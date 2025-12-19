/**
 * 游戏配置常量
 */

// 游戏世界尺寸
export const WORLD = {
  WIDTH: 2000,
  HEIGHT: 2000
}

// 玩家配置
export const PLAYER = {
  SPEED: 220,             // 移动速度（略提升，手感更灵活）
  HP: 100,
  ATK: 12,                // 基础攻击（提升，让初期体验更爽）
  ATTACK_RANGE: 85,       // 攻击范围（略大，更容易命中）
  ATTACK_COOLDOWN: 350,   // 攻击冷却（降低，攻击更流畅）
  SIZE: 24,
  COLOR: 0x64c8ff  // 淡蓝色
}

// 敌人配置
export const ENEMY = {
  SPEED: 75,              // 基础速度（略降，让玩家更容易走位）
  HP: 25,                 // 基础HP（降低，初期击杀更快）
  ATK: 8,                 // 基础攻击（降低，减少初期压力）
  SIZE: 18,
  COLOR: 0xff6464,  // 红色
  SPAWN_INTERVAL: 1500,
  MAX_COUNT: 150          // 最大敌人数（提升，支持更大规模战斗）
}

// 敌人类型配置
export const ENEMY_TYPES = {
  // 幽灵 - 基础追踪型
  SHADOW: {
    id: 'shadow',
    name: '幽灵',
    hp: 30,
    atk: 10,
    speed: 80,
    size: 18,
    color: 0xff6464,
    behavior: 'chase',
    score: 10
  },

  // 狼人 - 冲锋型
  WOLF: {
    id: 'wolf',
    name: '狼人',
    hp: 50,
    atk: 15,
    speed: 60,
    size: 22,
    color: 0xaa4444,
    behavior: 'charge',
    chargeSpeed: 300,
    chargeCooldown: 3000,
    chargeDistance: 200,
    score: 20
  },

  // 毒蛇 - 远程投射型
  SNAKE: {
    id: 'snake',
    name: '毒蛇',
    hp: 25,
    atk: 8,
    speed: 50,
    size: 16,
    color: 0x44aa44,
    behavior: 'ranged',
    attackRange: 300,
    attackCooldown: 2000,
    projectileSpeed: 200,
    score: 15
  },

  // 灵魂 - 分裂型
  WRAITH: {
    id: 'wraith',
    name: '灵魂',
    hp: 40,
    atk: 8,
    speed: 70,
    size: 20,
    color: 0x8844ff,
    behavior: 'split',
    splitCount: 2,
    splitHp: 15,
    score: 25
  },

  // 精英怪
  ELITE: {
    id: 'elite',
    name: '精英',
    hp: 200,
    atk: 25,
    speed: 60,
    size: 30,
    color: 0xff8800,
    behavior: 'elite',
    isElite: true,
    score: 100
  },

  // Boss
  BOSS: {
    id: 'boss',
    name: 'Boss',
    hp: 500,
    atk: 40,
    speed: 40,
    size: 50,
    color: 0xff0000,
    behavior: 'boss',
    isBoss: true,
    score: 500
  }
}

// 战斗系统配置
export const COMBAT = {
  // 连击系统
  COMBO_TIMEOUT: 2500,        // 连击超时时间（增加，更容易维持连击）
  COMBO_MULTIPLIER: 0.04,     // 每连击增加伤害百分比（略降，防止过于强力）
  MAX_COMBO_MULTIPLIER: 2.5,  // 最大连击倍率（提升，鼓励维持连击）

  // 击退效果
  KNOCKBACK_FORCE: 250,       // 击退力度（增强，更有打击感）
  KNOCKBACK_DURATION: 180,    // 击退持续时间（增加）

  // 无敌帧
  INVINCIBLE_DURATION: 600,   // 无敌帧持续时间（增加，降低难度）

  // 暴击系统
  CRIT_CHANCE: 0.08,          // 基础暴击率（提升到8%）
  CRIT_MULTIPLIER: 1.8        // 暴击伤害倍率（提升，暴击更有反馈）
}

// 颜色配置
export const COLORS = {
  PLAYER: 0x64c8ff,
  ENEMY: 0xff6464,
  ATTACK: 0xffffff,
  HP_BAR: 0x00ff00,
  HP_BAR_BG: 0x333333,
  UI_TEXT: '#ffffff',
  DAMAGE_NORMAL: '#ffffff',
  DAMAGE_CRIT: '#ffff00',
  COMBO_TEXT: '#64c8ff',
  SKILL_1: 0x00ffff,     // 加速 - 青色
  SKILL_2: 0xff00ff,     // 闪现 - 紫色
  SKILL_3: 0x00ff00,     // 护盾 - 绿色
  SKILL_4: 0xff6688      // 治疗 - 粉色
}

