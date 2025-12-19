# 区块计划

> 最后更新：2025-12-19

## 项目概况

- **项目名称**：御剑无双 (Sword Immortal)
- **主要语言**：Markdown（设计文档）+ TOML/JSON（配置）
- **项目类型**：游戏设计文档项目 + Aide 工作流
- **文件总数**：31
- **空目录数**：1（.aide/logs）
- **文档行数**：约 2200 行

## 完整目录树

```
t1/
├── .aide/                   Aide 工作流数据目录
│   ├── config.toml          核心配置
│   ├── flow-status.json     任务进度
│   ├── branches.*           分支信息
│   ├── pending-items.json   待定项
│   ├── decisions/           决策记录
│   ├── diagrams/            流程图
│   ├── logs/                [空目录] 历史归档
│   ├── task-plans/          任务计划（5文件）
│   └── project-docs/        项目文档（本目录）
├── docs/                    游戏设计文档 (GDD)
│   ├── gdd-chapter1.md      第1章：游戏概念
│   ├── gdd-chapter2.md      第2章：世界观
│   ├── gdd-chapter3.md      第3章：核心玩法
│   ├── gdd-chapter4.md      第4章：角色系统
│   ├── gdd-chapter5.md      第5章：敌人系统
│   ├── gdd-chapter6.md      第6章：Roguelike系统
│   ├── gdd-chapter7.md      第7章：无尽模式
│   ├── gdd-chapter8.md      第8章：UI/UX设计
│   └── gdd-index.md         GDD 索引
├── .gitignore               Git 忽略配置（空文件）
├── CHANGELOG.md             变更日志
├── README.md                项目说明
└── task-now.md              当前任务
```

## 区块划分

### 区块 1：项目根目录

- **路径**：`./`（根目录文件）
- **文件数**：4
- **空目录**：0
- **状态**：✅ 已完成
- **文档**：[01-root.md](./blocks/01-root.md)
- **包含文件**：
  - `README.md` - 项目说明
  - `CHANGELOG.md` - 变更日志
  - `task-now.md` - 当前任务
  - `.gitignore` - Git 忽略配置（空文件）

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
- **文件数**：18（含 project-docs 自引用）
- **空目录**：1（logs/）
- **状态**：✅ 已完成
- **文档**：[03-aide.md](./blocks/03-aide.md)
- **包含内容**：
  - `config.toml` - Aide 核心配置
  - `flow-status.json` - 任务进度状态
  - `branches.*` - 分支管理信息
  - `pending-items.json` - 待定项数据
  - `decisions/` - 决策记录（2文件）
  - `diagrams/` - 流程图（2文件）
  - `logs/` - [空目录] 历史归档
  - `task-plans/` - 任务计划（5文件）
  - `project-docs/` - 项目文档（自引用）

## 进度追踪

- [x] 区块 1：项目根目录 ✅
- [x] 区块 2：docs 文档目录 ✅
- [x] 区块 3：.aide 工作流目录 ✅

## 统计信息

| 项目 | 数量 |
|------|------|
| 区块总数 | 3 |
| 总目录数 | 8（含 1 个空目录）|
| 总文件数 | 31 |
| 被忽略项 | 0 |
| 文档行数 | 约 2200 行 |
