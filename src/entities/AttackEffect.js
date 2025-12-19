/**
 * 攻击效果类
 */

import Phaser from 'phaser'
import { PLAYER, COLORS } from '../config.js'

export class AttackEffect extends Phaser.GameObjects.Container {
  constructor(scene, x, y, angle) {
    super(scene, x, y)

    this.scene = scene

    // 创建攻击效果图形
    this.graphics = scene.add.graphics()
    this.add(this.graphics)

    // 绘制挥剑弧线
    this.drawSlash(angle)

    // 添加到场景
    scene.add.existing(this)

    // 启用物理碰撞
    scene.physics.add.existing(this)
    this.body.setCircle(PLAYER.ATTACK_RANGE)
    this.body.setOffset(-PLAYER.ATTACK_RANGE, -PLAYER.ATTACK_RANGE)

    // 自动销毁
    scene.time.delayedCall(150, () => {
      this.destroy()
    })
  }

  drawSlash(angle) {
    const range = PLAYER.ATTACK_RANGE

    // 挥剑弧线效果
    this.graphics.lineStyle(4, 0xffffff, 0.9)

    // 绘制扇形攻击范围
    const arcAngle = Math.PI / 2 // 90度扇形
    const startAngle = angle - arcAngle / 2
    const endAngle = angle + arcAngle / 2

    this.graphics.beginPath()
    this.graphics.arc(0, 0, range, startAngle, endAngle, false)
    this.graphics.strokePath()

    // 内部弧线
    this.graphics.lineStyle(2, 0x64c8ff, 0.7)
    this.graphics.beginPath()
    this.graphics.arc(0, 0, range * 0.6, startAngle, endAngle, false)
    this.graphics.strokePath()

    // 淡出动画
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 150,
      ease: 'Power2'
    })
  }
}
