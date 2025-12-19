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
    description: 'ATK +3',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'atk', value: 3 }
  },
  {
    id: 'A02',
    name: '坚韧',
    rarity: 'common',
    category: 'attribute',
    description: 'HP +15',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'maxHp', value: 15 }
  },
  {
    id: 'A03',
    name: '迅捷',
    rarity: 'common',
    category: 'attribute',
    description: 'SPD +15',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'speed', value: 15 }
  },
  {
    id: 'A04',
    name: '专注',
    rarity: 'rare',
    category: 'attribute',
    description: 'CRIT +5%',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'critChance', value: 0.05 }
  },
  {
    id: 'A05',
    name: '猛击',
    rarity: 'rare',
    category: 'attribute',
    description: 'CRITDMG +20%',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'critMultiplier', value: 0.2 }
  },
  {
    id: 'A06',
    name: '剑心',
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
    name: '不动明王',
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
    name: '剑气延长',
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
    description: '冷却缩减 +8%',
    stackable: true,
    maxStacks: 8,
    effect: { type: 'stat_add', stat: 'cooldownReduction', value: 0.08 }
  },
  {
    id: 'S03',
    name: '横扫千军',
    rarity: 'rare',
    category: 'skill',
    description: '剑气横扫范围 +50%',
    stackable: false,
    effect: { type: 'skill_enhance', skill: 'sword_wave', stat: 'range', value: 0.5 }
  },
  {
    id: 'S04',
    name: '瞬步强化',
    rarity: 'rare',
    category: 'skill',
    description: '瞬步斩可穿透敌人',
    stackable: false,
    effect: { type: 'skill_flag', skill: 'dash_slash', flag: 'penetrate', value: true }
  },
  {
    id: 'S05',
    name: '护体反震',
    rarity: 'rare',
    category: 'skill',
    description: '护体真气反弹伤害 +100%',
    stackable: false,
    effect: { type: 'skill_enhance', skill: 'shield', stat: 'reflect', value: 1.0 }
  },
  {
    id: 'S06',
    name: '剑域扩展',
    rarity: 'epic',
    category: 'skill',
    description: '剑域范围 +50%，持续 +1s',
    stackable: false,
    effect: { type: 'skill_multi', skill: 'sword_domain', changes: [
      { stat: 'radius', value: 0.5 },
      { stat: 'duration', value: 1000 }
    ]}
  },
  {
    id: 'S07',
    name: '万剑归宗',
    rarity: 'legendary',
    category: 'skill',
    description: '攻击时有20%概率发射追踪剑气',
    stackable: false,
    effect: { type: 'trigger', trigger: 'on_attack', chance: 0.2, action: 'homing_sword' }
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
    name: '剑气外溢',
    rarity: 'rare',
    category: 'effect',
    description: '攻击有 15% 概率触发额外剑气',
    stackable: false,
    effect: { type: 'trigger', trigger: 'on_attack', chance: 0.15, action: 'extra_slash' }
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
    name: '无双之力',
    rarity: 'epic',
    category: 'effect',
    description: '连击 100+ 时获得无敌',
    stackable: false,
    effect: { type: 'conditional', condition: 'combo_100', bonus: { flag: 'invincible', value: true } }
  },
  {
    id: 'E06',
    name: '轮回',
    rarity: 'legendary',
    category: 'effect',
    description: '死亡时复活，HP 30%（每局一次）',
    stackable: false,
    effect: { type: 'trigger', trigger: 'on_death', action: 'revive', value: 0.3, once: true }
  },
  {
    id: 'E07',
    name: '剑道通神',
    rarity: 'legendary',
    category: 'effect',
    description: '所有技能伤害 +30%，冷却 -20%',
    stackable: false,
    effect: { type: 'multi_stat', stats: [
      { stat: 'skillDamage', value: 0.3 },
      { stat: 'cooldownReduction', value: 0.2 }
    ]}
  },

  // === 生存类强化 ===
  {
    id: 'H01',
    name: '气血两旺',
    rarity: 'common',
    category: 'survival',
    description: 'HP +25',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'maxHp', value: 25 }
  },
  {
    id: 'H02',
    name: '铁布衫',
    rarity: 'common',
    category: 'survival',
    description: 'DEF +3',
    stackable: true,
    maxStacks: 10,
    effect: { type: 'stat_add', stat: 'def', value: 3 }
  },
  {
    id: 'H03',
    name: '回春',
    rarity: 'rare',
    category: 'survival',
    description: '每秒恢复 1 HP',
    stackable: true,
    maxStacks: 5,
    effect: { type: 'regen', stat: 'hp', value: 1 }
  },
  {
    id: 'H04',
    name: '吸血',
    rarity: 'rare',
    category: 'survival',
    description: '造成伤害回复 3% HP',
    stackable: true,
    maxStacks: 5,
    effect: { type: 'trigger', trigger: 'on_damage', action: 'lifesteal', value: 0.03 }
  },
  {
    id: 'H05',
    name: '金钟罩',
    rarity: 'epic',
    category: 'survival',
    description: '受到伤害 -15%',
    stackable: false,
    effect: { type: 'stat_add', stat: 'damageReduction', value: 0.15 }
  },
  {
    id: 'H06',
    name: '不死金身',
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
