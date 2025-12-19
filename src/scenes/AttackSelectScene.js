/**
 * 普攻选择场景
 * 游戏开始时展示普攻类型卡片，玩家选择初始普攻
 */

import Phaser from 'phaser'
import { ATTACK_TYPES } from '../config.js'
import { getAudioManager } from '../systems/AudioManager.js'

export class AttackSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AttackSelectScene' })
  }

  init(data) {
    this.onSelect = data.onSelect || (() => {})
  }

  create() {
    this.audioManager = getAudioManager()

    // 半透明背景
    const overlay = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.9
    )

    // 标题
    this.add.text(
      this.cameras.main.width / 2,
      60,
      '选择初始普攻',
      {
        fontSize: '36px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5)

    // 副标题
    this.add.text(
      this.cameras.main.width / 2,
      100,
      '每种普攻都有独特的攻击方式和强化路线',
      {
        fontSize: '16px',
        fill: '#888888',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5)

    // 获取所有普攻类型
    const attackTypes = Object.values(ATTACK_TYPES)

    // 创建卡片
    const cardWidth = 140
    const cardHeight = 200
    const cardSpacing = 20
    const totalWidth = attackTypes.length * cardWidth + (attackTypes.length - 1) * cardSpacing
    const startX = (this.cameras.main.width - totalWidth) / 2 + cardWidth / 2
    const cardY = this.cameras.main.height / 2

    attackTypes.forEach((attackType, index) => {
      const x = startX + index * (cardWidth + cardSpacing)
      this.createAttackCard(x, cardY, cardWidth, cardHeight, attackType)
    })

    // 提示文字
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height - 60,
      '点击卡片选择普攻开始游戏',
      {
        fontSize: '14px',
        fill: '#666666',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5)
  }

  createAttackCard(x, y, width, height, attackType) {
    // 卡片容器
    const card = this.add.container(x, y)

    // 卡片背景
    const bg = this.add.graphics()
    bg.fillStyle(0x1a1a3e, 1)
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10)
    bg.lineStyle(2, attackType.color, 0.8)
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10)
    card.add(bg)

    // 图标
    const iconText = this.add.text(0, -60, attackType.icon, {
      fontSize: '40px'
    }).setOrigin(0.5)
    card.add(iconText)

    // 名称
    const nameText = this.add.text(0, -10, attackType.name, {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    card.add(nameText)

    // 描述
    const descText = this.add.text(0, 20, attackType.description, {
      fontSize: '11px',
      fill: '#aaaaaa',
      fontFamily: 'Arial',
      wordWrap: { width: width - 20 },
      align: 'center'
    }).setOrigin(0.5, 0)
    card.add(descText)

    // 属性信息
    const statsText = this.add.text(0, 70,
      `伤害: ${attackType.damage}\n冷却: ${attackType.cooldown}ms`,
      {
        fontSize: '10px',
        fill: '#888888',
        fontFamily: 'Arial',
        align: 'center'
      }
    ).setOrigin(0.5, 0)
    card.add(statsText)

    // 交互区域
    const hitArea = this.add.rectangle(0, 0, width, height, 0x000000, 0)
    hitArea.setInteractive({ useHandCursor: true })
    card.add(hitArea)

    // 悬停效果
    hitArea.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x2a2a5e, 1)
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10)
      bg.lineStyle(3, attackType.color, 1)
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10)

      this.tweens.add({
        targets: card,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      })
    })

    hitArea.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x1a1a3e, 1)
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10)
      bg.lineStyle(2, attackType.color, 0.8)
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10)

      this.tweens.add({
        targets: card,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      })
    })

    // 点击选择
    hitArea.on('pointerdown', () => {
      this.selectAttack(attackType)
    })
  }

  selectAttack(attackType) {
    // 播放选择音效
    this.audioManager.playSfx('select')

    // 选择动画
    this.cameras.main.fadeOut(200, 0, 0, 0)

    this.cameras.main.once('camerafadeoutcomplete', () => {
      // 回调传递选择结果
      this.onSelect(attackType)

      // 关闭场景
      this.scene.stop()
    })
  }
}
