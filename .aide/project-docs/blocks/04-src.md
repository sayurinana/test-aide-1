# 区块4：src 源码目录

> 路径：`src/`
> 最后更新：2025-12-20（v2更新：新增多种普攻系统）

## 概述

游戏源代码目录，使用 Phaser 3 框架开发的《御剑无双》完整游戏。采用 ES6 模块化组织，包含游戏入口、配置、实体、场景、系统、数据和素材等模块。当前已实现完整的 Roguelike 割草游戏框架，包括：主菜单、多种普攻类型、战斗系统、技能系统、波次系统、强化系统、音效系统和视觉效果系统。

**v2 更新**：新增 6 种普攻类型（挥砍、射箭、法球、冲击波、闪电链、召唤物）、普攻选择界面、测试场景和 SVG 素材资源。

## 目录结构

```
src/
├── main.js                  游戏入口（34行）
├── config.js                配置常量（292行）
├── assets/                  游戏素材资源 [新增目录]
│   ├── skills/              技能图标（4个SVG）
│   │   ├── dash.svg         闪现技能图标
│   │   ├── heal.svg         治疗技能图标
│   │   ├── shield.svg       护盾技能图标
│   │   └── speed.svg        加速技能图标
│   └── sprites/             角色精灵图（7个SVG）
│       ├── player.svg       玩家角色
│       ├── boss.svg         Boss 敌人
│       ├── elite.svg        精英敌人
│       ├── shadow.svg       幽灵敌人
│       ├── snake.svg        毒蛇敌人
│       ├── wolf.svg         狼人敌人
│       └── wraith.svg       灵魂敌人
├── attacks/                 普攻类型实现 [新增目录]
│   ├── AttackBase.js        普攻基类（154行）
│   ├── SlashAttack.js       挥砍普攻（205行）
│   ├── ArrowAttack.js       射箭普攻（253行）
│   ├── OrbAttack.js         法球普攻（312行）
│   ├── LightningAttack.js   闪电链普攻（281行）
│   ├── WaveAttack.js        冲击波普攻（242行）
│   └── SummonAttack.js      召唤物普攻（370行）
├── entities/                游戏实体类
│   ├── Player.js            玩家角色（153行）
│   ├── Enemy.js             敌人类（142行）
│   └── AttackEffect.js      攻击效果（65行）
├── scenes/                  Phaser 场景
│   ├── MainMenuScene.js     主菜单场景（211行）
│   ├── GameScene.js         游戏主场景（604行）
│   ├── HUDScene.js          HUD 界面（629行）
│   ├── BuffSelectionScene.js 强化选择场景（166行）
│   ├── AttackSelectScene.js 普攻选择场景（193行）[新增]
│   └── TestScene.js         测试场景（619行）[新增]
├── systems/                 游戏系统
│   ├── EnemySpawner.js      敌人生成器（79行）
│   ├── ComboSystem.js       连击系统（81行）
│   ├── DamageSystem.js      伤害系统（120行）
│   ├── SkillManager.js      技能管理器（416行）
│   ├── RoguelikeSystem.js   Roguelike 系统（464行）
│   ├── WaveManager.js       波次管理器（337行）
│   ├── VFXManager.js        视觉效果管理器（370行）
│   ├── AudioManager.js      音效管理器（368行）
│   └── AttackManager.js     普攻管理器（147行）[新增]
├── data/                    游戏数据
│   └── BuffData.js          强化道具数据（315行）
└── ui/                      [空目录] UI 组件（待开发）
```

## 文件清单

