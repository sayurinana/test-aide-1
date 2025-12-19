# 区块4：src 源码目录

> 路径：`src/`
> 最后更新：2025-12-20

## 概述

游戏源代码目录，使用 Phaser 3 框架开发的《御剑无双》完整游戏。采用 ES6 模块化组织，包含游戏入口、配置、实体、场景、系统和数据等模块。当前已实现完整的 Roguelike 割草游戏框架，包括：主菜单、战斗系统、技能系统、波次系统、强化系统、音效系统和视觉效果系统。

## 目录结构

```
src/
├── main.js                  游戏入口（34行）
├── config.js                配置常量（213行）
├── entities/                游戏实体类
│   ├── Player.js            玩家角色（153行）
│   ├── Enemy.js             敌人类（142行）
│   └── AttackEffect.js      攻击效果（65行）
├── scenes/                  Phaser 场景
│   ├── MainMenuScene.js     主菜单场景（211行）[新增]
│   ├── GameScene.js         游戏主场景（604行）
│   ├── HUDScene.js          HUD 界面（629行）
│   └── BuffSelectionScene.js 强化选择场景（166行）[新增]
├── systems/                 游戏系统
│   ├── EnemySpawner.js      敌人生成器（79行）
│   ├── ComboSystem.js       连击系统（81行）[新增]
│   ├── DamageSystem.js      伤害系统（120行）[新增]
│   ├── SkillManager.js      技能管理器（416行）[新增]
│   ├── RoguelikeSystem.js   Roguelike 系统（464行）[新增]
│   ├── WaveManager.js       波次管理器（337行）[新增]
│   ├── VFXManager.js        视觉效果管理器（370行）[新增]
│   └── AudioManager.js      音效管理器（368行）[新增]
├── data/                    游戏数据 [新增目录]
│   └── BuffData.js          强化道具数据（315行）
└── ui/                      [空目录] UI 组件（待开发）
```

## 文件清单

| 文件 | 类型 | 行数 | 说明 |
|------|------|------|------|
| main.js | 入口 | 34 | Phaser 游戏初始化和配置 |
| config.js | 配置 | 213 | 游戏常量定义（含敌人类型、战斗系统、技能） |
| entities/Player.js | 实体 | 153 | 玩家角色类 |
| entities/Enemy.js | 实体 | 142 | 敌人类 |
| entities/AttackEffect.js | 实体 | 65 | 攻击效果类 |
| scenes/MainMenuScene.js | 场景 | 211 | 主菜单场景 |
| scenes/GameScene.js | 场景 | 604 | 游戏主场景（核心） |
| scenes/HUDScene.js | 场景 | 629 | HUD 界面场景 |
| scenes/BuffSelectionScene.js | 场景 | 166 | 强化选择场景 |
| systems/EnemySpawner.js | 系统 | 79 | 敌人生成器 |
| systems/ComboSystem.js | 系统 | 81 | 连击系统 |
| systems/DamageSystem.js | 系统 | 120 | 伤害系统 |
| systems/SkillManager.js | 系统 | 416 | 技能管理器 |
| systems/RoguelikeSystem.js | 系统 | 464 | Roguelike 强化系统 |
| systems/WaveManager.js | 系统 | 337 | 波次管理器 |
| systems/VFXManager.js | 系统 | 370 | 视觉效果管理器 |
| systems/AudioManager.js | 系统 | 368 | 音效管理器 |
| data/BuffData.js | 数据 | 315 | 强化道具数据定义 |
| ui/ | 目录 | - | [空目录] UI 组件待开发 |

## 核心组件

### main.js - 游戏入口

**职责**：初始化 Phaser 游戏实例

**游戏配置**：
- 渲染器：`Phaser.AUTO`（自动选择 WebGL/Canvas）
- 分辨率：1280×720
- 物理引擎：Arcade（无重力）
- 背景色：`#0a0a1e`（深蓝黑）
- 场景：`[MainMenuScene, GameScene, HUDScene, BuffSelectionScene]`

---

### config.js - 配置常量

**职责**：定义游戏全局配置常量

**导出常量**：

| 常量 | 说明 |
|------|------|
| `WORLD` | 世界尺寸（2000×2000） |
| `PLAYER` | 玩家配置（速度、HP、ATK、攻击范围等） |
| `ENEMY` | 敌人基础配置 |
| `ENEMY_TYPES` | 敌人类型配置（6种：飘影、妖狼、蛇妖、怨魂、精英、Boss） |
| `COMBAT` | 战斗系统配置（连击、击退、暴击等） |
| `COLORS` | 颜色配置 |
| `SKILLS` | 技能配置（4个主动技能） |

