# 任务细则：配置 GitHub Actions CI/CD 自动构建与部署

## 任务目标

配置 GitHub Actions 工作流，实现推送代码时自动构建项目并部署到 GitHub Pages。

## 具体步骤

### 1. 调整 Vite 配置

**文件**：`vite.config.js`

**修改内容**：
- 使用环境变量动态设置 `base` 路径
- 本地开发：`./`
- GitHub Pages：读取 `GITHUB_REPOSITORY` 环境变量获取仓库名

### 2. 创建 GitHub Actions Workflow

**文件**：`.github/workflows/deploy.yml`

**配置内容**：
- **触发条件**：push 到 main/master 分支
- **权限**：contents: read, pages: write, id-token: write
- **作业 1 - Build**：
  - 检出代码
  - 设置 Node.js 环境
  - 安装依赖 (npm ci)
  - 构建项目 (npm run build)
  - 上传构建产物
- **作业 2 - Deploy**：
  - 使用 actions/deploy-pages 部署到 GitHub Pages

### 3. 验证配置

- 检查 workflow 语法正确性
- 确认所有必要文件已创建

### 4. 更新文档

- 更新 README.md 添加部署说明
- 更新 CHANGELOG.md 记录变更

## 验证标准

1. `.github/workflows/deploy.yml` 文件存在且语法正确
2. `vite.config.js` 支持动态 base 路径
3. 文档已更新

## 技术方案

- 使用 GitHub Actions 官方 Pages 部署方案
- 使用 `actions/configure-pages` 配置 Pages
- 使用 `actions/upload-pages-artifact` 上传构建产物
- 使用 `actions/deploy-pages` 执行部署

## 注意事项

1. 用户需要在 GitHub 仓库设置中启用 Pages，并选择 "GitHub Actions" 作为 Source
2. 首次部署后，访问地址为：`https://<username>.github.io/<repo-name>/`
