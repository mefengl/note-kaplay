/**
 * 字体缓存系统
 * 
 * 这个模块创建了一个离屏画布来缓存文本渲染结果，用于提高性能。
 * 原理：
 * 1. 预先将常用文本渲染到缓存画布上
 * 2. 需要显示文本时直接从缓存中复制，避免重复渲染
 * 3. 使用 LRU (最近最少使用) 策略管理缓存空间
 */

import { MAX_TEXT_CACHE_SIZE } from "../constants";

/**
 * 创建字体缓存系统
 * @returns {Object} 包含缓存画布和2D上下文的对象
 * 
 * 配置说明：
 * - 画布尺寸：MAX_TEXT_CACHE_SIZE × MAX_TEXT_CACHE_SIZE (默认 256×256)
 * - 上下文选项：willReadFrequently=true，优化频繁读取像素的性能
 */
export const createFontCache = () => {
    // 创建离屏缓存画布
    const fontCacheCanvas = document.createElement("canvas");
    fontCacheCanvas.width = MAX_TEXT_CACHE_SIZE;
    fontCacheCanvas.height = MAX_TEXT_CACHE_SIZE;

    // 获取2D渲染上下文，启用频繁读取优化
    const fontCacheC2d = fontCacheCanvas.getContext("2d", {
        willReadFrequently: true,  // 优化频繁读取像素的性能
    });

    return {
        fontCacheCanvas,  // 缓存画布，用于存储渲染结果
        fontCacheC2d,    // 2D上下文，用于执行渲染操作
    };
};
