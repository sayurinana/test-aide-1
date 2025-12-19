/**
 * 召唤物普攻
 * 召唤自动攻击的分身/精灵
 */

import Phaser from 'phaser'
import { AttackBase } from './AttackBase.js'
import { ATTACK_TYPES } from '../config.js'

export class SummonAttack extends AttackBase {
  constructor(scene) {
    super(scene, ATTACK_TYPES.SUMMON)

    // 召唤物特有属性
    this.duration = ATTACK_TYPES.SUMMON.duration
    this.attackInterval = ATTACK_TYPES.SUMMON.attackInterval
    this.summonCount = 1  // 同时召唤数量

    // 召唤物组
    this.summons = scene.add.group()
  }

  /**
   * 执行攻击 - 召唤精灵
   */
  execute(player, context) {
    const { audioManager } = context

    // 召唤精灵
    for (let i = 0; i < this.summonCount; i++) {
      const angle = (i / this.summonCount) * Math.PI * 2
      const offsetX = Math.cos(angle) * 50
      const offsetY = Math.sin(angle) * 50
      this.spawnSummon(player.x + offsetX, player.y + offsetY, player, context)
    }

    // 播放音效
    if (audioManager) {
      audioManager.playSfx('attack')
    }
  }

  /**
   * 生成召唤物
   */
  spawnSummon(x, y, player, context) {
    // 创建召唤物图形
    const summon = this.scene.add.container(x, y)

    // 召唤物形状（小精灵）
    const graphics = this.scene.add.graphics()

    // 身体
    graphics.fillStyle(this.color, 0.8)
    graphics.fillCircle(0, 0, 12)

    // 眼睛
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(-4, -3, 3)
    graphics.fillCircle(4, -3, 3)
    graphics.fillStyle(0x000000, 1)
    graphics.fillCircle(-4, -3, 1.5)
    graphics.fillCircle(4, -3, 1.5)

    // 光晕
    graphics.fillStyle(this.color, 0.3)
    graphics.fillCircle(0, 0, 18)

    summon.add(graphics)

    // 添加物理
    this.scene.physics.add.existing(summon)
    summon.body.setCircle(12)
    summon.body.setOffset(-12, -12)

    // 存储数据
    summon.summonData = {
      damage: this.getComputedDamage(),
      range: this.getComputedRange(),
      attackInterval: this.attackInterval,
      lastAttackTime: 0,
      owner: player,
      createdTime: this.scene.time.now,
      duration: this.duration,
      context: context
    }

    this.summons.add(summon)

    // 出现动画
    summon.setScale(0)
    this.scene.tweens.add({
      targets: summon,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.out'
    })

    // 漂浮动画
    this.scene.tweens.add({
      targets: summon,
      y: y - 5,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    })
  }

  /**
   * 更新
   */
  update(delta) {
    super.update(delta)

    const currentTime = this.scene.time.now

    // 更新所有召唤物
    this.summons.getChildren().forEach(summon => {
      if (!summon.active) return

      // 检查持续时间
      const elapsed = currentTime - summon.summonData.createdTime
      if (elapsed >= summon.summonData.duration) {
        this.destroySummon(summon)
        return
      }

      // 跟随玩家附近
      this.updateSummonPosition(summon)

      // 自动攻击
      if (currentTime - summon.summonData.lastAttackTime >= summon.summonData.attackInterval) {
        this.summonAttack(summon)
        summon.summonData.lastAttackTime = currentTime
      }
    })
  }

