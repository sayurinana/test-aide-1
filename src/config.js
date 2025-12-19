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
  SKILL_1: 0x00ffff,     // 剑气横扫 - 青色
  SKILL_2: 0xff00ff,     // 瞬步斩 - 紫色
  SKILL_3: 0x00ff00,     // 护体真气 - 绿色
  SKILL_4: 0xffff00      // 剑域 - 金色
}

// 技能配置
export const SKILLS = {
  // 技能1: 剑气横扫 (Q) - 范围攻击
  SWORD_WAVE: {
    id: 'sword_wave',
    name: '剑气横扫',
    key: 'Q',
    cooldown: 3000,       // 冷却 3 秒
    damage: 15,           // 基础伤害
    range: 200,           // 攻击范围
    angle: Math.PI,       // 180度扇形
    duration: 300,        // 特效持续时间
    color: 0x00ffff
  },

  // 技能2: 瞬步斩 (E) - 突进攻击
  DASH_SLASH: {
    id: 'dash_slash',
    name: '瞬步斩',
    key: 'E',
    cooldown: 4000,       // 冷却 4 秒
    damage: 25,           // 基础伤害
    distance: 250,        // 突进距离
    width: 60,            // 伤害宽度
    duration: 200,        // 突进时间
    color: 0xff00ff
  },

  // 技能3: 护体真气 (R) - 防御/反击
  SHIELD: {
    id: 'shield',
    name: '护体真气',
    key: 'R',
    cooldown: 8000,       // 冷却 8 秒
    duration: 2000,       // 持续 2 秒
    reflect: 0.5,         // 反弹 50% 伤害
    radius: 80,           // 护盾半径
    color: 0x00ff00
  },

  // 技能4: 剑域 (Space) - 终极技能
  SWORD_DOMAIN: {
    id: 'sword_domain',
    name: '剑域',
    key: 'SPACE',
    cooldown: 15000,      // 冷却 15 秒
    damage: 50,           // 每次伤害
    radius: 300,          // 影响范围
    duration: 3000,       // 持续 3 秒
    ticks: 6,             // 伤害次数
    color: 0xffff00
  }
}
