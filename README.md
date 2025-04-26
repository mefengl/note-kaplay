# 代码阅读推荐顺序

这是一个推荐的代码阅读顺序，帮助你理解 Kaplay.js 的核心结构。带星号 (*) 的文件表示尚未详细注释。

## 核心入口与类型定义

- [`src/kaplay.ts`](./src/kaplay.ts) - Kaplay 库的主入口点和核心初始化：
  - 负责创建和配置游戏引擎实例
  - 提供全局 API 和状态管理
  - 管理游戏生命周期
- [`src/constants.ts`](./src/constants.ts) - 定义了库中使用的常量：
  - 字符集和文本渲染相关常量
  - 默认配置值
  - 系统常量
- [`src/types.ts`](./src/types.ts) - 全局类型定义：
  - 引擎核心类型 (KAPLAYCtx, KAPLAYOpt)
  - 组件和系统接口
  - 事件类型

## 核心模块实现

### ECS (实体组件系统)

- [`src/ecs/make.ts`](./src/ecs/make.ts) - ECS 的核心实现：
  - 游戏对象的创建和生命周期管理
  - 组件系统的实现
  - 事件系统集成

- [`src/ecs/components/`](./src/ecs/components/) - 组件库：
  - `draw/` - 渲染相关组件 (sprite, text, particles 等)
  - `physics/` - 物理相关组件 (body, area, collision 等)
  - `level/` - 关卡相关组件 (agent, pathfinder, sentry 等)
  - `misc/` - 通用组件 (state, timer, health 等)

- [`src/ecs/systems/`](./src/ecs/systems/) - 系统实现：
  - `collision.ts` - 碰撞检测系统
  - 其他游戏逻辑系统

### 引擎核心

- [`src/core/engine.ts`](./src/core/engine.ts) - 核心引擎实现：
  - 系统初始化和配置
  - 子系统管理
  - 全局状态管理

- [`src/core/frameRendering.ts`](./src/core/frameRendering.ts) - 渲染循环：
  - 帧缓冲管理
  - 渲染状态控制
  - 渲染管道实现

- [`src/core/debug.ts`](./src/core/debug.ts) - 调试系统：
  - 性能监控
  - 游戏状态控制
  - 调试界面

- [`src/core/errors.ts`](./src/core/errors.ts) - 错误处理：
  - 错误捕获和显示
  - 蓝屏风格的错误界面

- [`src/core/fontCache.ts`](./src/core/fontCache.ts) - 字体系统：
  - 字体缓存管理
  - 文本渲染优化

### 渲染系统

- [`src/gfx/`](./src/gfx/) - 图形渲染模块：
  - `gfx.ts` - WebGL 封装和底层图形接口
  - `gfxApp.ts` - 高级图形接口和渲染状态管理
  - `draw/` - 绘制函数集合：
    - 精灵渲染
    - 几何图形绘制
    - 文本渲染
    - 粒子系统

### 运行时支持

- [`src/events/`](./src/events/) - 事件系统：
  - `events.ts` - 事件发布/订阅机制
  - `eventMap.ts` - 事件类型定义

- [`src/app/`](./src/app/) - 应用生命周期：
  - 窗口管理
  - 输入处理
  - 游戏循环控制

- [`src/game/`](./src/game/) - 游戏管理：
  - 场景系统
  - 对象池
  - 全局状态

### 工具与资源管理

- [`src/assets/`](./src/assets/) - 资源管理系统：
  - 图片加载与处理
  - 音频资源管理
  - 精灵图集处理

- [`src/utils/`](./src/utils/) - 工具函数库：
  - 数学计算辅助函数
  - 数据结构实现
  - 调试工具

- [`src/math/`](./src/math/) - 数学库：
  - `math.ts` - 向量和矩阵运算
  - `color.ts` - 颜色处理
  - `various.ts` - 其他数学工具

### 音频系统

- [`src/audio/`](./src/audio/) - 音频引擎：
  - 音效和音乐播放
  - 音频资源管理
  - 音频状态控制

## 构建与测试

