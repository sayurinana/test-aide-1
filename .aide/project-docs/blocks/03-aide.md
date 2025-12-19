# 区块3：.aide 工作流目录

> 路径：`.aide/`
> 最后更新：2025-12-19

## 概述

Aide 工作流体系的数据目录，存储项目配置、任务进度、决策记录、流程图、任务计划和项目文档。该目录由 `aide init` 命令创建，通过 `aide` 系列命令进行管理。

**重要**：此目录被 git 追踪（`general.gitignore_aide = false`），支持多设备同步 aide 状态。

## 目录结构

```
.aide/
├── config.toml              Aide 核心配置文件（232行）
├── flow-status.json         当前任务进度状态（177行）
├── branches.json            Git 分支管理信息（16行）
├── branches.md              分支信息可读版（11行）
├── pending-items.json       待定项数据（150行）
├── decisions/               决策记录目录
│   ├── 2025-12-19T22-22-40.json  已完成决策（256行）
│   └── pending.json              待决策项副本（235行）
├── diagrams/                流程图目录
│   ├── spec-01-flow.puml    PlantUML 源文件（80行）
│   └── spec-01-flow.png     生成的流程图图片
├── logs/                    [空目录] 历史任务归档
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
        └── 03-aide.md       (本文档)
```

## 文件清单

| 文件 | 类型 | 行数 | 说明 |
|------|------|------|------|
| config.toml | 配置 | 232 | Aide 核心配置，含详细注释 |
| flow-status.json | 数据 | 177 | 当前任务进度和历史记录 |
| branches.json | 数据 | 16 | Git 分支元信息 |
| branches.md | 文档 | 11 | 分支信息可读摘要 |
| pending-items.json | 数据 | 150 | 待定项问题和选项 |
| decisions/*.json | 数据 | - | 用户决策记录 |
| diagrams/*.puml | 源码 | 80 | PlantUML 流程图源文件 |
| diagrams/*.png | 二进制 | - | 生成的流程图图片 |
| task-plans/guide.md | 文档 | 53 | 任务计划总导览 |
| task-plans/spec-*.md | 文档 | - | 子计划细则文档 |
| project-docs/* | 文档 | - | 面向 LLM 的项目文档 |
| logs/ | 目录 | - | [空目录] 历史任务归档 |

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
- **当前环节**：confirm（用户确认）
- **当前步骤**：22
- **任务分支**：aide/001
- **源分支**：master

**历史记录摘要**（22步）：
1. task-optimize：任务准备和待定项确认
2. flow-design：流程图设计
3. impl：实现 GDD 文档 8 章（步骤 8-16）
4. verify：验证完成
5. docs：README + CHANGELOG 更新
6. confirm：项目文档创建（当前）

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
- `spec-01.md`：前期设计（8 个步骤，当前执行中）
- `spec-02.md`：技术原型开发（7 个步骤）
- `spec-03.md`：核心系统实现（7 个步骤）
- `spec-04.md`：完善打磨（7 个步骤）

**执行顺序**：子计划 1 → 2 → 3 → 4（串行依赖）

---

### diagrams/ - 流程图

**职责**：存储 PlantUML 流程图源文件和生成的图片

**当前流程图**：
- `spec-01-flow.puml`：子计划1前期设计的执行流程图
- `spec-01-flow.png`：生成的 PNG 图片

**流程图内容**：8 个步骤分区（游戏概念→世界观→核心玩法→角色系统→敌人系统→Roguelike→无尽模式→UI/UX）+ 用户确认分支

---

### project-docs/ - 项目文档

**职责**：面向 LLM 的项目结构文档

**文档结构**：
- `README.md`：项目总导览
- `block-plan.md`：区块划分计划
- `blocks/`：各区块详细文档

**注意**：本区块（03-aide.md）属于 project-docs/blocks/ 目录，形成自引用

## 依赖关系

- **依赖**：无
- **被依赖**：
  - 项目根目录（config.toml 定义任务文档路径）
  - docs 目录（task-plans 中引用 GDD 文档结构）

## 注意事项

1. **Git 追踪**：此项目的 `.aide` 目录被 git 追踪，非默认行为
2. **不要手动编辑**：除 config.toml 外，其他文件应通过 `aide` 命令管理
3. **决策记录**：decisions/ 目录保存用户的所有历史决策
4. **空目录**：logs/ 目录当前为空，用于归档已完成的任务
5. **自引用**：project-docs/ 是本文档所在目录，更新时注意避免循环
