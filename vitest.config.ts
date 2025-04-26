/**
 * =============================================================================
 * == Kaplay.js 测试配置文件 ==
 * =============================================================================
 *
 * 这个文件配置了Kaplay.js项目的自动化测试环境。
 * 
 * 就像科学实验需要严格的实验条件一样，游戏开发也需要可靠的测试环境来确保一切按预期工作。
 * 这个配置文件就是设置这个"实验室"的说明书！
 * 
 * 这里使用的是Vitest测试框架，它是专为Vite构建工具设计的现代JavaScript测试框架。
 * Vitest的优点是速度快、配置简单，与现代前端工具链集成得很好。
 * 
 * 配置细节解析：
 * 
 * - name: "KAPLAY.js" - 为测试套件命名，这会显示在测试报告中
 * 
 * - environment: "puppeteer" - 使用Puppeteer作为测试环境
 *   Puppeteer是一个Node库，它提供了一个高级API来通过DevTools协议控制Chrome或Chromium
 *   这意味着我们的测试将在真实的浏览器环境中运行，而不仅仅是模拟DOM环境
 *   这对游戏引擎测试非常重要，因为我们需要测试渲染、输入处理等真实浏览器功能
 * 
 * - globalSetup: "vitest-environment-puppeteer/global-init" - 全局设置钩子
 *   在所有测试开始前运行的初始化脚本，负责设置Puppeteer环境
 * 
 * - fileParallelism: false - 禁用文件并行测试
 *   这确保测试按顺序运行，避免并发测试可能导致的资源竞争或状态污染问题
 *   对于游戏引擎这类复杂系统特别重要，因为测试通常涉及到共享资源（如Canvas、WebGL上下文等）
 * 
 * - typecheck 部分配置TypeScript类型检查：
 *   - ignoreSourceErrors: true - 忽略源代码中的类型错误，只关注测试文件
 *   - tsconfig: "./tests/tsconfig.json" - 使用专门为测试设置的TypeScript配置
 * 
 * 小朋友可以这样理解：这个文件就像是在说"我们要用一个特殊的机器人(Puppeteer)来玩我们的游戏，
 * 看看它是否按照我们的规则正常运行。而且我们要让机器人一次只玩一个游戏(不并行)，
 * 并且按照特定的规则(tsconfig)来判断游戏是否正确。"
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "KAPLAY.js",
        environment: "puppeteer",
        globalSetup: "vitest-environment-puppeteer/global-init",
        fileParallelism: false,
        typecheck: {
            ignoreSourceErrors: true,
            tsconfig: "./tests/tsconfig.json",
        },
    },
});
