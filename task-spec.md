# 任务细则：清理"御剑无双"旧信息

## 任务目标

清理项目中所有与"御剑无双"(Sword Immortal) 相关的旧信息，使项目恢复为干净状态。

## 成功标准

1. 项目中不再包含"御剑无双"或"Sword Immortal"相关的描述性内容
2. 删除所有 GDD 设计文档
3. 清理 Aide 项目文档
4. 保留项目的基础结构和源代码

## 具体步骤

### 步骤 1：清理项目根目录文件

| 文件 | 操作 |
|------|------|
| `README.md` | 重写为通用项目模板 |
| `CHANGELOG.md` | 删除 |
| `task-now.md` | 保留（当前任务文档） |

### 步骤 2：删除 docs/ 目录

删除整个 `docs/` 目录，包含以下文件：
- gdd-index.md
- gdd-chapter1.md ~ gdd-chapter8.md

### 步骤 3：清理 .aide/ 目录

| 路径 | 操作 |
|------|------|
| `.aide/project-docs/` | 删除整个目录 |
| `.aide/branches.md` | 清理旧分支描述 |
| `.aide/logs/` | 保留（历史记录） |

### 步骤 4：验证清理结果

执行搜索确认不再有"御剑无双"相关内容（排除历史日志和任务文档）。

## 不处理的内容

- `src/` 源代码目录（不包含相关内容）
- `.aide/logs/` 历史日志（保留历史记录）
- `.aide/config.toml` 配置文件
- `node_modules/`、`dist/` 等忽略目录

## 验证标准

```bash
# 搜索应返回空结果（排除 logs/ 和 task-now.md）
grep -r "御剑无双\|Sword Immortal" --exclude-dir=logs --exclude=task-now.md --exclude=task-spec.md
```