// 普攻类型配置
export const ATTACK_TYPES = {
  // 射箭 - 远程投射物
  ARROW: {
    id: 'arrow',
    name: '射箭',
    description: '发射箭矢攻击远处敌人',
    damage: 15,
    cooldown: 600,       // 冷却 600ms
    speed: 500,          // 箭矢速度
    range: 400,          // 射程
    size: 8,             // 箭矢大小
    color: 0xffcc00,     // 金色
    icon: '🏹'
  },

  // 挥砍 - 近战扇形
  SLASH: {
    id: 'slash',
    name: '挥砍',
    description: '近距离扇形斩击',
    damage: 20,
    cooldown: 400,       // 冷却 400ms
    range: 85,           // 攻击范围
    arcAngle: Math.PI / 2, // 90度扇形
    color: 0x64c8ff,     // 淡蓝色
    icon: '⚔️'
  },

  // 法球 - 追踪投射物
  ORB: {
    id: 'orb',
    name: '法球',
    description: '发射追踪敌人的魔法球',
    damage: 12,
    cooldown: 800,       // 冷却 800ms
    speed: 300,          // 法球速度
    range: 350,          // 追踪范围
    size: 12,            // 法球大小
    color: 0xff00ff,     // 紫色
    icon: '🔮'
  },

  // 冲击波 - 穿透攻击
  WAVE: {
    id: 'wave',
    name: '冲击波',
    description: '发射穿透敌人的冲击波',
    damage: 18,
    cooldown: 700,       // 冷却 700ms
    speed: 400,          // 冲击波速度
    range: 300,          // 射程
    width: 60,           // 冲击波宽度
    color: 0x00ffff,     // 青色
    icon: '💨'
  },

  // 闪电链 - 连锁攻击
  LIGHTNING: {
    id: 'lightning',
    name: '闪电链',
    description: '闪电在敌人之间跳跃',
    damage: 10,
    cooldown: 900,       // 冷却 900ms
    range: 250,          // 初始攻击范围
    chainRange: 150,     // 链式攻击范围
    chainCount: 3,       // 最大跳跃次数
    color: 0xffff00,     // 黄色
    icon: '⚡'
  },

  // 召唤物 - 自动攻击
  SUMMON: {
    id: 'summon',
    name: '召唤物',
    description: '召唤精灵自动攻击敌人',
    damage: 8,
    cooldown: 1200,      // 冷却 1200ms
    duration: 5000,      // 持续 5 秒
    attackInterval: 500, // 攻击间隔 500ms
    range: 200,          // 攻击范围
    color: 0x88ff88,     // 浅绿色
    icon: '👻'
  }
}

// 技能配置
export const SKILLS = {
  // 技能1: 加速 (Q) - 短时间移动速度大幅提升
  SPEED_BOOST: {
    id: 'speed_boost',
    name: '加速',
    key: 'Q',
    cooldown: 8000,       // 冷却 8 秒
    duration: 3000,       // 持续 3 秒
    speedMultiplier: 2.0, // 速度翻倍
    color: 0x00ffff
  },

  // 技能2: 闪现 (E) - 瞬间位移到指定方向
  DASH: {
    id: 'dash',
    name: '闪现',
    key: 'E',
    cooldown: 5000,       // 冷却 5 秒
    distance: 200,        // 闪现距离
    duration: 100,        // 闪现时间
    invincible: true,     // 闪现期间无敌
    color: 0xff00ff
  },

  // 技能3: 护盾 (R) - 短时间免疫所有伤害
  SHIELD: {
    id: 'shield',
    name: '护盾',
    key: 'R',
    cooldown: 15000,      // 冷却 15 秒
    duration: 2000,       // 持续 2 秒
    radius: 60,           // 护盾视觉半径
    color: 0x00ff00
  },

  // 技能4: 治疗 (Space) - 恢复一定比例生命值
  HEAL: {
    id: 'heal',
    name: '治疗',
    key: 'SPACE',
    cooldown: 20000,      // 冷却 20 秒
    healPercent: 0.3,     // 恢复 30% 最大生命值
    color: 0xff6688
  }
}
