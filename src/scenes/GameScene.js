/**
 * 游戏主场景
 */

import Phaser from 'phaser'
import { WORLD, PLAYER, ENEMY } from '../config.js'
import { Player } from '../entities/Player.js'
import { AttackEffect } from '../entities/AttackEffect.js'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // 设置世界边界
    this.physics.world.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT)

    // 设置相机边界
    this.cameras.main.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT)

    // 创建简单的背景网格
    this.createBackground()

    // 创建玩家
    this.player = new Player(this, WORLD.WIDTH / 2, WORLD.HEIGHT / 2)

    // 相机跟随玩家
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // 攻击效果组
    this.attackEffects = this.add.group()

    // 设置攻击输入
    this.setupAttackInput()

    // 启动 HUD 场景
    this.scene.launch('HUDScene')

    console.log('GameScene 初始化完成')
  }

  setupAttackInput() {
    // 鼠标点击攻击
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) {
        this.performAttack()
      }
    })
  }

  performAttack() {
    if (!this.player || !this.player.canAttack()) return

    if (this.player.attack()) {
      // 获取攻击位置和角度
      const attackPos = this.player.getAttackPosition()

      // 创建攻击效果
      const effect = new AttackEffect(
        this,
        attackPos.x,
        attackPos.y,
        this.player.rotation
      )

      this.attackEffects.add(effect)
    }
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
    // 更新玩家
    if (this.player) {
      this.player.update(time, delta)
    }
  }
}
