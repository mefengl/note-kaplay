/**
 * 调试系统
 * 
 * 这个模块提供了游戏引擎的调试功能，包括：
 * 1. 性能监控（FPS、绘制调用次数）
 * 2. 游戏状态控制（暂停、时间缩放）
 * 3. 日志系统
 * 4. 对象检查器
 */

import type { App } from "../app/app";
import type { AudioCtx } from "../audio/audio";
import { LOG_MAX } from "../constants";
import type { Game } from "../game/game";
import type { AppGfxCtx } from "../gfx/gfxApp";
import type { Debug, KAPLAYOpt } from "../types";
import type { FrameRenderer } from "./frameRendering";

/**
 * 初始化调试系统
 * @param gopt 引擎全局配置
 * @param app 应用程序实例
 * @param appGfx 图形上下文
 * @param audio 音频上下文
 * @param game 游戏实例
 * @param fr 帧渲染器
 */
export const initDebug = (
    gopt: KAPLAYOpt,
    app: App,
    appGfx: AppGfxCtx,
    audio: AudioCtx,
    game: Game,
    fr: FrameRenderer,
): Debug => {
    /** 暂停状态标志 */
    let debugPaused = false;

    /** 调试系统接口实现 */
    const debug: Debug = {
        /** 是否启用检查器模式 */
        inspect: false,

        /** 
         * 时间缩放因子
         * 可以用来实现慢动作或快进效果
         */
        set timeScale(timeScale: number) {
            app.state.timeScale = timeScale;
        },
        get timeScale() {
            return app.state.timeScale;
        },

        /** 是否显示日志 */
        showLog: true,

        /** 获取当前FPS */
        fps: () => app.fps(),

        /** 获取总帧数 */
        numFrames: () => app.numFrames(),

        /** 手动步进一帧 */
        stepFrame: fr.updateFrame,

        /** 获取上一帧的绘制调用次数 */
        drawCalls: () => appGfx.lastDrawCalls,

        /** 清空日志 */
        clearLog: () => game.logs = [],

        /**
         * 输出日志
         * 支持多参数输出，类似 console.log
         */
        log: (...msgs: any[]) => {
            const max = gopt.logMax ?? LOG_MAX;
            const msg = msgs.length > 1 ? msgs.join(" ") : msgs[0];

            // 在日志开头插入新消息
            game.logs.unshift({
                msg: msg,
                time: app.time(),  // 记录日志时间戳
            });

            // 限制日志数量
            if (game.logs.length > max) {
                game.logs = game.logs.slice(0, max);
            }
        },

        /**
         * 输出错误日志
         * 自动将输入转换为 Error 对象
         */
        error: (msg: unknown) =>
            debug.log(new Error(String(msg))),

        /** 当前录制状态（用于回放功能） */
        curRecording: null,

        /** 获取当前场景中的对象数量 */
        numObjects: () => game.root.get("*", { recursive: true }).length,

        /**
         * 暂停控制
         * 暂停时会同时暂停音频播放
         */
        get paused() {
            return debugPaused;
        },
        set paused(v) {
            debugPaused = v;
            if (v) {
                audio.ctx.suspend();  // 暂停音频
            }
            else {
                audio.ctx.resume();   // 恢复音频
            }
        },
    };

    return debug;
};
