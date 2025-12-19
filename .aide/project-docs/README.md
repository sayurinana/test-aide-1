# 《御剑无双》项目导览

> 本文档面向 LLM，用于快速了解项目结构和脉络。
> 最后更新：2025-12-20

## 项目简介

《御剑无双》(Sword Immortal) 是一款在浏览器中直接游玩的无双割草游戏。以简约的几何美术风格承载东方仙侠的意境，结合 Roguelike 随机强化系统和无尽生存模式，带来独特的战斗体验。

**核心卖点**：
- 独特视觉：简约几何与仙侠元素的创新融合
- 爽快战斗：大量敌人 + 华丽技能 + 连击系统
- 高可重玩：Roguelike 随机强化，每局不同体验
- 即开即玩：浏览器直接运行，无需下载

## 技术栈

- **游戏框架**：Phaser 3 (v3.80.1)
- **构建工具**：Vite (v5.4.11)
- **开发语言**：JavaScript (ES6+)
- **版本控制**：Git
- **工作流工具**：Aide

## 项目结构

```
t1/
├── .aide/                   Aide 工作流数据目录
│   ├── config.toml          核心配置
│   ├── flow-status.json     任务进度
│   ├── decisions/           决策记录
│   ├── diagrams/            流程图（6文件）
│   ├── logs/                [空目录] 历史归档
│   ├── task-plans/          任务计划（5个子计划）
│   └── project-docs/        项目文档（本目录）
├── docs/                    游戏设计文档 (GDD)
│   ├── gdd-index.md         GDD 总索引
│   └── gdd-chapter1~8.md    8个章节
├── src/                     源代码目录
│   ├── main.js              游戏入口
│   ├── config.js            配置常量（含技能、敌人类型）
│   ├── entities/            游戏实体
│   │   ├── Player.js        玩家角色
│   │   ├── Enemy.js         敌人类
│   │   └── AttackEffect.js  攻击效果
│   ├── scenes/              Phaser 场景
│   │   ├── MainMenuScene.js 主菜单场景
│   │   ├── GameScene.js     游戏主场景
│   │   ├── HUDScene.js      HUD 界面
│   │   └── BuffSelectionScene.js 强化选择
│   ├── systems/             游戏系统
│   │   ├── EnemySpawner.js  敌人生成器
│   │   ├── ComboSystem.js   连击系统
│   │   ├── DamageSystem.js  伤害系统
│   │   ├── SkillManager.js  技能管理器
│   │   ├── RoguelikeSystem.js Roguelike 系统
│   │   ├── WaveManager.js   波次管理器
│   │   ├── VFXManager.js    视觉效果管理器
│   │   └── AudioManager.js  音效管理器
│   ├── data/                游戏数据
│   │   └── BuffData.js      强化道具数据
│   └── ui/                  [空目录] UI 组件
├── dist/                    [ignored] 构建输出
├── node_modules/            [ignored] npm 依赖
├── index.html               HTML 入口页面
├── package.json             npm 配置
├── vite.config.js           Vite 构建配置
├── .gitignore               Git 忽略配置
├── CHANGELOG.md             变更日志
├── README.md                项目说明
└── task-now.md              原始任务描述
```

> 详细结构见各区块文档

## 架构概述

```
┌─────────────────────────────────────────────────────────────┐
│                    《御剑无双》架构                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   主界面    │ ──→│   战斗场景  │ ──→│   结算界面  │     │
│  └─────────────┘    └──────┬──────┘    └─────────────┘     │
│                            │                                │
│                    ┌───────┴───────┐                        │
│                    │               │                        │
│              ┌─────┴─────┐   ┌─────┴─────┐                  │
│              │ 强化选择  │   │   暂停    │                  │
│              └───────────┘   └───────────┘                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  核心循环：                                                  │
│  战斗 → 击杀敌人 → 波次结束 → 选择强化 → 下一波次           │
│                                          ↓                  │
│                                  角色死亡 → 结算            │
└─────────────────────────────────────────────────────────────┘
```

## 代码架构

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

## 区块索引

| 区块 | 路径 | 文件数 | 说明 |
|------|------|--------|------|
| [项目根目录](./blocks/01-root.md) | `./` | 7 | 项目配置、说明、变更日志 |
| [docs 文档目录](./blocks/02-docs.md) | `docs/` | 9 | 游戏设计文档 (GDD) 完整 8 章 |
| [.aide 工作流目录](./blocks/03-aide.md) | `.aide/` | 21 | Aide 配置、进度、决策、计划 |
| [src 源码目录](./blocks/04-src.md) | `src/` | 18 | 游戏源代码（完整实现） |

## 快速导航

### 想了解项目概况
- 查看 [项目根目录](./blocks/01-root.md) → README.md 和 CHANGELOG.md

### 想了解游戏设计
- 查看 [docs 文档目录](./blocks/02-docs.md)
- 游戏概念和核心循环 → gdd-chapter1.md
- 世界观和视觉风格 → gdd-chapter2.md
- 操作和技能设计 → gdd-chapter3.md

### 想了解系统设计
- 角色属性和成长 → gdd-chapter4.md
- 敌人类型和 AI → gdd-chapter5.md
- Roguelike 强化系统 → gdd-chapter6.md
- 无尽模式和评分 → gdd-chapter7.md
- UI/UX 界面设计 → gdd-chapter8.md

