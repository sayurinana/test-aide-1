/**
 * 波次管理系统
 * 管理无尽模式的波次递进、敌人配置和难度曲线
 */

import { ENEMY_TYPES } from '../config.js'

export class WaveManager {
  constructor(scene) {
    this.scene = scene

    // 当前状态
    this.currentWave = 0
    this.waveState = 'idle'  // idle, preparing, fighting, clearing, reward
    this.enemiesRemaining = 0
    this.enemiesSpawned = 0
    this.totalEnemiesInWave = 0

    // 波次配置
    this.prepareTime = 3000  // 准备时间 3 秒
    this.spawnTimer = 0
    this.spawnInterval = 1000  // 初始生成间隔

    // 统计
    this.stats = {
      totalKills: 0,
      totalDamage: 0,
      highestCombo: 0,
      startTime: 0,
      bossKills: 0
    }
  }

  // 开始新一波
  startNextWave() {
    this.currentWave++
    this.waveState = 'preparing'

    // 计算这波的敌人配置
    this.calculateWaveConfig()

    // 显示波次预告
    this.showWaveAnnouncement()

    // 准备倒计时后开始战斗
    this.scene.time.delayedCall(this.prepareTime, () => {
      this.beginFighting()
    })
  }

  calculateWaveConfig() {
    const wave = this.currentWave

    // 基础敌人数量: 10 + wave * 3 + floor(wave/10) * 5
    this.totalEnemiesInWave = 10 + wave * 3 + Math.floor(wave / 10) * 5

    // 生成间隔: 逐渐加快，但有下限
    this.spawnInterval = Math.max(200, 1000 - wave * 30)

    // 敌人配置
    this.waveEnemyTypes = this.getEnemyTypesForWave(wave)

    this.enemiesRemaining = this.totalEnemiesInWave
    this.enemiesSpawned = 0
  }

  getEnemyTypesForWave(wave) {
    const types = []

    // 基础敌人 - 飘影（始终出现）
    types.push({ type: 'SHADOW', weight: 50 })

    // 波次 3+ 解锁妖狼
    if (wave >= 3) {
      types.push({ type: 'WOLF', weight: 20 })
    }

    // 波次 5+ 解锁蛇妖
    if (wave >= 5) {
      types.push({ type: 'SNAKE', weight: 15 })
    }

    // 波次 8+ 解锁怨魂
    if (wave >= 8) {
      types.push({ type: 'WRAITH', weight: 15 })
    }

    return types
  }

  // 获取波次类型
  getWaveType() {
    const wave = this.currentWave

    if (wave % 10 === 0) return 'swarm'      // 狂潮波
    if (wave % 5 === 0) return 'boss'        // Boss 波
    if (wave % 3 === 0) return 'elite'       // 精英波
    return 'normal'                          // 普通波
  }

  // 获取难度系数
  getDifficultyMultiplier() {
    const wave = this.currentWave
    return {
      hp: 1 + wave * 0.1 + Math.pow(wave / 10, 2) * 0.05,
      atk: 1 + wave * 0.08,
      speed: Math.min(1 + wave * 0.02, 1.5)
    }
  }

  showWaveAnnouncement() {
    const waveType = this.getWaveType()
    let title = `第 ${this.currentWave} 波`
    let subtitle = ''
    let color = '#ffffff'

    switch (waveType) {
      case 'boss':
        title = `⚔️ BOSS 波 ⚔️`
        subtitle = `第 ${this.currentWave} 波`
        color = '#ff4444'
        break
      case 'elite':
        title = `精英波`
        subtitle = `第 ${this.currentWave} 波`
        color = '#ff8800'
        break
      case 'swarm':
        title = `🌊 狂潮波 🌊`
        subtitle = `第 ${this.currentWave} 波 - 敌人数量翻倍！`
        color = '#ff00ff'
        this.totalEnemiesInWave *= 2
        this.enemiesRemaining = this.totalEnemiesInWave
        break
    }

    // 发送事件给 HUD 显示
    this.scene.events.emit('waveAnnouncement', {
      wave: this.currentWave,
      type: waveType,
      title,
      subtitle,
      color,
      enemyCount: this.totalEnemiesInWave
    })
  }

  beginFighting() {
    this.waveState = 'fighting'
    this.spawnTimer = 0
    this.stats.startTime = this.scene.time.now

    // 通知 HUD
    this.scene.events.emit('waveFightStart', {
      wave: this.currentWave,
      enemyCount: this.totalEnemiesInWave
    })

    // Boss 波特殊处理
    if (this.getWaveType() === 'boss') {
      this.spawnBoss()
    }

    // 精英波添加精英
    if (this.getWaveType() === 'elite') {
      this.elitesToSpawn = Math.floor(this.currentWave / 5) + 1
    } else {
      this.elitesToSpawn = 0
    }
  }

