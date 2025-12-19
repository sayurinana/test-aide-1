# 区块1：项目根目录

> 路径：`./`（根目录文件）
> 最后更新：2025-12-20（v4更新：同步 v1.1.0-alpha.3）

## 概述

项目根目录包含项目的核心说明文件和构建配置，定义了项目的基本信息、开发状态、版本历史和开发环境配置。

## 目录结构

```
./
├── .claude/                 Claude 配置目录 [新增]
│   └── settings.local.json  本地设置
├── .github/                 GitHub 配置
│   └── workflows/
│       └── deploy.yml       CI/CD 自动部署
├── public/                  公共静态资源 [新增]
│   └── assets/sprites/      角色精灵（7个SVG）
├── .gitignore               Git 忽略配置
├── CHANGELOG.md             变更日志
├── README.md                项目说明
├── task-now.md              当前任务
├── index.html               HTML 入口页面
├── package.json             npm 配置
├── package-lock.json        npm 依赖锁定 [新增]
└── vite.config.js           Vite 构建配置
```

## 文件清单

| 文件 | 类型 | 行数 | 说明 |
|------|------|------|------|
| README.md | 文档 | 95 | 项目主说明文件 |
| CHANGELOG.md | 文档 | 190+ | 版本变更记录 |
| task-now.md | 文档 | 1 | 原始任务描述 |
| index.html | 入口 | 32 | HTML 入口页面 |
| package.json | 配置 | 26 | npm 项目配置 |
| package-lock.json | 配置 | 961 | npm 依赖锁定 [新增] |
| vite.config.js | 配置 | 16 | Vite 构建配置 |
| .gitignore | 配置 | 24 | Git 忽略规则 |
| .github/workflows/deploy.yml | 配置 | 54 | GitHub Actions 部署工作流 |
| .claude/settings.local.json | 配置 | 3 | Claude Code 本地设置 [新增] |
| public/assets/sprites/*.svg | 资源 | - | 7个角色精灵 SVG [新增] |

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

**开发状态**：v1.0.0 完整版本已发布

---

### CHANGELOG.md - 版本历史

**当前版本**：v1.1.0-alpha.3 (2025-12-20)

**已发布版本**：

| 版本 | 日期 | 主要内容 |
|------|------|----------|
| v1.1.0-alpha.3 | 2025-12-20 | Bug 修复（敌人生成/测试模式/画面模糊）|
| v1.1.0-alpha.2 | 2025-12-20 | Bug 修复（主菜单/测试场景/角色显示）|
| v1.1.0-alpha.1 | 2025-12-20 | 多种普攻系统 |
| v1.0.2 | 2025-12-20 | 自动攻击 + SVG 美化 |
| v1.0.1 | 2025-12-20 | CI/CD 自动部署 |
| v1.0.0 | 2025-12-20 | 完整可玩版本 |
| v0.3.0 | 2025-12-20 | 核心系统完成 |
| v0.2.0 | 2025-12-19 | 技术原型完成 |
| v0.1.0 | 2025-12-19 | GDD 设计文档完成 |

**v1.1.0-alpha.3 修复内容**：
- 敌人生成停止：升级队列与波次强化选择冲突
- 测试模式失效：覆盖场景阻止输入
- 画面模糊：移除已弃用的 resolution 属性

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
| `base` | 动态 | 本地: `'./'`, GitHub Pages: `'/<repo>/'` |
| `server.port` | 3000 | 开发服务器端口 |
| `server.open` | true | 自动打开浏览器 |
| `build.outDir` | `'dist'` | 构建输出目录 |
| `build.assetsDir` | `'assets'` | 静态资源目录 |

**动态 base 路径**：
- 通过 `GITHUB_ACTIONS` 和 `GITHUB_REPOSITORY` 环境变量自动检测
- 本地开发使用相对路径 `./`
- GitHub Pages 部署自动设置为 `/<repo-name>/`

---

### .github/workflows/deploy.yml - CI/CD 配置

**触发条件**：
- push 到 `main` 或 `master` 分支
- 支持手动触发 (workflow_dispatch)

**工作流程**：
1. **Build 作业**：
   - 检出代码
   - 设置 Node.js 20
   - 安装依赖 (npm ci)
   - 构建项目 (npm run build)
   - 上传构建产物到 Pages

2. **Deploy 作业**：
   - 等待 Build 完成
   - 部署到 GitHub Pages

**权限要求**：
- `contents: read`
- `pages: write`
- `id-token: write`

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

---

### .claude/settings.local.json - Claude 配置 [新增]

**职责**：Claude Code CLI 工具的本地配置

**配置内容**：
- `spinnerTipsEnabled: false` - 禁用加载提示

**说明**：此文件用于配置 Claude Code 命令行工具的本地行为，不同于项目根目录的 CLAUDE.md 指令文件。

---

### public/assets/sprites/ - 公共精灵资源 [新增]

**职责**：存放用于生产环境的角色 SVG 精灵

**文件清单**：
| 文件 | 大小 | 说明 |
|------|------|------|
| player.svg | 1.2KB | 玩家角色精灵 |
| boss.svg | 1.8KB | Boss 精灵 |
| elite.svg | 1.2KB | 精英怪精灵 |
| wolf.svg | 0.9KB | 狼人精灵 |
| snake.svg | 1.0KB | 毒蛇精灵 |
| shadow.svg | 0.8KB | 幽灵精灵 |
| wraith.svg | 1.1KB | 灵魂精灵 |

**说明**：与 `src/assets/sprites/` 内容相同，但 `public/` 目录下的文件会被 Vite 原样复制到构建输出，适用于需要运行时直接访问的场景。

---

### package-lock.json - npm 依赖锁定 [新增]

**职责**：锁定项目依赖的精确版本

**行数**：961 行

**说明**：由 `npm install` 自动生成和更新，记录所有直接和间接依赖的精确版本，确保在不同环境下安装相同的依赖版本。

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

1. 项目 v1.0.0 已发布，完整可玩
2. 使用 ES 模块（`type: module`）
3. 开发服务器会自动打开浏览器
4. 构建输出到 dist/ 目录（被 git 忽略）
5. 推送代码会自动触发 GitHub Actions 部署
6. 首次部署需在 GitHub Pages 设置中选择 "GitHub Actions" 作为 Source
7. 许可证：MIT
