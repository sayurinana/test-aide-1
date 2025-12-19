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

// 颜色配置
export const COLORS = {
  PLAYER: 0x64c8ff,
  ENEMY: 0xff6464,
  ATTACK: 0xffffff,
  HP_BAR: 0x00ff00,
  HP_BAR_BG: 0x333333,
  UI_TEXT: '#ffffff'
}
