# 任务细则：Bug 修复与画面优化

## 任务概述

修复《御剑无双》游戏中的 3 个 bug：敌人生成停止、测试模式失效、画面模糊。

## Bug 分析与修复方案

### Bug #1：敌人生成停止

**现象**：第一波怪物打完触发升级选了强化之后，敌人不再生成。

**根因分析**：
1. 击杀敌人时同时触发两个事件：
   - `WaveManager.onEnemyKilled()` → 波次完成 → `showBuffSelection()`
   - `RoguelikeSystem.addExp()` → 升级 → `showLevelUpBuffSelection()`
2. 两者都会启动 `BuffSelectionScene`，但 Phaser 不会创建多个实例
3. 第二次 `scene.launch()` 会覆盖第一次的 `onSelect` 回调
4. 如果升级的回调被执行，`WaveManager.onBuffSelected()` 不会被调用
5. `WaveManager.waveState` 停留在 `'reward'`，不会开始下一波

**修复方案**：
在 `RoguelikeSystem.processLevelUpQueue()` 中检查 `WaveManager.waveState`：
- 如果是 `'reward'` 状态，延迟处理升级队列
- 等待波次强化选择完成后再处理升级

**修改文件**：`src/systems/RoguelikeSystem.js`

**修改内容**：
```javascript
// processLevelUpQueue() 方法中添加检查
processLevelUpQueue() {
  // 如果正在选择强化或队列为空，不处理
  if (this.isSelectingBuff || this.levelUpQueue.length === 0) {
    return
  }

  // 新增：如果波次管理器正在等待强化选择，延迟处理
  if (this.scene.waveManager && this.scene.waveManager.waveState === 'reward') {
    // 延迟 500ms 后重试
    this.scene.time.delayedCall(500, () => {
      this.processLevelUpQueue()
    })
    return
  }

  // 原有逻辑...
}
```

---

### Bug #2：测试模式失效

**现象**：测试模式的敌人不会动，玩家也无法移动，按键无响应。

**根因分析**：
1. `TestScene` 启动时没有停止可能正在运行的覆盖场景
2. `AttackSelectScene` 或 `BuffSelectionScene` 可能仍在运行
3. 这些场景会暂停物理系统或阻止输入传递

**修复方案**：
在 `TestScene.create()` 开始时停止可能正在运行的覆盖场景。

**修改文件**：`src/scenes/TestScene.js`

**修改内容**：
```javascript
create() {
  // 新增：停止可能正在运行的覆盖场景
  this.scene.stop('AttackSelectScene')
  this.scene.stop('BuffSelectionScene')

  // 原有逻辑...
}
```

---

### Bug #3：画面模糊

**现象**：游戏画面和文字模糊不清。

**根因分析**：
1. `resolution` 属性在 Phaser 3.16+ 中已被弃用
2. 设置 `resolution: window.devicePixelRatio` 可能导致双重缩放
3. Phaser 3 已自动处理设备像素比，无需手动设置

**修复方案**：
移除 `resolution` 属性，让 Phaser 自动处理高 DPI 屏幕。

**修改文件**：`src/main.js`

**修改内容**：
```javascript
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#0a0a1e',
  // 移除 resolution 属性（已弃用，Phaser 3 自动处理）
  // resolution: window.devicePixelRatio || 1,  // 删除此行
  render: {
    // 保持原有配置
  },
  // ...
}
```

---

## 验证标准

### Bug #1 验证
1. 启动游戏，选择普攻
2. 击杀第一波敌人，触发升级
3. 选择强化后，确认第二波敌人正常生成
4. 重复测试 3 次，确保稳定

### Bug #2 验证
1. 从主菜单进入测试模式
2. 确认玩家可以移动（WASD）
3. 确认敌人会追踪玩家
4. 按 1 键获取经验，确认有响应
5. 按 3 键生成敌人波，确认敌人生成

### Bug #3 验证
1. 在高 DPI 屏幕（如 Retina）上运行游戏
2. 确认画面清晰，文字锐利
3. 确认 UI 元素边缘清晰
4. 对比修复前后的截图

---

## 实现步骤

1. 修复 Bug #1：修改 `RoguelikeSystem.js`
2. 修复 Bug #2：修改 `TestScene.js`
3. 修复 Bug #3：修改 `main.js`
4. 运行游戏验证所有修复
5. 更新文档

---

## 风险评估

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|----------|
| 修复 #1 导致升级队列处理延迟 | 低 | 低 | 500ms 延迟对用户体验影响很小 |
| 修复 #2 影响正常场景切换 | 低 | 中 | 只停止特定覆盖场景，不影响主场景 |
| 修复 #3 在某些浏览器上表现不一致 | 中 | 低 | Phaser 3 已处理兼容性 |
