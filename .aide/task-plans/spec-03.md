# 子计划 3：普攻系统基础架构

## 目标

设计并实现多样化普攻系统的基础架构，支持多种普攻类型同时存在和触发。

## 具体步骤

### 架构设计

1. 设计普攻系统架构：
   ```
   AttackManager (管理器)
   ├── AttackBase (基类)
   │   ├── ArrowAttack (射箭)
   │   ├── SlashAttack (挥砍)
   │   ├── OrbAttack (法球)
   │   ├── WaveAttack (冲击波)
   │   ├── LightningAttack (闪电链)
   │   └── SummonAttack (召唤物)
   └── AttackUpgradeTree (强化树)
   ```

2. 设计数据结构：
   - 普攻类型定义（`ATTACK_TYPES`）
   - 普攻属性配置（基础伤害、冷却、范围等）
   - 普攻强化定义（每种普攻的专属强化）

### 基础实现

1. 创建 `src/systems/AttackManager.js`：
   - 管理已装备的普攻列表
   - 统一触发所有普攻（按攻击键）
   - 处理普攻的添加/移除

2. 创建 `src/attacks/AttackBase.js`：
   - 普攻基类，定义通用接口
   - 属性：伤害、冷却、范围、等级
   - 方法：execute()、upgrade()、canFire()

3. 实现第一个普攻类型 `src/attacks/ArrowAttack.js`：
   - 射箭普攻完整实现
   - 支持强化：并排散射、串行连射、射程、贯穿

4. 实现第二个普攻类型 `src/attacks/SlashAttack.js`：
   - 挥砍普攻完整实现
   - 支持强化：挥砍幅度、范围、速度、频率

### 开局选择界面

1. 创建 `src/scenes/AttackSelectScene.js`：
   - 游戏开始时显示
   - 展示 6 种普攻类型卡片
   - 玩家选择 1 种作为初始普攻

2. 设计选择界面 UI：
   - 普攻类型图标
   - 名称和简介
   - 基础属性预览

### 集成到游戏循环

1. 修改 `Player.js`：
   - 移除原有攻击逻辑
   - 委托给 `AttackManager` 处理

2. 修改 `GameScene.js`：
   - 初始化 `AttackManager`
   - 在开局后调用 `AttackSelectScene`

3. 修改伤害判定：
   - `DamageSystem.js` 适配新的普攻伤害来源

## 验证标准

- [ ] 开局可选择初始普攻类型
- [ ] 射箭普攻正常发射、命中敌人
- [ ] 挥砍普攻正常挥动、命中敌人
- [ ] 多个普攻可同时装备并触发
- [ ] 普攻有独立冷却，不互相影响

## 依赖

- **前置**：子计划 2（品牌重塑完成）
- **后续**：子计划 4（扩展更多普攻类型）
