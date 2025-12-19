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
  SPEED: 200,
  HP: 100,
  ATK: 10,
  ATTACK_RANGE: 80,
  ATTACK_COOLDOWN: 400,
  SIZE: 24,
  COLOR: 0x64c8ff  // 淡蓝色
}

// 敌人配置
export const ENEMY = {
  SPEED: 80,
  HP: 30,
  ATK: 10,
  SIZE: 18,
  COLOR: 0xff6464,  // 红色
  SPAWN_INTERVAL: 1500,
  MAX_COUNT: 100
}

// 战斗系统配置
export const COMBAT = {
  // 连击系统
  COMBO_TIMEOUT: 2000,        // 连击超时时间 (ms)
  COMBO_MULTIPLIER: 0.05,     // 每连击增加伤害百分比
  MAX_COMBO_MULTIPLIER: 2.0,  // 最大连击倍率

  // 击退效果
  KNOCKBACK_FORCE: 200,       // 击退力度
  KNOCKBACK_DURATION: 150,    // 击退持续时间 (ms)

  // 无敌帧
  INVINCIBLE_DURATION: 500,   // 无敌帧持续时间 (ms)

  // 暴击系统
  CRIT_CHANCE: 0.05,          // 基础暴击率 5%
  CRIT_MULTIPLIER: 1.5        // 暴击伤害倍率
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
  COMBO_TEXT: '#64c8ff'
}
