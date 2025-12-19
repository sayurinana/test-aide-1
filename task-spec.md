# 任务细则：自动攻击功能 + 界面美化

## 任务概述

为《御剑无双》游戏添加两项功能：
1. 自动攻击开关
2. SVG 图像美化玩家和敌人

## 功能 1：自动攻击

### 目标
提供一个开关按键，打开后角色自动按当前攻击速度朝向光标方向发动攻击。

### 具体步骤

1. **在 GameScene 中添加自动攻击状态**
   - 新增 `autoAttack = false` 状态变量
   - 游戏开始时默认关闭

2. **添加按键监听**
   - 使用 F 键切换自动攻击开关
   - 切换时播放提示音效

3. **在 update 循环中实现自动攻击逻辑**
   - 如果 `autoAttack` 为 true 且游戏未暂停
   - 自动调用 `performAttack()`

4. **在 HUD 中显示自动攻击状态**
   - 在界面显示当前状态（开/关）

### 验证标准
- [ ] 按 F 键可切换自动攻击开关
- [ ] 开启后自动按攻击速度攻击
- [ ] 攻击方向朝向光标位置
- [ ] 游戏开始时默认关闭
- [ ] HUD 显示当前状态

## 功能 2：界面美化 (SVG)

### 目标
设计并创建 SVG 图像，替代玩家和敌人的几何图形绘制。

### 具体步骤

1. **设计 SVG 资源**
   - 玩家角色：仙侠风格剑客
   - 飘影：六边形幽灵
   - 妖狼：三角形野兽
   - 蛇妖：菱形蛇形
   - 怨魂：幽灵形态
   - 精英：带符文的圆形
   - Boss：带角的大型怪物

2. **创建 SVG 资源目录和文件**
   - 目录：`src/assets/sprites/`
   - 文件：player.svg, shadow.svg, wolf.svg 等

3. **修改 Player.js**
   - 预加载 SVG 资源
   - 使用 SVG 纹理替代 Graphics 绘制

4. **修改 Enemy.js**
   - 根据敌人类型加载对应 SVG
   - 使用 SVG 纹理替代 Graphics 绘制

5. **在 main.js 中预加载资源**
   - 添加资源预加载逻辑

### 验证标准
- [ ] 玩家使用 SVG 图像显示
- [ ] 各类型敌人使用对应 SVG 图像
- [ ] 图像在各种尺寸下清晰
- [ ] 保持原有碰撞判定不变
- [ ] 保持原有动画效果（闪烁等）

## 技术要点

### Phaser 3 SVG 加载
```javascript
// 在 preload 中加载 SVG
this.load.svg('player', 'assets/sprites/player.svg', { width: 48, height: 48 })

// 使用纹理
this.sprite = this.scene.add.image(0, 0, 'player')
```

### 文件修改清单
- `src/scenes/GameScene.js` - 自动攻击逻辑
- `src/scenes/HUDScene.js` - 状态显示
- `src/entities/Player.js` - SVG 渲染
- `src/entities/Enemy.js` - SVG 渲染
- `src/main.js` - 资源预加载
- `src/assets/sprites/*.svg` - SVG 资源文件

## 执行顺序

1. 先实现自动攻击功能（不依赖美化）
2. 再实现 SVG 美化（独立功能）
3. 最后整体验证

---

## 当前进度（任务中断点）

**更新时间**：2025-12-20

### 已完成

1. **功能 1：自动攻击** - ✅ 完成
   - GameScene.js：添加 `autoAttack` 状态、F 键监听、update 自动攻击逻辑
   - HUDScene.js：添加自动攻击状态显示和切换事件监听

2. **功能 2：SVG 美化** - 部分完成
   - ✅ 创建 `src/assets/sprites/` 目录
   - ✅ 创建 7 个 SVG 文件：player.svg, shadow.svg, wolf.svg, snake.svg, wraith.svg, elite.svg, boss.svg
   - ✅ MainMenuScene.js：添加 preload 方法预加载 SVG 资源

### 待完成

1. **修改 Player.js**
   - 使用 SVG 纹理替代 Graphics 绘制
   - 替换 `createGraphics()` 和 `drawCharacter()` 方法

2. **修改 Enemy.js**
   - 根据敌人类型使用对应 SVG 纹理
   - 替换 `createGraphics()` 和各 `draw*()` 方法

3. **验证与测试**
   - 运行游戏验证功能
   - 确保碰撞判定正常
   - 确保动画效果正常

4. **文档更新**
   - 更新 README.md
   - 更新 CHANGELOG.md

