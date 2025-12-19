/**
 * 闪电链普攻
 * 对最近敌人释放闪电，可弹射到其他敌人
 */

import Phaser from 'phaser'
import { AttackBase } from './AttackBase.js'
import { ATTACK_TYPES } from '../config.js'

export class LightningAttack extends AttackBase {
  constructor(scene) {
    super(scene, ATTACK_TYPES.LIGHTNING)

    // 闪电链特有属性
    this.chainRange = ATTACK_TYPES.LIGHTNING.chainRange
    this.chainCount = ATTACK_TYPES.LIGHTNING.chainCount
    this.damageDecay = 0.8  // 每次弹射伤害衰减

    // 闪电效果组
    this.lightningEffects = scene.add.group()
  }

  /**
   * 执行攻击 - 释放闪电链
   */
  execute(player, context) {
    const { enemies, audioManager, damageSystem, comboSystem, vfxManager, roguelikeSystem, waveManager, onEnemyKilled } = context

    // 寻找初始目标
    const target = this.findNearestEnemy(player, enemies)
    if (!target) return

    // 执行闪电链
    this.performChainLightning(player, target, context)

    // 播放音效
    if (audioManager) {
      audioManager.playSfx('attack')
    }
  }

  /**
   * 寻找最近敌人
   */
  findNearestEnemy(source, enemies, excludeSet = new Set()) {
    if (!enemies || enemies.length === 0) return null

    let nearest = null
    let minDist = this.getComputedRange()

    for (const enemy of enemies) {
      if (!enemy.isActive) continue
      if (excludeSet.has(enemy)) continue

      const dist = Phaser.Math.Distance.Between(source.x, source.y, enemy.x, enemy.y)
      if (dist < minDist) {
        minDist = dist
        nearest = enemy
      }
    }

    return nearest
  }

  /**
   * 执行闪电链弹射
   */
  performChainLightning(source, target, context) {
    const { enemies, damageSystem, comboSystem, vfxManager, roguelikeSystem, waveManager, onEnemyKilled } = context

    const hitEnemies = new Set()
    let currentSource = source
    let currentTarget = target
    let currentDamage = this.getComputedDamage()
    let chainIndex = 0

    while (currentTarget && chainIndex <= this.chainCount) {
      // 绘制闪电效果
      this.drawLightning(currentSource, currentTarget)

      // 造成伤害
      const killed = this.damageEnemy(currentTarget, currentDamage, context)

      // 记录已命中
      hitEnemies.add(currentTarget)

      if (killed && onEnemyKilled) {
        if (vfxManager) {
          vfxManager.createDeathParticles(currentTarget.x, currentTarget.y, currentTarget.color, 10)
          vfxManager.screenShake(0.002, 30)
        }
        onEnemyKilled(currentTarget)
      }

      // 准备下一次弹射
      currentSource = currentTarget
      currentDamage = Math.floor(currentDamage * this.damageDecay)
      chainIndex++

      // 寻找下一个目标
      currentTarget = this.findNearestEnemyInChainRange(currentSource, enemies, hitEnemies)
    }
  }

  /**
   * 在弹射范围内寻找下一个目标
   */
  findNearestEnemyInChainRange(source, enemies, excludeSet) {
    if (!enemies || enemies.length === 0) return null

    let nearest = null
    let minDist = this.chainRange

    for (const enemy of enemies) {
      if (!enemy.isActive) continue
      if (excludeSet.has(enemy)) continue

      const dist = Phaser.Math.Distance.Between(source.x, source.y, enemy.x, enemy.y)
      if (dist < minDist) {
        minDist = dist
        nearest = enemy
      }
    }

    return nearest
  }

  /**
   * 绘制闪电效果
   */
  drawLightning(source, target) {
    const graphics = this.scene.add.graphics()

    // 闪电路径（锯齿形）
    const points = this.generateLightningPath(source.x, source.y, target.x, target.y)

    // 外层光晕
    graphics.lineStyle(6, this.color, 0.3)
    graphics.beginPath()
    graphics.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y)
    }
    graphics.strokePath()

    // 主闪电
    graphics.lineStyle(2, this.color, 1)
    graphics.beginPath()
    graphics.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y)
    }
    graphics.strokePath()

    // 核心高亮
    graphics.lineStyle(1, 0xffffff, 0.8)
    graphics.beginPath()
    graphics.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y)
    }
    graphics.strokePath()

    this.lightningEffects.add(graphics)

    // 闪电消失动画
    this.scene.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        graphics.destroy()
      }
    })
  }

  /**
   * 生成闪电路径（锯齿形）
   */
  generateLightningPath(x1, y1, x2, y2) {
    const points = [{ x: x1, y: y1 }]
    const segments = 5 + Math.floor(Math.random() * 3)
    const dx = (x2 - x1) / segments
    const dy = (y2 - y1) / segments

    for (let i = 1; i < segments; i++) {
      const x = x1 + dx * i + (Math.random() - 0.5) * 20
      const y = y1 + dy * i + (Math.random() - 0.5) * 20
      points.push({ x, y })
    }

    points.push({ x: x2, y: y2 })
    return points
  }

  /**
   * 对敌人造成伤害
   */
  damageEnemy(enemy, damage, context) {
    const { damageSystem, comboSystem, vfxManager, audioManager, roguelikeSystem, waveManager } = context

    // 记录连击
    if (comboSystem) {
      comboSystem.addHit()
    }

    // 计算伤害
    const comboMultiplier = comboSystem ? comboSystem.getMultiplier() : 1
    const { damage: finalBaseDamage, isCrit } = damageSystem.calculateDamage(
      damage,
      comboMultiplier,
      { critChance: 0.08, critMultiplier: 1.8 }
    )

    let finalDamage = finalBaseDamage
    if (roguelikeSystem) {
      finalDamage = Math.floor(finalBaseDamage * roguelikeSystem.getDamageMultiplier(enemy))
    }

    // 应用伤害
    const killed = damageSystem.applyDamage(enemy, finalDamage, isCrit)

    // 视觉效果
    if (vfxManager) {
      vfxManager.showDamageNumber(enemy.x, enemy.y, finalDamage, isCrit)
      vfxManager.flashWhite(enemy, 50)
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

    return killed
  }

  /**
   * 应用强化效果
   */
  applyBuff(type, value) {
    super.applyBuff(type, value)

    switch (type) {
      case 'chainCount':
        this.chainCount += value
        break
      case 'chainRange':
        this.chainRange *= (1 + value)
        break
      case 'damageDecay':
        this.damageDecay = Math.min(this.damageDecay + value, 1.0) // 最高不衰减
        break
    }
  }

  /**
   * 重置
   */
  reset() {
    super.reset()
    this.chainRange = ATTACK_TYPES.LIGHTNING.chainRange
    this.chainCount = ATTACK_TYPES.LIGHTNING.chainCount
    this.damageDecay = 0.8
    this.lightningEffects.clear(true, true)
  }

  /**
   * 销毁
   */
  destroy() {
    this.lightningEffects.clear(true, true)
  }
}
