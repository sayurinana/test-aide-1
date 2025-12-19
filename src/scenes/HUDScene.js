/**
 * HUD 界面场景
 */

import Phaser from 'phaser'
import { COLORS, PLAYER } from '../config.js'
import { getAudioManager } from '../systems/AudioManager.js'

export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' })
  }

  create() {
    // 获取 GameScene 引用
    this.gameScene = this.scene.get('GameScene')

    // 创建 HP 血条
    this.createHpBar()

    // 创建经验值条
    this.createExpBar()

    // 创建击杀计数
    this.createKillCounter()

    // 创建波次显示
    this.createWaveDisplay()

    // 创建连击显示
    this.createComboDisplay()

    // 创建技能栏
    this.createSkillBar()

    // 创建暂停界面
    this.createPauseOverlay()

    // 创建调试信息
    this.createDebugInfo()

    // 创建自动攻击状态显示
    this.createAutoAttackDisplay()

    // 监听 GameScene 事件
    this.gameScene.events.on('playerHpUpdated', this.updateHpBar, this)
    this.gameScene.events.on('killCountUpdated', this.updateKillCount, this)
    this.gameScene.events.on('comboUpdated', this.updateCombo, this)
    this.gameScene.events.on('waveAnnouncement', this.showWaveAnnouncement, this)
    this.gameScene.events.on('waveFightStart', this.onWaveFightStart, this)
    this.gameScene.events.on('waveProgress', this.updateWaveProgress, this)
    this.gameScene.events.on('waveComplete', this.onWaveComplete, this)
    this.gameScene.events.on('buffAcquired', this.showBuffAcquired, this)
    this.gameScene.events.on('gamePaused', this.showPauseOverlay, this)
    this.gameScene.events.on('gameResumed', this.hidePauseOverlay, this)
    this.gameScene.events.on('autoAttackToggled', this.updateAutoAttackDisplay, this)
    this.gameScene.events.on('expUpdated', this.updateExpBar, this)

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

  createExpBar() {
    const x = 20
    const y = 45
    const width = 200
    const height = 12

    // 等级标签
    this.levelText = this.add.text(x, y - 2, 'Lv.1', {
      fontSize: '12px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    })

    // 经验条背景
    this.expBarBg = this.add.graphics()
    this.expBarBg.fillStyle(0x222222, 0.8)
    this.expBarBg.fillRoundedRect(x + 35, y, width - 5, height, 3)

    // 经验条前景
    this.expBar = this.add.graphics()
    this.expBarWidth = width - 9
    this.expBarHeight = height - 4
    this.expBarX = x + 37
    this.expBarY = y + 2

    this.drawExpBar(0)

    // 经验值文字
    this.expText = this.add.text(x + 35 + (width - 5) / 2, y + height / 2, '0/100', {
      fontSize: '10px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
  }

  drawExpBar(percent) {
    this.expBar.clear()
    this.expBar.fillStyle(0xffff00, 1)
    this.expBar.fillRoundedRect(
      this.expBarX,
      this.expBarY,
      Math.max(this.expBarWidth * percent, 0),
      this.expBarHeight,
      2
    )
  }

  updateExpBar(data) {
    const percent = data.exp / data.expToNext
    this.drawExpBar(percent)
    this.levelText.setText(`Lv.${data.level}`)
    this.expText.setText(`${data.exp}/${data.expToNext}`)

    // 升级时的动画效果
    if (this.lastLevel && data.level > this.lastLevel) {
      this.tweens.add({
        targets: this.levelText,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 150,
        yoyo: true
      })
    }
    this.lastLevel = data.level
  }

  createKillCounter() {
    // 击杀图标（简单的 X）
    const x = 20
    const y = 70

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

  createAutoAttackDisplay() {
    // 自动攻击状态显示在左下角
    const x = 20
    const y = this.cameras.main.height - 100

    // 背景框
    this.autoAttackBg = this.add.graphics()
    this.autoAttackBg.fillStyle(0x333333, 0.7)
    this.autoAttackBg.fillRoundedRect(x, y, 120, 30, 6)
    this.autoAttackBg.lineStyle(2, 0x666666, 0.8)
    this.autoAttackBg.strokeRoundedRect(x, y, 120, 30, 6)

    // 状态文字
    this.autoAttackText = this.add.text(x + 60, y + 15, '自动攻击: 关', {
      fontSize: '12px',
      fill: '#888888',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 按键提示
    this.add.text(x + 60, y + 40, '[F] 切换', {
      fontSize: '10px',
      fill: '#666666',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
  }

  updateAutoAttackDisplay(enabled) {
    if (enabled) {
      this.autoAttackText.setText('自动攻击: 开')
      this.autoAttackText.setFill('#00ff00')
      this.autoAttackBg.clear()
      this.autoAttackBg.fillStyle(0x1a3a1a, 0.8)
      this.autoAttackBg.fillRoundedRect(20, this.cameras.main.height - 100, 120, 30, 6)
      this.autoAttackBg.lineStyle(2, 0x00ff00, 0.8)
      this.autoAttackBg.strokeRoundedRect(20, this.cameras.main.height - 100, 120, 30, 6)
    } else {
      this.autoAttackText.setText('自动攻击: 关')
      this.autoAttackText.setFill('#888888')
      this.autoAttackBg.clear()
      this.autoAttackBg.fillStyle(0x333333, 0.7)
      this.autoAttackBg.fillRoundedRect(20, this.cameras.main.height - 100, 120, 30, 6)
      this.autoAttackBg.lineStyle(2, 0x666666, 0.8)
      this.autoAttackBg.strokeRoundedRect(20, this.cameras.main.height - 100, 120, 30, 6)
    }
  }

  createSkillBar() {
    // 技能栏位于屏幕底部中央
    const centerX = this.cameras.main.width / 2
    const y = this.cameras.main.height - 60
    const slotSize = 50
    const spacing = 10

    this.skillSlots = []
    const skillKeys = ['Q', 'E', 'R', 'SPACE']
    const skillColors = [0x00ffff, 0xff00ff, 0x00ff00, 0xff6688]

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
    const skillIds = ['speed_boost', 'dash', 'shield', 'heal']

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

  createWaveDisplay() {
    const x = this.cameras.main.width / 2
    const y = 30

    // 波次文字
    this.waveText = this.add.text(x, y, '准备开始', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // 进度条背景
    this.waveProgressBg = this.add.graphics()
    this.waveProgressBg.fillStyle(0x333333, 0.6)
    this.waveProgressBg.fillRoundedRect(x - 100, y + 20, 200, 10, 5)

    // 进度条前景
    this.waveProgress = this.add.graphics()
    this.waveProgressWidth = 196
    this.waveProgressX = x - 98
    this.waveProgressY = y + 22

    // 波次公告容器
    this.waveAnnouncementContainer = this.add.container(x, this.cameras.main.height / 2)
    this.waveAnnouncementContainer.setAlpha(0)
  }

  showWaveAnnouncement(data) {
    // 清空并重建公告
    this.waveAnnouncementContainer.removeAll(true)

    // 标题
    const title = this.add.text(0, -30, data.title, {
      fontSize: '48px',
      fill: data.color,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    this.waveAnnouncementContainer.add(title)

    // 副标题
    if (data.subtitle) {
      const subtitle = this.add.text(0, 30, data.subtitle, {
        fontSize: '24px',
        fill: '#aaaaaa',
        fontFamily: 'Arial'
      }).setOrigin(0.5)
      this.waveAnnouncementContainer.add(subtitle)
    }

    // 敌人数量
    const enemyInfo = this.add.text(0, 70, `敌人数量: ${data.enemyCount}`, {
      fontSize: '18px',
      fill: '#888888',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
    this.waveAnnouncementContainer.add(enemyInfo)

    // 显示动画
    this.waveAnnouncementContainer.setAlpha(0)
    this.waveAnnouncementContainer.setScale(0.5)

    this.tweens.add({
      targets: this.waveAnnouncementContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.out'
    })

    // 3秒后淡出
    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: this.waveAnnouncementContainer,
        alpha: 0,
        duration: 500
      })
    })
  }

  onWaveFightStart(data) {
    this.waveText.setText(`第 ${data.wave} 波`)
    this.currentWaveTotal = data.enemyCount
    this.currentWaveKilled = 0
    this.updateWaveProgressBar()
  }

  updateWaveProgress(data) {
    this.currentWaveKilled = data.killed
    this.currentWaveTotal = data.total
    this.updateWaveProgressBar()
  }

  updateWaveProgressBar() {
    this.waveProgress.clear()
    const percent = this.currentWaveKilled / Math.max(this.currentWaveTotal, 1)
    this.waveProgress.fillStyle(0x64c8ff, 1)
    this.waveProgress.fillRoundedRect(
      this.waveProgressX,
      this.waveProgressY,
      this.waveProgressWidth * percent,
      6,
      3
    )
  }

  onWaveComplete(data) {
    // 显示波次完成
    const text = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      `第 ${data.wave} 波完成！`,
      {
        fontSize: '36px',
        fill: '#00ff00',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5)

    // 动画后移除
    this.tweens.add({
      targets: text,
      alpha: 0,
      y: text.y - 50,
      duration: 1000,
      delay: 500,
      onComplete: () => text.destroy()
    })

    // 里程碑显示
    if (data.milestone) {
      this.showMilestone(data.milestone)
    }
  }

  showMilestone(milestone) {
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2 + 60

    const text = this.add.text(centerX, centerY, `⚔️ ${milestone.name} ⚔️\n${milestone.reward}`, {
      fontSize: '24px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: text.y - 30,
      duration: 1500,
      delay: 2000,
      onComplete: () => text.destroy()
    })
  }

  showBuffAcquired(buff) {
    // 右下角显示获得的强化
    const x = this.cameras.main.width - 20
    const y = this.cameras.main.height - 120

    const text = this.add.text(x, y, `+ ${buff.name}`, {
      fontSize: '20px',
      fill: '#00ff00',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(1, 0.5)

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: y - 30,
      duration: 1500,
      delay: 1000,
      onComplete: () => text.destroy()
    })
  }

  createPauseOverlay() {
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2

    this.pauseContainer = this.add.container(centerX, centerY)
    this.pauseContainer.setVisible(false)
    this.pauseContainer.setDepth(1000)

    this.audioManager = getAudioManager()

    // 半透明背景
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.8)
    this.pauseContainer.add(bg)

    // 暂停文字
    const pauseText = this.add.text(0, -120, '游戏暂停', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    this.pauseContainer.add(pauseText)

    // 继续游戏按钮
    const resumeBtn = this.createPauseButton(0, -30, '继续游戏', () => {
      this.gameScene.togglePause()
    })
    this.pauseContainer.add(resumeBtn)

    // 音效开关
    const soundText = this.audioManager.enabled ? '音效：开' : '音效：关'
    this.soundBtn = this.createPauseButton(0, 30, soundText, () => {
      const enabled = this.audioManager.toggleMute()
      this.soundBtnText.setText(enabled ? '音效：开' : '音效：关')
      this.audioManager.playSfx('select')
    })
    this.pauseContainer.add(this.soundBtn)

    // 返回主菜单
    const menuBtn = this.createPauseButton(0, 90, '返回主菜单', () => {
      this.audioManager.playSfx('select')
      this.scene.stop('GameScene')
      this.scene.stop('HUDScene')
      this.scene.start('MainMenuScene')
    })
    this.pauseContainer.add(menuBtn)

    // 提示文字
    const tipText = this.add.text(0, 170, '按 ESC 继续游戏', {
      fontSize: '16px',
      fill: '#666666',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
    this.pauseContainer.add(tipText)
  }

  createPauseButton(x, y, text, callback) {
    const container = this.add.container(x, y)

    // 按钮背景
    const bg = this.add.graphics()
    bg.fillStyle(0x1a1a3e, 1)
    bg.fillRoundedRect(-100, -20, 200, 40, 8)
    bg.lineStyle(2, 0x64c8ff, 0.8)
    bg.strokeRoundedRect(-100, -20, 200, 40, 8)
    container.add(bg)

    // 按钮文字
    const btnText = this.add.text(0, 0, text, {
      fontSize: '20px',
      fill: '#64c8ff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
    container.add(btnText)

    // 保存文字引用供后续修改
    if (text.includes('音效')) {
      this.soundBtnText = btnText
    }

    // 交互区域
    const hitArea = this.add.rectangle(0, 0, 200, 40, 0x000000, 0)
    hitArea.setInteractive({ useHandCursor: true })
    container.add(hitArea)

    hitArea.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x2a2a5e, 1)
      bg.fillRoundedRect(-100, -20, 200, 40, 8)
      bg.lineStyle(3, 0x88ddff, 1)
      bg.strokeRoundedRect(-100, -20, 200, 40, 8)
      btnText.setFill('#ffffff')
    })

    hitArea.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x1a1a3e, 1)
      bg.fillRoundedRect(-100, -20, 200, 40, 8)
      bg.lineStyle(2, 0x64c8ff, 0.8)
      bg.strokeRoundedRect(-100, -20, 200, 40, 8)
      btnText.setFill('#64c8ff')
    })

    hitArea.on('pointerdown', () => {
      this.audioManager.playSfx('select')
      callback()
    })

    return container
  }

  showPauseOverlay() {
    this.pauseContainer.setVisible(true)
  }

  hidePauseOverlay() {
    this.pauseContainer.setVisible(false)
  }
}
