/**
 * 普攻基类
 * 所有普攻类型的基础类，定义通用接口和属性
 */

export class AttackBase {
  constructor(scene, config) {
    this.scene = scene
    this.id = config.id
    this.name = config.name
    this.description = config.description || ''
    this.icon = config.icon || ''

    // 基础属性
    this.baseDamage = config.damage
    this.damage = config.damage
    this.baseCooldown = config.cooldown
    this.cooldown = config.cooldown
    this.range = config.range
    this.color = config.color

    // 状态
    this.currentCooldown = 0
    this.level = 1
    this.isEnabled = true

    // 强化加成
    this.damageBonus = 0      // 伤害加成（百分比）
    this.cooldownReduction = 0 // 冷却缩减（百分比）
    this.rangeBonus = 0       // 范围加成（百分比）
  }

  /**
   * 检查是否可以发射
   */
  canFire() {
    return this.isEnabled && this.currentCooldown <= 0
  }

  /**
   * 执行攻击（子类实现）
   * @param {Player} player - 玩家对象
   * @param {Object} context - 上下文信息（包含敌人列表等）
   */
  execute(player, context) {
    throw new Error('AttackBase.execute() must be implemented by subclass')
  }

  /**
   * 更新冷却
   * @param {number} delta - 时间增量（ms）
   */
  update(delta) {
    if (this.currentCooldown > 0) {
      this.currentCooldown -= delta
      if (this.currentCooldown < 0) {
        this.currentCooldown = 0
      }
    }
  }

  /**
   * 开始冷却
   */
  startCooldown() {
    const reducedCooldown = this.cooldown * (1 - this.cooldownReduction)
    this.currentCooldown = Math.max(reducedCooldown, 100) // 最小 100ms
  }

  /**
   * 获取计算后的伤害
   */
  getComputedDamage() {
    return Math.floor(this.damage * (1 + this.damageBonus))
  }

  /**
   * 获取计算后的范围
   */
  getComputedRange() {
    return this.range * (1 + this.rangeBonus)
  }

  /**
   * 获取冷却进度（0-1）
   */
  getCooldownProgress() {
    if (this.cooldown <= 0) return 1
    return 1 - (this.currentCooldown / this.cooldown)
  }

  /**
   * 升级攻击
   */
  upgrade() {
    this.level++
    // 基础升级：每级伤害 +10%，冷却 -5%
    this.damage = Math.floor(this.baseDamage * (1 + (this.level - 1) * 0.1))
    this.cooldown = Math.floor(this.baseCooldown * (1 - (this.level - 1) * 0.05))
    this.cooldown = Math.max(this.cooldown, 100) // 最小冷却 100ms
  }

  /**
   * 应用强化效果
   * @param {string} type - 强化类型
   * @param {number} value - 强化值
   */
  applyBuff(type, value) {
    switch (type) {
      case 'damage':
        this.damageBonus += value
        break
      case 'cooldown':
        this.cooldownReduction += value
        this.cooldownReduction = Math.min(this.cooldownReduction, 0.75) // 最大 75% 冷却缩减
        break
      case 'range':
        this.rangeBonus += value
        break
    }
  }

  /**
   * 重置状态
   */
  reset() {
    this.currentCooldown = 0
    this.level = 1
    this.damage = this.baseDamage
    this.cooldown = this.baseCooldown
    this.damageBonus = 0
    this.cooldownReduction = 0
    this.rangeBonus = 0
    this.isEnabled = true
  }

  /**
   * 获取攻击信息（用于 UI 显示）
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.icon,
      level: this.level,
      damage: this.getComputedDamage(),
      cooldown: this.cooldown,
      range: this.getComputedRange(),
      cooldownProgress: this.getCooldownProgress()
    }
  }
}
