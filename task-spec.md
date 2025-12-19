# 任务细则：Bug 修复与画面优化

## 任务目标
修复游戏中的 5 个问题，确保核心游戏循环和测试功能正常运行。

## 问题清单

### 问题 1：返回主菜单后开始按钮失效
- **根源**：`MainMenuScene.create()` 没有重置 `isStarting` 标志
- **位置**：`src/scenes/MainMenuScene.js:25`
- **修复**：在 `create()` 方法开头添加 `this.isStarting = false`

### 问题 2：测试场景不可用
- **根源**：`TestScene.spawnEnemyWave()` 传递了错误的参数（数字而非配置对象）
- **位置**：`src/scenes/TestScene.js:190`
- **修复**：修改参数为正确的敌人配置对象

### 问题 3：画面模糊
- **根源**：未设置 `devicePixelRatio` 支持高 DPI 屏幕
- **位置**：`src/main.js`
- **修复**：添加 `resolution: window.devicePixelRatio` 配置

### 问题 4：角色和敌人外观相同（绿线黑方块）
- **根源**：SVG 资源路径在构建后可能失效
- **位置**：`src/scenes/MainMenuScene.js:14-23`
- **修复**：使用 Vite 的资源导入方式，确保路径正确

### 问题 5：第一波敌人生成过早停止
- **根源**：待调查，可能是 WaveManager 逻辑问题
- **位置**：`src/systems/WaveManager.js`
- **修复**：调查并修复生成逻辑

## 具体步骤

1. 修复 MainMenuScene 的 `isStarting` 重置问题
2. 修复 TestScene 的 `spawnEnemyWave()` 参数问题
3. 添加高 DPI 屏幕支持
4. 修复 SVG 资源加载路径
5. 调查并修复敌人生成问题
6. 测试验证所有修复

## 验证标准

- [ ] 从游戏返回主菜单后，开始按钮可正常点击
- [ ] 测试场景中敌人可正常移动，玩家可正常控制
- [ ] 测试场景中按 1 键可获得经验
- [ ] 画面清晰，无模糊
- [ ] 角色和敌人有明显的视觉区分
- [ ] 第一波敌人正常生成
