/**
 * 技能管理器
 * 管理 4 个通用技能：加速、闪现、护盾、治疗
 */

import Phaser from 'phaser'
import { SKILLS, WORLD } from '../config.js'

export class SkillManager {
  constructor(scene, player) {
    this.scene = scene
    this.player = player

    // 技能列表
    this.skills = {
      speed_boost: { ...SKILLS.SPEED_BOOST, currentCooldown: 0, active: false },
      dash: { ...SKILLS.DASH, currentCooldown: 0 },
      shield: { ...SKILLS.SHIELD, currentCooldown: 0, active: false },
      heal: { ...SKILLS.HEAL, currentCooldown: 0 }
    }

    // 加速效果状态
    this.speedBoostActive = false
    this.originalSpeed = null

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

    // Q - 加速
    keys.Q.on('down', () => this.castSkill('speed_boost'))
    // E - 闪现
    keys.E.on('down', () => this.castSkill('dash'))
    // R - 护盾
    keys.R.on('down', () => this.castSkill('shield'))
    // Space - 治疗
    keys.SPACE.on('down', () => this.castSkill('heal'))
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
      case 'speed_boost':
        this.castSpeedBoost(skill)
        break
      case 'dash':
        this.castDash(skill)
        break
      case 'shield':
        this.castShield(skill)
        break
      case 'heal':
        this.castHeal(skill)
        break
    }

    // 触发技能释放事件
    this.scene.events.emit('skillCast', skillId, skill)

    return true
  }

  /**
   * 技能1: 加速 - 短时间移动速度大幅提升
   */
  castSpeedBoost(skill) {
    if (this.speedBoostActive) return

    this.speedBoostActive = true
    skill.active = true
    this.originalSpeed = this.player.speed

    // 应用加速
    this.player.speed *= skill.speedMultiplier

    // 创建加速特效（玩家周围的风圈）
    const windEffect = this.scene.add.graphics()
    windEffect.lineStyle(2, skill.color, 0.6)

    // 更新特效跟随玩家
    const updateEffect = () => {
      if (!this.speedBoostActive) return
      windEffect.clear()
      windEffect.lineStyle(2, skill.color, 0.6)
      windEffect.strokeCircle(this.player.x, this.player.y, 40)
      windEffect.strokeCircle(this.player.x, this.player.y, 50)
    }

    const effectTimer = this.scene.time.addEvent({
      delay: 50,
      callback: updateEffect,
      repeat: skill.duration / 50
    })

    // 加速结束
    this.scene.time.delayedCall(skill.duration, () => {
      this.speedBoostActive = false
      skill.active = false
      this.player.speed = this.originalSpeed
      effectTimer.destroy()

      // 特效消失
      this.scene.tweens.add({
        targets: windEffect,
        alpha: 0,
        duration: 200,
        onComplete: () => windEffect.destroy()
      })
    })

    // 触发加速激活事件
    this.scene.events.emit('speedBoostActivated', skill)
  }

  /**
   * 技能2: 闪现 - 瞬间位移到指定方向
   */
  castDash(skill) {
    const startX = this.player.x
    const startY = this.player.y
    const angle = this.player.rotation

    // 计算目标位置
    let endX = startX + Math.cos(angle) * skill.distance
    let endY = startY + Math.sin(angle) * skill.distance

    // 边界限制
    endX = Phaser.Math.Clamp(endX, 50, WORLD.WIDTH - 50)
    endY = Phaser.Math.Clamp(endY, 50, WORLD.HEIGHT - 50)

    // 闪现期间无敌
    if (skill.invincible) {
      this.player.isInvincible = true
    }

    // 创建闪现特效（起点残影）
    const afterimage = this.scene.add.graphics()
    afterimage.fillStyle(skill.color, 0.5)
    afterimage.fillCircle(startX, startY, this.player.size || 24)

    // 闪现轨迹
    const trail = this.scene.add.graphics()
    trail.lineStyle(3, skill.color, 0.6)
    trail.lineBetween(startX, startY, endX, endY)

    // 瞬间移动
    this.scene.tweens.add({
      targets: this.player,
      x: endX,
      y: endY,
      duration: skill.duration,
      ease: 'Power2',
      onComplete: () => {
        // 闪现结束
        if (skill.invincible) {
          this.player.isInvincible = false
          this.player.invincibleTimer = 200
        }

        // 特效消失
        this.scene.tweens.add({
          targets: [afterimage, trail],
          alpha: 0,
          duration: 300,
          onComplete: () => {
            afterimage.destroy()
            trail.destroy()
          }
        })
      }
    })
  }

  /**
   * 技能3: 护盾 - 短时间免疫所有伤害
   */
  castShield(skill) {
    skill.active = true

    // 开启无敌
    this.player.isInvincible = true

    // 创建护盾特效
    const shield = this.scene.add.graphics()
    shield.lineStyle(4, skill.color, 0.8)
    shield.strokeCircle(0, 0, skill.radius)
    shield.fillStyle(skill.color, 0.2)
    shield.fillCircle(0, 0, skill.radius)

    // 跟随玩家
    this.shieldGraphics = shield
    this.shieldRadius = skill.radius

    // 护盾脉冲动画
    this.scene.tweens.add({
      targets: shield,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 300,
      yoyo: true,
      repeat: -1
    })

    // 护盾持续时间
    this.scene.time.delayedCall(skill.duration, () => {
      skill.active = false
      this.player.isInvincible = false
      this.player.invincibleTimer = 200
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
   * 技能4: 治疗 - 恢复一定比例生命值
   */
  castHeal(skill) {
    const healAmount = Math.floor(this.player.maxHp * skill.healPercent)
    const oldHp = this.player.hp

    // 恢复生命值
    this.player.hp = Math.min(this.player.hp + healAmount, this.player.maxHp)
    const actualHeal = this.player.hp - oldHp

    // 更新 HUD
    this.scene.events.emit('playerHpUpdated', this.player.hp, this.player.maxHp)

    // 创建治疗特效
    const healEffect = this.scene.add.graphics()
    healEffect.fillStyle(skill.color, 0.4)
    healEffect.fillCircle(this.player.x, this.player.y, 60)

    // 治疗数字
    const healText = this.scene.add.text(
      this.player.x,
      this.player.y - 30,
      `+${actualHeal}`,
      {
        fontSize: '24px',
        fill: '#ff6688',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5)

    // 上升消失动画
    this.scene.tweens.add({
      targets: healText,
      y: this.player.y - 80,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => healText.destroy()
    })

    // 特效消失
    this.scene.tweens.add({
      targets: healEffect,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 500,
      onComplete: () => healEffect.destroy()
    })

    // 触发治疗事件
    this.scene.events.emit('healUsed', actualHeal)
  }

  /**
   * 检查护盾是否激活（用于外部检测）
   */
  checkShieldReflect(enemy, damage) {
    // 新的护盾是纯无敌，不反伤
    // 但保留接口兼容性
    if (this.skills.shield.active) {
      return true // 阻挡伤害
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
