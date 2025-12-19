/**
 * 敌人类 - 支持多种敌人类型和行为
 */

import Phaser from 'phaser'
import { ENEMY_TYPES } from '../config.js'

// 行为状态
const STATES = {
  IDLE: 'idle',
  CHASE: 'chase',
  CHARGE_PREP: 'charge_prep',
  CHARGING: 'charging',
  RANGED_ATTACK: 'ranged_attack',
  STUNNED: 'stunned'
}

export class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, x, y, typeConfig = ENEMY_TYPES.SHADOW) {
    super(scene, x, y)

    this.scene = scene
    this.typeConfig = typeConfig

    // 属性初始化
    this.hp = typeConfig.hp
    this.maxHp = typeConfig.hp
    this.atk = typeConfig.atk
    this.speed = typeConfig.speed
    this.size = typeConfig.size
    this.color = typeConfig.color
    this.behavior = typeConfig.behavior
    this.score = typeConfig.score || 10

    this.target = null
    this.isActive = true

    // 状态机
    this.state = STATES.CHASE
    this.stateTimer = 0

    // 行为相关计时器
    this.actionCooldown = 0

    // 创建敌人图形
    this.createGraphics()

    // 添加到场景
    scene.add.existing(this)

    // 启用物理
    scene.physics.add.existing(this)
    this.body.setCircle(this.size)
    this.body.setOffset(-this.size, -this.size)
  }

  createGraphics() {
    // 根据行为类型选择 SVG 纹理
    const textureKey = this.getTextureKey()
    this.sprite = this.scene.add.image(0, 0, textureKey)
    this.add(this.sprite)
  }

  getTextureKey() {
    switch (this.behavior) {
      case 'chase': return 'shadow'
      case 'charge': return 'wolf'
      case 'ranged': return 'snake'
      case 'split': return 'wraith'
      case 'elite': return 'elite'
      case 'boss': return 'boss'
      default: return 'shadow'
    }
  }

  updateTexture() {
    const textureKey = this.getTextureKey()
    if (this.sprite) {
      this.sprite.setTexture(textureKey)
    }
  }

  setTarget(target) {
    this.target = target
  }

  update(time, delta) {
    if (!this.isActive || !this.target) return

    // 更新计时器
    if (this.actionCooldown > 0) {
      this.actionCooldown -= delta
    }
    if (this.stateTimer > 0) {
      this.stateTimer -= delta
    }

    // 根据行为执行逻辑
    switch (this.behavior) {
      case 'chase':
        this.updateChase()
        break
      case 'charge':
        this.updateCharge(delta)
        break
      case 'ranged':
        this.updateRanged()
        break
      case 'split':
        this.updateChase() // 分裂型平时也是追踪
        break
      case 'elite':
        this.updateElite(delta)
        break
      case 'boss':
        this.updateBoss(delta)
        break
      default:
        this.updateChase()
    }
  }

  // 追踪行为
  updateChase() {
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      this.target.x, this.target.y
    )
    this.body.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    )
    this.rotation = angle
  }

  // 冲锋行为
  updateCharge(delta) {
    const dist = Phaser.Math.Distance.Between(
      this.x, this.y, this.target.x, this.target.y
    )

    switch (this.state) {
      case STATES.CHASE:
        // 接近目标时准备冲锋
        if (dist <= this.typeConfig.chargeDistance && this.actionCooldown <= 0) {
          this.state = STATES.CHARGE_PREP
          this.stateTimer = 500 // 蓄力时间
          this.body.setVelocity(0, 0)

          // 蓄力特效
          this.scene.tweens.add({
            targets: this,
            scaleX: 1.3,
            scaleY: 0.7,
            duration: 500,
            yoyo: false
          })

          // 记录冲锋方向
          this.chargeAngle = Phaser.Math.Angle.Between(
            this.x, this.y, this.target.x, this.target.y
          )
        } else {
          this.updateChase()
        }
        break

      case STATES.CHARGE_PREP:
        if (this.stateTimer <= 0) {
          this.state = STATES.CHARGING
          this.stateTimer = 300 // 冲锋持续时间

          // 恢复形状
          this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            duration: 100
          })

          // 开始冲锋
          this.body.setVelocity(
            Math.cos(this.chargeAngle) * this.typeConfig.chargeSpeed,
            Math.sin(this.chargeAngle) * this.typeConfig.chargeSpeed
          )
        }
        break

      case STATES.CHARGING:
        if (this.stateTimer <= 0) {
          this.state = STATES.CHASE
          this.actionCooldown = this.typeConfig.chargeCooldown
        }
        break
    }
  }

  // 远程攻击行为
  updateRanged() {
    const dist = Phaser.Math.Distance.Between(
      this.x, this.y, this.target.x, this.target.y
    )

    // 保持距离
    if (dist < this.typeConfig.attackRange * 0.6) {
      // 后退
      const angle = Phaser.Math.Angle.Between(
        this.target.x, this.target.y, this.x, this.y
      )
      this.body.setVelocity(
        Math.cos(angle) * this.speed,
        Math.sin(angle) * this.speed
      )
    } else if (dist > this.typeConfig.attackRange) {
      // 靠近
      this.updateChase()
    } else {
      // 停止并攻击
      this.body.setVelocity(0, 0)

      if (this.actionCooldown <= 0) {
        this.fireProjectile()
        this.actionCooldown = this.typeConfig.attackCooldown
      }
    }

    // 始终朝向玩家
    this.rotation = Phaser.Math.Angle.Between(
      this.x, this.y, this.target.x, this.target.y
    )
  }

  // 发射投射物
  fireProjectile() {
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y, this.target.x, this.target.y
    )

    // 创建投射物
    const projectile = this.scene.add.graphics()
    projectile.fillStyle(this.color, 1)
    projectile.fillCircle(0, 0, 8)
    projectile.setPosition(this.x, this.y)

    // 添加物理
    this.scene.physics.add.existing(projectile)
    projectile.body.setVelocity(
      Math.cos(angle) * this.typeConfig.projectileSpeed,
      Math.sin(angle) * this.typeConfig.projectileSpeed
    )
    projectile.body.setCircle(8)

    // 碰撞检测 - 模拟敌人碰撞，复用 GameScene.onEnemyHitPlayer 的逻辑
    const overlap = this.scene.physics.add.overlap(
      projectile,
      this.scene.player,
      () => {
        // 销毁投射物
        projectile.destroy()
        overlap.destroy()

        // 通过 GameScene 处理伤害（复用减伤、护盾等逻辑）
        if (this.scene.onEnemyHitPlayer) {
          // 创建临时对象传递伤害信息
          const fakeEnemy = { atk: this.atk, isActive: true }
          this.scene.onEnemyHitPlayer(this.scene.player, fakeEnemy)
        }
      }
    )

    // 超时销毁
    this.scene.time.delayedCall(3000, () => {
      if (projectile && projectile.active) {
        projectile.destroy()
        overlap.destroy()
      }
    })
  }

  // 精英行为
  updateElite(delta) {
    // 精英有多种攻击模式
    const dist = Phaser.Math.Distance.Between(
      this.x, this.y, this.target.x, this.target.y
    )

    // 简化版：结合追踪和偶尔的冲锋
    if (this.actionCooldown <= 0 && dist <= 200) {
      // 冲锋攻击
      const angle = Phaser.Math.Angle.Between(
        this.x, this.y, this.target.x, this.target.y
      )
      this.body.setVelocity(
        Math.cos(angle) * this.speed * 3,
        Math.sin(angle) * this.speed * 3
      )
      this.actionCooldown = 2000

      this.scene.time.delayedCall(300, () => {
        if (this.isActive) {
          this.body.setVelocity(0, 0)
        }
      })
    } else {
      this.updateChase()
    }
  }

  // Boss 行为
  updateBoss(delta) {
    this.updateChase()
  }

  takeDamage(amount) {
    this.hp -= amount

    // 受伤闪烁
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 50,
      yoyo: true,
      repeat: 1
    })

    if (this.hp <= 0) {
      this.die()
      return true
    }
    return false
  }

  die() {
    this.isActive = false
    this.body.setVelocity(0, 0)

    // 分裂型死亡时生成小怪
    if (this.behavior === 'split' && this.typeConfig.splitCount > 0) {
      this.spawnSplits()
    }

    // 死亡效果
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.setActive(false)
        this.setVisible(false)
      }
    })
  }

  // 分裂生成
  spawnSplits() {
    for (let i = 0; i < this.typeConfig.splitCount; i++) {
      const angle = (Math.PI * 2 / this.typeConfig.splitCount) * i
      const offsetX = Math.cos(angle) * this.size * 2
      const offsetY = Math.sin(angle) * this.size * 2

      // 创建小分裂体
      const splitConfig = {
        ...this.typeConfig,
        hp: this.typeConfig.splitHp,
        size: this.typeConfig.size * 0.6,
        splitCount: 0, // 不再继续分裂
        score: 5
      }

      // 通知生成器创建分裂体
      if (this.scene.enemySpawner) {
        this.scene.enemySpawner.spawnEnemy(
          this.x + offsetX,
          this.y + offsetY,
          splitConfig
        )
      }
    }
  }

  reset(x, y, typeConfig = null) {
    if (typeConfig) {
      this.typeConfig = typeConfig
      this.hp = typeConfig.hp
      this.maxHp = typeConfig.hp
      this.atk = typeConfig.atk
      this.speed = typeConfig.speed
      this.size = typeConfig.size
      this.color = typeConfig.color
      this.behavior = typeConfig.behavior
      this.score = typeConfig.score || 10

      // 更新物理体大小
      this.body.setCircle(this.size)
      this.body.setOffset(-this.size, -this.size)

      // 重绘外观
      this.updateTexture()
    } else {
      this.hp = this.maxHp
    }

    this.x = x
    this.y = y
    this.isActive = true
    this.alpha = 1
    this.scaleX = 1
    this.scaleY = 1
    this.state = STATES.CHASE
    this.stateTimer = 0
    this.actionCooldown = 0
    this.setActive(true)
    this.setVisible(true)
    this.body.setVelocity(0, 0)
  }
}
