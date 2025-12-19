/**
 * 敌人生成器 - 支持多种敌人类型
 */

import Phaser from 'phaser'
import { ENEMY, ENEMY_TYPES, WORLD } from '../config.js'
import { Enemy } from '../entities/Enemy.js'

export class EnemySpawner {
  constructor(scene, player) {
    this.scene = scene
    this.player = player
    this.enemies = scene.add.group({
      classType: Enemy,
      runChildUpdate: true,
      maxSize: ENEMY.MAX_COUNT  // 设置最大容量提升性能
    })

    this.spawnTimer = 0
    this.spawnInterval = ENEMY.SPAWN_INTERVAL
    this.maxEnemies = ENEMY.MAX_COUNT

    // 敌人类型权重（可由波次管理器修改）
    this.typeWeights = {
      shadow: 60,   // 飘影 60%
      wolf: 20,     // 妖狼 20%
      snake: 15,    // 蛇妖 15%
      wraith: 5     // 怨魂 5%
    }

    // 难度系数（可由波次管理器修改）
    this.difficultyMultiplier = 1.0

    // 缓存活跃敌人列表
    this._activeEnemiesCache = []
    this._cacheValid = false
  }

  update(time, delta) {
    // 每帧开始时使缓存失效，确保数据一致性
    this._cacheValid = false

    this.spawnTimer += delta

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0
      this.trySpawn()
    }
  }

  /**
   * 尝试生成敌人
   */
  trySpawn() {
    const activeEnemies = this.enemies.getChildren().filter(e => e.isActive)
    if (activeEnemies.length >= this.maxEnemies) return

    // 随机选择敌人类型
    const typeConfig = this.getRandomEnemyType()
    const pos = this.getSpawnPosition(typeConfig.size)

    this.spawnEnemy(pos.x, pos.y, typeConfig)
  }

  /**
   * 生成指定类型的敌人
   */
  spawnEnemy(x, y, typeConfig) {
    // 应用难度系数
    const scaledConfig = this.applyDifficulty(typeConfig)

    // 尝试从对象池获取
    let enemy = this.enemies.getFirstDead(false)

    if (enemy) {
      // 复用已有敌人
      enemy.reset(x, y, scaledConfig)
      enemy.setTarget(this.player)
    } else {
      // 创建新敌人
      enemy = new Enemy(this.scene, x, y, scaledConfig)
      enemy.setTarget(this.player)
      this.enemies.add(enemy)
    }

    // 敌人生成后使缓存失效
    this._cacheValid = false

    return enemy
  }

  /**
   * 应用难度系数
   */
  applyDifficulty(typeConfig) {
    if (this.difficultyMultiplier === 1.0) return typeConfig

    return {
      ...typeConfig,
      hp: Math.floor(typeConfig.hp * this.difficultyMultiplier),
      atk: Math.floor(typeConfig.atk * this.difficultyMultiplier),
      speed: Math.floor(typeConfig.speed * (1 + (this.difficultyMultiplier - 1) * 0.3))
    }
  }

  /**
   * 根据权重随机选择敌人类型
   */
  getRandomEnemyType() {
    const totalWeight = Object.values(this.typeWeights).reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight

    for (const [typeId, weight] of Object.entries(this.typeWeights)) {
      random -= weight
      if (random <= 0) {
        return this.getTypeConfig(typeId)
      }
    }

    return ENEMY_TYPES.SHADOW
  }

  /**
   * 获取敌人类型配置
   */
  getTypeConfig(typeId) {
    switch (typeId) {
      case 'shadow': return ENEMY_TYPES.SHADOW
      case 'wolf': return ENEMY_TYPES.WOLF
      case 'snake': return ENEMY_TYPES.SNAKE
      case 'wraith': return ENEMY_TYPES.WRAITH
      case 'elite': return ENEMY_TYPES.ELITE
      case 'boss': return ENEMY_TYPES.BOSS
      default: return ENEMY_TYPES.SHADOW
    }
  }

  /**
   * 生成精英敌人
   */
  spawnElite() {
    const pos = this.getSpawnPosition(ENEMY_TYPES.ELITE.size)
    return this.spawnEnemy(pos.x, pos.y, ENEMY_TYPES.ELITE)
  }

  /**
   * 生成 Boss
   */
  spawnBoss() {
    const pos = this.getSpawnPosition(ENEMY_TYPES.BOSS.size)
    return this.spawnEnemy(pos.x, pos.y, ENEMY_TYPES.BOSS)
  }

  /**
   * 生成指定类型的敌人（由 WaveManager 调用）
   * @param {string} typeKey - 敌人类型键（如 'SHADOW', 'BOSS'）
   * @param {object} customConfig - 可选的自定义配置（覆盖默认值）
   */
  spawnSpecificEnemy(typeKey, customConfig = null) {
    const baseConfig = ENEMY_TYPES[typeKey] || ENEMY_TYPES.SHADOW
    const config = customConfig || baseConfig
    const pos = this.getSpawnPosition(config.size)
    return this.spawnEnemy(pos.x, pos.y, config)
  }

  /**
   * 批量生成敌人
   */
  spawnWave(count, typeId = null) {
    const spawned = []
    for (let i = 0; i < count; i++) {
      const typeConfig = typeId ? this.getTypeConfig(typeId) : this.getRandomEnemyType()
      const pos = this.getSpawnPosition(typeConfig.size)
      const enemy = this.spawnEnemy(pos.x, pos.y, typeConfig)
      if (enemy) spawned.push(enemy)
    }
    return spawned
  }

  /**
   * 设置敌人类型权重
   */
  setTypeWeights(weights) {
    this.typeWeights = { ...this.typeWeights, ...weights }
  }

  /**
   * 设置难度系数
   */
  setDifficulty(multiplier) {
    this.difficultyMultiplier = multiplier
  }

  /**
   * 设置生成间隔
   */
  setSpawnInterval(interval) {
    this.spawnInterval = interval
  }

  /**
   * 设置最大敌人数
   */
  setMaxEnemies(max) {
    this.maxEnemies = max
  }

  getSpawnPosition(size = ENEMY.SIZE) {
    // 在玩家周围生成，但不在视野内
    const minDistance = 400
    const maxDistance = 600

    const angle = Math.random() * Math.PI * 2
    const distance = minDistance + Math.random() * (maxDistance - minDistance)

    let x = this.player.x + Math.cos(angle) * distance
    let y = this.player.y + Math.sin(angle) * distance

    // 限制在世界边界内
    x = Phaser.Math.Clamp(x, size, WORLD.WIDTH - size)
    y = Phaser.Math.Clamp(y, size, WORLD.HEIGHT - size)

    return { x, y }
  }

  getActiveEnemies() {
    // 使用缓存减少每帧的过滤开销
    if (!this._cacheValid) {
      this._activeEnemiesCache = this.enemies.getChildren().filter(e => e.isActive)
      this._cacheValid = true
    }
    return this._activeEnemiesCache
  }

  // 使缓存失效（在敌人状态变化时调用）
  invalidateCache() {
    this._cacheValid = false
  }

  getGroup() {
    return this.enemies
  }

  /**
   * 清除所有敌人
   */
  clearAll() {
    this.enemies.getChildren().forEach(enemy => {
      enemy.isActive = false
      enemy.setActive(false)
      enemy.setVisible(false)
    })
    this._cacheValid = false
  }
}
