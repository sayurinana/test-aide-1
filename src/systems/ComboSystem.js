/**
 * 连击系统
 * 管理连击计数、连击倍率和连击超时
 */

import { COMBAT } from '../config.js'

export class ComboSystem {
  constructor(scene) {
    this.scene = scene
    this.comboCount = 0
    this.lastHitTime = 0
    this.comboMultiplier = 1.0
  }

  /**
   * 记录一次击中
   */
  addHit() {
    const now = this.scene.time.now

    // 检查是否超时
    if (now - this.lastHitTime > COMBAT.COMBO_TIMEOUT) {
      this.comboCount = 0
      this.comboMultiplier = 1.0
    }

    this.comboCount++
    this.lastHitTime = now

    // 计算连击倍率
    this.comboMultiplier = Math.min(
      1.0 + (this.comboCount - 1) * COMBAT.COMBO_MULTIPLIER,
      COMBAT.MAX_COMBO_MULTIPLIER
    )

    // 触发连击事件
    this.scene.events.emit('comboUpdated', this.comboCount, this.comboMultiplier)

    return this.comboCount
  }

  /**
   * 获取当前连击数
   */
  getComboCount() {
    return this.comboCount
  }

  /**
   * 获取当前连击倍率
   */
  getMultiplier() {
    // 检查是否超时
    if (this.scene.time.now - this.lastHitTime > COMBAT.COMBO_TIMEOUT) {
      this.resetCombo()
    }
    return this.comboMultiplier
  }

  /**
   * 重置连击
   */
  resetCombo() {
    if (this.comboCount > 0) {
      this.comboCount = 0
      this.comboMultiplier = 1.0
      this.scene.events.emit('comboUpdated', 0, 1.0)
    }
  }

  /**
   * 更新（检查超时）
   */
  update(time, delta) {
    if (this.comboCount > 0 && time - this.lastHitTime > COMBAT.COMBO_TIMEOUT) {
      this.resetCombo()
    }
  }
}