| 文件 | 类型 | 行数 | 说明 |
|------|------|------|------|
| main.js | 入口 | 34 | Phaser 游戏初始化和配置 |
| config.js | 配置 | 292 | 游戏常量定义（含敌人类型、战斗系统、技能、普攻类型） |
| **assets/** | **目录** | **-** | **游戏素材资源目录** |
| assets/skills/*.svg | 素材 | - | 4 个技能图标 SVG |
| assets/sprites/*.svg | 素材 | - | 7 个角色精灵 SVG |
| **attacks/** | **目录** | **-** | **普攻类型实现目录** |
| attacks/AttackBase.js | 类 | 154 | 普攻基类（定义通用接口） |
| attacks/SlashAttack.js | 类 | 205 | 挥砍普攻（近战扇形） |
| attacks/ArrowAttack.js | 类 | 253 | 射箭普攻（远程投射） |
| attacks/OrbAttack.js | 类 | 312 | 法球普攻（自动追踪） |
| attacks/LightningAttack.js | 类 | 281 | 闪电链普攻（链式弹射） |
| attacks/WaveAttack.js | 类 | 242 | 冲击波普攻（穿透攻击） |
| attacks/SummonAttack.js | 类 | 370 | 召唤物普攻（自动攻击） |
| entities/Player.js | 实体 | 153 | 玩家角色类 |
| entities/Enemy.js | 实体 | 142 | 敌人类 |
| entities/AttackEffect.js | 实体 | 65 | 攻击效果类 |
| scenes/MainMenuScene.js | 场景 | 211 | 主菜单场景 |
| scenes/GameScene.js | 场景 | 604 | 游戏主场景（核心） |
| scenes/HUDScene.js | 场景 | 629 | HUD 界面场景 |
| scenes/BuffSelectionScene.js | 场景 | 166 | 强化选择场景 |
| scenes/AttackSelectScene.js | 场景 | 193 | 普攻选择场景 [新增] |
| scenes/TestScene.js | 场景 | 619 | 测试场景（快捷键调试） [新增] |
| systems/EnemySpawner.js | 系统 | 79 | 敌人生成器 |
| systems/ComboSystem.js | 系统 | 81 | 连击系统 |
| systems/DamageSystem.js | 系统 | 120 | 伤害系统 |
| systems/SkillManager.js | 系统 | 416 | 技能管理器 |
| systems/RoguelikeSystem.js | 系统 | 464 | Roguelike 强化系统 |
| systems/WaveManager.js | 系统 | 337 | 波次管理器 |
| systems/VFXManager.js | 系统 | 370 | 视觉效果管理器 |
| systems/AudioManager.js | 系统 | 368 | 音效管理器 |
| systems/AttackManager.js | 系统 | 147 | 普攻管理器 [新增] |
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
| `ENEMY_TYPES` | 敌人类型配置（6种：幽灵、狼人、毒蛇、灵魂、精英、Boss） |
| `COMBAT` | 战斗系统配置（连击、击退、暴击等） |
| `COLORS` | 颜色配置 |
| `ATTACK_TYPES` | **普攻类型配置（6种）** [新增] |
| `SKILLS` | 技能配置（4个主动技能） |

**敌人类型**：
| 类型 | 名称 | HP | ATK | 行为 |
|------|------|-----|-----|------|
| SHADOW | 幽灵 | 30 | 10 | 追踪 |
| WOLF | 狼人 | 50 | 15 | 冲锋 |
| SNAKE | 毒蛇 | 25 | 8 | 远程 |
| WRAITH | 灵魂 | 40 | 8 | 分裂 |
| ELITE | 精英 | 200 | 25 | 精英 |
| BOSS | Boss | 500 | 40 | Boss |

**普攻类型配置（ATTACK_TYPES）**：[新增]
| 类型 | 名称 | 伤害 | 冷却 | 特点 |
|------|------|------|------|------|
| ARROW | 射箭 | 15 | 600ms | 远程投射，可多重射击/穿透 |
| SLASH | 挥砍 | 20 | 400ms | 近战 90° 扇形，范围伤害 |
| ORB | 法球 | 12 | 800ms | 自动追踪最近敌人 |
| WAVE | 冲击波 | 18 | 700ms | 穿透敌人，强击退 |
| LIGHTNING | 闪电链 | 10 | 900ms | 最多弹射 3 次，衰减伤害 |
| SUMMON | 召唤物 | 8 | 1200ms | 召唤精灵自动攻击 5 秒 |

**技能配置**：
| 技能 | 按键 | 冷却 | 效果 |
|------|------|------|------|
| 加速 | Q | 8s | 移动速度翻倍 3s |
| 闪现 | E | 5s | 瞬移 200px，期间无敌 |
| 护盾 | R | 15s | 免疫伤害 2s |
| 治疗 | Space | 20s | 恢复 30% HP |

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

### scenes/AttackSelectScene.js - 普攻选择场景 [新增]

**职责**：游戏开始时让玩家选择初始普攻类型

**场景键**：`AttackSelectScene`

**核心功能**：
- 显示 6 种普攻类型卡片
- 每张卡片显示：图标、名称、描述、属性（伤害/冷却）
- 鼠标悬停放大效果
- 点击选择后淡出过渡到游戏
- 播放选择音效

**初始化参数**：
- `onSelect(attackType)` - 选择回调函数

**UI 设计**：
- 半透明黑色背景（90% 不透明度）
- 标题："选择初始普攻"
- 6 张横向排列的卡片
- 每张卡片尺寸：140×200

---

### scenes/TestScene.js - 测试场景 [新增]

**职责**：基于 GameScene 的调试场景，提供快捷键测试功能

**场景键**：`TestScene`

**测试功能快捷键**：
| 按键 | 功能 | 说明 |
|------|------|------|
| 1 | 获得大量经验 | 一次性获得 5 级经验 |
| 2 | 触发死亡 | 测试死亡流程 |
| 3 | 生成敌人波 | 玩家周围生成 10 个敌人 |
| 4 | 清除所有敌人 | 删除场上所有敌人 |
| 5 | 切换无敌 | 开/关玩家无敌状态 |
| 0 | 返回主菜单 | 退出测试场景 |

**默认状态**：
- 玩家默认无敌
- 敌人生成间隔设为无穷大
- 屏幕左上角显示测试提示面板

**复用的 GameScene 功能**：
- 完整的战斗系统
- 波次系统
- 强化系统
- 游戏结算

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

### systems/AttackManager.js - 普攻管理器 [新增]

**职责**：管理已装备的普攻列表，统一触发和更新

**核心功能**：
- 添加/移除普攻
- 检测已有普攻时自动升级
- 统一更新所有普攻冷却
- 批量执行所有可用普攻
- 对普攻应用强化效果

**核心方法**：
| 方法 | 说明 |
|------|------|
| `addAttack(attack)` | 添加普攻，重复则升级 |
| `removeAttack(attackId)` | 移除普攻 |
| `getAttack(attackId)` | 获取指定普攻 |
| `update(delta)` | 更新所有普攻冷却 |
| `executeAll(context)` | 执行所有可用普攻 |
| `canFireAny()` | 检查是否有普攻可用 |
| `applyBuffToAttack(id, type, value)` | 对指定普攻应用强化 |
| `applyBuffToAll(type, value)` | 对所有普攻应用强化 |
| `getAttacksInfo()` | 获取普攻信息（供 UI） |
| `reset()` / `clear()` | 重置/清空普攻 |

---

### attacks/ - 普攻系统 [新增目录]

**职责**：实现 6 种不同的普攻类型，采用继承结构

#### attacks/AttackBase.js - 普攻基类

**职责**：定义所有普攻的通用接口和属性

**基础属性**：
| 属性 | 说明 |
|------|------|
| `id` / `name` / `description` | 基础信息 |
| `baseDamage` / `damage` | 基础/当前伤害 |
| `baseCooldown` / `cooldown` | 基础/当前冷却 |
| `range` | 攻击范围 |
| `color` | 主题颜色 |
| `level` | 当前等级 |
| `damageBonus` / `cooldownReduction` / `rangeBonus` | 强化加成 |

**核心方法**：
| 方法 | 说明 |
|------|------|
| `canFire()` | 检查是否可发射 |
| `execute(player, context)` | 执行攻击（子类实现） |
| `update(delta)` | 更新冷却 |
| `startCooldown()` | 开始冷却 |
| `getComputedDamage/Range()` | 获取计算后的属性 |
| `upgrade()` | 升级（每级伤害 +10%，冷却 -5%） |
| `applyBuff(type, value)` | 应用强化效果 |
| `reset()` | 重置状态 |

#### attacks/SlashAttack.js - 挥砍普攻

**职责**：近距离扇形斩击，命中范围内所有敌人

**特有属性**：`arcAngle` (挥砍角度，默认 90°)

**攻击逻辑**：
1. 计算玩家前方攻击位置
2. 创建 AttackEffect 视觉效果
3. 播放剑光拖尾
4. 扇形范围检测敌人
5. 对命中敌人应用伤害、连击、击退

**特有强化**：`arc` - 增加挥砍角度（最大 270°）

#### attacks/ArrowAttack.js - 射箭普攻

**职责**：发射箭矢投射物，直线飞行

**特有属性**：
| 属性 | 说明 |
|------|------|
| `speed` | 箭矢速度 |
| `projectileSize` | 箭矢大小 |
| `pierce` | 穿透数量 |
| `multishot` | 同时发射数量 |
| `spreadAngle` | 散射角度 |

**攻击逻辑**：
1. 根据 multishot 发射多支箭
2. 箭矢直线飞行
3. 超出射程自动销毁
4. 命中后检查穿透

**特有强化**：`multishot` / `pierce` / `speed`

#### attacks/OrbAttack.js - 法球普攻

**职责**：发射自动追踪最近敌人的魔法球

**特有属性**：
| 属性 | 说明 |
|------|------|
| `orbCount` | 同时发射数量 |
| `pierce` | 穿透数量 |

**攻击逻辑**：
1. 寻找范围内最近敌人
2. 无敌人不发射
3. 法球追踪目标移动
4. 目标死亡自动切换新目标
5. 超出范围销毁

**特有强化**：`orbCount` / `pierce` / `trackingSpeed`

#### attacks/LightningAttack.js - 闪电链普攻

**职责**：对最近敌人释放闪电，可弹射到其他敌人

**特有属性**：
| 属性 | 说明 |
|------|------|
| `chainRange` | 弹射范围 |
| `chainCount` | 最大弹射次数（默认 3） |
| `damageDecay` | 伤害衰减系数（默认 0.8） |

**攻击逻辑**：
1. 寻找初始目标
2. 绘制锯齿形闪电效果
3. 对目标造成伤害
4. 寻找弹射范围内下一个目标
5. 每次弹射伤害衰减 20%

**特有强化**：`chainCount` / `chainRange` / `damageDecay`

#### attacks/WaveAttack.js - 冲击波普攻

**职责**：向前方发射穿透敌人的冲击波

**特有属性**：
| 属性 | 说明 |
|------|------|
| `width` | 冲击波宽度 |
| `waveCount` | 同时发射波数 |

**攻击逻辑**：
1. 发射弧形冲击波
2. 随距离逐渐扩大
3. 穿透敌人（不消失）
4. 强击退效果（1.5 倍）

**特有强化**：`waveCount` / `width` / `speed`

#### attacks/SummonAttack.js - 召唤物普攻

**职责**：召唤自动攻击的精灵分身

**特有属性**：
| 属性 | 说明 |
|------|------|
| `duration` | 召唤物持续时间（5 秒） |
| `attackInterval` | 攻击间隔（500ms） |
| `summonCount` | 同时召唤数量 |

**攻击逻辑**：
1. 召唤精灵在玩家周围
2. 精灵环绕玩家漂浮
3. 自动寻找范围内敌人
4. 发射追踪光弹攻击
5. 持续时间结束消失

**特有强化**：`summonCount` / `summonDuration` / `summonAttackSpeed`

---

### assets/ - 游戏素材 [新增目录]

**职责**：存储游戏 SVG 矢量图素材

**skills/** - 技能图标（4 个 SVG）：
| 文件 | 说明 |
|------|------|
| dash.svg | 闪现技能图标 |
| heal.svg | 治疗技能图标 |
| shield.svg | 护盾技能图标 |
| speed.svg | 加速技能图标 |

**sprites/** - 角色精灵（7 个 SVG）：
| 文件 | 说明 |
|------|------|
| player.svg | 玩家角色 |
| boss.svg | Boss 敌人 |
| elite.svg | 精英敌人 |
| shadow.svg | 幽灵敌人 |
| snake.svg | 毒蛇敌人 |
| wolf.svg | 狼人敌人 |
| wraith.svg | 灵魂敌人 |

**设计特点**：
- 简约几何风格
- 矢量格式（无损缩放）
- 统一的色彩主题

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
| 源码文件 | 28 个（+10） |
| SVG 素材 | 11 个 [新增] |
| 总代码行数 | 约 7600 行（+2750） |
| 场景数 | 6 个（+2） |
| 系统数 | 9 个（+1） |
| 普攻类型 | 6 个 [新增] |
| 实体类 | 3 个 |
| 技能数 | 4 个 |
| 强化道具 | 26 个 |
| 敌人类型 | 6 种 |

### v2 更新摘要

| 新增内容 | 数量 | 说明 |
|----------|------|------|
| assets/ 目录 | 11 文件 | SVG 矢量图素材 |
| attacks/ 目录 | 7 文件 | 6 种普攻实现 + 基类 |
| AttackSelectScene | 1 文件 | 普攻选择界面 |
| TestScene | 1 文件 | 调试测试场景 |
| AttackManager | 1 文件 | 普攻管理器 |
