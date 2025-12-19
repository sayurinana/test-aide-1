/**
 * 主菜单场景
 * 游戏开始界面
 */

import Phaser from 'phaser'
import { getAudioManager } from '../systems/AudioManager.js'

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' })
  }

  preload() {
    // 预加载 SVG 资源（从 public 目录加载，确保构建后路径正确）
    this.load.svg('player', 'assets/sprites/player.svg', { width: 48, height: 48 })
    this.load.svg('shadow', 'assets/sprites/shadow.svg', { width: 36, height: 36 })
    this.load.svg('wolf', 'assets/sprites/wolf.svg', { width: 44, height: 44 })
    this.load.svg('snake', 'assets/sprites/snake.svg', { width: 32, height: 32 })
    this.load.svg('wraith', 'assets/sprites/wraith.svg', { width: 40, height: 40 })
    this.load.svg('elite', 'assets/sprites/elite.svg', { width: 60, height: 60 })
    this.load.svg('boss', 'assets/sprites/boss.svg', { width: 100, height: 100 })
  }

  create() {
    // 重置状态（修复返回主菜单后按钮失效的问题）
    this.isStarting = false

    const { width, height } = this.cameras.main
    const centerX = width / 2
    const centerY = height / 2

    // 背景
    this.createBackground()

    // 游戏标题
    const title = this.add.text(centerX, centerY - 150, '无尽幸存者', {
      fontSize: '72px',
      fill: '#64c8ff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    // 标题光晕动画
    this.tweens.add({
      targets: title,
      alpha: { from: 0.8, to: 1 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // 副标题
    this.add.text(centerX, centerY - 80, 'Endless Survivor', {
      fontSize: '24px',
      fill: '#888888',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 开始按钮
    const startButton = this.createButton(centerX, centerY + 30, '开始游戏', (event) => {
      // Shift + 点击进入测试模式
      if (event && event.shiftKey) {
        this.startTestMode()
      } else {
        this.startGame()
      }
    })

    // 按钮脉动动画
    this.tweens.add({
      targets: startButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // 操作说明
    const instructions = [
      'WASD - 移动',
      '鼠标 - 瞄准',
      '左键 - 攻击',
      'Q/E/R/空格 - 技能',
      'ESC - 暂停'
    ]

    const instructionY = centerY + 120
    instructions.forEach((text, i) => {
      this.add.text(centerX, instructionY + i * 25, text, {
        fontSize: '16px',
        fill: '#666666',
        fontFamily: 'Arial'
      }).setOrigin(0.5)
    })

    // 版本信息
    this.add.text(width - 10, height - 10, 'v1.0.0', {
      fontSize: '12px',
      fill: '#444444',
      fontFamily: 'Arial'
    }).setOrigin(1, 1)

    // 按任意键开始
    this.add.text(centerX, height - 50, '点击任意处开始游戏', {
      fontSize: '18px',
      fill: '#555555',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 测试模式提示
    this.add.text(centerX, height - 25, '(按住 Shift 点击进入测试模式)', {
      fontSize: '12px',
      fill: '#444444',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 全屏点击监听（Shift + 点击进入测试模式）
    this.input.on('pointerdown', (pointer) => {
      if (pointer.event.shiftKey) {
        this.startTestMode()
      } else {
        this.startGame()
      }
    })

    // 键盘监听（Shift + 任意键进入测试模式）
    this.input.keyboard.on('keydown', (event) => {
      if (event.shiftKey) {
        this.startTestMode()
      } else {
        this.startGame()
      }
    })

    // 初始化音效管理器
    this.audioManager = getAudioManager()
  }

  createBackground() {
    const { width, height } = this.cameras.main
    const graphics = this.add.graphics()

    // 渐变背景
    graphics.fillStyle(0x0a0a1e, 1)
    graphics.fillRect(0, 0, width, height)

    // 装饰粒子
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width)
      const y = Phaser.Math.Between(0, height)
      const alpha = Phaser.Math.FloatBetween(0.1, 0.4)
      const size = Phaser.Math.Between(1, 3)

      const particle = this.add.graphics()
      particle.fillStyle(0x64c8ff, alpha)
      particle.fillCircle(0, 0, size)
      particle.setPosition(x, y)

      // 漂浮动画
      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(20, 50),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        onRepeat: () => {
          particle.setPosition(Phaser.Math.Between(0, width), height + 10)
          particle.alpha = alpha
        }
      })
    }
  }

  createButton(x, y, text, callback) {
    const button = this.add.container(x, y)

    // 按钮背景
    const bg = this.add.graphics()
    bg.fillStyle(0x1a1a3e, 1)
    bg.fillRoundedRect(-100, -25, 200, 50, 8)
    bg.lineStyle(2, 0x64c8ff, 1)
    bg.strokeRoundedRect(-100, -25, 200, 50, 8)
    button.add(bg)

    // 按钮文字
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '24px',
      fill: '#64c8ff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
    button.add(buttonText)

    // 交互区域
    const hitArea = this.add.rectangle(0, 0, 200, 50, 0x000000, 0)
    hitArea.setInteractive({ useHandCursor: true })
    button.add(hitArea)

    hitArea.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x2a2a5e, 1)
      bg.fillRoundedRect(-100, -25, 200, 50, 8)
      bg.lineStyle(3, 0x88ddff, 1)
      bg.strokeRoundedRect(-100, -25, 200, 50, 8)
      buttonText.setFill('#ffffff')
    })

    hitArea.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x1a1a3e, 1)
      bg.fillRoundedRect(-100, -25, 200, 50, 8)
      bg.lineStyle(2, 0x64c8ff, 1)
      bg.strokeRoundedRect(-100, -25, 200, 50, 8)
      buttonText.setFill('#64c8ff')
    })

    hitArea.on('pointerdown', (pointer, localX, localY, event) => {
      event.stopPropagation()
      this.audioManager.playSfx('select')
      // 传递原始事件以便检测 Shift 键
      callback({ shiftKey: pointer.event.shiftKey })
    })

    return button
  }

  startGame() {
    // 防止重复触发
    if (this.isStarting) return
    this.isStarting = true

    this.audioManager.playSfx('select')

    // 淡出过渡
    this.cameras.main.fadeOut(500, 0, 0, 0)

    this.time.delayedCall(500, () => {
      this.scene.start('GameScene')
    })
  }

  startTestMode() {
    // 防止重复触发
    if (this.isStarting) return
    this.isStarting = true

    this.audioManager.playSfx('select')

    // 淡出过渡
    this.cameras.main.fadeOut(500, 0, 0, 0)

    this.time.delayedCall(500, () => {
      this.scene.start('TestScene')
    })
  }
}
