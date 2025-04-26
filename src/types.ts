/**
 * Kaplay 引擎核心类型定义
 * 
 * 这个文件定义了引擎中最基本的类型：
 * 1. 游戏对象(GameObj)
 * 2. 组件(Component)
 * 3. 事件系统
 */

import { Mat23 } from "./math/math";
import type { KEventController } from "./events/events";

/**
 * 组件接口
 * 所有组件必须实现这个接口
 */
export interface Comp {
    /** 组件ID */
    id?: string;
    /** 组件依赖 */
    require?: string[];
    /** 组件初始化 */
    add?: () => void;
    /** 组件清理 */
    destroy?: () => void;
    /** 固定更新 */
    fixedUpdate?: () => void;
    /** 逻辑更新 */
    update?: () => void;
    /** 渲染 */
    draw?: () => void;
    /** 调试渲染 */
    drawInspect?: () => void;
    /** 获取状态 */
    inspect?: () => unknown;
}

/**
 * 游戏对象的基础接口
 */
export interface GameObjBase {
    /** 对象ID */
    id: string;
    /** 是否隐藏 */
    hidden?: boolean;
    /** 是否暂停 */
    paused?: boolean;
    /** 父对象 */
    parent?: GameObjBase;
    /** 子对象列表 */
    children: GameObjBase[];
    /** 变换矩阵 */
    transform: Mat23 | null;
    /** 可见性 */
    visible?: boolean;
    /** 对象名称 */
    name?: string;
    /** 层级索引 */
    layerIndex?: number;
    /** Z轴深度 */
    z?: number;
}

/**
 * 游戏对象的调试信息
 */
export interface GameObjInspect {
    /** 对象ID */
    id: string;
    /** 对象类型 */
    type: string;
    /** 组件状态 */
    components: Record<string, unknown>;
    /** 标签列表 */
    tags: string[];
}

/**
 * 完整的游戏对象接口
 */
export interface GameObj<T = unknown> extends GameObjBase {
    /** 使用组件 */
    use(comp: Comp): void;
    /** 移除组件 */
    unuse(id: string): void;
    /** 获取组件 */
    c(id: string): Comp | null;
    /** 查询子对象 */
    get<T = any>(t: Tag | Tag[], opts?: GetOpt): GameObj<T>[];
    /** 检查标签或组件 */
    is(t: Tag | Tag[]): boolean;
    /** 检查组件 */
    has(list: string | string[], op?: "and" | "or"): boolean;
    /** 添加事件监听 */
    on(name: string, action: (...args: unknown[]) => void): KEventController;
    /** 触发事件 */
    trigger(name: string, ...args: unknown[]): void;
    /** 销毁对象 */
    destroy(): void;
    /** 获取调试信息 */
    inspect(): GameObjInspect;
    /** 添加子对象 */
    add<T extends CompList<unknown>>(a: [...T]): GameObj<T[number]>;
    /** 移除子对象 */
    remove(obj: GameObj): void;
    /** 更新变换 */
    updateTransform(): void;
    /** 固定更新 */
    fixedUpdate(): void;
    /** 逻辑更新 */
    update(): void;
    /** 渲染树 */
    drawTree(): void;
    /** 调试渲染 */
    drawInspect(): void;
    /** 检查存在性 */
    exists(): boolean;
}

/** 标签类型 */
export type Tag = string;

/** 组件列表类型 */
export type CompList<T> = (Comp | string)[];

/** 查询选项 */
export interface GetOpt {
    /** 是否递归 */
    recursive?: boolean;
    /** 实时更新 */
    liveUpdate?: boolean;
    /** 查询类型 */
    only?: "comps" | "tags";
    /** 查询名称 */
    name?: string;
}

/** 引擎配置选项 */
export interface KAPLAYOpt {
    /** 标签作为组件 */
    tagsAsComponents?: boolean;
    /** 绘制配置 */
    drawConfig?: {
        /** 遮罩绘制 */
        drawMasked?: (func: () => void) => void;
        /** 减法绘制 */
        drawSubtracted?: (func: () => void) => void;
    };
    /** 默认层级 */
    defaultLayerIndex?: number;
}

/** 引擎上下文 */
export interface KAPLAYCtx {
    /** 引擎实例 */
    _k: any;
    /** 配置项 */
    globalOpt: KAPLAYOpt;
    /** 游戏根对象 */
    game: {
        root: GameObj;
        defaultLayerIndex: number;
        events: {
            trigger(name: string, ...args: unknown[]): void;
        };
    };
}
