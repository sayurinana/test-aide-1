/**
 * 强化选择场景
 * 波次结束时显示三选一界面
 */

import Phaser from 'phaser'
import { RARITY, CATEGORY } from '../data/BuffData.js'

export class BuffSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BuffSelectionScene' })
  }

  init(data) {
    this.choices = data.choices || []
    this.waveNumber = data.waveNumber || 1
    this.onSelect = data.onSelect || (() => {})
  }

  create() {
    const { width, height } = this.cameras.main

    // 半透明背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8)

    // 标题
    this.add.text(width / 2, 80, '选择你的强化', {
      fontSize: '36px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 波次信息
    this.add.text(width / 2, 130, `第 ${this.waveNumber} 波完成`, {
      fontSize: '20px',
      fill: '#888888',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 创建三个选项卡片
    const cardWidth = 200
    const cardHeight = 280
    const cardSpacing = 40
    const totalWidth = cardWidth * 3 + cardSpacing * 2
    const startX = (width - totalWidth) / 2 + cardWidth / 2

    this.choices.forEach((buff, index) => {
      const x = startX + index * (cardWidth + cardSpacing)
      const y = height / 2

      this.createBuffCard(x, y, cardWidth, cardHeight, buff, index)
    })

    // 提示文字
    this.add.text(width / 2, height - 60, '按 1/2/3 或点击选择', {
      fontSize: '18px',
      fill: '#666666',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 键盘输入
    this.input.keyboard.on('keydown-ONE', () => this.selectBuff(0))
    this.input.keyboard.on('keydown-TWO', () => this.selectBuff(1))
    this.input.keyboard.on('keydown-THREE', () => this.selectBuff(2))
  }

  createBuffCard(x, y, width, height, buff, index) {
    const rarity = RARITY[buff.rarity.toUpperCase()]
    const category = CATEGORY[buff.category.toUpperCase()]

    // 卡片背景
    const card = this.add.container(x, y)

    // 背景矩形
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e)
    bg.setStrokeStyle(3, rarity.color)
    card.add(bg)

    // 稀有度标签
    const rarityLabel = this.add.text(0, -height / 2 + 20, `[${rarity.name}]`, {
      fontSize: '14px',
      fill: '#' + rarity.color.toString(16).padStart(6, '0'),
      fontFamily: 'Arial'
    }).setOrigin(0.5)
    card.add(rarityLabel)

    // 类别图标
    const categoryIcon = this.add.text(0, -height / 2 + 60, category.icon, {
      fontSize: '48px'
    }).setOrigin(0.5)
    card.add(categoryIcon)

    // 强化名称
    const nameText = this.add.text(0, -height / 2 + 120, buff.name, {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
    card.add(nameText)

    // 描述
    const descText = this.add.text(0, -height / 2 + 160, buff.description, {
      fontSize: '16px',
      fill: '#aaaaaa',
      fontFamily: 'Arial',
      wordWrap: { width: width - 20 },
      align: 'center'
    }).setOrigin(0.5, 0)
    card.add(descText)

    // 快捷键提示
    const keyText = this.add.text(0, height / 2 - 30, `[${index + 1}]`, {
      fontSize: '20px',
      fill: '#666666',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
    card.add(keyText)

    // 交互
    bg.setInteractive({ useHandCursor: true })

    bg.on('pointerover', () => {
      bg.setStrokeStyle(4, 0xffffff)
      this.tweens.add({
        targets: card,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      })
    })

    bg.on('pointerout', () => {
      bg.setStrokeStyle(3, rarity.color)
      this.tweens.add({
        targets: card,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      })
    })

    bg.on('pointerdown', () => {
      this.selectBuff(index)
    })
  }

  selectBuff(index) {
    if (index >= 0 && index < this.choices.length) {
      const selectedBuff = this.choices[index]

      // 选择动画
      this.cameras.main.flash(200, 255, 255, 255, false)

      // 延迟关闭场景
      this.time.delayedCall(200, () => {
        this.onSelect(selectedBuff)
        this.scene.stop()
      })
    }
  }
}
