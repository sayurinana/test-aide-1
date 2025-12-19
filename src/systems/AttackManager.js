/**
 * 普攻管理器
 * 管理已装备的普攻列表，统一触发所有普攻
 */

export class AttackManager {
  constructor(scene, player) {
    this.scene = scene
    this.player = player
    this.attacks = []  // 已装备的普攻列表
  }

  /**
   * 添加普攻
   * @param {AttackBase} attack - 普攻实例
   */
  addAttack(attack) {
    // 检查是否已存在同类型普攻
    const existing = this.attacks.find(a => a.id === attack.id)
    if (existing) {
      // 已存在则升级
      existing.upgrade()
      return existing
    }
    this.attacks.push(attack)
    return attack
  }

  /**
   * 移除普攻
   * @param {string} attackId - 普攻 ID
   */
  removeAttack(attackId) {
    const index = this.attacks.findIndex(a => a.id === attackId)
    if (index !== -1) {
      this.attacks.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 获取普攻
   * @param {string} attackId - 普攻 ID
   */
  getAttack(attackId) {
    return this.attacks.find(a => a.id === attackId)
  }

  /**
   * 获取所有普攻
   */
  getAllAttacks() {
    return this.attacks
  }

  /**
   * 更新所有普攻的冷却
   * @param {number} delta - 时间增量（ms）
   */
  update(delta) {
    for (const attack of this.attacks) {
      attack.update(delta)
    }
  }

  /**
   * 执行所有可用普攻
   * @param {Object} context - 上下文信息
   * @returns {boolean} 是否有普攻被执行
   */
  executeAll(context) {
    let anyExecuted = false

    for (const attack of this.attacks) {
      if (attack.canFire()) {
        attack.execute(this.player, context)
        attack.startCooldown()
        anyExecuted = true
      }
    }

    return anyExecuted
  }

  /**
   * 检查是否有任何普攻可以发射
   */
  canFireAny() {
    return this.attacks.some(a => a.canFire())
  }

  /**
   * 对特定类型的普攻应用强化
   * @param {string} attackId - 普攻 ID
   * @param {string} buffType - 强化类型
   * @param {number} value - 强化值
   */
  applyBuffToAttack(attackId, buffType, value) {
    const attack = this.getAttack(attackId)
    if (attack) {
      attack.applyBuff(buffType, value)
    }
  }

  /**
   * 对所有普攻应用强化
   * @param {string} buffType - 强化类型
   * @param {number} value - 强化值
   */
  applyBuffToAll(buffType, value) {
    for (const attack of this.attacks) {
      attack.applyBuff(buffType, value)
    }
  }

  /**
   * 获取所有普攻的信息（用于 UI 显示）
   */
  getAttacksInfo() {
    return this.attacks.map(a => a.getInfo())
  }

  /**
   * 重置所有普攻状态
   */
  reset() {
    for (const attack of this.attacks) {
      attack.reset()
    }
  }

  /**
   * 清空所有普攻
   */
  clear() {
    this.attacks = []
  }

  /**
   * 获取普攻数量
   */
  getAttackCount() {
    return this.attacks.length
  }
}
