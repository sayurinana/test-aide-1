# 区块3：.aide 工作流目录

> 路径：`.aide/`
> 最后更新：2025-12-20（v3更新）

## 概述

Aide 工作流体系的数据目录，存储项目配置、任务进度、决策记录、流程图、任务计划和项目文档。该目录由 `aide init` 命令创建，通过 `aide` 系列命令进行管理。

**重要**：此目录被 git 追踪（`general.gitignore_aide = false`），支持多设备同步 aide 状态。

## 目录结构

```
.aide/
├── config.toml              Aide 核心配置文件（232行）
├── flow-status.json         当前任务进度状态（320行）
├── branches.json            Git 分支管理信息（16行）
├── branches.md              分支信息可读版（11行）
├── pending-items.json       待定项数据（150行）
├── decisions/               决策记录目录
│   ├── 2025-12-19T22-22-40.json  已完成决策（256行）
│   └── pending.json              待决策项副本（235行）
├── diagrams/                流程图目录（6文件）
│   ├── spec-01-flow.puml    子计划1流程图源文件
│   ├── spec-01-flow.png     子计划1流程图图片
│   ├── spec-02-task-flow.puml    子计划2任务流程图
│   ├── spec-02-task-flow.png     子计划2任务流程图图片
│   ├── spec-02-game-logic.puml   游戏主循环逻辑图
│   └── spec-02-game-logic.png    游戏主循环逻辑图图片
├── logs/                    历史任务归档（7 文件）[+1]
│   ├── 2025-12-19T22-20-36-status.json
│   ├── 2025-12-20T02-16-28-status.json
│   ├── 2025-12-20T02-54-45-status.json
│   ├── 2025-12-20T03-35-52-status.json
│   ├── 2025-12-20T03-43-38-status.json
│   ├── 2025-12-20T04-33-28-status.json
│   └── 2025-12-20T06-41-56-status.json  [新增]
├── task-plans/              任务计划目录
│   ├── guide.md             任务计划总导览（53行）
│   ├── spec-01.md           子计划1：前期设计（66行）
│   ├── spec-02.md           子计划2：技术原型（58行）
│   ├── spec-03.md           子计划3：核心系统（75行）
│   └── spec-04.md           子计划4：完善打磨（70行）
└── project-docs/            项目文档目录（LLM 导向）
    ├── README.md            总导览
    ├── block-plan.md        区块计划
    └── blocks/              子区块文档
        ├── 01-root.md
        ├── 02-docs.md
        ├── 03-aide.md       (本文档)
        └── 04-src.md        源码区块文档
```

## 文件清单

