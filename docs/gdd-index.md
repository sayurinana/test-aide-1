# 《御剑无双》游戏设计文档 (GDD)

> 东方仙侠 × 简约几何 × 无双割草 × Roguelike

---

## 文档概览

| 章节 | 标题 | 文件 |
|------|------|------|
| 1 | 游戏概念 | [gdd-chapter1.md](./gdd-chapter1.md) |
| 2 | 世界观与背景设定 | [gdd-chapter2.md](./gdd-chapter2.md) |
| 3 | 核心玩法设计 | [gdd-chapter3.md](./gdd-chapter3.md) |
| 4 | 角色系统设计 | [gdd-chapter4.md](./gdd-chapter4.md) |
| 5 | 敌人系统设计 | [gdd-chapter5.md](./gdd-chapter5.md) |
| 6 | Roguelike 系统设计 | [gdd-chapter6.md](./gdd-chapter6.md) |
| 7 | 无尽模式框架设计 | [gdd-chapter7.md](./gdd-chapter7.md) |
| 8 | UI/UX 设计 | [gdd-chapter8.md](./gdd-chapter8.md) |

---

## 项目速览

### 基本信息
- **游戏名称**：御剑无双 (Sword Immortal)
- **游戏类型**：无双割草 + Roguelike + 无尽生存
- **平台**：Web 浏览器
- **美术风格**：简约几何 + 东方仙侠
- **目标版本**：MVP 演示版

### 核心卖点
1. **独特视觉**：简约几何与仙侠元素的创新融合
2. **爽快战斗**：大量敌人 + 华丽技能 + 连击系统
3. **高可重玩**：Roguelike 随机强化，每局不同体验
4. **即开即玩**：浏览器直接运行，无需下载

### 核心循环
```
战斗 → 击杀敌人 → 波次结束 → 选择强化 → 下一波次 → 循环
                                              ↓
                                    角色死亡 → 结算
```

---

## 系统摘要

### 角色系统
- 6 个基础属性：HP、ATK、DEF、SPD、CRIT、CRITDMG
- 5 个隐藏属性：攻击速度、范围、冷却缩减、生命恢复、吸血
- 5 个技能 + 闪避

### 敌人系统
- 4 种小怪：飘影、妖狼、蛇妖、怨魂
- 1 种精英：邪修
- 1 种 Boss：妖将（双阶段）

### Roguelike 系统
- 4 级稀有度：普通/稀有/史诗/传说
- 4 类强化：属性/技能/特效/生存
- 20+ 强化道具
- 5 种 Build 方向

### 无尽模式
- 4 种波次：普通/精英/Boss/狂潮
- 里程碑奖励系统
- 评分和记录系统

---

## 技术方案

### 技术栈
- **游戏框架**：Phaser 3
- **构建工具**：Vite
- **开发语言**：JavaScript (可选 TypeScript)
- **版本控制**：Git

### 目录结构（预览）
```
sword-immortal/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── config/
│   ├── scenes/
│   ├── entities/
│   ├── systems/
│   ├── ui/
│   └── utils/
├── assets/
│   ├── sprites/
│   ├── audio/
│   └── fonts/
└── docs/
    └── gdd/
```

---

## 里程碑规划

### MVP 版本（当前目标）
- [ ] 基础游戏框架
- [ ] 玩家角色控制
- [ ] 基础敌人 AI
- [ ] 核心战斗系统
- [ ] Roguelike 选择系统
- [ ] 无尽模式基础
- [ ] 基础 UI

### 后续迭代
- 更多敌人类型
- 更多强化道具
- 音效系统
- 成就系统
- 排行榜

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0 | 2025-12-19 | 初版完成 |

---

*文档结束*
