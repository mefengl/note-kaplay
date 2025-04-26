/**
 * 帧渲染系统
 * 
 * 这个模块负责管理游戏的渲染循环，实现了以下核心功能：
 * 1. 帧缓冲区管理（Frame Buffer）
 * 2. 后期处理效果（Post Processing）
 * 3. 游戏对象更新（Game Object Updates）
 * 
 * 渲染流程：
 * ┌──────────────┐
 * │  frameStart  │ → 清空缓冲区，准备新帧
 * └──────┬───────┘
 *        ↓
 * ┌──────────────┐
 * │updateFrame   │ → 更新游戏逻辑
 * └──────┬───────┘
 *        ↓
 * ┌──────────────┐
 * │  frameEnd    │ → 应用后期处理，显示
 * └──────────────┘
 */

import { BG_GRID_SIZE } from "../constants";
import type { Game } from "../game/game";
import { drawTexture } from "../gfx/draw/drawTexture";
import { drawUnscaled } from "../gfx/draw/drawUnscaled";
import { drawUVQuad } from "../gfx/draw/drawUVQuad";
import type { AppGfxCtx } from "../gfx/gfxApp";
import { flush, height, width } from "../gfx/stack";
import { Quad, Vec2 } from "../math/math";

/** 帧渲染器类型定义 */
export type FrameRenderer = ReturnType<typeof createFrameRenderer>;

/**
 * 创建帧渲染器
 * @param gfx 图形上下文
 * @param game 游戏实例
 * @param pixelDensity 像素密度（用于高DPI显示）
 */
export const createFrameRenderer = (
    gfx: AppGfxCtx,
    game: Game,
    pixelDensity: number,
) => {
    /**
     * 开始一个新的渲染帧
     * 1. 清空后缓冲区
     * 2. 绑定帧缓冲区
     * 3. 绘制背景（如果需要）
     * 4. 重置渲染状态
     */
    function frameStart() {
        // 清空后缓冲区
        gfx.gl.clear(gfx.gl.COLOR_BUFFER_BIT);
        gfx.frameBuffer.bind();
        // 清空帧缓冲区
        gfx.gl.clear(gfx.gl.COLOR_BUFFER_BIT);

        // 绘制网格背景（Kaplay 的标志性背景）
        if (!gfx.bgColor) {
            drawUnscaled(() => {
                drawUVQuad({
                    width: width(),
                    height: height(),
                    quad: new Quad(
                        0,
                        0,
                        width() / BG_GRID_SIZE,   // 网格大小
                        height() / BG_GRID_SIZE,
                    ),
                    tex: gfx.bgTex,
                    fixed: true,  // 固定位置，不受相机影响
                });
            });
        }

        // 重置渲染状态
        gfx.renderer.numDraws = 0;          // 重置绘制计数
        gfx.fixed = false;                  // 重置固定标志
        gfx.transformStackIndex = -1;       // 重置变换栈
        gfx.transform.setIdentity();        // 重置变换矩阵
    }

    /**
     * 结束当前渲染帧
     * 1. 应用后期处理效果
     * 2. 将帧缓冲区内容显示到屏幕
     */
    function frameEnd() {
        // TODO: 调试UI不应该使用帧缓冲区
        // TODO: 改进帧缓冲区渲染/尺寸问题
        flush();  // 刷新所有待渲染内容
        gfx.lastDrawCalls = gfx.renderer.numDraws;  // 记录本帧的绘制次数
        gfx.frameBuffer.unbind();  // 解绑帧缓冲区
        
        // 设置视口尺寸
        gfx.gl.viewport(
            0,
            0,
            gfx.gl.drawingBufferWidth,
            gfx.gl.drawingBufferHeight,
        );

        // 保存原始尺寸
        const ow = gfx.width;
        const oh = gfx.height;
        // 根据像素密度调整尺寸
        gfx.width = gfx.gl.drawingBufferWidth / pixelDensity;
        gfx.height = gfx.gl.drawingBufferHeight / pixelDensity;

        // 应用后期处理效果并显示到屏幕
        drawTexture({
            flipY: true,                    // Y轴翻转（WebGL坐标系需要）
            tex: gfx.frameBuffer.tex,       // 帧缓冲区纹理
            pos: new Vec2(gfx.viewport.x, gfx.viewport.y),  // 位置
            width: gfx.viewport.width,      // 宽度
            height: gfx.viewport.height,    // 高度
            shader: gfx.postShader,         // 后期处理着色器
            uniform: typeof gfx.postShaderUniform === "function"
                ? gfx.postShaderUniform()   // 动态uniform
                : gfx.postShaderUniform,    // 静态uniform
            fixed: true,                    // 固定位置
        });

        // 完成渲染并恢复原始尺寸
        flush();
        gfx.width = ow;
        gfx.height = oh;
    }

    /**
     * 固定时间步长更新
     * 用于物理模拟等需要稳定时间间隔的更新
     */
    function fixedUpdateFrame() {
        game.root.fixedUpdate();
    }

    /**
     * 正常帧更新
     * 用于常规游戏逻辑更新
     */
    function updateFrame() {
        game.root.update();
    }

    // 返回帧渲染器接口
    return { frameStart, frameEnd, fixedUpdateFrame, updateFrame };
};
