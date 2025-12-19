/**
 * Roguelike 系统 - 强化选择和效果管理
 * 基于 GDD 第六章设计
 */

import { BUFF_LIST, RARITY, getBuffById } from '../data/BuffData.js'

export class RoguelikeSystem {
  constructor(scene, player) {
    this.scene = scene
    this.player = player

    // 玩家已获得的强化
    this.activeBuffs = []  // { buffId, stacks }

    // 经验值和等级系统
    this.level = 1
    this.exp = 0
    this.expToNextLevel = 100  // 初始升级所需经验
    this.expGrowthRate = 1.15  // 每级经验需求增长率
    this.levelUpQueue = []     // 升级队列
    this.isSelectingBuff = false  // 是否正在选择强化

    // 保底计数
    this.pity = {
      rare: 0,
      epic: 0,
      legendary: 0
    }

    // 一次性效果状态
    this.usedOnce = {
      revive: false
    }

    // 被动效果状态
    this.regenTimer = 0

    // 初始化玩家强化属性
    this.initPlayerBuffStats()
  }

  initPlayerBuffStats() {
    // 在玩家对象上初始化强化属性
    this.player.buffStats = {
      // 基础属性加成
      atkAdd: 0,
      maxHpAdd: 0,
      speedAdd: 0,
      defAdd: 0,
      critChanceAdd: 0,
      critMultiplierAdd: 0,

      // 百分比加成
      atkPercent: 0,
      maxHpPercent: 0,

      // 技能相关
      attackRangePercent: 0,
      cooldownReduction: 0,
      skillDamage: 0,

      // 生存相关
      damageReduction: 0,
      regenPerSecond: 0,
      lifestealPercent: 0,
      healOnKill: 0,

      // 特殊标记
      hasRevive: false,
      reviveUsed: false,
      dashPenetrate: false,

      // 技能增强
      skillEnhancements: {}
    }
  }

  // 获取计算后的属性值
  getComputedStat(baseStat, statName) {
    const stats = this.player.buffStats
    let value = baseStat

    // 根据属性名应用加成
    switch (statName) {
      case 'atk':
        value = baseStat + stats.atkAdd
        value *= (1 + stats.atkPercent)
        // 连击 50+ 时 ATK +10%
        if (this.hasBuff('E01') && this.scene.comboSystem?.comboCount >= 50) {
          value *= 1.1
        }
        break
      case 'maxHp':
        value = baseStat + stats.maxHpAdd
        value *= (1 + stats.maxHpPercent)
        break
      case 'speed':
        value = baseStat + stats.speedAdd
        break
      case 'def':
        value = baseStat + stats.defAdd
        break
      case 'critChance':
        value = baseStat + stats.critChanceAdd
        break
      case 'critMultiplier':
        value = baseStat + stats.critMultiplierAdd
        break
      case 'attackRange':
        value = baseStat * (1 + stats.attackRangePercent)
        break
    }

    return value
  }

  // 检查是否有某个强化
  hasBuff(buffId) {
    return this.activeBuffs.some(b => b.buffId === buffId)
  }

  // 获取强化的叠加层数
  getBuffStacks(buffId) {
    const buff = this.activeBuffs.find(b => b.buffId === buffId)
    return buff ? buff.stacks : 0
  }

  // 添加强化
  addBuff(buffId) {
    const buffData = getBuffById(buffId)
    if (!buffData) return false

    const existing = this.activeBuffs.find(b => b.buffId === buffId)

    if (existing) {
      // 可叠加强化
      if (buffData.stackable && existing.stacks < buffData.maxStacks) {
        existing.stacks++
        this.applyBuffEffect(buffData)
        return true
      }
      return false // 已满或不可叠加
    } else {
      // 新强化
      this.activeBuffs.push({ buffId, stacks: 1 })
      this.applyBuffEffect(buffData)
      return true
    }
  }

