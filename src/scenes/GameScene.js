/**
 * 游戏主场景
 * 集成战斗系统、技能系统、Roguelike 系统和波次管理
 */

import Phaser from 'phaser'
import { WORLD, PLAYER, ENEMY } from '../config.js'
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

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.killCount = 0
    this.gameOver = false
    this.isPaused = false
  }

  create() {
    // 重置状态
    this.killCount = 0
    this.gameOver = false
    this.isPaused = false

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

    // 创建敌人生成器（由 WaveManager 控制生成）
    this.enemySpawner = new EnemySpawner(this, this.player)
    // 禁用自动生成，由 WaveManager 控制
    this.enemySpawner.setSpawnInterval(Infinity)

    // 创建战斗系统
    this.comboSystem = new ComboSystem(this)
    this.damageSystem = new DamageSystem(this)

    // 创建技能管理器
    this.skillManager = new SkillManager(this, this.player)

    // 创建 Roguelike 系统
    this.roguelikeSystem = new RoguelikeSystem(this, this.player)

    // 创建波次管理器
    this.waveManager = new WaveManager(this)

    // 创建视觉效果管理器
    this.vfxManager = new VFXManager(this)

    // 初始化音效管理器
    this.audioManager = getAudioManager()

    // 设置碰撞检测
    this.setupCollisions()

    // 设置攻击输入
    this.setupAttackInput()

    // 设置暂停输入
    this.setupPauseInput()

    // 启动 HUD 场景
    this.scene.launch('HUDScene')

    // 游戏开始：第一波
    this.time.delayedCall(1000, () => {
      this.waveManager.startNextWave()
    })

    console.log('GameScene 初始化完成')
  }

  setupCollisions() {
    // 敌人与玩家碰撞
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

    // 检查连击无敌（无双之力）
    if (this.roguelikeSystem.isComboInvincible()) return

    // 检查护盾反伤
    if (this.skillManager && this.skillManager.checkShieldReflect(enemy, enemy.atk)) {
      return // 护盾阻挡了伤害
    }

    // 计算实际受到的伤害（应用减伤）
    const actualDamage = this.roguelikeSystem.calculateDamageTaken(enemy.atk)

    // 玩家受伤
    const isDead = this.player.takeDamage(actualDamage)

    // 受伤视觉反馈
    this.vfxManager.screenShake(0.008, 100)
    this.vfxManager.showDamageNumber(this.player.x, this.player.y, actualDamage, false)

    // 受伤音效
    this.audioManager.playSfx('hurt')

    // 重置连击
    this.comboSystem.resetCombo()

    // 更新 HUD
    this.events.emit('playerHpUpdated', this.player.hp, this.player.maxHp)

    if (isDead) {
      // 检查复活
      if (this.roguelikeSystem.checkRevive()) {
        // 复活成功
        this.events.emit('playerRevived')
      } else {
        this.onGameOver()
      }
    }
  }

  setupAttackInput() {
    // 鼠标点击攻击
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

      // 攻击音效
      this.audioManager.playSfx('attack')

      // 剑光拖尾效果
      this.vfxManager.createSlashTrail(
        attackPos.x,
        attackPos.y,
        this.player.rotation,
        PLAYER.ATTACK_RANGE,
        0x64c8ff
      )

      // 检测攻击范围内的敌人
      this.checkAttackHits(attackPos)
    }
  }

  checkAttackHits(attackPos) {
    const enemies = this.enemySpawner.getActiveEnemies()

    // 获取计算后的攻击范围
    let attackRange = PLAYER.ATTACK_RANGE
    if (this.roguelikeSystem) {
      attackRange = this.roguelikeSystem.getComputedStat(PLAYER.ATTACK_RANGE, 'attackRange')
    }

    const attackAngle = this.player.rotation
    const arcAngle = Math.PI / 2 // 90度攻击扇形

    enemies.forEach(enemy => {
      if (!enemy.isActive) return

      // 计算敌人到攻击点的距离
      const dist = Phaser.Math.Distance.Between(
        attackPos.x, attackPos.y,
        enemy.x, enemy.y
      )

      if (dist <= attackRange + enemy.size) {
        // 检查是否在攻击扇形范围内
        const angleToEnemy = Phaser.Math.Angle.Between(
          this.player.x, this.player.y,
          enemy.x, enemy.y
        )
        const angleDiff = Phaser.Math.Angle.Wrap(angleToEnemy - attackAngle)

        if (Math.abs(angleDiff) <= arcAngle / 2) {
          // 记录连击
          this.comboSystem.addHit()

          // 获取计算后的攻击力
          let playerAtk = this.player.atk
          if (this.roguelikeSystem) {
            playerAtk = this.roguelikeSystem.getComputedStat(this.player.baseAtk, 'atk')
          }

          // 计算伤害（含暴击和连击加成）
          const { damage, isCrit } = this.damageSystem.calculateDamage(
            playerAtk,
            this.comboSystem.getMultiplier(),
            this.player
          )

          // 应用伤害加成（如处刑者）
          const finalDamage = Math.floor(damage * this.roguelikeSystem.getDamageMultiplier(enemy))

          // 应用伤害
          const killed = this.damageSystem.applyDamage(enemy, finalDamage, isCrit)

          // 视觉效果
          this.vfxManager.showDamageNumber(enemy.x, enemy.y, finalDamage, isCrit)
          this.vfxManager.flashWhite(enemy, 30)

          // 音效
          this.audioManager.playSfx('hit')

          if (isCrit) {
            this.vfxManager.screenShake(0.003, 50)
            this.vfxManager.hitStop(30)
          }

          // 应用击退
          this.damageSystem.applyKnockback(enemy, this.player.x, this.player.y)

          // 触发吸血
          this.roguelikeSystem.onDamageDealt(finalDamage)

          // 记录伤害
          this.waveManager.recordDamage(finalDamage)

          if (killed) {
            // 死亡粒子效果
            this.vfxManager.createDeathParticles(enemy.x, enemy.y, enemy.color, 10)
            this.vfxManager.screenShake(0.002, 30)
            // 击杀音效
            this.audioManager.playSfx('kill')
            this.onEnemyKilled(enemy)
          }
        }
      }
    })
  }

  onEnemyKilled(enemy) {
    this.killCount++

    // 通知 WaveManager
    this.waveManager.onEnemyKilled(enemy)

    // 触发击杀回复
    this.roguelikeSystem.onKill()

    // 通知 HUD 更新
    this.events.emit('killCountUpdated', this.killCount)
  }

  // 显示强化选择界面
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

    // 暂停游戏场景
    this.physics.pause()
  }

  onBuffSelected(buff) {
    // 应用强化
    this.roguelikeSystem.addBuff(buff.id)

    // 通知 HUD
    this.events.emit('buffAcquired', buff)

    // 恢复游戏
    this.physics.resume()

    // 通知 WaveManager 继续
    this.waveManager.onBuffSelected()
  }

  createBackground() {
    // 创建背景层
    const graphics = this.add.graphics()

    // 渐变背景色块（模拟深度）
    graphics.fillStyle(0x151528, 1)
    graphics.fillRect(0, 0, WORLD.WIDTH, WORLD.HEIGHT)

    // 添加随机装饰光点（仙气效果）
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(50, WORLD.WIDTH - 50)
      const y = Phaser.Math.Between(50, WORLD.HEIGHT - 50)
      const alpha = Phaser.Math.FloatBetween(0.1, 0.3)
      const size = Phaser.Math.Between(2, 5)

      graphics.fillStyle(0x6688aa, alpha)
      graphics.fillCircle(x, y, size)
    }

    // 创建网格背景
    graphics.lineStyle(1, 0x2a2a4a, 0.3)

    const gridSize = 100
    for (let x = 0; x <= WORLD.WIDTH; x += gridSize) {
      graphics.lineBetween(x, 0, x, WORLD.HEIGHT)
    }
    for (let y = 0; y <= WORLD.HEIGHT; y += gridSize) {
      graphics.lineBetween(0, y, WORLD.WIDTH, y)
    }

    // 绘制世界边界（带发光效果）
    graphics.lineStyle(4, 0x4a6a8a, 0.8)
    graphics.strokeRect(2, 2, WORLD.WIDTH - 4, WORLD.HEIGHT - 4)
    graphics.lineStyle(2, 0x6a8aaa, 0.5)
    graphics.strokeRect(6, 6, WORLD.WIDTH - 12, WORLD.HEIGHT - 12)

    // 添加角落装饰
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

    // 更新玩家
    if (this.player) {
      this.player.update(time, delta)
    }

    // 更新敌人生成器
    if (this.enemySpawner) {
      this.enemySpawner.update(time, delta)
    }

    // 更新连击系统
    if (this.comboSystem) {
      this.comboSystem.update(time, delta)

      // 记录最高连击
      this.waveManager.recordCombo(this.comboSystem.comboCount)
    }

    // 更新技能管理器
    if (this.skillManager) {
      this.skillManager.update(time, delta)
    }

    // 更新 Roguelike 系统（HP 回复等）
    if (this.roguelikeSystem) {
      this.roguelikeSystem.update(time, delta)
    }

    // 更新波次管理器
    if (this.waveManager) {
      this.waveManager.update(time, delta)
    }
  }

  addKill() {
    this.killCount++
    // 通知 HUD 更新
    this.events.emit('killCountUpdated', this.killCount)
  }

  onGameOver() {
    this.gameOver = true

    // 游戏结束音效
    this.audioManager.playSfx('gameover')

    // 获取结算数据
    const stats = this.waveManager.getGameOverStats()

    console.log('游戏结束！', stats)

    // 发送结算事件给 HUD
    this.events.emit('gameOver', stats)

    // 显示游戏结束界面
    this.showGameOverScreen(stats)
  }

  showGameOverScreen(stats) {
    const centerX = this.cameras.main.scrollX + this.cameras.main.width / 2
    const centerY = this.cameras.main.scrollY + this.cameras.main.height / 2

    // 半透明背景
    const overlay = this.add.rectangle(
      centerX, centerY,
      this.cameras.main.width, this.cameras.main.height,
      0x000000, 0.7
    )

    // 标题
    this.add.text(centerX, centerY - 150, '☠️ 修炼结束 ☠️', {
      fontSize: '42px',
      fill: '#ff6464',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 最高波次
    this.add.text(centerX, centerY - 80, `最高波次：第 ${stats.highestWave} 波`, {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 存活时间
    const minutes = Math.floor(stats.survivalTime / 60000)
    const seconds = Math.floor((stats.survivalTime % 60000) / 1000)
    this.add.text(centerX, centerY - 40, `存活时间：${minutes} 分 ${seconds} 秒`, {
      fontSize: '20px',
      fill: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 分隔线
    const line = this.add.graphics()
    line.lineStyle(2, 0x444444)
    line.lineBetween(centerX - 200, centerY, centerX + 200, centerY)

    // 统计数据
    const statsY = centerY + 30
    const leftX = centerX - 100
    const rightX = centerX + 100

    this.add.text(leftX, statsY, `击杀数：${stats.totalKills}`, {
      fontSize: '18px',
      fill: '#cccccc',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    this.add.text(rightX, statsY, `最高连击：${stats.highestCombo}`, {
      fontSize: '18px',
      fill: '#cccccc',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    this.add.text(leftX, statsY + 30, `造成伤害：${stats.totalDamage}`, {
      fontSize: '18px',
      fill: '#cccccc',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    this.add.text(rightX, statsY + 30, `获得强化：${stats.buffsCollected}`, {
      fontSize: '18px',
      fill: '#cccccc',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 最终分数
    const score = this.calculateScore(stats)
    this.add.text(centerX, centerY + 100, `📊 最终分数：${score}`, {
      fontSize: '32px',
      fill: '#ffff00',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 重新开始按钮
    const restartText = this.add.text(centerX, centerY + 170, '[ 点击重新开始 ]', {
      fontSize: '24px',
      fill: '#64c8ff',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    restartText.on('pointerdown', () => {
      this.scene.restart()
    })

    restartText.on('pointerover', () => {
      restartText.setFill('#ffffff')
    })

    restartText.on('pointerout', () => {
      restartText.setFill('#64c8ff')
    })
  }

  calculateScore(stats) {
    // 基础分 = 击杀数 × 10 + 波次 × 1000
    const baseScore = stats.totalKills * 10 + stats.highestWave * 1000

    // 连击系数 = 1 + 最高连击 / 500 (上限 2.0)
    const comboMultiplier = Math.min(1 + stats.highestCombo / 500, 2.0)

    // 效率系数 = 1 + 总伤害 / 存活时间 / 1000 (上限 1.5)
    const efficiencyMultiplier = stats.survivalTime > 0
      ? Math.min(1 + stats.totalDamage / stats.survivalTime / 1000, 1.5)
      : 1

    // 难度系数 = 1 + 最高波次 / 50
    const difficultyMultiplier = 1 + stats.highestWave / 50

    return Math.floor(baseScore * comboMultiplier * efficiencyMultiplier * difficultyMultiplier)
  }
}
