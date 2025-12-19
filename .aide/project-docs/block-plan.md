# 区块计划

> 最后更新：2025-12-20（v2更新：新增多种普攻系统）

## 项目概况

- **项目名称**：御剑无双 (Sword Immortal)
- **主要语言**：JavaScript (Phaser 3) + Markdown（设计文档）
- **项目类型**：浏览器无双割草游戏 + Aide 工作流
- **文件总数**：74（非 node_modules）[+21]
- **空目录数**：1（src/ui）
- **代码行数**：约 7600 行 [+2750]

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
│   ├── logs/                历史归档（6文件）
│   ├── task-plans/          任务计划（5文件）
│   └── project-docs/        项目文档（本目录）
├── .github/                 GitHub 配置 [新增]
│   └── workflows/
│       └── deploy.yml       CI/CD 自动部署
├── docs/                    游戏设计文档 (GDD)
│   ├── gdd-index.md         GDD 索引
│   └── gdd-chapter1~8.md    8个章节
├── src/                     源代码目录
│   ├── main.js              游戏入口
│   ├── config.js            配置常量
│   ├── assets/              游戏素材 [新增]
│   │   ├── skills/          技能图标（4个SVG）
│   │   └── sprites/         角色精灵（7个SVG）
│   ├── attacks/             普攻实现 [新增]
│   │   ├── AttackBase.js    普攻基类
│   │   ├── SlashAttack.js   挥砍普攻
│   │   ├── ArrowAttack.js   射箭普攻
│   │   ├── OrbAttack.js     法球普攻
│   │   ├── LightningAttack.js 闪电链普攻
│   │   ├── WaveAttack.js    冲击波普攻
│   │   └── SummonAttack.js  召唤物普攻
│   ├── entities/            游戏实体类
│   │   ├── Player.js        玩家角色
│   │   ├── Enemy.js         敌人类
│   │   └── AttackEffect.js  攻击效果
│   ├── scenes/              Phaser 场景
│   │   ├── MainMenuScene.js 主菜单场景
│   │   ├── GameScene.js     游戏主场景
│   │   ├── HUDScene.js      HUD 界面
│   │   ├── BuffSelectionScene.js 强化选择场景
│   │   ├── AttackSelectScene.js  普攻选择场景 [新增]
│   │   └── TestScene.js     测试场景 [新增]
│   ├── systems/             游戏系统
│   │   ├── EnemySpawner.js  敌人生成器
│   │   ├── ComboSystem.js   连击系统
│   │   ├── DamageSystem.js  伤害系统
│   │   ├── SkillManager.js  技能管理器
│   │   ├── RoguelikeSystem.js Roguelike 系统
│   │   ├── WaveManager.js   波次管理器
│   │   ├── VFXManager.js    视觉效果管理器
│   │   ├── AudioManager.js  音效管理器
│   │   └── AttackManager.js 普攻管理器 [新增]
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
- **文件数**：27（含 project-docs 自引用）
- **空目录**：0
- **状态**：✅ 已完成（2025-12-20 v2 更新）
- **文档**：[03-aide.md](./blocks/03-aide.md)
- **包含内容**：
  - `config.toml` - Aide 核心配置
  - `flow-status.json` - 任务进度状态
  - `branches.*` - 分支管理信息
  - `pending-items.json` - 待定项数据
  - `decisions/` - 决策记录（2文件）
  - `diagrams/` - 流程图（6文件）
  - `logs/` - 历史归档（6文件）
  - `task-plans/` - 任务计划（5文件）
  - `project-docs/` - 项目文档（自引用）

### 区块 4：src 源码目录

- **路径**：`src/`
- **文件数**：39（+21）
- **空目录**：1（ui/）
- **状态**：✅ 已完成（2025-12-20 v2 更新）
- **文档**：[04-src.md](./blocks/04-src.md)
- **包含内容**：
  - `main.js` - 游戏入口（34行）
  - `config.js` - 配置常量（292行）
  - `assets/` - 游戏素材（11个SVG）[新增]
  - `attacks/` - 普攻系统（7文件，1817行）[新增]
  - `entities/` - 游戏实体类（3文件，360行）
  - `scenes/` - Phaser 场景（6文件，2422行）[+2]
  - `systems/` - 游戏系统（9文件，2382行）[+1]
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
| 总目录数 | 20（含 1 个空目录）|
| 总文件数 | 74（非 node_modules）|
| 被忽略项 | 2（node_modules/, dist/）|
| JavaScript 代码 | 约 7600 行 |
| 文档行数 | 约 2500 行 |

## 变更记录

| 日期 | 区块 | 变更内容 |
|------|------|----------|
| 2025-12-20 | src | **v2 更新**：新增 assets/ 目录（11个SVG）、attacks/ 目录（7个攻击类）、AttackSelectScene、TestScene、AttackManager |
| 2025-12-20 | aide | logs/ 目录新增 6 个历史任务归档文件 |
| 2025-12-20 | src | 新增 10 个文件：MainMenuScene、BuffSelectionScene、ComboSystem、DamageSystem、SkillManager、RoguelikeSystem、WaveManager、VFXManager、AudioManager、BuffData |
| 2025-12-20 | src | 更新 3 个文件：main.js、GameScene.js、HUDScene.js |
| 2025-12-20 | src | 新增 data/ 目录 |