  // 应用强化效果
  applyBuffEffect(buffData) {
    const effect = buffData.effect
    const stats = this.player.buffStats

    switch (effect.type) {
      case 'stat_add':
        this.applyStatAdd(effect.stat, effect.value)
        break

      case 'stat_percent':
        this.applyStatPercent(effect.stat, effect.value)
        break

      case 'multi_stat':
        effect.stats.forEach(s => {
          this.applyStatAdd(s.stat, s.value)
        })
        break

      case 'multi_percent':
        effect.stats.forEach(s => {
          this.applyStatPercent(s.stat, s.value)
        })
        break

      case 'regen':
        stats.regenPerSecond += effect.value
        break

      case 'trigger':
        if (effect.action === 'heal') {
          stats.healOnKill += effect.value
        } else if (effect.action === 'lifesteal') {
          stats.lifestealPercent += effect.value
        } else if (effect.action === 'revive') {
          stats.hasRevive = true
        }
        break

      case 'skill_enhance':
        if (!stats.skillEnhancements[effect.skill]) {
          stats.skillEnhancements[effect.skill] = {}
        }
        stats.skillEnhancements[effect.skill][effect.stat] =
          (stats.skillEnhancements[effect.skill][effect.stat] || 0) + effect.value
        break

      case 'skill_flag':
        if (effect.skill === 'dash_slash' && effect.flag === 'penetrate') {
          stats.dashPenetrate = true
        }
        break

      case 'skill_multi':
        if (!stats.skillEnhancements[effect.skill]) {
          stats.skillEnhancements[effect.skill] = {}
        }
        effect.changes.forEach(c => {
          stats.skillEnhancements[effect.skill][c.stat] =
            (stats.skillEnhancements[effect.skill][c.stat] || 0) + c.value
        })
        break

      case 'new_attack':
        // 触发新攻击选择界面
        this.scene.events.emit('showNewAttackSelection')
        break
    }

    // 应用 HP 变化
    this.applyHpChanges()
  }

  applyStatAdd(stat, value) {
    const stats = this.player.buffStats
    switch (stat) {
      case 'atk': stats.atkAdd += value; break
      case 'maxHp': stats.maxHpAdd += value; break
      case 'speed': stats.speedAdd += value; break
      case 'def': stats.defAdd += value; break
      case 'critChance': stats.critChanceAdd += value; break
      case 'critMultiplier': stats.critMultiplierAdd += value; break
      case 'cooldownReduction': stats.cooldownReduction += value; break
      case 'skillDamage': stats.skillDamage += value; break
      case 'damageReduction': stats.damageReduction += value; break
      case 'attackRange': stats.attackRangePercent += value; break
    }
  }

  applyStatPercent(stat, value) {
    const stats = this.player.buffStats
    switch (stat) {
      case 'atk': stats.atkPercent += value; break
      case 'maxHp': stats.maxHpPercent += value; break
      case 'attackRange': stats.attackRangePercent += value; break
    }
  }

  applyHpChanges() {
    // 重新计算最大 HP
    const baseMaxHp = this.player.baseMaxHp || 100
    const newMaxHp = this.getComputedStat(baseMaxHp, 'maxHp')

    // 如果最大 HP 增加，同时增加当前 HP
    if (newMaxHp > this.player.maxHp) {
      const hpDiff = newMaxHp - this.player.maxHp
      this.player.hp = Math.min(this.player.hp + hpDiff, newMaxHp)
    }

    this.player.maxHp = Math.floor(newMaxHp)

    // 更新 HUD
    this.scene.events.emit('playerHpUpdated', this.player.hp, this.player.maxHp)
  }

  // 获取玩家已拥有的攻击类型列表
  getOwnedAttackTypes() {
    if (!this.scene.attackManager) return []
    return this.scene.attackManager.getAllAttacks().map(a => a.id)
  }

