# 区块计划

> 最后更新：2025-12-20

## 项目概况

- **项目名称**：御剑无双 (Sword Immortal)
- **主要语言**：JavaScript (Phaser 3) + Markdown（设计文档）
- **项目类型**：浏览器无双割草游戏 + Aide 工作流
- **文件总数**：53（非 node_modules）
- **空目录数**：2（.aide/logs、src/ui）
- **代码行数**：约 5100 行

## 完整目录树

```
t1/
├── .aide/                   Aide 工作流数据目录
│   ├── config.toml          核心配置
│   ├── flow-status.json     任务进度
│   ├── branches.*           分支信息
│   ├── pending-items.json   待定项
│   ├── decisions/           决策记录
│   ├── diagrams/            流程图（6文件）
│   ├── logs/                [空目录] 历史归档
│   ├── task-plans/          任务计划（5文件）
│   └── project-docs/        项目文档（本目录）
├── docs/                    游戏设计文档 (GDD)
│   ├── gdd-index.md         GDD 索引
│   └── gdd-chapter1~8.md    8个章节
├── src/                     源代码目录
│   ├── main.js              游戏入口
│   ├── config.js            配置常量
│   ├── entities/            游戏实体类
│   │   ├── Player.js        玩家角色
│   │   ├── Enemy.js         敌人类
│   │   └── AttackEffect.js  攻击效果
│   ├── scenes/              Phaser 场景
│   │   ├── MainMenuScene.js 主菜单场景
│   │   ├── GameScene.js     游戏主场景
│   │   ├── HUDScene.js      HUD 界面
│   │   └── BuffSelectionScene.js 强化选择场景
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
├── index.html               HTML 入口
├── package.json             npm 配置
├── vite.config.js           Vite 构建配置
├── .gitignore               Git 忽略配置
├── CHANGELOG.md             变更日志
├── README.md                项目说明
└── task-now.md              当前任务
```

## 区块划分

### 区块 1：项目根目录

- **路径**：`./`（根目录文件）
- **文件数**：7
- **空目录**：0
- **状态**：✅ 已完成
- **文档**：[01-root.md](./blocks/01-root.md)
- **包含文件**：
  - `README.md` - 项目说明
  - `CHANGELOG.md` - 变更日志
  - `task-now.md` - 当前任务
  - `index.html` - HTML 入口页面
  - `package.json` - npm 配置
  - `vite.config.js` - Vite 构建配置
  - `.gitignore` - Git 忽略配置

### 区块 2：docs 文档目录

- **路径**：`docs/`
- **文件数**：9
- **空目录**：0
- **状态**：✅ 已完成
- **文档**：[02-docs.md](./blocks/02-docs.md)
- **包含文件**：
  - `gdd-index.md` - GDD 索引
  - `gdd-chapter1.md` ~ `gdd-chapter8.md` - 8个章节

### 区块 3：.aide 工作流目录

- **路径**：`.aide/`
- **文件数**：21（含 project-docs 自引用）
- **空目录**：1（logs/）
- **状态**：✅ 已完成
- **文档**：[03-aide.md](./blocks/03-aide.md)
- **包含内容**：
  - `config.toml` - Aide 核心配置
  - `flow-status.json` - 任务进度状态
  - `branches.*` - 分支管理信息
  - `pending-items.json` - 待定项数据
  - `decisions/` - 决策记录（2文件）
  - `diagrams/` - 流程图（6文件）
  - `logs/` - [空目录] 历史归档
  - `task-plans/` - 任务计划（5文件）
  - `project-docs/` - 项目文档（自引用）

### 区块 4：src 源码目录

- **路径**：`src/`
- **文件数**：18
- **空目录**：1（ui/）
- **状态**：✅ 已完成（2025-12-20 更新）
- **文档**：[04-src.md](./blocks/04-src.md)
- **包含内容**：
  - `main.js` - 游戏入口（34行）
  - `config.js` - 配置常量（213行）
  - `entities/` - 游戏实体类（3文件，360行）
  - `scenes/` - Phaser 场景（4文件，1610行）
  - `systems/` - 游戏系统（8文件，2235行）
  - `data/` - 游戏数据（1文件，315行）
  - `ui/` - [空目录] UI 组件（待开发）

## 进度追踪

- [x] 区块 1：项目根目录 ✅
- [x] 区块 2：docs 文档目录 ✅
- [x] 区块 3：.aide 工作流目录 ✅
- [x] 区块 4：src 源码目录 ✅（2025-12-20 更新）

## 统计信息

| 项目 | 数量 |
|------|------|
| 区块总数 | 4 |
| 总目录数 | 14（含 2 个空目录）|
| 总文件数 | 53（非 node_modules）|
| 被忽略项 | 2（node_modules/, dist/）|
| JavaScript 代码 | 约 4850 行 |
| 文档行数 | 约 2200 行 |

## 变更记录

| 日期 | 区块 | 变更内容 |
|------|------|----------|
| 2025-12-20 | src | 新增 10 个文件：MainMenuScene、BuffSelectionScene、ComboSystem、DamageSystem、SkillManager、RoguelikeSystem、WaveManager、VFXManager、AudioManager、BuffData |
| 2025-12-20 | src | 更新 3 个文件：main.js、GameScene.js、HUDScene.js |
| 2025-12-20 | src | 新增 data/ 目录 |