- [`scripts/build.js`](./scripts/build.js) - 构建脚本。
- [`scripts/dev.js`](./scripts/dev.js) - 开发环境脚本。
- [`vitest.config.ts`](./vitest.config.ts) - Vitest 测试配置文件。
- [`tests/`](./tests/) - 测试代码目录。

## 配置文件

- [`package.json`](./package.json) - 项目依赖和脚本配置。
- [`tsconfig.json`](./tsconfig.json) - TypeScript 编译器配置。
- [`dprint.json`](./dprint.json) - dprint 代码格式化配置。

## 文档与贡献指南

- [`README.md`](./README.md) - 项目介绍 (当前文件)。
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) - 贡献指南。
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) - 行为准则。
- [`CHANGELOG.md`](./CHANGELOG.md) - 更新日志。

## 示例代码

- [`examples/`](./examples/)* - 大量的示例代码，展示库的各种用法。 (建议在理解核心模块后查看)

### 游戏开发指南

### 组件系统使用方法

1. 基础组件
   - `pos` - 位置组件，处理对象在游戏世界中的位置
   - `sprite` - 精灵组件，处理图像渲染
   - `area` - 碰撞区域组件，用于碰撞检测
   - `body` - 物理组件，处理重力和物理模拟

2. 行为组件
   - `state` - 状态机组件，管理对象的不同状态
   - `timer` - 定时器组件，处理延时和周期性事件
   - `health` - 生命值组件，管理对象的生命周期

3. AI 组件
   - `agent` - AI 代理组件，实现基本的 AI 行为
   - `patrol` - 巡逻组件，实现来回巡逻
   - `sentry` - 哨兵组件，实现视野检测

### 示例代码解析

- [`examples/`](./examples/) - 实例教程：
  - `basics*.js` - 基础概念演示
  - `platformer.js` - 平台游戏示例
  - `rpg.js` - 角色扮演游戏示例
  - `shooter.js` - 射击游戏示例

每个示例都包含详细的注释，展示了如何使用不同的组件和系统来实现游戏功能。建议在理解完核心模块后，按照难度递增的顺序学习这些示例。

---
(原有 README 内容将保留在此下方)

# 🎮 KAPLAY.js — A JavaScript & TypeScript Game Library

<div align="center">
  <img src="./kaplay.webp">
</div>

KAPLAY is the **fun-first**, 2D game library for **JavaScript** and
**TypeScript**. It’s made to **feel like a game** while you're making games.
Simple. Fast. Powerful.

