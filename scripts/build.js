/**
 * =============================================================================
 * == Kaplay.js 构建脚本 ==
 * =============================================================================
 *
 * 这个脚本是整个Kaplay.js引擎的构建入口点。
 * 它负责把所有TypeScript源代码编译成可发布的JavaScript库。
 * 
 * 就像烹饪一样，这个脚本是把所有原料（源代码）最终做成一道美味佳肴（可用的游戏库）的过程。
 * 
 * 工作流程：
 * 1. 调用"build"函数从./lib/build.js模块进行核心构建
 *    - 这个过程会编译所有TypeScript代码
 *    - 打包所有依赖
 *    - 生成压缩和非压缩版本的库文件
 * 
 * 2. 调用"genGlobalDTS"函数从./lib/globaldts.js模块生成全局类型定义
 *    - 这让开发者在使用全局变量模式时也能获得TypeScript类型检查和代码补全的好处
 *    - 如果你用过Kaplay.js，就知道它可以把很多函数挂到全局window对象上，这一步就是为这些全局函数生成类型定义
 * 
 * 注意：
 * - 这个脚本使用了顶层await（ES模块的特性），所以不需要包装在async函数中
 * - @ts-check注释启用了对JavaScript文件的类型检查，确保构建脚本本身不会有错误
 */

// @ts-check

import { build } from "./lib/build.js";
import { genGlobalDTS } from "./lib/globaldts.js";

await build();
await genGlobalDTS();
