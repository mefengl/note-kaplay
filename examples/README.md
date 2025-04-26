# Kaplay.js 示例代码库使用指南

## 示例代码库简介

这个目录包含了大量的示例代码，展示了Kaplay.js游戏引擎的各种功能和用法。这些示例就像是一本"菜谱书"，通过实际的代码展示如何使用Kaplay.js创建各种有趣的游戏功能。

## 示例文件的结构

每个示例文件都有一个统一的结构，包含以下元素：

```javascript
/**
 * @file 示例标题
 * @description 功能描述
 * @difficulty 难度级别 (0-5)
 * @tags 相关标签
 * @minver 最低兼容版本
 * @category 分类
 * @group 所属组
 * @groupOrder 组内顺序
 */

// 示例代码...
```

这种结构使得示例代码易于浏览和理解。

## 学习路径推荐

对于初学者，建议按照以下顺序学习示例：

1. **基础入门**：从 `basicsStart.js` 开始，了解如何初始化游戏
2. **基本组件**：学习 `basicsComponents.js`，理解游戏对象和组件系统
3. **渲染基础**：通过 `basicsCompRender.js` 学习如何渲染图像和文本
4. **事件系统**：查看 `basicsEvents.js` 了解事件处理机制
5. **全局API**：学习 `basicsGlobals.js` 中的全局函数和变量

## 示例分类

示例代码按照不同的功能分类：

### 基础示例

- `basicsStart.js` - 创建第一个游戏
- `basicsObject.js` - 游戏对象基础
- `basicsComponents.js` - 组件系统基础
- `basicsCompRender.js` - 渲染组件基础
- `basicsEvents.js` - 事件系统基础
- `basicsGlobals.js` - 全局函数和变量

### 游戏类型示例

- `platformer.js` - 平台游戏示例
- `shooter.js` - 射击游戏示例
- `rpg.js` - 角色扮演游戏示例
- `pong.js` - 经典乒乓游戏

### 图形与渲染

- `sprite.js` - 精灵图渲染
- `animation.js` - 动画系统
- `shader.js` - 着色器效果
- `text.js` - 文本渲染
- `draw.js` - 绘图API
- `particle.js` - 粒子系统

### 物理与碰撞

- `collision.js` - 碰撞检测
- `gravity.js` - 重力系统
- `friction.js` - 摩擦力
- `restitution.js` - 弹性碰撞

### 输入与交互

- `binding.js` - 按键绑定
- `gamepad.js` - 游戏手柄支持
- `drag.js` - 拖拽功能
- `textInput.js` - 文本输入

### 游戏机制

- `timer.js` - 定时器系统
- `level.js` - 关卡系统
- `scenes.js` - 场景管理
- `camera.js` - 摄像机控制

### 音频系统

- `audio.js` - 音频播放基础
- `burp.js` - 音效示例

### 人工智能

- `ai.js` - 人工智能基础
- `patrol.js` - 巡逻行为
- `maze.js` - 迷宫生成与寻路

## 如何运行示例

1. 在项目根目录运行 `pnpm dev` 命令启动开发服务器
2. 在浏览器中打开显示的地址（通常是 http://localhost:5173）
3. 从示例列表中选择你想运行的示例

## 如何修改示例

1. 找到你想修改的示例文件（在`examples`目录下）
2. 使用你喜欢的代码编辑器打开并修改
3. 保存文件后，开发服务器会自动重新加载，显示更改后的效果

## 小朋友理解版

想象这个文件夹里有很多小游戏的"食谱"！每个"食谱"都教你怎么做出游戏中的一个特色功能：

- 想学怎么让角色跳起来？看看`platformer.js`！
- 想知道怎么发射子弹？`shooter.js`会告诉你！
- 想做出漂亮的爆炸效果？试试`particle.js`！

就像学做菜一样，先从简单的开始，慢慢尝试更复杂的。每个例子都有解释，告诉你每行代码是做什么的。这样，你很快就能学会用Kaplay.js做出自己的游戏啦！