| 文件 | 类型 | 行数 | 说明 |
|------|------|------|------|
| config.toml | 配置 | 232 | Aide 核心配置，含详细注释 |
| flow-status.json | 数据 | 320 | 当前任务进度和历史记录（40步） |
| branches.json | 数据 | 16 | Git 分支元信息 |
| branches.md | 文档 | 11 | 分支信息可读摘要 |
| pending-items.json | 数据 | 150 | 待定项问题和选项 |
| decisions/*.json | 数据 | - | 用户决策记录 |
| diagrams/*.puml | 源码 | - | PlantUML 流程图源文件（3个） |
| diagrams/*.png | 二进制 | - | 生成的流程图图片（3个） |
| task-plans/guide.md | 文档 | 53 | 任务计划总导览 |
| task-plans/spec-*.md | 文档 | - | 子计划细则文档（4个） |
| project-docs/* | 文档 | - | 面向 LLM 的项目文档 |
| logs/*.json | 数据 | - | 历史任务归档（7 个文件）|

## 核心组件

### config.toml - Aide 配置文件

**职责**：定义 Aide 工作流体系的所有配置项

**主要配置节**：

| 节 | 说明 |
|-----|------|
| `[general]` | 通用配置（gitignore_aide=false 表示追踪 .aide） |
| `[runtime]` | 运行时要求（python_min="3.11", use_uv=true） |
| `[task]` | 任务文档路径配置 |
| `[env]` | 环境检测模块配置 |
| `[docs]` | 项目文档路径配置 |
| `[flow]` | 流程追踪配置（phases 定义任务环节） |
| `[plantuml]` | PlantUML 配置 |
| `[decide]` | 待定项确认 Web 服务配置 |

**关键配置项**：
- `general.gitignore_aide = false`：允许 git 追踪 .aide 目录
- `env.modules = ["python", "uv", "venv", "requirements"]`
- `flow.phases = ["task-optimize", "flow-design", "impl", "verify", "docs", "confirm", "finish"]`
- `decide.url = "http://vm1.dev.net:3721"`

---

### flow-status.json - 任务进度

**职责**：记录当前任务的执行状态和历史

**当前任务状态**：
- **任务ID**：2025-12-19T22-20-36
- **当前环节**：flow-design（子计划3流程设计中）
- **当前步骤**：40
- **任务分支**：aide/001
- **源分支**：master

**历史记录摘要**（40步）：
1. task-optimize：任务准备和待定项确认（步骤 1-4）
2. flow-design (子计划1)：流程图设计（步骤 5-6）
3. impl (子计划1)：实现 GDD 文档 8 章（步骤 7-16）
4. verify (子计划1)：验证完成（步骤 17-18）
5. docs (子计划1)：README + CHANGELOG 更新（步骤 19-20）
6. confirm (子计划1)：项目文档创建（步骤 21-24）
7. flow-design (子计划2)：流程图设计（步骤 25-26）
8. impl (子计划2)：技术原型开发（步骤 27-34）
9. verify (子计划2)：验证完成（步骤 35-36）
10. docs (子计划2)：文档更新（步骤 37-39）
11. flow-design (子计划3)：当前进行中（步骤 40）

**关联 Git 提交**：每个实现步骤都有对应的 git_commit 记录

---

### decisions/ - 决策记录

**职责**：存储用户的待定项决策结果

**已完成决策（2025-12-19T22-22-40.json）**：

| 待定项 | 用户选择 | 备注 |
|--------|----------|------|
| 游戏主题 | 东方仙侠 | - |
| 美术风格 | 简约几何风 | 非默认推荐 |
| 游戏规模 | 单关卡演示版 | "先弄个最小验证版本" |
| 核心玩法 | Roguelike 元素 | "你要指导我完成前期设计" |

---

### task-plans/ - 任务计划

**职责**：存储复杂任务的分解计划

**任务计划结构**：
- `guide.md`：总导览，包含设计决策摘要和子计划索引
- `spec-01.md`：前期设计（8 个步骤，已完成）
- `spec-02.md`：技术原型开发（7 个步骤，已完成）
- `spec-03.md`：核心系统实现（7 个步骤，进行中）
- `spec-04.md`：完善打磨（7 个步骤，待开发）

**当前进度**：
| 子计划 | 状态 |
|--------|------|
| 1. 前期设计 | **completed** |
| 2. 技术原型开发 | **completed** |
| 3. 核心系统实现 | **in_progress** |
| 4. 完善打磨 | pending |

**执行顺序**：子计划 1 → 2 → 3 → 4（串行依赖）

---

### diagrams/ - 流程图

**职责**：存储 PlantUML 流程图源文件和生成的图片

**流程图清单**：

| 文件 | 说明 |
|------|------|
| spec-01-flow.puml/png | 子计划1前期设计执行流程图 |
| spec-02-task-flow.puml/png | 子计划2任务执行流程图 |
| spec-02-game-logic.puml/png | 游戏主循环逻辑图 |

**spec-01-flow 内容**：8 个步骤分区（游戏概念→世界观→核心玩法→角色系统→敌人系统→Roguelike→无尽模式→UI/UX）+ 用户确认分支

**spec-02-task-flow 内容**：7 个步骤的技术原型开发流程

**spec-02-game-logic 内容**：游戏主循环逻辑（初始化→战斗→敌人生成→碰撞检测→结算）

---

### project-docs/ - 项目文档

**职责**：面向 LLM 的项目结构文档

**文档结构**：
- `README.md`：项目总导览
- `block-plan.md`：区块划分计划
- `blocks/`：各区块详细文档
  - `01-root.md`：项目根目录
  - `02-docs.md`：docs 文档目录
  - `03-aide.md`：.aide 工作流目录（本文档）
  - `04-src.md`：src 源码目录

**注意**：本区块（03-aide.md）属于 project-docs/blocks/ 目录，形成自引用

## 依赖关系

- **依赖**：无
- **被依赖**：
  - 项目根目录（config.toml 定义任务文档路径）
  - docs 目录（task-plans 中引用 GDD 文档结构）
  - src 目录（flow-status 记录实现进度）

## 注意事项

1. **Git 追踪**：此项目的 `.aide` 目录被 git 追踪，非默认行为
2. **不要手动编辑**：除 config.toml 外，其他文件应通过 `aide` 命令管理
3. **决策记录**：decisions/ 目录保存用户的所有历史决策
4. **历史归档**：logs/ 目录存储已完成任务的状态快照（7 个文件）
5. **自引用**：project-docs/ 是本文档所在目录，更新时注意避免循环
6. **流程图更新**：diagrams/ 目录已包含子计划1和2的流程图
