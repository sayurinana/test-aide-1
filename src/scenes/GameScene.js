/**
 * 游戏主场景
 */

import Phaser from 'phaser'
import { WORLD, PLAYER, ENEMY } from '../config.js'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // 设置世界边界
    this.physics.world.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT)

    // 创建简单的背景网格
    this.createBackground()

    // 启动 HUD 场景
    this.scene.launch('HUDScene')

    console.log('GameScene 初始化完成')
  }

  createBackground() {
    // 创建网格背景
    const graphics = this.add.graphics()
    graphics.lineStyle(1, 0x2a2a4a, 0.3)

    const gridSize = 100
    for (let x = 0; x <= WORLD.WIDTH; x += gridSize) {
      graphics.lineBetween(x, 0, x, WORLD.HEIGHT)
    }
    for (let y = 0; y <= WORLD.HEIGHT; y += gridSize) {
      graphics.lineBetween(0, y, WORLD.WIDTH, y)
    }

    // 绘制边界
    graphics.lineStyle(3, 0x4a4a6a, 1)
    graphics.strokeRect(0, 0, WORLD.WIDTH, WORLD.HEIGHT)
  }

  update(time, delta) {
    // 游戏主循环
  }
}