### 想了解源代码
- 查看 [src 源码目录](./blocks/04-src.md)
- 游戏入口 → src/main.js
- 配置常量 → src/config.js
- 玩家角色 → src/entities/Player.js
- 游戏场景 → src/scenes/GameScene.js
- 技能系统 → src/systems/SkillManager.js
- Roguelike 系统 → src/systems/RoguelikeSystem.js
- 波次系统 → src/systems/WaveManager.js
- 强化数据 → src/data/BuffData.js

### 想了解工作流状态
- 查看 [.aide 工作流目录](./blocks/03-aide.md)
- 当前任务进度 → flow-status.json
- 任务计划 → task-plans/
- 用户决策记录 → decisions/

### 想开始开发
```bash
# 安装依赖
npm install

# 开发模式（自动打开浏览器）
npm run dev

# 构建生产版本
npm run build
```

## 游戏系统摘要

### 角色系统
- **6 基础属性**：HP(100)、ATK(10)、DEF(5)、SPD(200)、CRIT(5%)、CRITDMG(150%)
- **5 隐藏属性**：攻击速度、攻击范围、冷却缩减、生命恢复、吸血
- **5 技能**：剑气横扫、瞬步斩、护体真气、剑域、御风步

### 敌人系统
- **4 小怪**：飘影(追踪)、妖狼(冲锋)、蛇妖(远程)、怨魂(分裂)
- **1 精英**：邪修（3技能）
- **1 Boss**：妖将（双阶段）

### Roguelike 系统
- **4 级稀有度**：普通(60%)/稀有(25%)/史诗(12%)/传说(3%)
- **4 类强化**：属性/技能/特效/生存
- **20+ 强化道具**
- **5 种 Build 方向**：暴击流、攻速流、范围流、生存流、技能流

### 无尽模式
- **4 种波次**：普通/精英(每3波)/Boss(每5波)/狂潮(每10波)
- **难度递增**：敌人数量、属性、类型随波次提升
- **里程碑奖励**：波次 5/10/15/20/25/30/50 有特殊奖励
- **评分系统**：击杀数 × 连击系数 × 效率系数 × 难度系数

## 当前实现状态

### 已实现（v1.0.0 完整游戏）

| 模块 | 状态 | 位置 |
|------|------|------|
| 游戏框架初始化 | ✅ | main.js |
| 主菜单界面 | ✅ | MainMenuScene.js |
| 世界边界和相机 | ✅ | GameScene.js |
| 玩家移动（WASD） | ✅ | Player.js |
| 玩家朝向（鼠标） | ✅ | Player.js |
| 基础攻击（点击） | ✅ | Player.js, AttackEffect.js |
| 扇形攻击判定 | ✅ | GameScene.js |
| 4 个技能（Q/E/R/Space） | ✅ | SkillManager.js |
| 连击系统 | ✅ | ComboSystem.js |
| 伤害系统（暴击、击退） | ✅ | DamageSystem.js |
| 敌人生成器 | ✅ | EnemySpawner.js |
| 敌人追踪 AI | ✅ | Enemy.js |
| 敌人对象池 | ✅ | EnemySpawner.js |
| 6 种敌人类型 | ✅ | config.js, Enemy.js |
| 波次系统 | ✅ | WaveManager.js |
| Roguelike 强化系统 | ✅ | RoguelikeSystem.js |
| 26 个强化道具 | ✅ | BuffData.js |
| 强化选择界面 | ✅ | BuffSelectionScene.js |
| 完整 HUD 界面 | ✅ | HUDScene.js |
| 技能栏 UI | ✅ | HUDScene.js |
| 波次/连击显示 | ✅ | HUDScene.js |
| 暂停界面（ESC） | ✅ | HUDScene.js |
| 视觉效果系统 | ✅ | VFXManager.js |
| 程序化音效系统 | ✅ | AudioManager.js |
| 游戏结算界面 | ✅ | GameScene.js |
| 分数计算系统 | ✅ | GameScene.js |

### 待优化

| 模块 | 优先级 | 说明 |
|------|--------|------|
| UI 组件封装 | 低 | src/ui/ 目录待开发 |
| 更多敌人行为 | 低 | 远程、分裂等特殊行为 |
| 成就系统 | 低 | 可选功能 |

## Aide 工作流状态

**当前任务**：2025-12-19T22-20-36
- **当前环节**：docs（文档更新中）
- **当前步骤**：52
- **任务分支**：aide/001

**子计划进度**：
| 子计划 | 状态 |
|--------|------|
| 1. 前期设计 | ✅ 完成 |
| 2. 技术原型开发 | ✅ 完成 |
| 3. 核心系统实现 | ✅ 完成 |
| 4. 完善打磨 | ✅ 完成 |

## 统计信息

| 项目 | 数量 |
|------|------|
| 区块总数 | 4 |
| 总目录数 | 14（含 2 个空目录）|
| 总文件数 | 53（非 node_modules）|
| 被忽略项 | 2（node_modules/, dist/）|
| JavaScript 代码 | 约 4850 行 |
| 文档行数 | 约 2200 行 |

## 开发状态

**v1.0.0 已发布** - 完整可玩版本

| 阶段 | 状态 | 说明 |
|------|------|------|
| 前期设计 | ✅ 完成 | GDD 文档完整 |
| 技术原型 | ✅ 完成 | 基础战斗可运行 |
| 核心系统 | ✅ 完成 | 技能/波次/强化/音效 |
| 完善打磨 | ✅ 完成 | Bug 修复/性能优化 |
