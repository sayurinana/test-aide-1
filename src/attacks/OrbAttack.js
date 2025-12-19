/**
 * 法球普攻
 * 发射自动追踪最近敌人的法球
 */

import Phaser from 'phaser'
import { AttackBase } from './AttackBase.js'
import { ATTACK_TYPES } from '../config.js'

export class OrbAttack extends AttackBase {
  constructor(scene) {
    super(scene, ATTACK_TYPES.ORB)

    // 法球特有属性
    this.speed = ATTACK_TYPES.ORB.speed
    this.projectileSize = ATTACK_TYPES.ORB.size
    this.orbCount = 1       // 同时发射数量
    this.pierce = 0         // 穿透数量

    // 投射物组
    this.projectiles = scene.add.group()
  }

  /**
   * 执行攻击 - 发射追踪法球
   */
  execute(player, context) {
    const { enemies, audioManager } = context

    // 寻找最近敌人
    const target = this.findNearestEnemy(player, enemies)
    if (!target) return // 没有敌人则不发射

    // 发射法球
    for (let i = 0; i < this.orbCount; i++) {
      this.spawnOrb(player.x, player.y, target, context)
    }

    // 播放音效
    if (audioManager) {
      audioManager.playSfx('attack')
    }
  }

  /**
   * 寻找最近敌人
   */
  findNearestEnemy(player, enemies) {
    if (!enemies || enemies.length === 0) return null

    let nearest = null
    let minDist = this.getComputedRange()

    for (const enemy of enemies) {
      if (!enemy.isActive) continue
      const dist = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y)
      if (dist < minDist) {
        minDist = dist
        nearest = enemy
      }
    }

    return nearest
  }

  /**
   * 生成法球
   */
  spawnOrb(x, y, target, context) {
    // 创建法球图形
    const orb = this.scene.add.container(x, y)

    // 法球形状（发光球体）
    const graphics = this.scene.add.graphics()

    // 外层光晕
    graphics.fillStyle(this.color, 0.3)
    graphics.fillCircle(0, 0, this.projectileSize * 1.5)

    // 中层
    graphics.fillStyle(this.color, 0.6)
    graphics.fillCircle(0, 0, this.projectileSize)

    // 核心
    graphics.fillStyle(0xffffff, 0.8)
    graphics.fillCircle(0, 0, this.projectileSize * 0.4)

    orb.add(graphics)

    // 添加物理
    this.scene.physics.add.existing(orb)
    orb.body.setCircle(this.projectileSize)
    orb.body.setOffset(-this.projectileSize, -this.projectileSize)

    // 存储数据
    orb.attackData = {
      damage: this.getComputedDamage(),
      pierce: this.pierce,
      pierceCount: 0,
      hitEnemies: new Set(),
      target: target,
      startX: x,
      startY: y,
      maxRange: this.getComputedRange()
    }

    this.projectiles.add(orb)

    // 追踪更新
    orb.updateCallback = () => {
      this.updateOrbTracking(orb, context)
    }
  }

  /**
   * 更新法球追踪
   */
  updateOrbTracking(orb, context) {
    if (!orb || !orb.active) return

    const { enemies } = context

    // 检查是否超出范围
    const dist = Phaser.Math.Distance.Between(
      orb.attackData.startX, orb.attackData.startY,
      orb.x, orb.y
    )
    if (dist > orb.attackData.maxRange) {
      this.destroyOrb(orb)
      return
    }

    // 获取当前目标
    let target = orb.attackData.target

    // 如果目标失效，寻找新目标
    if (!target || !target.isActive) {
      target = this.findNearestEnemyFromOrb(orb, enemies)
      orb.attackData.target = target
    }

    if (target && target.isActive) {
      // 追踪目标
      const angle = Phaser.Math.Angle.Between(orb.x, orb.y, target.x, target.y)
      const vx = Math.cos(angle) * this.speed
      const vy = Math.sin(angle) * this.speed
      orb.body.setVelocity(vx, vy)
    } else {
      // 没有目标，直线飞行
      if (orb.body.velocity.x === 0 && orb.body.velocity.y === 0) {
        // 给一个默认方向
        orb.body.setVelocity(this.speed, 0)
      }
    }
  }

  /**
   * 从法球位置寻找最近敌人
   */
  findNearestEnemyFromOrb(orb, enemies) {
    if (!enemies || enemies.length === 0) return null

    let nearest = null
    let minDist = Infinity

    for (const enemy of enemies) {
      if (!enemy.isActive) continue
      if (orb.attackData.hitEnemies.has(enemy)) continue

      const dist = Phaser.Math.Distance.Between(orb.x, orb.y, enemy.x, enemy.y)
      if (dist < minDist) {
        minDist = dist
        nearest = enemy
      }
    }

    return nearest
  }

  /**
   * 销毁法球
   */
  destroyOrb(orb) {
    if (orb && orb.active) {
      this.projectiles.remove(orb, true, true)
    }
  }

  /**
   * 更新
   */
  update(delta) {
    super.update(delta)

    // 更新所有法球
    this.projectiles.getChildren().forEach(orb => {
      if (orb.updateCallback) {
        orb.updateCallback()
      }
    })
  }

  /**
   * 处理法球命中敌人
   */
  onHitEnemy(orb, enemy, context) {
    if (!orb.active || !enemy.isActive) return false
    if (orb.attackData.hitEnemies.has(enemy)) return false

    const { damageSystem, comboSystem, vfxManager, audioManager, roguelikeSystem, waveManager } = context

    // 标记已命中
    orb.attackData.hitEnemies.add(enemy)

    // 记录连击
    if (comboSystem) {
      comboSystem.addHit()
    }

    // 计算伤害
    const comboMultiplier = comboSystem ? comboSystem.getMultiplier() : 1
    const { damage, isCrit } = damageSystem.calculateDamage(
      orb.attackData.damage,
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
      // 命中爆炸效果
      vfxManager.createDeathParticles(orb.x, orb.y, this.color, 5)
    }

    if (audioManager) {
      audioManager.playSfx('hit')
    }

    // 应用击退
    damageSystem.applyKnockback(enemy, orb.x, orb.y)

    if (roguelikeSystem) {
      roguelikeSystem.onDamageDealt(finalDamage)
    }

    if (waveManager) {
      waveManager.recordDamage(finalDamage)
    }

    // 检查穿透
    orb.attackData.pierceCount++
    if (orb.attackData.pierceCount > orb.attackData.pierce) {
      this.destroyOrb(orb)
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
      case 'orbCount':
        this.orbCount += value
        break
      case 'pierce':
        this.pierce += value
        break
      case 'trackingSpeed':
        this.speed *= (1 + value)
        break
    }
  }

  /**
   * 重置
   */
  reset() {
    super.reset()
    this.speed = ATTACK_TYPES.ORB.speed
    this.orbCount = 1
    this.pierce = 0
    this.projectiles.clear(true, true)
  }

  /**
   * 销毁
   */
  destroy() {
    this.projectiles.clear(true, true)
  }
}