  /**
   * 更新召唤物位置（环绕玩家）
   */
  updateSummonPosition(summon) {
    const owner = summon.summonData.owner
    if (!owner) return

    // 计算目标位置（玩家周围）
    const summons = this.summons.getChildren()
    const index = summons.indexOf(summon)
    const angle = (this.scene.time.now / 1000 + index * Math.PI * 2 / summons.length)
    const radius = 60

    const targetX = owner.x + Math.cos(angle) * radius
    const targetY = owner.y + Math.sin(angle) * radius

    // 平滑移动
    const speed = 150
    const dx = targetX - summon.x
    const dy = targetY - summon.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > 5) {
      summon.body.setVelocity(
        (dx / dist) * speed,
        (dy / dist) * speed
      )
    } else {
      summon.body.setVelocity(0, 0)
    }
  }

  /**
   * 召唤物攻击
   */
  summonAttack(summon) {
    const context = summon.summonData.context
    const { enemies, damageSystem, comboSystem, vfxManager, audioManager, roguelikeSystem, waveManager, onEnemyKilled } = context

    // 寻找范围内最近敌人
    const target = this.findNearestEnemyInRange(summon, enemies)
    if (!target) return

    // 发射攻击光弹
    this.fireProjectile(summon, target, context)
  }

  /**
   * 寻找范围内最近敌人
   */
  findNearestEnemyInRange(summon, enemies) {
    if (!enemies || enemies.length === 0) return null

    let nearest = null
    let minDist = summon.summonData.range

    for (const enemy of enemies) {
      if (!enemy.isActive) continue

      const dist = Phaser.Math.Distance.Between(summon.x, summon.y, enemy.x, enemy.y)
      if (dist < minDist) {
        minDist = dist
        nearest = enemy
      }
    }

    return nearest
  }

  /**
   * 发射光弹
   */
  fireProjectile(summon, target, context) {
    const { damageSystem, comboSystem, vfxManager, audioManager, roguelikeSystem, waveManager, onEnemyKilled } = context

    // 创建光弹
    const bullet = this.scene.add.graphics()
    bullet.fillStyle(this.color, 1)
    bullet.fillCircle(0, 0, 5)
    bullet.fillStyle(0xffffff, 0.8)
    bullet.fillCircle(0, 0, 2)
    bullet.setPosition(summon.x, summon.y)

    // 计算方向
    const angle = Phaser.Math.Angle.Between(summon.x, summon.y, target.x, target.y)
    const speed = 400

    // 光弹移动
    this.scene.tweens.add({
      targets: bullet,
      x: target.x,
      y: target.y,
      duration: Phaser.Math.Distance.Between(summon.x, summon.y, target.x, target.y) / speed * 1000,
      onComplete: () => {
        // 命中
        if (target.isActive) {
          this.onHitEnemy(summon, target, context)
        }
        bullet.destroy()
      }
    })
  }

  /**
   * 处理命中敌人
   */
  onHitEnemy(summon, enemy, context) {
    if (!enemy.isActive) return false

    const { damageSystem, comboSystem, vfxManager, audioManager, roguelikeSystem, waveManager, onEnemyKilled } = context

    // 记录连击
    if (comboSystem) {
      comboSystem.addHit()
    }

    // 计算伤害
    const comboMultiplier = comboSystem ? comboSystem.getMultiplier() : 1
    const { damage, isCrit } = damageSystem.calculateDamage(
      summon.summonData.damage,
      comboMultiplier,
      { critChance: 0.08, critMultiplier: 1.8 }
    )

    let finalDamage = damage
    if (roguelikeSystem) {
      finalDamage = Math.floor(damage * roguelikeSystem.getDamageMultiplier(enemy))
    }

    // 应用伤害
    const killed = damageSystem.applyDamage(enemy, finalDamage, isCrit)

    // 视觉效果
    if (vfxManager) {
      vfxManager.showDamageNumber(enemy.x, enemy.y, finalDamage, isCrit)
      vfxManager.flashWhite(enemy, 30)
    }

    if (audioManager) {
      audioManager.playSfx('hit')
    }

    if (roguelikeSystem) {
      roguelikeSystem.onDamageDealt(finalDamage)
    }

    if (waveManager) {
      waveManager.recordDamage(finalDamage)
    }

    // 处理击杀
    if (killed && onEnemyKilled) {
      if (vfxManager) {
        vfxManager.createDeathParticles(enemy.x, enemy.y, enemy.color, 10)
        vfxManager.screenShake(0.002, 30)
      }
      if (audioManager) {
        audioManager.playSfx('kill')
      }
      onEnemyKilled(enemy)
    }

    return killed
  }

  /**
   * 销毁召唤物
   */
  destroySummon(summon) {
    if (!summon || !summon.active) return

    // 消失动画
    this.scene.tweens.add({
      targets: summon,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.summons.remove(summon, true, true)
      }
    })
  }

  /**
   * 获取所有活跃的召唤物
   */
  getSummons() {
    return this.summons
  }

  /**
   * 应用强化效果
   */
  applyBuff(type, value) {
    super.applyBuff(type, value)

    switch (type) {
      case 'summonCount':
        this.summonCount += value
        break
      case 'summonDuration':
        this.duration *= (1 + value)
        break
      case 'summonAttackSpeed':
        this.attackInterval *= (1 - value)
        this.attackInterval = Math.max(this.attackInterval, 200) // 最小 200ms
        break
    }
  }

  /**
   * 重置
   */
  reset() {
    super.reset()
    this.duration = ATTACK_TYPES.SUMMON.duration
    this.attackInterval = ATTACK_TYPES.SUMMON.attackInterval
    this.summonCount = 1
    this.summons.clear(true, true)
  }

  /**
   * 销毁
   */
  destroy() {
    this.summons.clear(true, true)
  }
}
