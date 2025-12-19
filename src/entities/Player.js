/**
 * 玩家角色类
 */

import Phaser from 'phaser'
import { PLAYER, WORLD, COLORS, COMBAT } from '../config.js'

export class Player extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)

    this.scene = scene
    this.hp = PLAYER.HP
    this.maxHp = PLAYER.HP
    this.atk = PLAYER.ATK
    this.speed = PLAYER.SPEED
    this.attackCooldown = 0
    this.isAttacking = false

    // 无敌帧
    this.isInvincible = false
    this.invincibleTimer = 0

    // 暴击属性
    this.critChance = COMBAT.CRIT_CHANCE
    this.critMultiplier = COMBAT.CRIT_MULTIPLIER

    // 创建角色图形
    this.createGraphics()

    // 添加到场景
    scene.add.existing(this)

    // 启用物理
    scene.physics.add.existing(this)
    this.body.setCollideWorldBounds(true)
    this.body.setCircle(PLAYER.SIZE)
    this.body.setOffset(-PLAYER.SIZE, -PLAYER.SIZE)

    // 输入控制
    this.cursors = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    })
  }

  createGraphics() {
    // 创建主体 - 简约几何风格的剑客
    this.graphics = this.scene.add.graphics()
    this.add(this.graphics)

    // 绘制角色
    this.drawCharacter()
  }

  drawCharacter() {
    this.graphics.clear()

    // 身体 - 淡蓝色圆形
    this.graphics.fillStyle(COLORS.PLAYER, 1)
    this.graphics.fillCircle(0, 0, PLAYER.SIZE)

    // 方向指示器 - 三角形
    this.graphics.fillStyle(0xffffff, 0.8)
    this.graphics.fillTriangle(
      PLAYER.SIZE * 0.5, 0,
      -PLAYER.SIZE * 0.3, -PLAYER.SIZE * 0.4,
      -PLAYER.SIZE * 0.3, PLAYER.SIZE * 0.4
    )

    // 核心光点
    this.graphics.fillStyle(0xffffff, 1)
    this.graphics.fillCircle(0, 0, PLAYER.SIZE * 0.2)
  }

  update(time, delta) {
    // 处理移动
    this.handleMovement()

    // 处理朝向
    this.handleRotation()

    // 更新攻击冷却
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta
    }

    // 更新无敌帧
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= delta
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false
        this.alpha = 1
      }
    }
  }

  handleMovement() {
    let vx = 0
    let vy = 0

    if (this.cursors.left.isDown) vx -= 1
    if (this.cursors.right.isDown) vx += 1
    if (this.cursors.up.isDown) vy -= 1
    if (this.cursors.down.isDown) vy += 1

    // 归一化对角线移动
    if (vx !== 0 && vy !== 0) {
      const factor = Math.SQRT1_2
      vx *= factor
      vy *= factor
    }

    this.body.setVelocity(vx * this.speed, vy * this.speed)
  }

  handleRotation() {
    // 朝向鼠标位置
    const pointer = this.scene.input.activePointer
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)
    const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y)
    this.rotation = angle
  }

  canAttack() {
    return this.attackCooldown <= 0 && !this.isAttacking
  }

  attack() {
    if (!this.canAttack()) return false

    this.isAttacking = true
    this.attackCooldown = PLAYER.ATTACK_COOLDOWN

    // 攻击动画结束后重置状态
    this.scene.time.delayedCall(200, () => {
      this.isAttacking = false
    })

    return true
  }

  takeDamage(amount) {
    // 无敌帧期间不受伤害
    if (this.isInvincible) return false

    this.hp -= amount
    if (this.hp < 0) this.hp = 0

    // 触发无敌帧
    this.isInvincible = true
    this.invincibleTimer = COMBAT.INVINCIBLE_DURATION

    // 受伤闪烁效果
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 2
    })

    return this.hp <= 0
  }

  getAttackPosition() {
    // 获取攻击位置（角色前方）
    const distance = PLAYER.SIZE + PLAYER.ATTACK_RANGE * 0.5
    return {
      x: this.x + Math.cos(this.rotation) * distance,
      y: this.y + Math.sin(this.rotation) * distance
    }
  }
}
