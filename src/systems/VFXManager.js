/**
 * 视觉效果管理器
 * 统一管理游戏中的粒子特效、屏幕震动、Hit Stop 等
 */

import Phaser from 'phaser'
import { COLORS } from '../config.js'

export class VFXManager {
  constructor(scene) {
    this.scene = scene
    this.particles = []
    this.isHitStopping = false
  }

  // 屏幕震动
  screenShake(intensity = 0.005, duration = 100) {
    this.scene.cameras.main.shake(duration, intensity)
  }

  // Hit Stop - 击中暂停效果
  hitStop(duration = 50) {
    if (this.isHitStopping) return

    this.isHitStopping = true

    // 暂停物理和时间
    this.scene.physics.pause()

    this.scene.time.delayedCall(duration, () => {
      this.scene.physics.resume()
      this.isHitStopping = false
    })
  }

  // 伤害数字
  showDamageNumber(x, y, damage, isCrit = false) {
    const color = isCrit ? COLORS.DAMAGE_CRIT : COLORS.DAMAGE_NORMAL
    const fontSize = isCrit ? '28px' : '20px'
    const prefix = isCrit ? '!' : ''

    const text = this.scene.add.text(x, y - 20, `${prefix}${damage}`, {
      fontSize: fontSize,
      fontFamily: 'Arial',
      fill: color,
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5)

    // 上浮并淡出
    this.scene.tweens.add({
      targets: text,
      y: y - 60,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => text.destroy()
    })
  }

  // 受击闪白效果
  flashWhite(target, duration = 50) {
    if (!target || !target.graphics) return

    const originalColor = target.color || 0xffffff
    target.graphics.clear()
    target.graphics.fillStyle(0xffffff, 1)
    target.graphics.fillCircle(0, 0, target.size || 20)

    this.scene.time.delayedCall(duration, () => {
      if (target && target.active !== false && target.drawEnemy) {
        target.drawEnemy()
      } else if (target && target.active !== false && target.drawCharacter) {
        target.drawCharacter()
      }
    })
  }

  // 死亡粒子效果
  createDeathParticles(x, y, color = 0xff6464, count = 8) {
    for (let i = 0; i < count; i++) {
      const particle = this.scene.add.graphics()
      particle.fillStyle(color, 1)
      particle.fillCircle(0, 0, Phaser.Math.Between(3, 6))
      particle.setPosition(x, y)

      const angle = (Math.PI * 2 / count) * i + Phaser.Math.FloatBetween(-0.3, 0.3)
      const speed = Phaser.Math.Between(100, 200)
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      this.scene.tweens.add({
        targets: particle,
        x: x + vx * 0.5,
        y: y + vy * 0.5,
        alpha: 0,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: Phaser.Math.Between(300, 500),
        ease: 'Power2',
        onComplete: () => particle.destroy()
      })
    }
  }

  // 剑光拖尾效果
  createSlashTrail(x, y, angle, range, color = 0xffffff) {
    const trail = this.scene.add.graphics()

    // 主弧线
    trail.lineStyle(6, color, 0.9)
    const arcAngle = Math.PI / 2
    const startAngle = angle - arcAngle / 2
    const endAngle = angle + arcAngle / 2

    trail.beginPath()
    trail.arc(0, 0, range, startAngle, endAngle, false)
    trail.strokePath()

    // 内弧光
    trail.lineStyle(3, 0xffffff, 0.7)
    trail.beginPath()
    trail.arc(0, 0, range * 0.7, startAngle, endAngle, false)
    trail.strokePath()

    // 外弧光
    trail.lineStyle(2, color, 0.5)
    trail.beginPath()
    trail.arc(0, 0, range * 1.1, startAngle, endAngle, false)
    trail.strokePath()

    trail.setPosition(x, y)

    // 淡出
    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      ease: 'Power2',
      onComplete: () => trail.destroy()
    })
  }

  // 技能特效 - 剑气横扫
  createSwordWaveEffect(x, y, angle, range, color = 0x00ffff) {
    // 扇形波动
    const wave = this.scene.add.graphics()
    wave.fillStyle(color, 0.3)
    wave.lineStyle(3, color, 0.8)

    const arcAngle = Math.PI // 180度
    wave.beginPath()
    wave.moveTo(0, 0)
    wave.arc(0, 0, range, angle - arcAngle / 2, angle + arcAngle / 2, false)
    wave.closePath()
    wave.fillPath()
    wave.strokePath()

    wave.setPosition(x, y)

    this.scene.tweens.add({
      targets: wave,
      alpha: 0,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 300,
      ease: 'Power2',
      onComplete: () => wave.destroy()
    })

    // 粒子
    for (let i = 0; i < 12; i++) {
      const particleAngle = angle - arcAngle / 2 + (arcAngle / 12) * i
      const particle = this.scene.add.graphics()
      particle.fillStyle(color, 1)
      particle.fillCircle(0, 0, 4)
      particle.setPosition(x, y)

      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(particleAngle) * range * 1.2,
        y: y + Math.sin(particleAngle) * range * 1.2,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      })
    }
  }

  // 技能特效 - 瞬步斩
  createDashSlashEffect(startX, startY, endX, endY, width, color = 0xff00ff) {
    // 残影
    const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY)
    const dist = Phaser.Math.Distance.Between(startX, startY, endX, endY)

    // 轨迹线
    const trail = this.scene.add.graphics()
    trail.fillStyle(color, 0.5)

    // 矩形轨迹
    const perpAngle = angle + Math.PI / 2
    const hw = width / 2
    trail.beginPath()
    trail.moveTo(startX + Math.cos(perpAngle) * hw, startY + Math.sin(perpAngle) * hw)
    trail.lineTo(endX + Math.cos(perpAngle) * hw, endY + Math.sin(perpAngle) * hw)
    trail.lineTo(endX - Math.cos(perpAngle) * hw, endY - Math.sin(perpAngle) * hw)
    trail.lineTo(startX - Math.cos(perpAngle) * hw, startY - Math.sin(perpAngle) * hw)
    trail.closePath()
    trail.fillPath()

    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => trail.destroy()
    })
  }

  // 技能特效 - 护盾
  createShieldEffect(x, y, radius, color = 0x00ff00) {
    const shield = this.scene.add.graphics()
    shield.lineStyle(4, color, 0.8)
    shield.strokeCircle(0, 0, radius)
    shield.fillStyle(color, 0.2)
    shield.fillCircle(0, 0, radius)
    shield.setPosition(x, y)

    // 脉动效果
    this.scene.tweens.add({
      targets: shield,
      scaleX: 1.1,
      scaleY: 1.1,
      alpha: 0.6,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    return shield
  }

  // 技能特效 - 剑域
  createSwordDomainEffect(x, y, radius, color = 0xffff00) {
    const domain = this.scene.add.graphics()

    // 外圈
    domain.lineStyle(3, color, 0.8)
    domain.strokeCircle(0, 0, radius)

    // 内部剑气线条
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i
      domain.lineStyle(2, color, 0.5)
      domain.lineBetween(
        Math.cos(angle) * radius * 0.3,
        Math.sin(angle) * radius * 0.3,
        Math.cos(angle) * radius * 0.9,
        Math.sin(angle) * radius * 0.9
      )
    }

    domain.fillStyle(color, 0.1)
    domain.fillCircle(0, 0, radius)
    domain.setPosition(x, y)

    // 旋转动画
    this.scene.tweens.add({
      targets: domain,
      rotation: Math.PI * 2,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    })

    return domain
  }

  // 波次开始特效
  createWaveStartEffect() {
    const centerX = this.scene.cameras.main.scrollX + this.scene.cameras.main.width / 2
    const centerY = this.scene.cameras.main.scrollY + this.scene.cameras.main.height / 2

    // 冲击波
    const wave = this.scene.add.graphics()
    wave.lineStyle(4, 0xffff00, 0.8)
    wave.strokeCircle(0, 0, 10)
    wave.setPosition(centerX, centerY)

    this.scene.tweens.add({
      targets: wave,
      scaleX: 50,
      scaleY: 50,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => wave.destroy()
    })
  }

  // 获得强化特效
  createBuffAcquiredEffect(x, y, color = 0xffff00) {
    // 光柱
    const beam = this.scene.add.graphics()
    beam.fillStyle(color, 0.5)
    beam.fillRect(-20, -500, 40, 500)
    beam.setPosition(x, y)

    this.scene.tweens.add({
      targets: beam,
      alpha: 0,
      scaleX: 2,
      duration: 500,
      ease: 'Power2',
      onComplete: () => beam.destroy()
    })

    // 星星粒子
    for (let i = 0; i < 8; i++) {
      const star = this.scene.add.text(x, y, '✦', {
        fontSize: '20px',
        fill: '#ffff00'
      }).setOrigin(0.5)

      const angle = (Math.PI * 2 / 8) * i
      this.scene.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * 80,
        y: y + Math.sin(angle) * 80,
        alpha: 0,
        duration: 600,
        ease: 'Power2',
        onComplete: () => star.destroy()
      })
    }
  }

  // 玩家移动拖尾
  createPlayerTrail(player) {
    if (!player || !player.active) return

    const trail = this.scene.add.graphics()
    trail.fillStyle(COLORS.PLAYER, 0.3)
    trail.fillCircle(0, 0, player.body.width / 2 * 0.8)
    trail.setPosition(player.x, player.y)

    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 200,
      ease: 'Power2',
      onComplete: () => trail.destroy()
    })
  }

  // 清理所有特效
  cleanup() {
    this.particles.forEach(p => {
      if (p && p.destroy) p.destroy()
    })
    this.particles = []
  }
}
