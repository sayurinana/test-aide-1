/**
 * 强化道具数据定义
 * 基于 GDD 第六章设计
 */

// 稀有度配置
export const RARITY = {
  COMMON: { id: 'common', name: '普通', color: 0xffffff, probability: 0.60 },
  RARE: { id: 'rare', name: '稀有', color: 0x4488ff, probability: 0.25 },
  EPIC: { id: 'epic', name: '史诗', color: 0xaa44ff, probability: 0.12 },
  LEGENDARY: { id: 'legendary', name: '传说', color: 0xffaa00, probability: 0.03 }
}

// 强化类别
export const CATEGORY = {
  ATTRIBUTE: { id: 'attribute', name: '属性', icon: '⬆️' },
  SKILL: { id: 'skill', name: '技能', icon: '⚔️' },
  EFFECT: { id: 'effect', name: '特效', icon: '✨' },
  SURVIVAL: { id: 'survival', name: '生存', icon: '❤️' }
}

// 强化道具列表
export const BUFF_LIST = [
  // === 属性类强化 ===
  {
    id: 'A01',
    name: '锋锐',
    rarity: 'common',
    category: 'attribute',
    description: 'ATK +4',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'atk', value: 4 }
  },
  {
    id: 'A02',
    name: '坚韧',
    rarity: 'common',
    category: 'attribute',
    description: 'HP +20',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'maxHp', value: 20 }
  },
  {
    id: 'A03',
    name: '迅捷',
    rarity: 'common',
    category: 'attribute',
    description: 'SPD +20',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'speed', value: 20 }
  },
  {
    id: 'A04',
    name: '专注',
    rarity: 'rare',
    category: 'attribute',
    description: 'CRIT +6%',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'critChance', value: 0.06 }
  },
  {
    id: 'A05',
    name: '猛击',
    rarity: 'rare',
    category: 'attribute',
    description: 'CRITDMG +25%',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'critMultiplier', value: 0.25 }
  },
  {
    id: 'A06',
    name: '战意',
    rarity: 'epic',
    category: 'attribute',
    description: 'ATK +10, CRIT +3%',
    stackable: true,
    maxStacks: 5,
    effect: { type: 'multi_stat', stats: [
      { stat: 'atk', value: 10 },
      { stat: 'critChance', value: 0.03 }
    ]}
  },
  {
    id: 'A07',
    name: '战神',
    rarity: 'legendary',
    category: 'attribute',
    description: 'ATK +20%, HP +30%',
    stackable: false,
    effect: { type: 'multi_percent', stats: [
      { stat: 'atk', value: 0.2 },
      { stat: 'maxHp', value: 0.3 }
    ]}
  },

  // === 技能类强化 ===
  {
    id: 'S01',
    name: '扩展打击',
    rarity: 'common',
    category: 'skill',
    description: '普攻范围 +20%',
    stackable: true,
    maxStacks: 5,
    effect: { type: 'stat_percent', stat: 'attackRange', value: 0.2 }
  },
  {
    id: 'S02',
    name: '快速冷却',
    rarity: 'common',
    category: 'skill',
    description: '技能冷却 -8%',
    stackable: true,
    maxStacks: 8,
    effect: { type: 'stat_add', stat: 'cooldownReduction', value: 0.08 }
  },
  {
    id: 'S03',
    name: '风行者',
    rarity: 'rare',
    category: 'skill',
    description: '加速效果持续时间 +50%',
    stackable: false,
    effect: { type: 'skill_enhance', skill: 'speed_boost', stat: 'duration', value: 0.5 }
  },
  {
    id: 'S04',
    name: '闪现大师',
    rarity: 'rare',
    category: 'skill',
    description: '闪现距离 +50%',
    stackable: false,
    effect: { type: 'skill_enhance', skill: 'dash', stat: 'distance', value: 0.5 }
  },
  {
    id: 'S05',
    name: '钢铁意志',
    rarity: 'rare',
    category: 'skill',
    description: '护盾持续时间 +100%',
    stackable: false,
    effect: { type: 'skill_enhance', skill: 'shield', stat: 'duration', value: 1.0 }
  },
  {
    id: 'S06',
    name: '治愈之力',
    rarity: 'epic',
    category: 'skill',
    description: '治疗量 +50%，冷却 -20%',
    stackable: false,
    effect: { type: 'skill_multi', skill: 'heal', changes: [
      { stat: 'healPercent', value: 0.15 },
      { stat: 'cooldown', value: -4000 }
    ]}
  },
  {
    id: 'S07',
    name: '技能宗师',
    rarity: 'legendary',
    category: 'skill',
    description: '所有技能冷却 -30%',
    stackable: false,
    effect: { type: 'stat_add', stat: 'cooldownReduction', value: 0.30 }
  },

  // === 特效类强化 ===
  {
    id: 'E01',
    name: '连斩',
    rarity: 'common',
    category: 'effect',
    description: '连击 50+ 时，ATK +10%',
    stackable: false,
    effect: { type: 'conditional', condition: 'combo_50', bonus: { stat: 'atk', percent: 0.1 } }
  },
  {
    id: 'E02',
    name: '嗜血',
    rarity: 'rare',
    category: 'effect',
    description: '击杀回复 2 HP',
    stackable: true,
    maxStacks: 5,
    effect: { type: 'trigger', trigger: 'on_kill', action: 'heal', value: 2 }
  },
  {
    id: 'E03',
    name: '连击狂人',
    rarity: 'rare',
    category: 'effect',
    description: '连击伤害加成上限 +50%',
    stackable: false,
    effect: { type: 'stat_add', stat: 'comboMultiplierCap', value: 0.5 }
  },
  {
    id: 'E04',
    name: '处刑者',
    rarity: 'epic',
    category: 'effect',
    description: '对 HP<30% 敌人伤害 +50%',
    stackable: false,
    effect: { type: 'conditional_damage', condition: 'enemy_low_hp', threshold: 0.3, bonus: 0.5 }
  },
  {
    id: 'E05',
    name: '无敌之力',
    rarity: 'epic',
    category: 'effect',
    description: '连击 100+ 时获得无敌',
    stackable: false,
    effect: { type: 'conditional', condition: 'combo_100', bonus: { flag: 'invincible', value: true } }
  },
  {
    id: 'E06',
    name: '重生',
    rarity: 'legendary',
    category: 'effect',
    description: '死亡时复活，HP 30%（每局一次）',
    stackable: false,
    effect: { type: 'trigger', trigger: 'on_death', action: 'revive', value: 0.3, once: true }
  },
  {
    id: 'E07',
    name: '完美强化',
    rarity: 'legendary',
    category: 'effect',
    description: '所有属性 +15%',
    stackable: false,
    effect: { type: 'multi_percent', stats: [
      { stat: 'atk', value: 0.15 },
      { stat: 'maxHp', value: 0.15 },
      { stat: 'speed', value: 0.15 }
    ]}
  },

  // === 生存类强化 ===
  {
    id: 'H01',
    name: '生命力',
    rarity: 'common',
    category: 'survival',
    description: 'HP +30',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'maxHp', value: 30 }
  },
  {
    id: 'H02',
    name: '护甲',
    rarity: 'common',
    category: 'survival',
    description: 'DEF +4',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'def', value: 4 }
  },
  {
    id: 'H03',
    name: '回春',
    rarity: 'rare',
    category: 'survival',
    description: '每秒恢复 2 HP',
    stackable: true,
    maxStacks: 5,
    effect: { type: 'regen', stat: 'hp', value: 2 }
  },
  {
    id: 'H04',
    name: '吸血',
    rarity: 'rare',
    category: 'survival',
    description: '造成伤害回复 4% HP',
    stackable: true,
    maxStacks: 5,
    effect: { type: 'trigger', trigger: 'on_damage', action: 'lifesteal', value: 0.04 }
  },
  {
    id: 'H05',
    name: '坚硬外壳',
    rarity: 'epic',
    category: 'survival',
    description: '受到伤害 -20%',
    stackable: false,
    effect: { type: 'stat_add', stat: 'damageReduction', value: 0.20 }
  },
  {
    id: 'H06',
    name: '绝境重生',
    rarity: 'legendary',
    category: 'survival',
    description: 'HP 低于 10% 时，受伤 -50%',
    stackable: false,
    effect: { type: 'conditional', condition: 'hp_below_10', bonus: { stat: 'damageReduction', value: 0.5 } }
  }
]

// 根据 ID 获取强化数据
export function getBuffById(id) {
  return BUFF_LIST.find(b => b.id === id)
}

// 根据稀有度获取强化列表
export function getBuffsByRarity(rarity) {
  return BUFF_LIST.filter(b => b.rarity === rarity)
}

// 根据类别获取强化列表
export function getBuffsByCategory(category) {
  return BUFF_LIST.filter(b => b.category === category)
}
