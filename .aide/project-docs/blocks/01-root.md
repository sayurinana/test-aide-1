# 区块1：项目根目录

> 路径：`./`（根目录文件）
> 最后更新：2025-12-20

## 概述

项目根目录包含项目的核心说明文件和构建配置，定义了项目的基本信息、开发状态、版本历史和开发环境配置。

## 目录结构

```
./
├── .gitignore               Git 忽略配置
├── CHANGELOG.md             变更日志
├── README.md                项目说明
├── task-now.md              当前任务
├── index.html               HTML 入口页面
├── package.json             npm 配置
└── vite.config.js           Vite 构建配置
```

## 文件清单

| 文件 | 类型 | 行数 | 说明 |
|------|------|------|------|
| README.md | 文档 | 69 | 项目主说明文件 |
| CHANGELOG.md | 文档 | 70+ | 版本变更记录 |
| task-now.md | 文档 | 7 | 原始任务描述 |
| index.html | 入口 | 32 | HTML 入口页面 |
| package.json | 配置 | 26 | npm 项目配置 |
| vite.config.js | 配置 | 14 | Vite 构建配置 |
| .gitignore | 配置 | 24 | Git 忽略规则 |

## 核心内容

### README.md - 项目说明

**项目名称**：御剑无双 (Sword Immortal)

**项目定位**：
- 东方仙侠 × 简约几何 × 无双割草 × Roguelike
- 浏览器内直接游玩的无双割草游戏

**游戏特色**：
1. 独特视觉：简约几何与仙侠元素融合
2. 爽快战斗：大量敌人 + 华丽技能 + 连击系统
3. 高可重玩：Roguelike 随机强化
4. 即开即玩：浏览器直接运行

**技术栈**：
- 游戏框架：Phaser 3
- 构建工具：Vite
- 开发语言：JavaScript

**开发状态**：技术原型已完成，核心系统开发中

---

### CHANGELOG.md - 版本历史

**当前版本**：v0.2.0 (2025-12-19)

**已发布版本**：

| 版本 | 日期 | 主要内容 |
|------|------|----------|
| v0.2.0 | 2025-12-19 | 技术原型完成 |
| v0.1.0 | 2025-12-19 | GDD 设计文档完成 |

**v0.2.0 新增内容**：
- 项目初始化（Vite + Phaser 3）
- 游戏场景搭建（世界边界、相机系统）
- 玩家角色实现（移动、朝向、攻击）
- 敌人系统（生成器、追踪 AI、对象池）
- 碰撞检测（扇形攻击判定、敌人伤害）
- 基础 UI（HP 血条、击杀计数）

**计划版本**：
- v0.3.0：核心系统实现（技能、Roguelike、波次）
- v1.0.0：MVP 完整版本

---

### task-now.md - 原始任务

用户的原始任务描述：
> 做一个无双割草类型的游戏，浏览器中直接游玩，需要先完成前期设计

---

### index.html - HTML 入口

**职责**：游戏的 HTML 容器页面

**关键内容**：
- 语言设置：`zh-CN`
- 标题：御剑无双 - Sword Immortal
- 容器：`#game-container`（带边框和阴影）
- 入口脚本：`/src/main.js`（ES 模块）

**样式配置**：
- 背景色：`#1a1a2e`（深紫蓝）
- 布局：Flexbox 居中
- 容器边框：`2px solid #4a4a6a`
- 发光效果：`box-shadow: 0 0 20px rgba(100, 200, 255, 0.3)`

---

### package.json - npm 配置

**项目信息**：
- 名称：`sword-immortal`
- 版本：`0.1.0`
- 类型：ES Module

**脚本命令**：
| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式（热更新） |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |

**依赖项**：
| 包名 | 版本 | 用途 |
|------|------|------|
| `phaser` | ^3.80.1 | 游戏框架 |
| `vite` | ^5.4.11 | 构建工具（dev） |

---

### vite.config.js - Vite 配置

**配置项**：
| 配置 | 值 | 说明 |
|------|-----|------|
| `base` | `'./'` | 相对路径部署 |
| `server.port` | 3000 | 开发服务器端口 |
| `server.open` | true | 自动打开浏览器 |
| `build.outDir` | `'dist'` | 构建输出目录 |
| `build.assetsDir` | `'assets'` | 静态资源目录 |

---

### .gitignore - Git 忽略规则

**忽略项目**：
| 类别 | 规则 |
|------|------|
| 依赖 | `node_modules/` |
| 构建 | `dist/` |
| IDE | `.idea/`, `.vscode/`, `*.swp`, `*.swo` |
| 系统 | `.DS_Store`, `Thumbs.db` |
| 日志 | `*.log`, `npm-debug.log*` |
| 环境 | `.env`, `.env.local` |

## 依赖关系

- **依赖**：无
- **被依赖**：
  - docs（README 引用 GDD 文档）
  - src（index.html 引用 main.js）

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 注意事项

1. 项目已从设计阶段进入开发阶段
2. 使用 ES 模块（`type: module`）
3. 开发服务器会自动打开浏览器
4. 构建输出到 dist/ 目录（被 git 忽略）
5. 许可证：MIT
