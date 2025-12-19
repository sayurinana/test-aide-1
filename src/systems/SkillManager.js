/**
 * 技能管理器
 * 管理技能冷却、释放和特效
 */

import Phaser from 'phaser'
import { SKILLS, ENEMY } from '../config.js'

export class SkillManager {
  constructor(scene, player) {
    this.scene = scene
    this.player = player

    // 技能列表
    this.skills = {
      sword_wave: { ...SKILLS.SWORD_WAVE, currentCooldown: 0 },
      dash_slash: { ...SKILLS.DASH_SLASH, currentCooldown: 0 },
      shield: { ...SKILLS.SHIELD, currentCooldown: 0, active: false },
      sword_domain: { ...SKILLS.SWORD_DOMAIN, currentCooldown: 0, active: false }
    }

    // 设置按键绑定
    this.setupInput()
  }

  setupInput() {
    const keys = this.scene.input.keyboard.addKeys({
      Q: Phaser.Input.Keyboard.KeyCodes.Q,
      E: Phaser.Input.Keyboard.KeyCodes.E,
      R: Phaser.Input.Keyboard.KeyCodes.R,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
    })

    // Q - 剑气横扫
    keys.Q.on('down', () => this.castSkill('sword_wave'))
    // E - 瞬步斩
    keys.E.on('down', () => this.castSkill('dash_slash'))
    // R - 护体真气
    keys.R.on('down', () => this.castSkill('shield'))
    // Space - 剑域
    keys.SPACE.on('down', () => this.castSkill('sword_domain'))
  }

  /**
   * 检查技能是否可用
   */
  canCast(skillId) {
    const skill = this.skills[skillId]
    if (!skill) return false
    return skill.currentCooldown <= 0
  }

  /**
   * 释放技能
   */
  castSkill(skillId) {
    if (!this.canCast(skillId)) return false

    const skill = this.skills[skillId]
    skill.currentCooldown = skill.cooldown

    // 根据技能类型执行
    switch (skillId) {
      case 'sword_wave':
        this.castSwordWave(skill)
        break
      case 'dash_slash':
        this.castDashSlash(skill)
        break
      case 'shield':
        this.castShield(skill)
        break
      case 'sword_domain':
        this.castSwordDomain(skill)
        break
    }

    // 触发技能释放事件
    this.scene.events.emit('skillCast', skillId, skill)

    return true
  }

