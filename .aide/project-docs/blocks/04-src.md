# 区块4：src 源码目录

> 路径：`src/`
> 最后更新：2025-12-20

## 概述

游戏源代码目录，使用 Phaser 3 框架开发的《御剑无双》技术原型。采用 ES6 模块化组织，包含游戏入口、配置、实体、场景和系统等核心模块。当前实现了基础的战斗原型：玩家移动、攻击、敌人生成和追踪。

## 目录结构

```
src/
├── main.js              游戏入口（32行）
├── config.js            配置常量（42行）
├── entities/            游戏实体类
│   ├── Player.js        玩家角色（153行）
│   ├── Enemy.js         敌人类（142行）
│   └── AttackEffect.js  攻击效果（65行）
├── scenes/              Phaser 场景
│   ├── GameScene.js     游戏主场景（222行）
│   └── HUDScene.js      HUD 界面（148行）
├── systems/             游戏系统
│   └── EnemySpawner.js  敌人生成器（79行）
└── ui/                  [空目录] UI 组件（待开发）
```

## 文件清单

| 文件 | 类型 | 行数 | 说明 |
|------|------|------|------|
| main.js | 入口 | 32 | Phaser 游戏初始化和配置 |
| config.js | 配置 | 42 | 游戏常量定义 |
| entities/Player.js | 实体 | 153 | 玩家角色类 |
| entities/Enemy.js | 实体 | 142 | 敌人类 |
| entities/AttackEffect.js | 实体 | 65 | 攻击效果类 |
| scenes/GameScene.js | 场景 | 222 | 游戏主场景 |
| scenes/HUDScene.js | 场景 | 148 | HUD 界面场景 |
| systems/EnemySpawner.js | 系统 | 79 | 敌人生成器 |
| ui/ | 目录 | - | [空目录] UI 组件待开发 |

## 核心组件

### main.js - 游戏入口

**职责**：初始化 Phaser 游戏实例

**游戏配置**：
- 渲染器：`Phaser.AUTO`（自动选择 WebGL/Canvas）
- 分辨率：1280×720
- 物理引擎：Arcade（无重力）
- 背景色：`#1a1a2e`（深紫蓝）
- 场景：`[GameScene, HUDScene]`

```javascript
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
  scene: [GameScene, HUDScene]
}
```

---

### config.js - 配置常量

**职责**：定义游戏全局配置常量

**导出常量**：

| 常量 | 说明 |
|------|------|
| `WORLD` | 世界尺寸（2000×2000） |
| `PLAYER` | 玩家配置（速度、HP、ATK、攻击范围等） |
| `ENEMY` | 敌人配置（速度、HP、ATK、生成间隔等） |
| `COLORS` | 颜色配置（玩家、敌人、UI 等） |

**玩家配置值**：
- `SPEED`: 200 px/s
- `HP`: 100
- `ATK`: 10
- `ATTACK_RANGE`: 80 px
- `ATTACK_COOLDOWN`: 400 ms
- `SIZE`: 24 px
- `COLOR`: 0x64c8ff（淡蓝色）

**敌人配置值**：
- `SPEED`: 80 px/s
- `HP`: 30
- `ATK`: 10
- `SIZE`: 18 px
- `COLOR`: 0xff6464（红色）
- `SPAWN_INTERVAL`: 1500 ms
- `MAX_COUNT`: 100

---

### entities/Player.js - 玩家角色

**职责**：玩家角色的渲染、移动、攻击逻辑

**类继承**：`Phaser.GameObjects.Container`

**关键属性**：
- `hp`, `maxHp` - 生命值
- `atk` - 攻击力
- `speed` - 移动速度
- `attackCooldown` - 攻击冷却
- `isAttacking` - 攻击状态

**核心方法**：
| 方法 | 说明 |
|------|------|
| `createGraphics()` | 创建几何风格角色图形 |
| `update(time, delta)` | 每帧更新（移动、朝向、冷却） |
| `handleMovement()` | WASD 移动控制，支持斜向归一化 |
| `handleRotation()` | 角色朝向鼠标位置 |
| `canAttack()` | 检查是否可攻击 |
| `attack()` | 执行攻击 |
| `takeDamage(amount)` | 受伤处理（含闪烁效果） |
| `getAttackPosition()` | 获取攻击判定位置 |

**视觉表现**：
- 主体：淡蓝色圆形（几何风格）
- 方向指示：白色三角形
- 核心：白色光点

---

### entities/Enemy.js - 敌人类

**职责**：敌人的渲染、AI 追踪、受伤处理

**类继承**：`Phaser.GameObjects.Container`

**关键属性**：
- `hp`, `maxHp` - 生命值
- `atk` - 攻击力
- `speed` - 移动速度
- `target` - 追踪目标（玩家）
- `isActive` - 激活状态

**核心方法**：
| 方法 | 说明 |
|------|------|
| `drawEnemy()` | 绘制六边形敌人（几何风格） |
| `setTarget(target)` | 设置追踪目标 |
| `update(time, delta)` | AI 追踪逻辑 |
| `takeDamage(amount)` | 受伤处理 |
| `die()` | 死亡效果（缩放淡出） |
| `reset(x, y)` | 对象池复用重置 |

**视觉表现**：
- 主体：红色六边形
- 核心：深红色圆形

---

### entities/AttackEffect.js - 攻击效果

**职责**：挥剑攻击的视觉效果

