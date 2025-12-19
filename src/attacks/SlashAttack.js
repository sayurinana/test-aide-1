/**
 * 挥砍普攻
 * 近距离扇形斩击，命中范围内所有敌人
 */

import Phaser from 'phaser'
import { AttackBase } from './AttackBase.js'
import { ATTACK_TYPES, PLAYER } from '../config.js'
import { AttackEffect } from '../entities/AttackEffect.js'

export class SlashAttack extends AttackBase {
  constructor(scene) {
    super(scene, ATTACK_TYPES.SLASH)

    // 挥砍特有属性
    this.arcAngle = ATTACK_TYPES.SLASH.arcAngle
    this.attackEffects = scene.add.group()
  }

  /**
   * 执行攻击 - 扇形挥砍
   */
  execute(player, context) {
    const { audioManager, vfxManager, enemies, damageSystem, comboSystem, roguelikeSystem, waveManager, onEnemyKilled } = context

    // 获取攻击位置（角色前方）
    const distance = PLAYER.SIZE + this.getComputedRange() * 0.5
    const attackPos = {
      x: player.x + Math.cos(player.rotation) * distance,
      y: player.y + Math.sin(player.rotation) * distance
    }

    // 创建攻击效果
    const effect = new AttackEffect(
      this.scene,
      attackPos.x,
      attackPos.y,
      player.rotation
    )
    this.attackEffects.add(effect)

    // 播放音效
    if (audioManager) {
      audioManager.playSfx('attack')
    }

    // 剑光拖尾效果
    if (vfxManager) {
      vfxManager.createSlashTrail(
        attackPos.x,
        attackPos.y,
        player.rotation,
        this.getComputedRange(),
        this.color
      )
    }

    // 检测攻击范围内的敌人
    this.checkHits(player, attackPos, context)
  }

  /**
   * 检测命中
   */
  checkHits(player, attackPos, context) {
    const { enemies, damageSystem, comboSystem, roguelikeSystem, waveManager, vfxManager, audioManager, onEnemyKilled } = context

    if (!enemies) return

    const attackRange = this.getComputedRange()
    const attackAngle = player.rotation

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
          player.x, player.y,
          enemy.x, enemy.y
        )
        const angleDiff = Phaser.Math.Angle.Wrap(angleToEnemy - attackAngle)

        if (Math.abs(angleDiff) <= this.arcAngle / 2) {
          // 命中敌人
          this.onHitEnemy(enemy, player, context)
        }
      }
    })
  }

  /**
   * 处理命中敌人
   */
  onHitEnemy(enemy, player, context) {
    const { damageSystem, comboSystem, roguelikeSystem, waveManager, vfxManager, audioManager, onEnemyKilled } = context

    // 记录连击
    if (comboSystem) {
      comboSystem.addHit()
    }

    // 计算伤害（含暴击和连击加成）
    const comboMultiplier = comboSystem ? comboSystem.getMultiplier() : 1

    // 获取玩家暴击属性（如果有）
    const critChance = player.critChance || 0.08
    const critMultiplier = player.critMultiplier || 1.8

    const { damage, isCrit } = damageSystem.calculateDamage(
      this.getComputedDamage(),
      comboMultiplier,
      { critChance, critMultiplier }
    )

    // 应用伤害加成
    let finalDamage = damage
    if (roguelikeSystem) {
      finalDamage = Math.floor(damage * roguelikeSystem.getDamageMultiplier(enemy))
    }

    // 应用伤害
    const killed = damageSystem.applyDamage(enemy, finalDamage, isCrit)

    // 视觉效果
    if (vfxManager) {
      vfxManager.showDamageNumber(enemy.x, enemy.y, finalDamage, isCrit)
      vfxManager.flashWhite(enemy, 30)
    }

    // 音效
    if (audioManager) {
      audioManager.playSfx('hit')
    }

    if (isCrit && vfxManager) {
      vfxManager.screenShake(0.003, 50)
      vfxManager.hitStop(30)
    }

    // 应用击退
    damageSystem.applyKnockback(enemy, player.x, player.y)

    // 触发吸血
    if (roguelikeSystem) {
      roguelikeSystem.onDamageDealt(finalDamage)
    }

    // 记录伤害
    if (waveManager) {
      waveManager.recordDamage(finalDamage)
    }

    // 处理击杀
    if (killed && onEnemyKilled) {
      if (vfxManager) {
        vfxManager.createDeathParticles(enemy.x, enemy.y, enemy.color, 10)
        vfxManager.screenShake(0.002, 30)
      }
      if (audioManager) {
        audioManager.playSfx('kill')
      }
      onEnemyKilled(enemy)
    }

    return killed
  }

  /**
   * 应用强化效果（挥砍特有）
   */
  applyBuff(type, value) {
    super.applyBuff(type, value)

    switch (type) {
      case 'arc':
        this.arcAngle += value  // 增加挥砍角度
        this.arcAngle = Math.min(this.arcAngle, Math.PI * 1.5) // 最大 270 度
        break
    }
  }

  /**
   * 重置
   */
  reset() {
    super.reset()
    this.arcAngle = ATTACK_TYPES.SLASH.arcAngle
    this.attackEffects.clear(true, true)
  }

  /**
   * 销毁
   */
  destroy() {
    this.attackEffects.clear(true, true)
  }
}
