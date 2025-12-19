/**
 * 敌人生成器
 */

import { ENEMY, WORLD } from '../config.js'
import { Enemy } from '../entities/Enemy.js'

export class EnemySpawner {
  constructor(scene, player) {
    this.scene = scene
    this.player = player
    this.enemies = scene.add.group({
      classType: Enemy,
      runChildUpdate: true
    })

    this.spawnTimer = 0
    this.spawnInterval = ENEMY.SPAWN_INTERVAL
    this.maxEnemies = ENEMY.MAX_COUNT
  }

  update(time, delta) {
    this.spawnTimer += delta

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0
      this.trySpawn()
    }
  }

  trySpawn() {
    // 检查敌人数量
    const activeEnemies = this.enemies.getChildren().filter(e => e.isActive)
    if (activeEnemies.length >= this.maxEnemies) return

    // 尝试从对象池获取
    let enemy = this.enemies.getFirstDead(false)

    if (enemy) {
      // 复用已有敌人
      const pos = this.getSpawnPosition()
      enemy.reset(pos.x, pos.y)
      enemy.setTarget(this.player)
    } else {
      // 创建新敌人
      const pos = this.getSpawnPosition()
      enemy = new Enemy(this.scene, pos.x, pos.y)
      enemy.setTarget(this.player)
      this.enemies.add(enemy)
    }
  }

  getSpawnPosition() {
    // 在玩家周围生成，但不在视野内
    const minDistance = 400
    const maxDistance = 600

    const angle = Math.random() * Math.PI * 2
    const distance = minDistance + Math.random() * (maxDistance - minDistance)

    let x = this.player.x + Math.cos(angle) * distance
    let y = this.player.y + Math.sin(angle) * distance

    // 限制在世界边界内
    x = Phaser.Math.Clamp(x, ENEMY.SIZE, WORLD.WIDTH - ENEMY.SIZE)
    y = Phaser.Math.Clamp(y, ENEMY.SIZE, WORLD.HEIGHT - ENEMY.SIZE)

    return { x, y }
  }

  getActiveEnemies() {
    return this.enemies.getChildren().filter(e => e.isActive)
  }

  getGroup() {
    return this.enemies
  }
}
