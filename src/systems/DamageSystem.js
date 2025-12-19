/**
 * 伤害系统
 * 处理伤害计算、暴击判定、击退效果
 */

import Phaser from 'phaser'
import { COMBAT, COLORS } from '../config.js'

export class DamageSystem {
  constructor(scene) {
    this.scene = scene
  }

  /**
   * 计算伤害
   * @param {number} baseDamage - 基础伤害
   * @param {number} comboMultiplier - 连击倍率
   * @param {object} attacker - 攻击者（可选，用于属性加成）
   * @returns {object} { damage, isCrit }
   */
  calculateDamage(baseDamage, comboMultiplier = 1.0, attacker = null) {
    let damage = baseDamage * comboMultiplier

    // 暴击判定
    const critChance = attacker?.critChance ?? COMBAT.CRIT_CHANCE
    const critMultiplier = attacker?.critMultiplier ?? COMBAT.CRIT_MULTIPLIER
    const isCrit = Math.random() < critChance

    if (isCrit) {
      damage *= critMultiplier
    }

    return {
      damage: Math.floor(damage),
      isCrit
    }
  }

  /**
   * 应用伤害到目标
   * @param {object} target - 目标对象
   * @param {number} damage - 伤害值
   * @param {boolean} isCrit - 是否暴击
   * @returns {boolean} 目标是否死亡
   */
  applyDamage(target, damage, isCrit = false) {
    if (!target || !target.isActive) return false

    // 显示伤害数字
    this.showDamageNumber(target.x, target.y, damage, isCrit)

    // 应用伤害
    const isDead = target.takeDamage(damage)

    return isDead
  }

  /**
   * 应用击退效果
   * @param {object} target - 目标对象
   * @param {number} fromX - 击退来源 X
   * @param {number} fromY - 击退来源 Y
   * @param {number} force - 击退力度（可选）
   */
  applyKnockback(target, fromX, fromY, force = COMBAT.KNOCKBACK_FORCE) {
    if (!target || !target.body) return

    // 计算击退方向
    const angle = Phaser.Math.Angle.Between(fromX, fromY, target.x, target.y)
    const knockbackVx = Math.cos(angle) * force
    const knockbackVy = Math.sin(angle) * force

    // 保存原速度
    const originalVx = target.body.velocity.x
    const originalVy = target.body.velocity.y

    // 应用击退
    target.body.setVelocity(knockbackVx, knockbackVy)

    // 击退结束后恢复
    this.scene.time.delayedCall(COMBAT.KNOCKBACK_DURATION, () => {
      if (target && target.body && target.isActive) {
        // 不直接恢复原速度，让 AI 重新计算
        target.body.setVelocity(0, 0)
      }
    })
  }

  /**
   * 显示伤害数字
   */
  showDamageNumber(x, y, damage, isCrit = false) {
    const offsetY = -30
    const color = isCrit ? COLORS.DAMAGE_CRIT : COLORS.DAMAGE_NORMAL
    const fontSize = isCrit ? '24px' : '18px'
    const text = isCrit ? `${damage}!` : `${damage}`

    const damageText = this.scene.add.text(x, y + offsetY, text, {
      fontSize: fontSize,
      fill: color,
      fontFamily: 'Arial',
      fontStyle: isCrit ? 'bold' : 'normal',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)

    // 动画效果：上浮并淡出
    this.scene.tweens.add({
      targets: damageText,
      y: y + offsetY - 40,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        damageText.destroy()
      }
    })
  }
}