  // 生成三个选择
  generateChoices(waveNumber, isBossWave = false) {
    const choices = []
    const usedIds = new Set()

    // 获取玩家已拥有的攻击类型
    const ownedAttackTypes = this.getOwnedAttackTypes()

    for (let i = 0; i < 3; i++) {
      const rarity = this.rollRarity(waveNumber, isBossWave && i === 0)
      const candidates = BUFF_LIST.filter(b => {
        if (usedIds.has(b.id)) return false
        if (b.rarity !== rarity) return false

        // 检查不可叠加且已拥有的
        if (!b.stackable && this.hasBuff(b.id)) return false

        // 检查已满级的可叠加强化
        if (b.stackable) {
          const stacks = this.getBuffStacks(b.id)
          if (stacks >= b.maxStacks) return false
        }

        // 过滤普攻类强化：只显示玩家已拥有攻击方式的专属强化
        if (b.category === 'attack' && b.attackType) {
          if (!ownedAttackTypes.includes(b.attackType)) {
            return false
          }
        }

        // 过滤"新的力量"强化：已拥有全部6种攻击时不再出现
        if (b.id === 'ATK_NEW' && ownedAttackTypes.length >= 6) {
          return false
        }

        return true
      })

      if (candidates.length > 0) {
        const choice = candidates[Math.floor(Math.random() * candidates.length)]
        choices.push(choice)
        usedIds.add(choice.id)
      } else {
        // 降级选择
        const fallbackCandidates = BUFF_LIST.filter(b => {
          if (usedIds.has(b.id)) return false
          if (!b.stackable && this.hasBuff(b.id)) return false
          if (b.stackable) {
            const stacks = this.getBuffStacks(b.id)
            if (stacks >= b.maxStacks) return false
          }
          return true
        })

        if (fallbackCandidates.length > 0) {
          const choice = fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)]
          choices.push(choice)
          usedIds.add(choice.id)
        }
      }
    }

    return choices
  }

  // 随机稀有度（优化概率，更慷慨）
  rollRarity(waveNumber, guaranteedRare = false) {
    // Boss 波保底稀有
    if (guaranteedRare) {
      const roll = Math.random()
      if (roll < 0.05 + this.pity.legendary * 0.015) {
        this.pity.legendary = 0
        return 'legendary'
      }
      if (roll < 0.20 + this.pity.epic * 0.03) {
        this.pity.epic = 0
        return 'epic'
      }
      this.pity.epic++
      this.pity.legendary++
      return 'rare'
    }

    // 正常概率（提升稀有度出现率）
    let roll = Math.random()

    // 保底机制（更快触发）
    const legendaryChance = 0.04 + this.pity.legendary * 0.008
    const epicChance = 0.15 + this.pity.epic * 0.02
    const rareChance = 0.30 + this.pity.rare * 0.05

    if (roll < legendaryChance) {
      this.pity.legendary = 0
      this.pity.epic = 0
      this.pity.rare = 0
      return 'legendary'
    }
    roll -= legendaryChance

    if (roll < epicChance) {
      this.pity.legendary++
      this.pity.epic = 0
      this.pity.rare = 0
      return 'epic'
    }
    roll -= epicChance

    if (roll < rareChance) {
      this.pity.legendary++
      this.pity.epic++
      this.pity.rare = 0
      return 'rare'
    }

    this.pity.legendary++
    this.pity.epic++
    this.pity.rare++
    return 'common'
  }

  // 处理击杀事件
  onKill() {
    const stats = this.player.buffStats
    if (stats.healOnKill > 0) {
      this.player.hp = Math.min(this.player.hp + stats.healOnKill, this.player.maxHp)
      this.scene.events.emit('playerHpUpdated', this.player.hp, this.player.maxHp)
    }
  }

  // 处理造成伤害事件
  onDamageDealt(damage) {
    const stats = this.player.buffStats
    if (stats.lifestealPercent > 0) {
      const heal = Math.floor(damage * stats.lifestealPercent)
      if (heal > 0) {
        this.player.hp = Math.min(this.player.hp + heal, this.player.maxHp)
        this.scene.events.emit('playerHpUpdated', this.player.hp, this.player.maxHp)
      }
    }
  }

  // 检查复活
  checkRevive() {
    const stats = this.player.buffStats
    if (stats.hasRevive && !stats.reviveUsed) {
      stats.reviveUsed = true
      this.player.hp = Math.floor(this.player.maxHp * 0.3)
      this.player.isInvincible = true
      this.scene.time.delayedCall(2000, () => {
        this.player.isInvincible = false
      })
      this.scene.events.emit('playerHpUpdated', this.player.hp, this.player.maxHp)
      return true
    }
    return false
  }

  // 计算受到的伤害
  calculateDamageTaken(baseDamage) {
    const stats = this.player.buffStats
    let reduction = stats.damageReduction

    // 不死金身：HP 低于 10% 时额外减伤
    if (this.hasBuff('H06') && this.player.hp / this.player.maxHp < 0.1) {
      reduction += 0.5
    }

    // 减伤上限 75%
    reduction = Math.min(reduction, 0.75)

    // 防御减伤
    const def = stats.defAdd
    const defReduction = def / (def + 50)

    return Math.floor(baseDamage * (1 - reduction) * (1 - defReduction))
  }

  // 计算伤害加成
  getDamageMultiplier(enemy) {
    let multiplier = 1

    // 处刑者：对低 HP 敌人加伤
    if (this.hasBuff('E04') && enemy.hp / enemy.maxHp < 0.3) {
      multiplier *= 1.5
    }

    // 剑道通神：技能伤害加成（由技能系统处理）

    return multiplier
  }

  // 检查连击无敌
  isComboInvincible() {
    return this.hasBuff('E05') && this.scene.comboSystem?.comboCount >= 100
  }

  // 更新（每帧调用）
  update(time, delta) {
    const stats = this.player.buffStats

    // HP 回复
    if (stats.regenPerSecond > 0) {
      this.regenTimer += delta
      if (this.regenTimer >= 1000) {
        this.regenTimer -= 1000
        if (this.player.hp < this.player.maxHp) {
          this.player.hp = Math.min(this.player.hp + stats.regenPerSecond, this.player.maxHp)
          this.scene.events.emit('playerHpUpdated', this.player.hp, this.player.maxHp)
        }
      }
    }
  }

  // 获取已激活强化的显示信息
  getActiveBuffsInfo() {
    return this.activeBuffs.map(b => {
      const data = getBuffById(b.buffId)
      return {
        ...data,
        stacks: b.stacks
      }
    })
  }

  // 添加经验值
  addExp(amount) {
    this.exp += amount

    // 检查是否升级（可能连续升多级）
    while (this.exp >= this.expToNextLevel) {
      this.exp -= this.expToNextLevel
      this.level++
      this.expToNextLevel = Math.floor(this.expToNextLevel * this.expGrowthRate)

      // 将升级加入队列
      this.levelUpQueue.push({
        level: this.level,
        timestamp: Date.now()
      })
    }

    // 通知 HUD 更新经验值显示
    this.scene.events.emit('expUpdated', {
      exp: this.exp,
      expToNext: this.expToNextLevel,
      level: this.level
    })

    // 处理升级队列
    this.processLevelUpQueue()
  }

  // 处理升级队列
  processLevelUpQueue() {
    // 如果正在选择强化或队列为空，不处理
    if (this.isSelectingBuff || this.levelUpQueue.length === 0) {
      return
    }

    // 修复：如果波次管理器正在等待强化选择（reward 状态），延迟处理
    // 避免同时启动两个 BuffSelectionScene 导致回调被覆盖
    if (this.scene.waveManager && this.scene.waveManager.waveState === 'reward') {
      this.scene.time.delayedCall(500, () => {
        this.processLevelUpQueue()
      })
      return
    }

    // 取出队列中的第一个升级
    const levelUp = this.levelUpQueue[0]
    this.isSelectingBuff = true

    // 显示强化选择界面
    this.showLevelUpBuffSelection(levelUp.level)
  }

  // 显示升级强化选择界面
  showLevelUpBuffSelection(level) {
    const choices = this.generateChoices(level, level % 5 === 0)

    this.scene.scene.launch('BuffSelectionScene', {
      choices,
      waveNumber: level,  // 使用等级代替波次
      isLevelUp: true,    // 标记为升级触发
      queueLength: this.levelUpQueue.length,  // 告知队列长度
      onSelect: (buff) => {
        this.onLevelUpBuffSelected(buff)
      }
    })

    // 暂停游戏场景
    this.scene.physics.pause()
  }

  // 升级强化选择完成
  onLevelUpBuffSelected(buff) {
    // 应用强化
    this.addBuff(buff.id)

    // 通知 HUD
    this.scene.events.emit('buffAcquired', buff)

    // 从队列中移除已处理的升级
    this.levelUpQueue.shift()
    this.isSelectingBuff = false

    // 检查队列中是否还有待处理的升级
    if (this.levelUpQueue.length > 0) {
      // 短暂延迟后处理下一个升级
      this.scene.time.delayedCall(300, () => {
        this.processLevelUpQueue()
      })
    } else {
      // 队列清空，恢复游戏
      this.scene.physics.resume()
    }
  }

  // 获取经验值信息
  getExpInfo() {
    return {
      level: this.level,
      exp: this.exp,
      expToNext: this.expToNextLevel,
      queueLength: this.levelUpQueue.length
    }
  }
}
