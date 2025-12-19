/**
 * 冲击波普攻
 * 向前方发射穿透敌人的冲击波
 */

import Phaser from 'phaser'
import { AttackBase } from './AttackBase.js'
import { ATTACK_TYPES } from '../config.js'

export class WaveAttack extends AttackBase {
  constructor(scene) {
    super(scene, ATTACK_TYPES.WAVE)

    // 冲击波特有属性
    this.speed = ATTACK_TYPES.WAVE.speed
    this.width = ATTACK_TYPES.WAVE.width
    this.waveCount = 1  // 同时发射波数

    // 投射物组
    this.projectiles = scene.add.group()
  }

  /**
   * 执行攻击 - 发射冲击波
   */
  execute(player, context) {
    const { audioManager } = context

    // 获取发射方向
    const angle = player.rotation

    // 发射冲击波
    for (let i = 0; i < this.waveCount; i++) {
      const offsetAngle = (i - (this.waveCount - 1) / 2) * 0.2 // 多波时轻微散射
      this.spawnWave(player.x, player.y, angle + offsetAngle, context)
    }

    // 播放音效
    if (audioManager) {
      audioManager.playSfx('attack')
    }
  }

  /**
   * 生成冲击波
   */
  spawnWave(x, y, angle, context) {
    // 创建冲击波图形
    const wave = this.scene.add.container(x, y)

    // 冲击波形状（扇形/弧形）
    const graphics = this.scene.add.graphics()

    // 绘制冲击波弧线
    const arcAngle = Math.PI / 6 // 30度弧度
    graphics.lineStyle(4, this.color, 0.8)
    graphics.beginPath()
    graphics.arc(0, 0, this.width / 2, -arcAngle, arcAngle)
    graphics.strokePath()

    // 内层光效
    graphics.lineStyle(2, 0xffffff, 0.5)
    graphics.beginPath()
    graphics.arc(0, 0, this.width / 2 - 5, -arcAngle * 0.8, arcAngle * 0.8)
    graphics.strokePath()

    wave.add(graphics)
    wave.rotation = angle

    // 添加物理
    this.scene.physics.add.existing(wave)
    wave.body.setSize(this.width, this.width / 2)
    wave.body.setOffset(-this.width / 2, -this.width / 4)

    // 设置速度
    const vx = Math.cos(angle) * this.speed
    const vy = Math.sin(angle) * this.speed
    wave.body.setVelocity(vx, vy)

    // 存储数据
    wave.attackData = {
      damage: this.getComputedDamage(),
      hitEnemies: new Set(),
      startX: x,
      startY: y,
      maxRange: this.getComputedRange()
    }

    this.projectiles.add(wave)

    // 范围检测更新
    wave.updateCallback = () => {
      this.updateWave(wave)
    }
  }

  /**
   * 更新冲击波
   */
  updateWave(wave) {
    if (!wave || !wave.active) return

    // 检查是否超出范围
    const dist = Phaser.Math.Distance.Between(
      wave.attackData.startX, wave.attackData.startY,
      wave.x, wave.y
    )
    if (dist > wave.attackData.maxRange) {
      this.destroyWave(wave)
      return
    }

    // 随着距离扩大冲击波
    const scale = 1 + dist / wave.attackData.maxRange * 0.5
    wave.setScale(scale)
  }

  /**
   * 销毁冲击波
   */
  destroyWave(wave) {
    if (wave && wave.active) {
      this.projectiles.remove(wave, true, true)
    }
  }

  /**
   * 更新
   */
  update(delta) {
    super.update(delta)

    // 更新所有冲击波
    this.projectiles.getChildren().forEach(wave => {
      if (wave.updateCallback) {
        wave.updateCallback()
      }
    })
  }

  /**
   * 处理冲击波命中敌人
   */
  onHitEnemy(wave, enemy, context) {
    if (!wave.active || !enemy.isActive) return false
    if (wave.attackData.hitEnemies.has(enemy)) return false

    const { damageSystem, comboSystem, vfxManager, audioManager, roguelikeSystem, waveManager } = context

    // 标记已命中（冲击波可穿透，不销毁）
    wave.attackData.hitEnemies.add(enemy)

    // 记录连击
    if (comboSystem) {
      comboSystem.addHit()
    }

    // 计算伤害
    const comboMultiplier = comboSystem ? comboSystem.getMultiplier() : 1
    const { damage, isCrit } = damageSystem.calculateDamage(
      wave.attackData.damage,
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

    // 击退（冲击波击退力更强）
    damageSystem.applyKnockback(enemy, wave.x, wave.y, 1.5)

    if (roguelikeSystem) {
      roguelikeSystem.onDamageDealt(finalDamage)
    }

    if (waveManager) {
      waveManager.recordDamage(finalDamage)
    }

    return killed
  }

  /**
   * 获取所有活跃的投射物
   */
  getProjectiles() {
    return this.projectiles
  }

  /**
   * 应用强化效果
   */
  applyBuff(type, value) {
    super.applyBuff(type, value)

    switch (type) {
      case 'waveCount':
        this.waveCount += value
        break
      case 'width':
        this.width *= (1 + value)
        break
      case 'speed':
        this.speed *= (1 + value)
        break
    }
  }

  /**
   * 重置
   */
  reset() {
    super.reset()
    this.speed = ATTACK_TYPES.WAVE.speed
    this.width = ATTACK_TYPES.WAVE.width
    this.waveCount = 1
    this.projectiles.clear(true, true)
  }

  /**
   * 销毁
   */
  destroy() {
    this.projectiles.clear(true, true)
  }
}