**敌人类型**：
| 类型 | 名称 | HP | ATK | 行为 |
|------|------|-----|-----|------|
| SHADOW | 飘影 | 30 | 10 | 追踪 |
| WOLF | 妖狼 | 50 | 15 | 冲锋 |
| SNAKE | 蛇妖 | 25 | 8 | 远程 |
| WRAITH | 怨魂 | 40 | 8 | 分裂 |
| ELITE | 邪修 | 200 | 25 | 精英 |
| BOSS | 妖将 | 500 | 40 | Boss |

**技能配置**：
| 技能 | 按键 | 冷却 | 效果 |
|------|------|------|------|
| 剑气横扫 | Q | 3s | 180° 范围攻击 |
| 瞬步斩 | E | 4s | 突进 250px |
| 护体真气 | R | 8s | 护盾反伤 2s |
| 剑域 | Space | 15s | 持续范围伤害 |

---

### scenes/MainMenuScene.js - 主菜单场景

**职责**：游戏开始界面

**场景键**：`MainMenuScene`

**核心功能**：
- 游戏标题显示（带光晕动画）
- 开始按钮（带脉动动画）
- 操作说明（WASD、鼠标、技能键）
- 版本信息显示
- 装饰性粒子背景

**核心方法**：
| 方法 | 说明 |
|------|------|
| `createBackground()` | 创建渐变背景和漂浮粒子 |
| `createButton()` | 创建交互式按钮 |
| `startGame()` | 淡出过渡并启动游戏 |

---

### scenes/GameScene.js - 游戏主场景

**职责**：游戏核心逻辑场景，集成所有子系统

**场景键**：`GameScene`

**关键属性**：
- `player` - 玩家实例
- `enemySpawner` - 敌人生成器
- `comboSystem` - 连击系统
- `damageSystem` - 伤害系统
- `skillManager` - 技能管理器
- `roguelikeSystem` - Roguelike 系统
- `waveManager` - 波次管理器
- `vfxManager` - 视觉效果管理器
- `audioManager` - 音效管理器
- `killCount` - 击杀数
- `gameOver` - 游戏结束标志
- `isPaused` - 暂停标志

**核心方法**：
| 方法 | 说明 |
|------|------|
| `create()` | 场景初始化（创建所有子系统） |
| `setupCollisions()` | 设置敌人与玩家碰撞检测 |
| `onEnemyHitPlayer()` | 处理敌人碰撞玩家（含无敌检查、护盾反伤） |
| `performAttack()` | 执行普通攻击（含剑光拖尾） |
| `checkAttackHits()` | 扇形范围攻击判定（含连击、暴击、吸血） |
| `onEnemyKilled()` | 敌人击杀处理（通知波次、触发回复） |
| `showBuffSelection()` | 显示强化选择界面 |
| `onBuffSelected()` | 强化选择完成处理 |
| `togglePause()` | 切换暂停状态 |
| `onGameOver()` | 游戏结束处理 |
| `showGameOverScreen()` | 显示游戏结算界面 |
| `calculateScore()` | 计算最终分数 |

**游戏循环**：
1. 更新玩家（移动、朝向）
2. 更新敌人生成器
3. 更新连击系统（超时检测）
4. 更新技能管理器（冷却）
5. 更新 Roguelike 系统（HP 回复）
6. 更新波次管理器（敌人生成）

---

### scenes/HUDScene.js - HUD 界面

**职责**：游戏 UI 叠加层

**场景键**：`HUDScene`

**UI 元素**：
- HP 血条（带颜色变化：绿→黄→红）
- 击杀计数（带缩放动画）
- 波次显示（标题 + 进度条）
- 连击显示（数字 + 倍率）
- 技能栏（4 个技能槽 + 冷却显示）
- 暂停界面
- 调试信息（FPS、敌人数量）

**核心方法**：
| 方法 | 说明 |
|------|------|
| `createHpBar()` | 创建血条 |
| `createKillCounter()` | 创建击杀计数 |
| `createWaveDisplay()` | 创建波次显示 |
| `createComboDisplay()` | 创建连击显示 |
| `createSkillBar()` | 创建技能栏 |
| `createPauseOverlay()` | 创建暂停界面 |
| `showWaveAnnouncement()` | 显示波次公告 |
| `updateSkillBar()` | 更新技能冷却状态 |

