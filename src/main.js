/**
 * 御剑无双 - 游戏入口
 * Sword Immortal - Game Entry
 */

import Phaser from 'phaser'
import { GameScene } from './scenes/GameScene.js'
import { HUDScene } from './scenes/HUDScene.js'
import { BuffSelectionScene } from './scenes/BuffSelectionScene.js'

// 游戏配置
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [GameScene, HUDScene, BuffSelectionScene]
}

// 启动游戏
const game = new Phaser.Game(config)

// 导出游戏实例供调试使用
window.game = game
