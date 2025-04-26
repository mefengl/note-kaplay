/**
 * 错误处理系统
 * 
 * 这个模块提供了游戏引擎的错误处理机制，主要功能：
 * 1. 捕获并显示错误信息
 * 2. 暂停游戏运行
 * 3. 提供蓝屏死机风格的错误显示界面
 * 
 * 错误界面布局：
 * ┌──────────────────────────┐
 * │ Error                    │
 * │                         │
 * │ [详细错误信息]           │
 * │                         │
 * └──────────────────────────┘
 */

import { DBG_FONT } from "../constants";
import { drawFormattedText } from "../gfx/draw/drawFormattedText";
import { drawRect } from "../gfx/draw/drawRect";
import { drawText } from "../gfx/draw/drawText";
import { drawUnscaled } from "../gfx/draw/drawUnscaled";
import { formatText } from "../gfx/formatText";
import { height, popTransform, width } from "../gfx/stack";
import { _k } from "../kaplay";
import { rgb } from "../math/color";
import { vec2 } from "../math/math";

/** 崩溃状态标志，防止错误处理器重复触发 */
let crashed = false;

/**
 * 处理游戏运行时错误
 * @param err 捕获到的错误对象
 * 
 * 错误处理流程：
 * 1. 检查是否已经崩溃
 * 2. 暂停音频播放
 * 3. 显示错误界面
 * 4. 触发错误事件
 * 5. 根据错误类型决定是否抛出
 */
export const handleErr = (err: Error | any) => {
    // 防止重复触发错误处理
    if (crashed) return;
    crashed = true;
    
    // 暂停音频播放
    _k.audio.ctx.suspend();

    // 获取错误消息
    const errorMessage = err.message ?? String(err)
        ?? "Unknown error, check console for more info";
    
    // 错误界面显示标志
    let errorScreen = false;

    // 启动简化的游戏循环，只显示错误界面
    _k.app.run(
        () => {},  // 空的更新函数
        () => {    // 渲染函数
            // 确保错误界面只绘制一次
            if (errorScreen) return;
            errorScreen = true;

            // 开始新的渲染帧
            _k.frameRenderer.frameStart();

            // 使用未缩放的坐标系绘制
            drawUnscaled(() => {
                const pad = 32;   // 内边距
                const gap = 16;   // 元素间距
                const gw = width();   // 画面宽度
                const gh = height();  // 画面高度

                // 文本样式配置
                const textStyle = {
                    size: 36,           // 字体大小
                    width: gw - pad * 2,  // 文本区域宽度
                    letterSpacing: 4,   // 字间距
                    lineSpacing: 4,     // 行间距
                    font: DBG_FONT,     // 使用调试字体
                    fixed: true,        // 固定位置
                };

                // 绘制蓝色背景
                drawRect({
                    width: gw,
                    height: gh,
                    color: rgb(0, 0, 255),  // 经典蓝屏颜色
                    fixed: true,
                });

                // 格式化并绘制标题
                const title = formatText({
                    ...textStyle,
                    text: "Error",
                    pos: vec2(pad),
                    color: rgb(255, 128, 0),  // 醒目的橙色
                    fixed: true,
                });

                drawFormattedText(title);

                // 绘制错误信息
                drawText({
                    ...textStyle,
                    text: errorMessage,
                    pos: vec2(pad, pad + title.height + gap),
                    fixed: true,
                });

                // 恢复变换状态
                popTransform();
                
                // 触发错误事件，允许外部处理
                _k.game.events.trigger("error", err);
            });

            // 完成渲染帧
            _k.frameRenderer.frameEnd();
        },
    );

    // TODO: 将这个设置为配置项
    if (!errorMessage.startsWith("[rendering]")) {
        // 对于非渲染错误，直接抛出以终止游戏
        throw new Error(errorMessage);
    }
    else {
        // 渲染错误只记录到控制台
        // 这是为了支持"无头"渲染模式
        console.error(errorMessage);
    }
};