**事件监听**：
- `playerHpUpdated` - 血量更新
- `killCountUpdated` - 击杀更新
- `comboUpdated` - 连击更新
- `waveAnnouncement` - 波次公告
- `waveFightStart` - 战斗开始
- `waveProgress` - 波次进度
- `waveComplete` - 波次完成
- `buffAcquired` - 获得强化
- `gamePaused/gameResumed` - 暂停/恢复

---

### scenes/BuffSelectionScene.js - 强化选择场景

**职责**：波次结束时的三选一强化界面

**场景键**：`BuffSelectionScene`

**核心功能**：
- 接收三个强化选项
- 显示卡片式选项（稀有度边框颜色）
- 支持鼠标点击或键盘 1/2/3 选择
- 选择后触发回调并关闭

---

### systems/ComboSystem.js - 连击系统

**职责**：管理连击计数、连击倍率和连击超时

**关键属性**：
- `comboCount` - 当前连击数
- `lastHitTime` - 上次击中时间
- `comboMultiplier` - 连击倍率

**核心方法**：
| 方法 | 说明 |
|------|------|
| `addHit()` | 记录一次击中，更新连击数和倍率 |
| `getMultiplier()` | 获取当前倍率（含超时检查） |
| `resetCombo()` | 重置连击 |

**连击倍率公式**：
```
multiplier = 1.0 + (combo - 1) * 0.05, 上限 2.0
```

---

### systems/DamageSystem.js - 伤害系统

**职责**：处理伤害计算、暴击判定、击退效果

**核心方法**：
| 方法 | 说明 |
|------|------|
| `calculateDamage(base, combo, attacker)` | 计算伤害（含暴击） |
| `applyDamage(target, damage, isCrit)` | 应用伤害到目标 |
| `applyKnockback(target, x, y, force)` | 应用击退效果 |
| `showDamageNumber(x, y, damage, isCrit)` | 显示伤害数字 |

**暴击系统**：
- 基础暴击率：5%
- 暴击伤害：1.5 倍

---

### systems/SkillManager.js - 技能管理器

**职责**：管理技能冷却、释放和特效

**技能列表**：
| ID | 名称 | 按键 | 类型 |
|-----|------|------|------|
| `sword_wave` | 剑气横扫 | Q | 180° 扇形 |
| `dash_slash` | 瞬步斩 | E | 突进 |
| `shield` | 护体真气 | R | 护盾反伤 |
| `sword_domain` | 剑域 | Space | 持续范围 |

**核心方法**：
| 方法 | 说明 |
|------|------|
| `canCast(skillId)` | 检查技能是否可用 |
| `castSkill(skillId)` | 释放技能 |
| `castSwordWave(skill)` | 剑气横扫实现 |
| `castDashSlash(skill)` | 瞬步斩实现（突进无敌） |
| `castShield(skill)` | 护体真气实现 |
| `castSwordDomain(skill)` | 剑域实现（定时多段伤害） |
| `hitEnemiesInArc()` | 扇形范围伤害 |
| `hitEnemiesInLine()` | 线形范围伤害 |
| `hitEnemiesInRadius()` | 圆形范围伤害 |
| `checkShieldReflect()` | 检查护盾反伤 |
| `getSkillStates()` | 获取技能状态（供 UI） |

---

### systems/RoguelikeSystem.js - Roguelike 系统

**职责**：强化选择和效果管理

**关键属性**：
- `activeBuffs` - 已激活强化列表
- `pity` - 保底计数器（稀有、史诗、传说）
- `player.buffStats` - 强化属性加成

**核心方法**：
| 方法 | 说明 |
|------|------|
| `getComputedStat(base, stat)` | 获取计算后的属性值 |
| `hasBuff(buffId)` | 检查是否有某强化 |
| `addBuff(buffId)` | 添加强化 |
| `applyBuffEffect(buffData)` | 应用强化效果 |
| `generateChoices(wave, isBoss)` | 生成三个选择 |
| `rollRarity(wave, guaranteed)` | 随机稀有度（含保底） |
| `onKill()` | 击杀事件（触发击杀回复） |
| `onDamageDealt(damage)` | 伤害事件（触发吸血） |
| `checkRevive()` | 检查复活 |
| `calculateDamageTaken(base)` | 计算受到的伤害（减伤） |
| `getDamageMultiplier(enemy)` | 获取伤害加成（处刑者等） |
| `isComboInvincible()` | 检查连击无敌（无双之力） |

**强化属性**：
- 基础属性：ATK、HP、速度、防御、暴击
- 技能相关：攻击范围、冷却缩减、技能伤害
- 生存相关：减伤、回复、吸血、击杀回血
- 特殊效果：复活、瞬步穿透、连击无敌

