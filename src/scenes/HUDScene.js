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

    // 创建连击显示
    this.createComboDisplay()

    // 创建技能栏
    this.createSkillBar()

    // 创建调试信息
    this.createDebugInfo()

    // 监听 GameScene 事件
    this.gameScene.events.on('playerHpUpdated', this.updateHpBar, this)
    this.gameScene.events.on('killCountUpdated', this.updateKillCount, this)
    this.gameScene.events.on('comboUpdated', this.updateCombo, this)

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

  createComboDisplay() {
    // 连击显示在屏幕中央偏上
    const x = this.cameras.main.width / 2
    const y = 80

    this.comboText = this.add.text(x, y, '', {
      fontSize: '36px',
      fill: '#64c8ff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0)

    this.comboMultiplierText = this.add.text(x, y + 40, '', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0)
  }

  updateCombo(count, multiplier) {
    if (count === 0) {
      // 连击结束，淡出
      this.tweens.add({
        targets: [this.comboText, this.comboMultiplierText],
        alpha: 0,
        duration: 300
      })
      return
    }

    // 更新文字
    this.comboText.setText(`${count} COMBO`)
    this.comboMultiplierText.setText(`x${multiplier.toFixed(2)}`)

    // 显示并动画
    this.comboText.setAlpha(1)
    this.comboMultiplierText.setAlpha(1)

    // 缩放动画
    this.tweens.add({
      targets: this.comboText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
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

  createSkillBar() {
    // 技能栏位于屏幕底部中央
    const centerX = this.cameras.main.width / 2
    const y = this.cameras.main.height - 60
    const slotSize = 50
    const spacing = 10

    this.skillSlots = []
    const skillKeys = ['Q', 'E', 'R', 'SPACE']
    const skillColors = [0x00ffff, 0xff00ff, 0x00ff00, 0xffff00]

    for (let i = 0; i < 4; i++) {
      const x = centerX - (slotSize + spacing) * 1.5 + i * (slotSize + spacing)

      // 技能槽背景
      const bg = this.add.graphics()
      bg.fillStyle(0x333333, 0.8)
      bg.fillRoundedRect(x, y, slotSize, slotSize, 8)
      bg.lineStyle(2, skillColors[i], 0.8)
      bg.strokeRoundedRect(x, y, slotSize, slotSize, 8)

      // 冷却遮罩
      const cooldownMask = this.add.graphics()
      cooldownMask.setPosition(x, y)

      // 按键提示
      const keyLabel = skillKeys[i] === 'SPACE' ? '␣' : skillKeys[i]
      const keyText = this.add.text(x + slotSize / 2, y + slotSize - 8, keyLabel, {
        fontSize: '12px',
        fill: '#ffffff',
        fontFamily: 'Arial'
      }).setOrigin(0.5)

      // 冷却文字
      const cooldownText = this.add.text(x + slotSize / 2, y + slotSize / 2, '', {
        fontSize: '14px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5)

      this.skillSlots.push({
        bg,
        cooldownMask,
        cooldownText,
        x,
        y,
        size: slotSize,
        color: skillColors[i]
      })
    }
  }

  updateSkillBar() {
    if (!this.gameScene.skillManager) return

    const states = this.gameScene.skillManager.getSkillStates()
    const skillIds = ['sword_wave', 'dash_slash', 'shield', 'sword_domain']

    skillIds.forEach((id, i) => {
      const state = states[id]
      const slot = this.skillSlots[i]

      // 更新冷却遮罩
      slot.cooldownMask.clear()

      if (!state.ready) {
        const percent = state.currentCooldown / state.cooldown
        const height = slot.size * percent

        slot.cooldownMask.fillStyle(0x000000, 0.6)
        slot.cooldownMask.fillRect(0, slot.size - height, slot.size, height)

        // 显示冷却时间
        slot.cooldownText.setText((state.currentCooldown / 1000).toFixed(1))
      } else {
        slot.cooldownText.setText('')
      }

      // 激活状态特效
      if (state.active) {
        slot.bg.clear()
        slot.bg.fillStyle(slot.color, 0.4)
        slot.bg.fillRoundedRect(slot.x, slot.y, slot.size, slot.size, 8)
        slot.bg.lineStyle(3, slot.color, 1)
        slot.bg.strokeRoundedRect(slot.x, slot.y, slot.size, slot.size, 8)
      } else {
        slot.bg.clear()
        slot.bg.fillStyle(0x333333, 0.8)
        slot.bg.fillRoundedRect(slot.x, slot.y, slot.size, slot.size, 8)
        slot.bg.lineStyle(2, slot.color, state.ready ? 0.8 : 0.3)
        slot.bg.strokeRoundedRect(slot.x, slot.y, slot.size, slot.size, 8)
      }
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

    // 更新技能栏
    this.updateSkillBar()
  }
}