✨ Whether you’re a beginner or an experienced dev, **KAPLAY** comes with its
own **web-based editor** — the [KAPLAYGROUND](https://play.kaplayjs.com) — so
you can try code instantly, and learn with more than **90 examples**!

## 🎲 Quick Overview

```js
// Start a game
kaplay({
    background: "#6d80fa",
});

// Load an image
loadSprite("bean", "https://play.kaplayjs.com/bean.png");

// Add a sprite to the scene
add([
    sprite("bean"), // it renders as a sprite
]);
```

Game objects are composed from simple, powerful components:

```js
// Add a Game Obj to the scene from a list of component
const player = add([
    rect(40, 40), // it renders as a rectangle
    pos(100, 200), // it has a position (coordinates)
    area(), // it has a collider
    body(), // it is a physical body which will respond to physics
    health(8), // it has 8 health points
    // Give it tags for easier group behaviors
    "friendly",
    // Give plain objects fields for associated data
    {
        dir: vec2(-1, 0),
        dead: false,
        speed: 240,
    },
]);
```

Blocky imperative syntax for describing behaviors

```js
// .onCollide() comes from "area" component
player.onCollide("enemy", () => {
    // .hurt() comes from "health" component
    player.hurt(1);
});

// check fall death
player.onUpdate(() => {
    if (player.pos.y >= height()) {
        destroy(player);
    }
});

// All objects with tag "enemy" will move to the left
onUpdate("enemy", (enemy) => {
    enemy.move(-400, 0);
});

// move up 100 pixels per second every frame when "w" key is held down
onKeyDown("w", () => {
    player.move(0, 100);
});
```

## 🖥️ Installation

### 🚀 Using `create-kaplay`

The fastest way to get started:

```sh
npx create-kaplay my-game
```

Then open [http://localhost:5173](http://localhost:5173) and edit `src/game.js`.

### 📦 Install with package manager

```sh
npm install kaplay
```

```sh
yarn add kaplay
```

```sh
pnpm add kaplay
```

```sh
bun add kaplay
```

> You will need a bundler like [Vite](https://vitejs.dev/) or
> [ESBuild](https://esbuild.github.io/) to use KAPLAY in your project. Learn how
> to setup ESbuild
> [here](https://kaplayjs.com/guides/install/#setup-your-own-nodejs-environment).

### 🌐 Use in Browser

Include via CDN:

```html
<script src="https://unpkg.com/kaplay@3001.0.12/dist/kaplay.js"></script>
```

### 📜 TypeScript Global Types

If you're using **TypeScript**, you used `create-kaplay` or installed with a
package manager and you want **global types**, you can load them using the
following directive:

```ts
import "kaplay/global";

vec2(10, 10); // typed!
```

But it's recommended to use `tsconfig.json` to include the types:

```json
{
  "compilerOptions": {
    "types": ["./node_modules/kaplay/dist/declaration/global.d.ts"]
  }
}
```

> [!WARNING]\
> If you are publishing a game (and not testing/learning) maybe you don't want
> to use globals,
> [see why](https://kaplayjs.com/guides/optimization/#avoid-global-namespace).

You can also use all **KAPLAY** source types importing them:

```js
import type { TextCompOpt } from "kaplay"
import type * as KA from "kaplay" // if you prefer a namespace-like import

interface MyTextCompOpt extends KA.TextCompOpt {
  fallback: string;
}
```

## 📚 Resources

### 📖 Docs

- [KAPLAY Official Docs](https://kaplayjs.com/docs/)
- [KAPLAYGROUND](https://play.kaplayjs.com)

### 📺 Tutorials

- 🎥
  [KAPLAY Library Crash Course by JSLegend ⚔️](https://www.youtube.com/watch?v=FdEYxGoy5_c)
- 📖
  [Learn JavaScript basics and KAPLAY to make games quickly](https://jslegenddev.substack.com/p/learn-the-basics-of-javascript-and)

### 💬 Community

- [Discord Server](https://discord.gg/aQ6RuQm3TF)
- [GitHub Discussions](https://github.com/kaplayjs/kaplay/discussions)
- [Twitter](https://twitter.com/Kaboomjs)

## 🎮 Games

Collections of games made with KAPLAY, selected by KAPLAY:

- [Itch.io](https://itch.io/c/4494863/kag-collection)
- [Newgrounds.com](https://www.newgrounds.com/playlist/379920/kaplay-games)

## 🙌 Credits

KAPLAY is an open-source project, maintained by the
[KAPLAY Team and core contributors](https://github.com/kaplayjs/kaplay/wiki/Development-Team)
and with the support of many
[other amazing contributors](https://github.com/kaplayjs/kaplay/graphs/contributors).

### 🏆 Recognitions

- Thanks to [mulfok](https://twitter.com/MulfoK) for the awesome
  [mulfok32](https://lospec.com/palette-list/mulfok32) color palette, used in
  KAPLAY sprites and art
- Thanks to [Pixabay](https://pixabay.com/users/pixabay-1/) for the great
  [burp](https://pixabay.com/sound-effects/burp-104984/) sound, used in `burp()`
  function
- Thanks to [Kenney](https://kenney.nl/) for all used assets for examples
  - [Impact Sound Pack](https://kenney.nl/assets/impact-sounds)
  - [1-Bit Platformer Pack](https://kenney.nl/assets/1-bit-platformer-pack)
- Thanks to [abrudz](https://github.com/abrudz) for the amazing
  [APL386 font](https://abrudz.github.io/APL386/)
- Thanks to [Polyducks](http://polyducks.co.uk/) for the amazing
  [kitchen sink font](https://polyducks.itch.io/kitchen-sink-textmode-font) font
- Thanks to [0x72](https://0x72.itch.io/) for the amazing
  [Dungeon Tileset](https://0x72.itch.io/dungeontileset-ii)
