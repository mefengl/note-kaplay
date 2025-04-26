/**
 * Kaplay 游戏引擎的核心实现
 * 
 * 这个文件是整个引擎的心脏，负责：
 * 1. 初始化所有核心系统
 * 2. 管理系统间的依赖关系
 * 3. 提供全局访问点
 */

import { initApp } from "../app/app";
import { initAssets } from "../assets/asset";
import { initAudio } from "../audio/audio";
import { initGame } from "../game/game";
import { createCanvas } from "../gfx/canvas";
import { initGfx } from "../gfx/gfx";
import { initAppGfx } from "../gfx/gfxApp";
import type { KAPLAYCtx, KAPLAYOpt } from "../types";
import { initDebug } from "./debug";
import { createFontCache } from "./fontCache";
import { createFrameRenderer } from "./frameRendering";

/** 引擎实例类型 */
export type Engine = ReturnType<typeof createEngine>;

/**
 * 创建游戏引擎实例
 * @param gopt 引擎初始化选项
 * 
 * 初始化流程：
 * 1. 创建画布和字体缓存
 * 2. 初始化应用程序核心
 * 3. 设置 WebGL 上下文
 * 4. 初始化图形系统
 * 5. 初始化其他核心系统
 * 6. 创建帧渲染器
 * 7. 设置调试模式
 */
export const createEngine = (gopt: KAPLAYOpt) => {
    // 步骤1：创建基础设施
    const canvas = createCanvas(gopt);  // 创建游戏画布
    const { fontCacheC2d, fontCacheCanvas } = createFontCache();  // 创建字体缓存系统
    const app = initApp({ canvas, ...gopt });  // 初始化应用程序

    // 步骤2：初始化 WebGL 上下文
    const canvasContext = app.canvas
        .getContext("webgl", {
            antialias: true,      // 抗锯齿
            depth: true,          // 深度缓冲
            stencil: true,        // 模板缓冲
            alpha: true,          // Alpha 通道
            preserveDrawingBuffer: true,  // 保留绘图缓冲（用于截图）
        });

    if (!canvasContext) throw new Error("WebGL not supported");  // WebGL 不支持时抛出错误

    const gl = canvasContext;

    // 步骤3：初始化图形系统
    const gfx = initGfx(gl, gopt);  // 底层图形系统
    const appGfx = initAppGfx(gfx, gopt);  // 应用层图形系统

    // 步骤4：初始化其他核心系统
    const assets = initAssets(gfx, gopt.spriteAtlasPadding ?? 0);  // 资源管理
    const audio = initAudio();  // 音频系统
    const game = initGame();    // 游戏系统

    // 步骤5：创建帧渲染器
    const frameRenderer = createFrameRenderer(
        appGfx,
        game,
        gopt.pixelDensity ?? 1,  // 默认像素密度为1
    );

    // 步骤6：初始化调试系统
    const debug = initDebug(gopt, app, appGfx, audio, game, frameRenderer);

    // 返回引擎实例
    return {
        globalOpt: gopt,          // 全局配置
        canvas,                   // 游戏画布
        app,                      // 应用程序核心
        ggl: gfx,                // 底层图形系统
        gfx: appGfx,             // 应用层图形系统
        audio,                    // 音频系统
        assets,                   // 资源管理
        frameRenderer,            // 帧渲染器
        fontCacheC2d,            // 字体缓存 2D 上下文
        fontCacheCanvas,         // 字体缓存画布
        game,                    // 游戏系统
        debug,                   // 调试系统
        k: null as unknown as KAPLAYCtx,  // Kaplay 上下文（在 kaplay() 运行后设置）
    };
};
