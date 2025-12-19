/**
 * 御剑无双 - 游戏入口
 * Sword Immortal - Game Entry
 */

import Phaser from 'phaser'
import { MainMenuScene } from './scenes/MainMenuScene.js'
import { GameScene } from './scenes/GameScene.js'
import { HUDScene } from './scenes/HUDScene.js'
import { BuffSelectionScene } from './scenes/BuffSelectionScene.js'

// 游戏配置
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#0a0a1e',
  // 渲染性能优化
  render: {
    pixelArt: false,           // 非像素风格
    antialias: true,           // 开启抗锯齿
    roundPixels: true,         // 像素取整，减少模糊
    batchSize: 4096,           // 增加批量渲染大小
    maxLights: 10              // 限制灯光数量
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
      // 物理性能优化
      fps: 60,                 // 锁定物理帧率
      timeScale: 1,
      fixedStep: true          // 固定步长更新
    }
  },
  // 缩放配置（移动端适配）
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 640,
      height: 360
    },
    max: {
      width: 1920,
      height: 1080
    }
  },
  // 输入配置
  input: {
    activePointers: 2,         // 支持多点触控
    touch: {
      capture: true
    }
  },
  // 音频配置
  audio: {
    disableWebAudio: false,
    noAudio: false
  },
  scene: [MainMenuScene, GameScene, HUDScene, BuffSelectionScene]
}

// 启动游戏
const game = new Phaser.Game(config)

// 导出游戏实例供调试使用
window.game = game
