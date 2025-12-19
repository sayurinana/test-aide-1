# 子计划 1：自动攻击功能

## 目标

实现一个自动攻击开关，玩家按下特定按键（T 键）后，角色将自动按当前攻击速度朝向光标方向发动攻击。游戏开始时默认关闭。

## 具体步骤

### 1. 修改 Player.js

1. 添加 `autoAttack` 状态变量（默认 false）
2. 添加 `toggleAutoAttack()` 方法用于切换状态
3. 添加 `isAutoAttackEnabled()` 方法用于查询状态

### 2. 修改 GameScene.js

1. 在 `create()` 中添加 T 键监听
2. 绑定 T 键到 `player.toggleAutoAttack()`
3. 在 `update()` 循环中添加自动攻击逻辑：
   - 检查 `player.isAutoAttackEnabled()`
   - 如果启用且 `player.canAttack()`，则调用 `performAttack()`
4. 切换时播放音效提示

### 3. 修改 HUDScene.js

1. 添加自动攻击状态指示器（屏幕左下角或技能栏附近）
2. 监听状态变化事件更新显示
3. 显示格式：「自动攻击：开/关」或图标形式

### 4. 修改 config.js（可选）

如需配置化，可添加：
- 自动攻击开关按键配置
- 默认状态配置

## 验证标准

- [ ] 游戏开始时自动攻击默认关闭
- [ ] 按 T 键可以切换自动攻击状态
- [ ] 开启状态时，角色自动朝光标方向攻击
- [ ] 攻击速度与手动点击一致（遵循攻击冷却）
- [ ] HUD 正确显示当前自动攻击状态
- [ ] 切换时有音效/视觉反馈

## 依赖

- 前置：无
- 后续：无（与子计划2相互独立）

## 技术细节

### 现有攻击机制

```javascript
// Player.js
canAttack() {
  return this.attackCooldown <= 0 && !this.isAttacking
}

attack() {
  if (!this.canAttack()) return false
  // ... 攻击逻辑
  this.attackCooldown = PLAYER.ATTACK_COOLDOWN // 350ms
  return true
}
```

### 攻击朝向

玩家已有 `handleRotation()` 方法持续追踪鼠标位置更新朝向，无需额外处理。

### 攻击执行

GameScene.js 中的 `performAttack()` 方法处理实际攻击判定和特效。
