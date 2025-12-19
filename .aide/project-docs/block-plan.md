# 区块计划

> 最后更新：2025-12-19

## 项目概况

- **项目名称**：御剑无双 (Sword Immortal)
- **主要语言**：Markdown（设计文档）
- **项目类型**：游戏设计文档项目
- **文件总数**：27（含 14 被忽略）
- **空目录数**：1
- **文档行数**：约 3853 行

## 完整目录树

```
t1/
├── .aide/                   [ignored] Aide 工作流数据
├── docs/                    游戏设计文档 (GDD)
│   ├── gdd-chapter1.md      第1章
│   ├── gdd-chapter2.md      第2章
│   ├── gdd-chapter3.md      第3章
│   ├── gdd-chapter4.md      第4章
│   ├── gdd-chapter5.md      第5章
│   ├── gdd-chapter6.md      第6章
│   ├── gdd-chapter7.md      第7章
│   ├── gdd-chapter8.md      第8章
│   └── gdd-index.md         GDD 索引
├── .gitignore               Git 忽略配置
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

### 被忽略项

- **路径**：`.aide/`
- **说明**：Aide 工作流数据目录（由 .gitignore 忽略）
- **内部结构**：
  - `config.toml` - 配置文件
  - `flow-status.json` - 任务进度
  - `branches.json/md` - 分支信息
  - `decisions/` - 决策记录
  - `diagrams/` - 流程图
  - `logs/` - [空目录] 日志
  - `task-plans/` - 任务计划
  - `project-docs/` - 本项目文档

## 进度追踪

- [x] 区块 1：项目根目录 ✅
- [x] 区块 2：docs 文档目录 ✅

## 统计信息

| 项目 | 数量 |
|------|------|
| 区块总数 | 2 |
| 总目录数 | 7（含 1 个空目录）|
| 总文件数 | 27 |
| 被忽略项 | 14 文件 |
| 文档行数 | 约 3853 行 |
