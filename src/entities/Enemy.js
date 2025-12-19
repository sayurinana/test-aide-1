/**
 * 敌人类
 */

import Phaser from 'phaser'
import { ENEMY, COLORS } from '../config.js'

export class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)

    this.scene = scene
    this.hp = ENEMY.HP
    this.maxHp = ENEMY.HP
    this.atk = ENEMY.ATK
    this.speed = ENEMY.SPEED
    this.target = null
    this.isActive = true

    // 创建敌人图形
    this.createGraphics()

    // 添加到场景
    scene.add.existing(this)

    // 启用物理
    scene.physics.add.existing(this)
    this.body.setCircle(ENEMY.SIZE)
    this.body.setOffset(-ENEMY.SIZE, -ENEMY.SIZE)
  }

  createGraphics() {
    this.graphics = this.scene.add.graphics()
    this.add(this.graphics)
    this.drawEnemy()
  }

  drawEnemy() {
    this.graphics.clear()

    // 敌人主体 - 红色多边形
    this.graphics.fillStyle(COLORS.ENEMY, 1)

    // 绘制六边形敌人
    const size = ENEMY.SIZE
    const points = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      points.push({
        x: Math.cos(angle) * size,
        y: Math.sin(angle) * size
      })
    }

    this.graphics.beginPath()
    this.graphics.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      this.graphics.lineTo(points[i].x, points[i].y)
    }
    this.graphics.closePath()
    this.graphics.fillPath()

    // 核心
    this.graphics.fillStyle(0x330000, 1)
    this.graphics.fillCircle(0, 0, size * 0.3)
  }

  setTarget(target) {
    this.target = target
  }

  update(time, delta) {
    if (!this.isActive || !this.target) return

    // 追踪玩家
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      this.target.x, this.target.y
    )

    // 设置速度朝向目标
    this.body.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    )

    // 旋转朝向目标
    this.rotation = angle
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

  reset(x, y) {
    this.x = x
    this.y = y
    this.hp = ENEMY.HP
    this.isActive = true
    this.alpha = 1
    this.scaleX = 1
    this.scaleY = 1
    this.setActive(true)
    this.setVisible(true)
    this.body.setVelocity(0, 0)
  }
}
