/**
 * HUD 界面场景
 */

import Phaser from 'phaser'
import { COLORS, PLAYER } from '../config.js'

export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' })
  }

  create() {
    // 获取 GameScene 引用
    this.gameScene = this.scene.get('GameScene')

    // 创建 HP 血条
    this.createHpBar()

    // 创建击杀计数
    this.createKillCounter()

    // 创建调试信息
    this.createDebugInfo()

    // 监听 GameScene 事件
    this.gameScene.events.on('playerHpUpdated', this.updateHpBar, this)
    this.gameScene.events.on('killCountUpdated', this.updateKillCount, this)

    console.log('HUDScene 初始化完成')
  }

  createHpBar() {
    const x = 20
    const y = 20
    const width = 200
    const height = 20

    // HP 标签
    this.add.text(x, y - 2, 'HP', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    })

    // 血条背景
    this.hpBarBg = this.add.graphics()
    this.hpBarBg.fillStyle(0x333333, 0.8)
    this.hpBarBg.fillRoundedRect(x + 30, y, width, height, 4)

    // 血条前景
    this.hpBar = this.add.graphics()
    this.hpBarWidth = width - 4
    this.hpBarHeight = height - 4
    this.hpBarX = x + 32
    this.hpBarY = y + 2

    this.drawHpBar(1)

    // HP 文字
    this.hpText = this.add.text(x + 30 + width / 2, y + height / 2, `${PLAYER.HP}/${PLAYER.HP}`, {
      fontSize: '12px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
  }

  drawHpBar(percent) {
    this.hpBar.clear()

    // 根据血量改变颜色
    let color = 0x00ff00 // 绿色
    if (percent <= 0.5) color = 0xffff00 // 黄色
    if (percent <= 0.25) color = 0xff0000 // 红色

    this.hpBar.fillStyle(color, 1)
    this.hpBar.fillRoundedRect(
      this.hpBarX,
      this.hpBarY,
      this.hpBarWidth * percent,
      this.hpBarHeight,
      2
    )
  }

  updateHpBar(hp, maxHp) {
    const percent = hp / maxHp
    this.drawHpBar(percent)
    this.hpText.setText(`${hp}/${maxHp}`)
  }

  createKillCounter() {
    // 击杀图标（简单的 X）
    const x = 20
    const y = 55

    this.add.text(x, y, 'KILLS', {
      fontSize: '14px',
      fill: '#ff6464',
      fontFamily: 'Arial'
    })

    this.killText = this.add.text(x + 55, y, '0', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    })
  }

  updateKillCount(count) {
    this.killText.setText(count.toString())

    // 击杀时的动画效果
    this.tweens.add({
      targets: this.killText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 100,
      yoyo: true
    })
  }

  createDebugInfo() {
    // FPS 和敌人数量显示
    this.debugText = this.add.text(this.cameras.main.width - 150, 20, '', {
      fontSize: '12px',
      fill: '#888888',
      fontFamily: 'monospace'
    })
  }

  update(time, delta) {
    // 更新调试信息
    if (this.debugText && this.gameScene) {
      const fps = Math.round(this.game.loop.actualFps)
      const enemies = this.gameScene.enemySpawner
        ? this.gameScene.enemySpawner.getActiveEnemies().length
        : 0

      this.debugText.setText([
        `FPS: ${fps}`,
        `Enemies: ${enemies}`
      ])
    }
  }
}
