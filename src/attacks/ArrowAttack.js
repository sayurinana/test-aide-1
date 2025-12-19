/**
 * 射箭普攻
 * 发射箭矢投射物，直线飞行，命中敌人造成伤害
 */

import Phaser from 'phaser'
import { AttackBase } from './AttackBase.js'
import { ATTACK_TYPES } from '../config.js'

export class ArrowAttack extends AttackBase {
  constructor(scene) {
    super(scene, ATTACK_TYPES.ARROW)

    // 射箭特有属性
    this.speed = ATTACK_TYPES.ARROW.speed
    this.projectileSize = ATTACK_TYPES.ARROW.size
    this.pierce = 0  // 穿透数量（强化后可增加）
    this.multishot = 1  // 同时发射数量（强化后可增加）
    this.spreadAngle = 0  // 散射角度

    // 投射物组
    this.projectiles = scene.add.group()
  }

  /**
   * 执行攻击 - 发射箭矢
   */
  execute(player, context) {
    const { audioManager, vfxManager } = context

    // 计算发射方向
    const baseAngle = player.rotation

    // 根据 multishot 发射多支箭
    for (let i = 0; i < this.multishot; i++) {
      let angle = baseAngle

      // 多支箭时计算散射角度
      if (this.multishot > 1) {
        const spreadStep = this.spreadAngle / (this.multishot - 1)
        angle = baseAngle - this.spreadAngle / 2 + spreadStep * i
      }

      this.spawnArrow(player.x, player.y, angle, context)
    }

    // 播放音效
    if (audioManager) {
      audioManager.playSfx('attack')
    }
  }

  /**
   * 生成单支箭矢
   */
  spawnArrow(x, y, angle, context) {
    // 创建箭矢图形
    const arrow = this.scene.add.container(x, y)

    // 箭矢形状（三角形）
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(this.color, 1)
    graphics.beginPath()
    graphics.moveTo(this.projectileSize * 1.5, 0)
    graphics.lineTo(-this.projectileSize, -this.projectileSize / 2)
    graphics.lineTo(-this.projectileSize, this.projectileSize / 2)
    graphics.closePath()
    graphics.fill()

    // 发光效果
    graphics.fillStyle(0xffffff, 0.5)
    graphics.fillCircle(0, 0, this.projectileSize / 2)

    arrow.add(graphics)
    arrow.rotation = angle

    // 添加物理
    this.scene.physics.add.existing(arrow)
    arrow.body.setCircle(this.projectileSize)
    arrow.body.setOffset(-this.projectileSize, -this.projectileSize)

    // 设置速度
    const vx = Math.cos(angle) * this.speed
    const vy = Math.sin(angle) * this.speed
    arrow.body.setVelocity(vx, vy)

    // 存储数据
    arrow.attackData = {
      damage: this.getComputedDamage(),
      pierce: this.pierce,
      pierceCount: 0,
      hitEnemies: new Set()
    }

    this.projectiles.add(arrow)

    // 设置超出范围自动销毁
    const startX = x
    const startY = y
    const maxRange = this.getComputedRange()

    arrow.updateCallback = () => {
      const dist = Phaser.Math.Distance.Between(startX, startY, arrow.x, arrow.y)
      if (dist > maxRange) {
        this.destroyArrow(arrow)
      }
    }
  }

  /**
   * 销毁箭矢
   */
  destroyArrow(arrow) {
    if (arrow && arrow.active) {
      this.projectiles.remove(arrow, true, true)
    }
  }

  /**
   * 更新 - 检测碰撞
   */
  update(delta) {
    super.update(delta)

    // 更新所有箭矢
    this.projectiles.getChildren().forEach(arrow => {
      if (arrow.updateCallback) {
        arrow.updateCallback()
      }
    })
  }

  /**
   * 处理箭矢命中敌人
   */
  onHitEnemy(arrow, enemy, context) {
    if (!arrow.active || !enemy.isActive) return false
    if (arrow.attackData.hitEnemies.has(enemy)) return false

    const { damageSystem, comboSystem, vfxManager, audioManager, roguelikeSystem, waveManager, onEnemyKilled } = context

    // 标记已命中
    arrow.attackData.hitEnemies.add(enemy)

    // 记录连击
    if (comboSystem) {
      comboSystem.addHit()
    }

    // 计算伤害（含暴击和连击加成）
    const comboMultiplier = comboSystem ? comboSystem.getMultiplier() : 1
    const { damage, isCrit } = damageSystem.calculateDamage(
      arrow.attackData.damage,
      comboMultiplier,
      { critChance: 0.08, critMultiplier: 1.8 }  // 使用默认暴击参数
    )

    // 应用伤害加成
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

    // 音效
    if (audioManager) {
      audioManager.playSfx('hit')
    }

    if (isCrit && vfxManager) {
      vfxManager.screenShake(0.003, 50)
    }

    // 应用击退
    damageSystem.applyKnockback(enemy, arrow.x, arrow.y)

    // 触发吸血
    if (roguelikeSystem) {
      roguelikeSystem.onDamageDealt(finalDamage)
    }

    // 记录伤害
    if (waveManager) {
      waveManager.recordDamage(finalDamage)
    }

    // 检查穿透
    arrow.attackData.pierceCount++
    if (arrow.attackData.pierceCount > arrow.attackData.pierce) {
      this.destroyArrow(arrow)
    }

    // 返回击杀状态
    return killed
  }

  /**
   * 获取所有活跃的投射物
   */
  getProjectiles() {
    return this.projectiles
  }

  /**
   * 应用强化效果（射箭特有）
   */
  applyBuff(type, value) {
    super.applyBuff(type, value)

    switch (type) {
      case 'multishot':
        this.multishot += value
        this.spreadAngle = Math.PI / 6 * (this.multishot - 1) // 每多一支箭增加 30 度散射
        break
      case 'pierce':
        this.pierce += value
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
    this.speed = ATTACK_TYPES.ARROW.speed
    this.pierce = 0
    this.multishot = 1
    this.spreadAngle = 0

    // 清空投射物
    this.projectiles.clear(true, true)
  }

  /**
   * 销毁
   */
  destroy() {
    this.projectiles.clear(true, true)
  }
}