---

### systems/WaveManager.js - 波次管理器

**职责**：管理无尽模式的波次递进、敌人配置和难度曲线

**波次状态**：`idle` → `preparing` → `fighting` → `clearing` → `reward`

**波次类型**：
| 波次 | 类型 | 特点 |
|------|------|------|
| n%10=0 | 狂潮波 | 敌人数量翻倍 |
| n%5=0 | Boss 波 | 出现 Boss |
| n%3=0 | 精英波 | 出现精英 |
| 其他 | 普通波 | 正常 |

**难度曲线**：
- HP 系数：`1 + wave * 0.1 + (wave/10)² * 0.05`
- ATK 系数：`1 + wave * 0.08`
- 速度系数：`min(1 + wave * 0.02, 1.5)`

**核心方法**：
| 方法 | 说明 |
|------|------|
| `startNextWave()` | 开始新一波 |
| `calculateWaveConfig()` | 计算波次配置 |
| `getEnemyTypesForWave(wave)` | 获取敌人类型（逐步解锁） |
| `onEnemyKilled()` | 敌人击杀处理 |
| `onWaveComplete()` | 波次完成处理 |
| `getGameOverStats()` | 获取结算数据 |

**里程碑**：第 5/10/15/20/25/30/50 波有特殊奖励

---

### systems/VFXManager.js - 视觉效果管理器

**职责**：统一管理粒子特效、屏幕震动、Hit Stop 等

**核心方法**：
| 方法 | 说明 |
|------|------|
| `screenShake(intensity, duration)` | 屏幕震动 |
| `hitStop(duration)` | 击中暂停效果 |
| `showDamageNumber(x, y, damage, isCrit)` | 伤害数字 |
| `flashWhite(target, duration)` | 受击闪白 |
| `createDeathParticles(x, y, color, count)` | 死亡粒子 |
| `createSlashTrail(x, y, angle, range, color)` | 剑光拖尾 |
| `createSwordWaveEffect()` | 剑气横扫特效 |
| `createDashSlashEffect()` | 瞬步斩特效 |
| `createShieldEffect()` | 护盾特效 |
| `createSwordDomainEffect()` | 剑域特效 |
| `createWaveStartEffect()` | 波次开始特效 |
| `createBuffAcquiredEffect()` | 获得强化特效 |

---

### systems/AudioManager.js - 音效管理器

**职责**：使用 Web Audio API 程序化生成音效

**单例模式**：通过 `getAudioManager()` 获取实例

**音效类型**：
| 类型 | 说明 |
|------|------|
| `attack` | 攻击音效（剑划空气） |
| `hit` | 命中音效 |
| `kill` | 击杀音效（爆裂） |
| `skill` | 技能音效（双音） |
| `hurt` | 受伤音效 |
| `select` | UI 选择音效 |
| `buff` | 获得强化音效（上行琶音） |
| `wave` | 波次开始音效 |
| `gameover` | 游戏结束音效（下行） |

**核心方法**：
| 方法 | 说明 |
|------|------|
| `playSfx(type)` | 播放音效 |
| `toggleMute()` | 切换静音 |
| `setMasterVolume(value)` | 设置主音量 |
| `startMusic()` | 启动背景音乐 |

---

### data/BuffData.js - 强化道具数据

**职责**：定义所有强化道具的数据

**稀有度**：
| 稀有度 | 概率 | 颜色 |
|--------|------|------|
| 普通 | 60% | 白色 |
| 稀有 | 25% | 蓝色 |
| 史诗 | 12% | 紫色 |
| 传说 | 3% | 橙色 |

**类别**：属性、技能、特效、生存

**强化数量**：共 26 个强化道具

**导出函数**：
- `getBuffById(id)` - 根据 ID 获取
- `getBuffsByRarity(rarity)` - 根据稀有度获取
- `getBuffsByCategory(category)` - 根据类别获取

---

### entities/Player.js - 玩家角色

**职责**：玩家角色的渲染、移动、攻击逻辑

**类继承**：`Phaser.GameObjects.Container`

**核心方法**：
| 方法 | 说明 |
|------|------|
| `createGraphics()` | 创建几何风格角色图形 |
| `update(time, delta)` | 每帧更新 |
| `handleMovement()` | WASD 移动控制 |
| `handleRotation()` | 角色朝向鼠标 |
| `canAttack()` | 检查是否可攻击 |
| `attack()` | 执行攻击 |
| `takeDamage(amount)` | 受伤处理 |