  /**
   * 技能1: 剑气横扫 - 180度扇形攻击
   */
  castSwordWave(skill) {
    const { x, y, rotation } = this.player

    // 创建扇形特效
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(skill.color, 0.4)

    // 绘制扇形
    graphics.beginPath()
    graphics.moveTo(x, y)
    graphics.arc(x, y, skill.range, rotation - skill.angle / 2, rotation + skill.angle / 2)
    graphics.closePath()
    graphics.fillPath()

    // 扇形边缘
    graphics.lineStyle(3, skill.color, 0.8)
    graphics.beginPath()
    graphics.arc(x, y, skill.range, rotation - skill.angle / 2, rotation + skill.angle / 2)
    graphics.stroke()

    // 特效消失动画
    this.scene.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: skill.duration,
      ease: 'Power2',
      onComplete: () => graphics.destroy()
    })

    // 检测范围内敌人
    this.hitEnemiesInArc(x, y, skill.range, rotation, skill.angle, skill.damage)
  }

  /**
   * 技能2: 瞬步斩 - 突进并造成伤害
   */
  castDashSlash(skill) {
    const startX = this.player.x
    const startY = this.player.y
    const angle = this.player.rotation

    // 计算目标位置
    const endX = startX + Math.cos(angle) * skill.distance
    const endY = startY + Math.sin(angle) * skill.distance

    // 突进期间无敌
    this.player.isInvincible = true

    // 创建拖尾特效
    const trail = this.scene.add.graphics()
    trail.fillStyle(skill.color, 0.5)
    trail.fillRect(startX - skill.width / 2, startY - 5, skill.distance, 10)
    trail.setRotation(angle)
    trail.setPosition(startX, startY)

    // 突进动画
    this.scene.tweens.add({
      targets: this.player,
      x: endX,
      y: endY,
      duration: skill.duration,
      ease: 'Power2',
      onComplete: () => {
        // 突进结束
        this.player.isInvincible = false
        this.player.invincibleTimer = 200 // 短暂无敌帧

        // 消除拖尾
        this.scene.tweens.add({
          targets: trail,
          alpha: 0,
          duration: 200,
          onComplete: () => trail.destroy()
        })
      }
    })

    // 检测路径上的敌人
    this.hitEnemiesInLine(startX, startY, endX, endY, skill.width, skill.damage)
  }

  /**
   * 技能3: 护体真气 - 护盾反伤
   */
  castShield(skill) {
    skill.active = true

    // 创建护盾特效
    const shield = this.scene.add.graphics()
    shield.lineStyle(4, skill.color, 0.8)
    shield.strokeCircle(0, 0, skill.radius)
    shield.fillStyle(skill.color, 0.2)
    shield.fillCircle(0, 0, skill.radius)

    // 跟随玩家
    this.shieldGraphics = shield
    this.shieldRadius = skill.radius

    // 护盾持续时间
    this.scene.time.delayedCall(skill.duration, () => {
      skill.active = false
      this.shieldGraphics = null

      // 护盾消失动画
      this.scene.tweens.add({
        targets: shield,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 300,
        onComplete: () => shield.destroy()
      })
    })

    // 触发护盾激活事件
    this.scene.events.emit('shieldActivated', skill)
  }

  /**
   * 技能4: 剑域 - 持续范围伤害
   */
  castSwordDomain(skill) {
    skill.active = true
    const { x, y } = this.player

    // 创建剑域特效
    const domain = this.scene.add.graphics()
    domain.lineStyle(3, skill.color, 0.6)
    domain.strokeCircle(x, y, skill.radius)
    domain.fillStyle(skill.color, 0.1)
    domain.fillCircle(x, y, skill.radius)

    // 剑域不跟随玩家移动（固定位置）
    const domainX = x
    const domainY = y

    // 脉冲动画
    this.scene.tweens.add({
      targets: domain,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: skill.ticks - 1
    })

    // 定时造成伤害
    const tickInterval = skill.duration / skill.ticks
    let tickCount = 0

    const damageTimer = this.scene.time.addEvent({
      delay: tickInterval,
      callback: () => {
        tickCount++
        this.hitEnemiesInRadius(domainX, domainY, skill.radius, skill.damage)

        // 伤害波纹特效
        const ripple = this.scene.add.graphics()
        ripple.lineStyle(2, skill.color, 0.8)
        ripple.strokeCircle(domainX, domainY, 50)

        this.scene.tweens.add({
          targets: ripple,
          scaleX: skill.radius / 50,
          scaleY: skill.radius / 50,
          alpha: 0,
          duration: 300,
          onComplete: () => ripple.destroy()
        })

        if (tickCount >= skill.ticks) {
          damageTimer.destroy()
          skill.active = false

          // 剑域消失
          this.scene.tweens.add({
            targets: domain,
            alpha: 0,
            duration: 300,
            onComplete: () => domain.destroy()
          })
        }
      },
      repeat: skill.ticks - 1
    })
  }

  /**
   * 扇形范围伤害
   */
  hitEnemiesInArc(x, y, range, angle, arcAngle, damage) {
    const enemies = this.scene.enemySpawner.getActiveEnemies()

    enemies.forEach(enemy => {
      if (!enemy.isActive) return

      const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y)
      if (dist > range + ENEMY.SIZE) return

      const angleToEnemy = Phaser.Math.Angle.Between(x, y, enemy.x, enemy.y)
      const angleDiff = Phaser.Math.Angle.Wrap(angleToEnemy - angle)

      if (Math.abs(angleDiff) <= arcAngle / 2) {
        this.applySkillDamage(enemy, damage, x, y)
      }
    })
  }

  /**
   * 线形范围伤害
   */
  hitEnemiesInLine(startX, startY, endX, endY, width, damage) {
    const enemies = this.scene.enemySpawner.getActiveEnemies()

    enemies.forEach(enemy => {
      if (!enemy.isActive) return

      // 计算敌人到线段的距离
      const dist = Phaser.Math.Distance.BetweenPointsSquared(
        { x: enemy.x, y: enemy.y },
        Phaser.Geom.Line.GetNearestPoint(
          new Phaser.Geom.Line(startX, startY, endX, endY),
          { x: enemy.x, y: enemy.y }
        )
      )

      if (Math.sqrt(dist) <= width / 2 + ENEMY.SIZE) {
        this.applySkillDamage(enemy, damage, startX, startY)
      }
    })
  }

  /**
   * 圆形范围伤害
   */
  hitEnemiesInRadius(x, y, radius, damage) {
    const enemies = this.scene.enemySpawner.getActiveEnemies()

    enemies.forEach(enemy => {
      if (!enemy.isActive) return

      const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y)
      if (dist <= radius + ENEMY.SIZE) {
        this.applySkillDamage(enemy, damage, x, y)
      }
    })
  }

  /**
   * 应用技能伤害
   */
  applySkillDamage(enemy, baseDamage, sourceX, sourceY) {
    // 记录连击
    this.scene.comboSystem.addHit()

    // 计算伤害
    const { damage, isCrit } = this.scene.damageSystem.calculateDamage(
      baseDamage,
      this.scene.comboSystem.getMultiplier(),
      this.player
    )

    // 应用伤害
    const killed = this.scene.damageSystem.applyDamage(enemy, damage, isCrit)

    // 应用击退
    this.scene.damageSystem.applyKnockback(enemy, sourceX, sourceY)

    if (killed) {
      // 使用 onEnemyKilled 确保 WaveManager 和 RoguelikeSystem 正确更新
      this.scene.onEnemyKilled(enemy)
    }
  }

  /**
   * 检查护盾反伤
   */
  checkShieldReflect(enemy, damage) {
    if (this.skills.shield.active && this.shieldGraphics) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        enemy.x, enemy.y
      )

      if (dist <= this.shieldRadius + ENEMY.SIZE) {
        // 反弹伤害
        const reflectDamage = Math.floor(damage * this.skills.shield.reflect)
        enemy.takeDamage(reflectDamage)
        return true // 阻挡伤害
      }
    }
    return false
  }

  /**
   * 更新
   */
  update(time, delta) {
    // 更新技能冷却
    for (const skillId in this.skills) {
      const skill = this.skills[skillId]
      if (skill.currentCooldown > 0) {
        skill.currentCooldown -= delta
      }
    }

    // 更新护盾位置
    if (this.shieldGraphics && this.player) {
      this.shieldGraphics.setPosition(this.player.x, this.player.y)
    }
  }

  /**
   * 获取技能状态（供 UI 使用）
   */
  getSkillStates() {
    const states = {}
    for (const skillId in this.skills) {
      const skill = this.skills[skillId]
      states[skillId] = {
        name: skill.name,
        key: skill.key,
        cooldown: skill.cooldown,
        currentCooldown: Math.max(0, skill.currentCooldown),
        ready: skill.currentCooldown <= 0,
        active: skill.active || false
      }
    }
    return states
  }
}