**类继承**：`Phaser.GameObjects.Container`

**特点**：
- 90° 扇形攻击弧线
- 双层弧线（外白内青）
- 150ms 自动销毁
- 淡出动画

---

### scenes/GameScene.js - 游戏主场景

**职责**：游戏主逻辑场景

**场景键**：`GameScene`

**关键属性**：
- `player` - 玩家实例
- `enemySpawner` - 敌人生成器
- `attackEffects` - 攻击效果组
- `killCount` - 击杀数
- `gameOver` - 游戏结束标志
- `damageCooldown` - 伤害冷却

**核心方法**：
| 方法 | 说明 |
|------|------|
| `create()` | 场景初始化（世界、玩家、敌人、碰撞） |
| `createBackground()` | 创建网格背景（100px 间隔） |
| `setupCollisions()` | 设置敌人与玩家碰撞检测 |
| `setupAttackInput()` | 设置鼠标点击攻击 |
| `performAttack()` | 执行攻击逻辑 |
| `checkAttackHits(pos)` | 扇形范围攻击判定 |
| `update(time, delta)` | 游戏循环更新 |
| `onGameOver()` | 游戏结束处理 |

**游戏循环**：
1. 更新伤害冷却
2. 更新玩家（移动、朝向）
3. 更新敌人生成器（生成、追踪）

**攻击判定**：
- 90° 扇形范围
- 基于距离 + 角度的双重判定

---

### scenes/HUDScene.js - HUD 界面

**职责**：游戏 UI 叠加层

**场景键**：`HUDScene`

**UI 元素**：
- HP 血条（带颜色变化：绿→黄→红）
- 击杀计数（带缩放动画）
- 调试信息（FPS、敌人数量）

**核心方法**：
| 方法 | 说明 |
|------|------|
| `createHpBar()` | 创建血条（圆角矩形） |
| `drawHpBar(percent)` | 根据血量绘制并变色 |
| `updateHpBar(hp, maxHp)` | 响应血量更新事件 |
| `createKillCounter()` | 创建击杀计数 |
| `updateKillCount(count)` | 响应击杀更新事件 |
| `createDebugInfo()` | 创建调试面板 |

**事件监听**：
- `playerHpUpdated` - 血量更新
- `killCountUpdated` - 击杀更新

---

### systems/EnemySpawner.js - 敌人生成器

**职责**：敌人的定时生成和对象池管理

**关键属性**：
- `enemies` - 敌人 Group（含对象池）
- `spawnTimer` - 生成计时器
- `spawnInterval` - 生成间隔（1500ms）
- `maxEnemies` - 最大数量（100）

**核心方法**：
| 方法 | 说明 |
|------|------|
| `update(time, delta)` | 计时器更新 |
| `trySpawn()` | 尝试生成敌人（含对象池复用） |
| `getSpawnPosition()` | 计算生成位置（玩家周围 400-600px） |
| `getActiveEnemies()` | 获取活跃敌人列表 |
| `getGroup()` | 获取敌人 Group（用于碰撞检测） |

**生成策略**：
- 在玩家周围 400-600px 距离生成
- 限制在世界边界内
- 对象池复用已死亡敌人

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        main.js                               │
│                    (Phaser.Game 初始化)                       │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│      GameScene          │    │       HUDScene          │
│  ┌───────────────────┐  │    │  ┌───────────────────┐  │
│  │ Player            │  │    │  │ HP Bar            │  │
│  │ AttackEffect      │◄─┼────┼──│ Kill Counter      │  │
│  │ EnemySpawner      │  │    │  │ Debug Info        │  │
│  │   └─ Enemy[]      │  │    │  └───────────────────┘  │
│  └───────────────────┘  │    │                         │
└─────────────────────────┘    └─────────────────────────┘
              │
              ▼
┌─────────────────────────┐
│       config.js         │
│  WORLD | PLAYER | ENEMY │
│        COLORS           │
└─────────────────────────┘
```

## 依赖关系

**外部依赖**：
- `phaser` ^3.80.1

**内部依赖**：
- `main.js` → `scenes/GameScene.js`, `scenes/HUDScene.js`
- `scenes/GameScene.js` → `config.js`, `entities/*`, `systems/EnemySpawner.js`
- `scenes/HUDScene.js` → `config.js`
- `entities/*` → `config.js`
- `systems/EnemySpawner.js` → `config.js`, `entities/Enemy.js`

**被依赖**：
- 被根目录 `index.html` 通过 `<script type="module">` 引用

## 技术要点

1. **模块化设计**：ES6 模块，职责清晰
2. **对象池模式**：`EnemySpawner` 复用已死亡敌人
3. **场景分离**：游戏逻辑与 UI 分离（GameScene + HUDScene）
4. **事件驱动**：通过 Phaser 事件系统通信
5. **几何渲染**：使用 Graphics API 绘制简约风格角色

## 待开发模块

1. **ui/** - UI 组件目录（空）
   - 主菜单
   - 暂停界面
   - 强化选择界面

2. **待添加系统**：
   - 技能系统
   - Roguelike 强化系统
   - 波次系统
   - 连击系统

## 注意事项

1. 当前为技术原型阶段，仅实现基础战斗
2. 所有配置值集中在 `config.js`，便于调整
3. 敌人 AI 仅实现简单追踪，待扩展
4. UI 目录预留但尚未实现