---

### entities/Enemy.js - 敌人类

**职责**：敌人的渲染、AI 追踪、受伤处理

**类继承**：`Phaser.GameObjects.Container`

**核心方法**：
| 方法 | 说明 |
|------|------|
| `drawEnemy()` | 绘制六边形敌人 |
| `setTarget(target)` | 设置追踪目标 |
| `update(time, delta)` | AI 追踪逻辑 |
| `takeDamage(amount)` | 受伤处理 |
| `die()` | 死亡效果 |
| `reset(x, y)` | 对象池复用重置 |

---

### systems/EnemySpawner.js - 敌人生成器

**职责**：敌人的生成和对象池管理

**核心方法**：
| 方法 | 说明 |
|------|------|
| `update(time, delta)` | 计时器更新 |
| `trySpawn()` | 尝试生成敌人 |
| `spawnSpecificEnemy(type, config)` | 生成指定类型敌人 |
| `getSpawnPosition()` | 计算生成位置 |
| `getActiveEnemies()` | 获取活跃敌人列表 |

---

## 架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                           main.js                                    │
│                      (Phaser.Game 初始化)                            │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
       ┌────────────────────────┼────────────────────────┐
       ▼                        ▼                        ▼
┌──────────────┐     ┌─────────────────────┐     ┌──────────────┐
│ MainMenuScene │     │     GameScene       │     │BuffSelection │
│              │     │                     │     │    Scene     │
└──────────────┘     │  ┌───────────────┐  │     └──────────────┘
                     │  │ Player        │  │
                     │  │ EnemySpawner  │  │     ┌──────────────┐
                     │  │   └─ Enemy[]  │  │     │  HUDScene    │
                     │  ├───────────────┤  │◄────│              │
                     │  │ ComboSystem   │  │     │ ┌──────────┐ │
                     │  │ DamageSystem  │  │────▶│ │HP/Kill   │ │
                     │  │ SkillManager  │  │     │ │Wave/Combo│ │
                     │  │ RoguelikeSystem│ │     │ │SkillBar  │ │
                     │  │ WaveManager   │  │     │ └──────────┘ │
                     │  │ VFXManager    │  │     └──────────────┘
                     │  │ AudioManager  │  │
                     │  └───────────────┘  │
                     └─────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          config.js                                   │
│   WORLD | PLAYER | ENEMY | ENEMY_TYPES | COMBAT | COLORS | SKILLS   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        data/BuffData.js                              │
│                    RARITY | CATEGORY | BUFF_LIST                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 依赖关系

**外部依赖**：
- `phaser` ^3.80.1

**内部依赖**：
- `main.js` → `scenes/*`
- `scenes/GameScene.js` → `config.js`, `entities/*`, `systems/*`
- `scenes/HUDScene.js` → `config.js`, `systems/AudioManager.js`
- `scenes/MainMenuScene.js` → `systems/AudioManager.js`
- `scenes/BuffSelectionScene.js` → `data/BuffData.js`, `systems/AudioManager.js`
- `systems/RoguelikeSystem.js` → `data/BuffData.js`
- `systems/WaveManager.js` → `config.js`
- `systems/SkillManager.js` → `config.js`
- `systems/ComboSystem.js` → `config.js`
- `systems/DamageSystem.js` → `config.js`
- `systems/VFXManager.js` → `config.js`
- `entities/*` → `config.js`
- `systems/EnemySpawner.js` → `config.js`, `entities/Enemy.js`

**被依赖**：
- 被根目录 `index.html` 通过 `<script type="module">` 引用

## 技术要点

1. **模块化设计**：ES6 模块，职责清晰，系统解耦
2. **对象池模式**：`EnemySpawner` 复用已死亡敌人
3. **场景分离**：游戏逻辑（GameScene）与 UI（HUDScene）分离
4. **事件驱动**：通过 Phaser 事件系统实现组件通信
5. **几何渲染**：使用 Graphics API 绘制简约风格角色
6. **程序化音效**：Web Audio API 生成音效，无需音频文件
7. **Roguelike 机制**：保底系统、可叠加强化、条件触发
8. **波次系统**：难度曲线、敌人类型解锁、里程碑奖励

## 统计信息

| 项目 | 数量 |
|------|------|
| 源码文件 | 18 个 |
| 总代码行数 | 约 4850 行 |
| 场景数 | 4 个 |
| 系统数 | 8 个 |
| 实体类 | 3 个 |
| 技能数 | 4 个 |
| 强化道具 | 26 个 |
| 敌人类型 | 6 种 |
