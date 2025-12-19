/**
 * 测试关卡场景
 * 基于 GameScene，添加测试用快捷键功能
 */

import Phaser from 'phaser'
import { WORLD, PLAYER } from '../config.js'
import { Player } from '../entities/Player.js'
import { AttackEffect } from '../entities/AttackEffect.js'
import { EnemySpawner } from '../systems/EnemySpawner.js'
import { ComboSystem } from '../systems/ComboSystem.js'
import { DamageSystem } from '../systems/DamageSystem.js'
import { SkillManager } from '../systems/SkillManager.js'
import { RoguelikeSystem } from '../systems/RoguelikeSystem.js'
import { WaveManager } from '../systems/WaveManager.js'
import { VFXManager } from '../systems/VFXManager.js'
import { getAudioManager } from '../systems/AudioManager.js'

export class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestScene' })
    this.killCount = 0
    this.gameOver = false
    this.isPaused = false
    this.autoAttack = false
    this.testInvincible = true
  }

  create() {
    // 重置状态
    this.killCount = 0
    this.gameOver = false
    this.isPaused = false
    this.autoAttack = false
    this.testInvincible = true

    // 设置世界边界
    this.physics.world.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT)
    this.cameras.main.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT)

    // 创建背景
    this.createBackground()

    // 创建玩家
    this.player = new Player(this, WORLD.WIDTH / 2, WORLD.HEIGHT / 2)
    this.player.isInvincible = true  // 测试模式默认无敌

    // 相机跟随
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // 攻击效果组
    this.attackEffects = this.add.group()

    // 创建系统
    this.enemySpawner = new EnemySpawner(this, this.player)
    this.enemySpawner.setSpawnInterval(Infinity)
    this.comboSystem = new ComboSystem(this)
    this.damageSystem = new DamageSystem(this)
    this.skillManager = new SkillManager(this, this.player)
    this.roguelikeSystem = new RoguelikeSystem(this, this.player)
    this.waveManager = new WaveManager(this)
    this.vfxManager = new VFXManager(this)
    this.audioManager = getAudioManager()

    // 设置碰撞和输入
    this.setupCollisions()
    this.setupAttackInput()
    this.setupPauseInput()
    this.setupAutoAttackInput()
    this.setupTestKeys()

    // 启动 HUD
    this.scene.launch('HUDScene')

    // 显示测试模式提示
    this.showTestModeHint()

    // 开始第一波
    this.time.delayedCall(1000, () => {
      this.waveManager.startNextWave()
    })

    console.log('TestScene 初始化完成 - 测试模式')
  }

  setupTestKeys() {
    this.input.keyboard.on('keydown-ONE', () => {
      if (this.gameOver || this.isPaused) return
      this.grantLargeExp()
    })

    this.input.keyboard.on('keydown-TWO', () => {
      if (this.gameOver || this.isPaused) return
      this.triggerDeath()
    })

    this.input.keyboard.on('keydown-THREE', () => {
      if (this.gameOver || this.isPaused) return
      this.spawnEnemyWave()
    })

    this.input.keyboard.on('keydown-FOUR', () => {
      if (this.gameOver || this.isPaused) return
      this.clearAllEnemies()
    })

    this.input.keyboard.on('keydown-FIVE', () => {
      if (this.gameOver || this.isPaused) return
      this.toggleInvincible()
    })

    this.input.keyboard.on('keydown-ZERO', () => {
      this.returnToMenu()
    })
  }

  showTestModeHint() {
    const hintContainer = this.add.container(10, 10).setScrollFactor(0).setDepth(1000)

    const bg = this.add.rectangle(0, 0, 200, 180, 0x000000, 0.7).setOrigin(0, 0)
    hintContainer.add(bg)

    const title = this.add.text(10, 10, '[ 测试模式 ]', {
      fontSize: '16px',
      fill: '#ff6600',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    })
    hintContainer.add(title)

    const hints = [
      '1 - 获得大量经验',
      '2 - 触发死亡',
      '3 - 生成敌人波',
      '4 - 清除所有敌人',
      '5 - 切换无敌',
      '0 - 返回主菜单'
    ]

    hints.forEach((hint, index) => {
      const text = this.add.text(10, 35 + index * 22, hint, {
        fontSize: '14px',
        fill: '#cccccc',
        fontFamily: 'Arial'
      })
      hintContainer.add(text)
    })

    this.invincibleText = this.add.text(10, 160, '无敌: ON', {
      fontSize: '14px',
      fill: '#00ff00',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    })
    hintContainer.add(this.invincibleText)
  }

  grantLargeExp() {
    const expInfo = this.roguelikeSystem.getExpInfo()
    let totalExp = 0
    let currentExpToNext = expInfo.expToNext
    for (let i = 0; i < 5; i++) {
      totalExp += currentExpToNext
      currentExpToNext = Math.floor(currentExpToNext * 1.15)
    }

    console.log(`[测试] 获得经验: ${totalExp}`)
    this.roguelikeSystem.addExp(totalExp)
    this.vfxManager.screenFlash(0xffff00, 200, 0.3)
    this.audioManager.playSfx('levelup')
  }

  triggerDeath() {
    this.player.isInvincible = false
    this.player.hp = 0
    this.events.emit('playerHpUpdated', 0, this.player.maxHp)
    console.log('[测试] 触发死亡')
    this.onGameOver()
  }

  spawnEnemyWave() {
    const wave = this.waveManager.currentWave || 1
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2
      const distance = 300 + Math.random() * 100
      const x = this.player.x + Math.cos(angle) * distance
      const y = this.player.y + Math.sin(angle) * distance
      const spawnX = Phaser.Math.Clamp(x, 50, WORLD.WIDTH - 50)
      const spawnY = Phaser.Math.Clamp(y, 50, WORLD.HEIGHT - 50)
      this.enemySpawner.spawnEnemy(spawnX, spawnY, wave)
    }
    console.log('[测试] 生成敌人波: 10 个敌人')
    this.audioManager.playSfx('wave')
  }

  clearAllEnemies() {
    const enemies = this.enemySpawner.getActiveEnemies()
    let count = 0
    enemies.forEach(enemy => {
      if (enemy.isActive) {
        enemy.destroy()
        count++
      }
    })
    console.log(`[测试] 清除敌人: ${count} 个`)
    this.vfxManager.screenFlash(0x00ffff, 200, 0.3)
  }

  toggleInvincible() {
    this.testInvincible = !this.testInvincible
    this.player.isInvincible = this.testInvincible
    if (this.invincibleText) {
      this.invincibleText.setText(`无敌: ${this.testInvincible ? 'ON' : 'OFF'}`)
      this.invincibleText.setFill(this.testInvincible ? '#00ff00' : '#ff0000')
    }
    console.log(`[测试] 无敌模式: ${this.testInvincible ? '开启' : '关闭'}`)
    this.audioManager.playSfx('select')
  }

  returnToMenu() {
    console.log('[测试] 返回主菜单')
    this.scene.stop('HUDScene')
    this.scene.start('MainMenuScene')
  }

  // 复用 GameScene 的方法
  setupCollisions() {
    this.physics.add.overlap(
      this.player,
      this.enemySpawner.getGroup(),
      this.onEnemyHitPlayer,
      null,
      this
    )
  }

  onEnemyHitPlayer(player, enemy) {
    if (this.gameOver || !enemy.isActive) return
    if (this.player.isInvincible) return
    if (this.roguelikeSystem.isComboInvincible()) return

    if (this.skillManager && this.skillManager.checkShieldReflect(enemy, enemy.atk)) {
      return
    }

    const actualDamage = this.roguelikeSystem.calculateDamageTaken(enemy.atk)
    const isDead = this.player.takeDamage(actualDamage)

    this.vfxManager.screenShake(0.008, 100)
    this.vfxManager.showDamageNumber(this.player.x, this.player.y, actualDamage, false)
    this.audioManager.playSfx('hurt')
    this.comboSystem.resetCombo()
    this.events.emit('playerHpUpdated', this.player.hp, this.player.maxHp)

    if (isDead) {
      if (this.roguelikeSystem.checkRevive()) {
        this.events.emit('playerRevived')
      } else {
        this.onGameOver()
      }
    }
  }

  setupAttackInput() {
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown() && !this.gameOver && !this.isPaused) {
        this.performAttack()
      }
    })
  }

  setupPauseInput() {
    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.gameOver) {
        this.togglePause()
      }
    })
  }

  setupAutoAttackInput() {
    this.input.keyboard.on('keydown-F', () => {
      if (!this.gameOver && !this.isPaused) {
        this.autoAttack = !this.autoAttack
        this.audioManager.playSfx('select')
        this.events.emit('autoAttackToggled', this.autoAttack)
      }
    })
  }

  togglePause() {
    this.isPaused = !this.isPaused
    if (this.isPaused) {
      this.physics.pause()
      this.events.emit('gamePaused')
    } else {
      this.physics.resume()
      this.events.emit('gameResumed')
    }
  }

  performAttack() {
    if (!this.player || !this.player.canAttack()) return

    if (this.player.attack()) {
      const attackPos = this.player.getAttackPosition()
      const effect = new AttackEffect(this, attackPos.x, attackPos.y, this.player.rotation)
      this.attackEffects.add(effect)
      this.audioManager.playSfx('attack')

      this.vfxManager.createSlashTrail(
        attackPos.x, attackPos.y,
        this.player.rotation,
        PLAYER.ATTACK_RANGE,
        0x64c8ff
      )

      this.checkAttackHits(attackPos)
    }
  }

  checkAttackHits(attackPos) {
    const enemies = this.enemySpawner.getActiveEnemies()
    let attackRange = PLAYER.ATTACK_RANGE
    if (this.roguelikeSystem) {
      attackRange = this.roguelikeSystem.getComputedStat(PLAYER.ATTACK_RANGE, 'attackRange')
    }

    const attackAngle = this.player.rotation
    const arcAngle = Math.PI / 2

    enemies.forEach(enemy => {
      if (!enemy.isActive) return

      const dist = Phaser.Math.Distance.Between(attackPos.x, attackPos.y, enemy.x, enemy.y)

      if (dist <= attackRange + enemy.size) {
        const angleToEnemy = Phaser.Math.Angle.Between(
          this.player.x, this.player.y, enemy.x, enemy.y
        )
        const angleDiff = Phaser.Math.Angle.Wrap(angleToEnemy - attackAngle)

        if (Math.abs(angleDiff) <= arcAngle / 2) {
          this.comboSystem.addHit()

          let playerAtk = this.player.atk
          if (this.roguelikeSystem) {
            playerAtk = this.roguelikeSystem.getComputedStat(this.player.baseAtk, 'atk')
          }

          const { damage, isCrit } = this.damageSystem.calculateDamage(
            playerAtk, this.comboSystem.getMultiplier(), this.player
          )

          const finalDamage = Math.floor(damage * this.roguelikeSystem.getDamageMultiplier(enemy))
          const killed = this.damageSystem.applyDamage(enemy, finalDamage, isCrit)

          this.vfxManager.showDamageNumber(enemy.x, enemy.y, finalDamage, isCrit)
          this.vfxManager.flashWhite(enemy, 30)
          this.audioManager.playSfx('hit')

          if (isCrit) {
            this.vfxManager.screenShake(0.003, 50)
            this.vfxManager.hitStop(30)
          }

          this.damageSystem.applyKnockback(enemy, this.player.x, this.player.y)
          this.roguelikeSystem.onDamageDealt(finalDamage)
          this.waveManager.recordDamage(finalDamage)

          if (killed) {
            this.vfxManager.createDeathParticles(enemy.x, enemy.y, enemy.color, 10)
            this.vfxManager.screenShake(0.002, 30)
            this.audioManager.playSfx('kill')
            this.onEnemyKilled(enemy)
          }
        }
      }
    })
  }

  onEnemyKilled(enemy) {
    this.killCount++
    this.waveManager.onEnemyKilled(enemy)
    this.roguelikeSystem.onKill()
    const expReward = this.getExpReward(enemy)
    this.roguelikeSystem.addExp(expReward)
    this.events.emit('killCountUpdated', this.killCount)
  }

  getExpReward(enemy) {
    let baseExp = 10
    if (enemy.isBoss) {
      baseExp = 200
    } else if (enemy.isElite) {
      baseExp = 50
    } else {
      baseExp = Math.floor(10 + enemy.maxHp / 20)
    }
    const waveBonus = 1 + this.waveManager.currentWave * 0.05
    return Math.floor(baseExp * waveBonus)
  }

  showBuffSelection() {
    const choices = this.roguelikeSystem.generateChoices(
      this.waveManager.currentWave,
      this.waveManager.getWaveType() === 'boss'
    )

    this.scene.launch('BuffSelectionScene', {
      choices,
      waveNumber: this.waveManager.currentWave,
      onSelect: (buff) => {
        this.onBuffSelected(buff)
      }
    })

    this.physics.pause()
  }

  onBuffSelected(buff) {
    this.roguelikeSystem.addBuff(buff.id)
    this.events.emit('buffAcquired', buff)
    this.physics.resume()
    this.waveManager.onBuffSelected()
  }

  createBackground() {
    const graphics = this.add.graphics()

    graphics.fillStyle(0x151528, 1)
    graphics.fillRect(0, 0, WORLD.WIDTH, WORLD.HEIGHT)

    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(50, WORLD.WIDTH - 50)
      const y = Phaser.Math.Between(50, WORLD.HEIGHT - 50)
      const alpha = Phaser.Math.FloatBetween(0.1, 0.3)
      const size = Phaser.Math.Between(2, 5)
      graphics.fillStyle(0x6688aa, alpha)
      graphics.fillCircle(x, y, size)
    }

    graphics.lineStyle(1, 0x2a2a4a, 0.3)
    const gridSize = 100
    for (let x = 0; x <= WORLD.WIDTH; x += gridSize) {
      graphics.lineBetween(x, 0, x, WORLD.HEIGHT)
    }
    for (let y = 0; y <= WORLD.HEIGHT; y += gridSize) {
      graphics.lineBetween(0, y, WORLD.WIDTH, y)
    }

    graphics.lineStyle(4, 0x4a6a8a, 0.8)
    graphics.strokeRect(2, 2, WORLD.WIDTH - 4, WORLD.HEIGHT - 4)
    graphics.lineStyle(2, 0x6a8aaa, 0.5)
    graphics.strokeRect(6, 6, WORLD.WIDTH - 12, WORLD.HEIGHT - 12)

    this.createCornerDecoration(graphics, 0, 0, 1, 1)
    this.createCornerDecoration(graphics, WORLD.WIDTH, 0, -1, 1)
    this.createCornerDecoration(graphics, 0, WORLD.HEIGHT, 1, -1)
    this.createCornerDecoration(graphics, WORLD.WIDTH, WORLD.HEIGHT, -1, -1)
  }

  createCornerDecoration(graphics, x, y, dirX, dirY) {
    const size = 80
    graphics.lineStyle(2, 0x4a6a8a, 0.6)
    graphics.lineBetween(x, y, x + size * dirX, y)
    graphics.lineBetween(x, y, x, y + size * dirY)
    graphics.lineBetween(x + size * 0.5 * dirX, y, x + size * 0.5 * dirX, y + size * 0.3 * dirY)
    graphics.lineBetween(x, y + size * 0.5 * dirY, x + size * 0.3 * dirX, y + size * 0.5 * dirY)
  }

  update(time, delta) {
    if (this.gameOver || this.isPaused) return

    if (this.player) this.player.update(time, delta)
    if (this.autoAttack) this.performAttack()
    if (this.enemySpawner) this.enemySpawner.update(time, delta)
    if (this.comboSystem) {
      this.comboSystem.update(time, delta)
      this.waveManager.recordCombo(this.comboSystem.comboCount)
    }
    if (this.skillManager) this.skillManager.update(time, delta)
    if (this.roguelikeSystem) this.roguelikeSystem.update(time, delta)
    if (this.waveManager) this.waveManager.update(time, delta)
  }

  onGameOver() {
    this.gameOver = true
    this.cameras.main.stopFollow()
    this.audioManager.playSfx('gameover')
    const stats = this.waveManager.getGameOverStats()
    console.log('游戏结束！', stats)
    this.events.emit('gameOver', stats)
    this.showGameOverScreen(stats)
  }

  showGameOverScreen(stats) {
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2
    const uiContainer = this.add.container(0, 0).setScrollFactor(0)

    const overlay = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.85)
    uiContainer.add(overlay)

    const titleText = this.add.text(centerX, centerY - 180, '游戏结束', {
      fontSize: '48px',
      fill: '#ff6464',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    uiContainer.add(titleText)

    this.tweens.add({
      targets: titleText,
      scaleX: 1.1, scaleY: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    const waveText = this.add.text(centerX, centerY - 100, `最高波次：第 ${stats.highestWave} 波`, {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
    uiContainer.add(waveText)

    const minutes = Math.floor(stats.survivalTime / 60000)
    const seconds = Math.floor((stats.survivalTime % 60000) / 1000)
    const timeText = this.add.text(centerX, centerY - 60, `存活时间：${minutes} 分 ${seconds} 秒`, {
      fontSize: '20px',
      fill: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5)
    uiContainer.add(timeText)

    const line = this.add.graphics()
    line.lineStyle(2, 0x444444)
    line.lineBetween(centerX - 200, centerY - 30, centerX + 200, centerY - 30)
    uiContainer.add(line)

    const statsY = centerY + 10
    const leftX = centerX - 100
    const rightX = centerX + 100

    const killText = this.add.text(leftX, statsY, `击杀数：${stats.totalKills}`, {
      fontSize: '18px', fill: '#cccccc', fontFamily: 'Arial'
    }).setOrigin(0.5)
    uiContainer.add(killText)

    const comboText = this.add.text(rightX, statsY, `最高连击：${stats.highestCombo}`, {
      fontSize: '18px', fill: '#cccccc', fontFamily: 'Arial'
    }).setOrigin(0.5)
    uiContainer.add(comboText)

    const damageText = this.add.text(leftX, statsY + 30, `造成伤害：${stats.totalDamage}`, {
      fontSize: '18px', fill: '#cccccc', fontFamily: 'Arial'
    }).setOrigin(0.5)
    uiContainer.add(damageText)

    const buffText = this.add.text(rightX, statsY + 30, `获得强化：${stats.buffsCollected}`, {
      fontSize: '18px', fill: '#cccccc', fontFamily: 'Arial'
    }).setOrigin(0.5)
    uiContainer.add(buffText)

    const score = this.calculateScore(stats)
    const scoreText = this.add.text(centerX, centerY + 90, `最终分数：${score}`, {
      fontSize: '36px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    uiContainer.add(scoreText)

    this.tweens.add({
      targets: scoreText,
      alpha: 0.7,
      duration: 500,
      yoyo: true,
      repeat: 2
    })

    const createButton = (x, y, text, callback) => {
      const btn = this.add.text(x, y, text, {
        fontSize: '24px',
        fill: '#64c8ff',
        fontFamily: 'Arial',
        backgroundColor: '#1a1a3e',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })

      btn.on('pointerover', () => btn.setFill('#ffffff'))
      btn.on('pointerout', () => btn.setFill('#64c8ff'))
      btn.on('pointerdown', () => {
        this.audioManager.playSfx('select')
        callback()
      })
      uiContainer.add(btn)
      return btn
    }

    createButton(centerX - 100, centerY + 160, '再来一局', () => this.scene.restart())
    createButton(centerX + 100, centerY + 160, '返回菜单', () => {
      this.scene.stop('HUDScene')
      this.scene.start('MainMenuScene')
    })
  }

  calculateScore(stats) {
    const baseScore = stats.totalKills * 10 + stats.highestWave * 1000
    const comboMultiplier = Math.min(1 + stats.highestCombo / 500, 2.0)
    const efficiencyMultiplier = stats.survivalTime > 0
      ? Math.min(1 + stats.totalDamage / stats.survivalTime / 1000, 1.5)
      : 1
    const difficultyMultiplier = 1 + stats.highestWave / 50
    return Math.floor(baseScore * comboMultiplier * efficiencyMultiplier * difficultyMultiplier)
  }
}
