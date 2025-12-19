/**
 * 游戏主场景
 */

import Phaser from 'phaser'
import { WORLD, PLAYER, ENEMY } from '../config.js'
import { Player } from '../entities/Player.js'
import { AttackEffect } from '../entities/AttackEffect.js'
import { EnemySpawner } from '../systems/EnemySpawner.js'
import { ComboSystem } from '../systems/ComboSystem.js'
import { DamageSystem } from '../systems/DamageSystem.js'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.killCount = 0
    this.gameOver = false
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

    // 创建敌人生成器
    this.enemySpawner = new EnemySpawner(this, this.player)

    // 创建战斗系统
    this.comboSystem = new ComboSystem(this)
    this.damageSystem = new DamageSystem(this)

    // 设置碰撞检测
    this.setupCollisions()

    // 设置攻击输入
    this.setupAttackInput()

    // 启动 HUD 场景
    this.scene.launch('HUDScene')

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

    // 玩家受伤
    const isDead = this.player.takeDamage(enemy.atk)

    // 重置连击
    this.comboSystem.resetCombo()

    // 更新 HUD
    this.events.emit('playerHpUpdated', this.player.hp, this.player.maxHp)

    if (isDead) {
      this.onGameOver()
    }
  }

  setupAttackInput() {
    // 鼠标点击攻击
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown() && !this.gameOver) {
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

      // 检测攻击范围内的敌人
      this.checkAttackHits(attackPos)
    }
  }

  checkAttackHits(attackPos) {
    const enemies = this.enemySpawner.getActiveEnemies()
    const attackRange = PLAYER.ATTACK_RANGE
    const attackAngle = this.player.rotation
    const arcAngle = Math.PI / 2 // 90度攻击扇形

    enemies.forEach(enemy => {
      if (!enemy.isActive) return

      // 计算敌人到攻击点的距离
      const dist = Phaser.Math.Distance.Between(
        attackPos.x, attackPos.y,
        enemy.x, enemy.y
      )

      if (dist <= attackRange + ENEMY.SIZE) {
        // 检查是否在攻击扇形范围内
        const angleToEnemy = Phaser.Math.Angle.Between(
          this.player.x, this.player.y,
          enemy.x, enemy.y
        )
        const angleDiff = Phaser.Math.Angle.Wrap(angleToEnemy - attackAngle)

        if (Math.abs(angleDiff) <= arcAngle / 2) {
          // 记录连击
          this.comboSystem.addHit()

          // 计算伤害（含暴击和连击加成）
          const { damage, isCrit } = this.damageSystem.calculateDamage(
            this.player.atk,
            this.comboSystem.getMultiplier(),
            this.player
          )

          // 应用伤害
          const killed = this.damageSystem.applyDamage(enemy, damage, isCrit)

          // 应用击退
          this.damageSystem.applyKnockback(enemy, this.player.x, this.player.y)

          if (killed) {
            this.addKill()
          }
        }
      }
    })
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
    if (this.gameOver) return

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
    }
  }

  addKill() {
    this.killCount++
    // 通知 HUD 更新
    this.events.emit('killCountUpdated', this.killCount)
  }

  onGameOver() {
    this.gameOver = true
    console.log('游戏结束！击杀数:', this.killCount)

    // 显示游戏结束文字
    const centerX = this.cameras.main.scrollX + this.cameras.main.width / 2
    const centerY = this.cameras.main.scrollY + this.cameras.main.height / 2

    this.add.text(centerX, centerY - 50, '游戏结束', {
      fontSize: '48px',
      fill: '#ff6464',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    this.add.text(centerX, centerY + 20, `击杀数: ${this.killCount}`, {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    this.add.text(centerX, centerY + 80, '点击重新开始', {
      fontSize: '24px',
      fill: '#64c8ff',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // 点击重新开始
    this.input.once('pointerdown', () => {
      this.scene.restart()
    })
  }
}