  spawnBoss() {
    const bossConfig = { ...ENEMY_TYPES.BOSS }
    const difficulty = this.getDifficultyMultiplier()

    bossConfig.hp = Math.floor(bossConfig.hp * difficulty.hp)
    bossConfig.atk = Math.floor(bossConfig.atk * difficulty.atk)

    this.scene.enemySpawner.spawnSpecificEnemy('BOSS', bossConfig)
    this.enemiesRemaining++
    this.totalEnemiesInWave++
  }

  spawnElite() {
    if (this.elitesToSpawn <= 0) return

    const eliteConfig = { ...ENEMY_TYPES.ELITE }
    const difficulty = this.getDifficultyMultiplier()

    eliteConfig.hp = Math.floor(eliteConfig.hp * difficulty.hp)
    eliteConfig.atk = Math.floor(eliteConfig.atk * difficulty.atk)

    this.scene.enemySpawner.spawnSpecificEnemy('ELITE', eliteConfig)
    this.enemiesRemaining++
    this.totalEnemiesInWave++
    this.elitesToSpawn--
  }

  // 每帧更新
  update(time, delta) {
    if (this.waveState !== 'fighting') return

    // 生成敌人
    this.spawnTimer += delta
    if (this.spawnTimer >= this.spawnInterval && this.enemiesSpawned < this.totalEnemiesInWave) {
      this.spawnTimer = 0
      this.spawnEnemy()
    }

    // 精英生成
    if (this.elitesToSpawn > 0 && this.enemiesSpawned % 10 === 0 && this.enemiesSpawned > 0) {
      this.spawnElite()
    }
  }

  spawnEnemy() {
    if (this.enemiesSpawned >= this.totalEnemiesInWave) return

    // 根据权重随机选择敌人类型
    const types = this.waveEnemyTypes
    const totalWeight = types.reduce((sum, t) => sum + t.weight, 0)
    let random = Math.random() * totalWeight

    let selectedType = types[0].type
    for (const t of types) {
      random -= t.weight
      if (random <= 0) {
        selectedType = t.type
        break
      }
    }

    // 应用难度系数
    const baseConfig = ENEMY_TYPES[selectedType]
    const difficulty = this.getDifficultyMultiplier()

    const config = {
      ...baseConfig,
      hp: Math.floor(baseConfig.hp * difficulty.hp),
      atk: Math.floor(baseConfig.atk * difficulty.atk),
      speed: Math.floor(baseConfig.speed * difficulty.speed)
    }

    this.scene.enemySpawner.spawnSpecificEnemy(selectedType, config)
    this.enemiesSpawned++
  }

  // 敌人被击杀时调用
  onEnemyKilled(enemy) {
    this.enemiesRemaining--
    this.stats.totalKills++

    if (enemy.isBoss) {
      this.stats.bossKills++
    }

    // 更新 HUD
    this.scene.events.emit('waveProgress', {
      killed: this.totalEnemiesInWave - this.enemiesRemaining,
      total: this.totalEnemiesInWave
    })

    // 检查波次是否结束
    if (this.enemiesRemaining <= 0 && this.enemiesSpawned >= this.totalEnemiesInWave) {
      this.onWaveComplete()
    }
  }

  onWaveComplete() {
    this.waveState = 'reward'

    // 检查里程碑
    const milestone = this.checkMilestone()

    // 发送波次完成事件
    this.scene.events.emit('waveComplete', {
      wave: this.currentWave,
      type: this.getWaveType(),
      milestone,
      stats: { ...this.stats }
    })

    // 显示强化选择界面
    this.scene.showBuffSelection()
  }

  checkMilestone() {
    const milestones = {
      5: { name: '初试锋芒', reward: '额外一次强化选择' },
      10: { name: '小有成就', reward: '传说强化保底' },
      15: { name: '声名鹊起', reward: '全属性 +10%' },
      20: { name: '名震一方', reward: '解锁特殊强化池' },
      25: { name: '威震八方', reward: 'HP 全恢复 + 传说强化' },
      30: { name: '无双剑仙', reward: '获得"无双之证"称号' },
      50: { name: '镇妖真人', reward: '进入排行榜殿堂' }
    }

    return milestones[this.currentWave] || null
  }

  // 强化选择完成后继续
  onBuffSelected() {
    this.waveState = 'idle'

    // 短暂休息后开始下一波
    this.scene.time.delayedCall(1000, () => {
      this.startNextWave()
    })
  }

  // 获取游戏结算数据
  getGameOverStats() {
    const playTime = this.scene.time.now - (this.stats.startTime || 0)

    return {
      highestWave: this.currentWave,
      survivalTime: playTime,
      totalKills: this.stats.totalKills,
      highestCombo: this.stats.highestCombo,
      totalDamage: this.stats.totalDamage,
      bossKills: this.stats.bossKills,
      buffsCollected: this.scene.roguelikeSystem?.activeBuffs.length || 0
    }
  }

  // 更新统计
  recordDamage(damage) {
    this.stats.totalDamage += damage
  }

  recordCombo(combo) {
    if (combo > this.stats.highestCombo) {
      this.stats.highestCombo = combo
    }
  }
}
