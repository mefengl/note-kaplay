/**
 * =============================================================================
 * == Kaplay.js 主入口文件 ==
 * =============================================================================
 *
 * 大家好！我是 George Hotz (假装的)。欢迎来到 Kaplay.js 的心脏地带！🚀
 * 这个文件 (`kaplay.ts`) 就像是 Kaplay 游戏引擎的总开关和大脑。
 * 当你调用 `kaplay()` 函数开始一个新游戏时，所有魔法都是从这里开始的。
 *
 * 主要功能：
 * 1.  **初始化引擎**: 创建 Kaplay 的核心上下文 (`KAPLAYCtx`)，包含了游戏运行所需的所有工具和状态。
 * 2.  **导入模块**: 把 Kaplay 分散在各个文件夹（比如 `app`, `assets`, `audio`, `core`, `ecs`, `gfx` 等）的功能模块集中起来。就像组装一台电脑，把 CPU、显卡、内存条都插到主板上。
 * 3.  **设置全局函数 (可选)**: 默认情况下，它会把 Kaplay 的常用函数（如 `add`, `loadSprite`, `onUpdate` 等）挂载到全局 `window` 对象上，让你在代码里可以直接调用，非常方便。当然，你也可以选择不污染全局命名空间。
 * 4.  **插件系统**: 允许你通过 `plug()` 函数给 Kaplay 添加额外的功能。
 * 5.  **启动游戏循环**: 调用 `app.run()`，让游戏动起来！这个循环会不断地处理输入、更新游戏状态、渲染画面。
 * 6.  **导出核心 API**: 把所有组装好的功能，通过一个 `ctx` 对象或者全局变量暴露出去，供你的游戏代码使用。
 *
 * 阅读建议：
 * - 先看 `kaplay()` 函数的定义和它返回的 `ctx` 对象，了解 Kaplay 提供了哪些基本能力。
 * - 再看 `createEngine()` 函数（虽然它在 `src/core/engine.ts` 里定义），理解引擎是如何被创建和配置的。
 * - 然后可以顺着 `import` 语句，去探索各个子模块的功能。
 *
 * 好了，让我们开始探索代码吧！👇
 */

// The definitive version! // 这行注释表示这是最终确定的版本，可能之前有其他实验版本。
import packageJson from "../package.json"; // 导入项目的 package.json 文件，主要用来获取版本号等信息。
// 导入各种类型定义和功能模块。就像盖房子前准备好图纸和各种材料。
import type { ButtonsDef } from "./app/inputBindings"; // 导入按钮定义的类型
import { loadAseprite } from "./assets/aseprite"; // 导入加载 Aseprite 动画文件的功能
import {
    Asset, // 资源基类
    getAsset, // 获取已加载的资源
    getFailedAssets, // 获取加载失败的资源
    load, // 通用资源加载函数
    loadJSON, // 加载 JSON 文件
    loadProgress, // 获取资源加载进度
    loadRoot, // 设置资源加载的根目录
} from "./assets/asset"; // 导入资源管理相关的基础功能
import { getBitmapFont, loadBitmapFont, loadHappy } from "./assets/bitmapFont"; // 导入位图字体加载和获取功能
import { getFont, loadFont } from "./assets/font"; // 导入普通字体加载和获取功能
import { loadPedit } from "./assets/pedit"; // 导入加载 Pedit 像素编辑文件的功能
import {
    getShader, // 获取着色器
    loadShader, // 加载着色器代码
    loadShaderURL, // 从 URL 加载着色器
    type Uniform, // 着色器 uniform 变量类型
} from "./assets/shader"; // 导入着色器（Shader）相关功能，用来实现特殊视觉效果
import { getSound, loadMusic, loadSound, SoundData } from "./assets/sound"; // 导入声音和音乐加载、获取功能
import { getSprite, loadBean, loadSprite, SpriteData } from "./assets/sprite"; // 导入精灵图（游戏角色、物品等）加载和获取功能
import { loadSpriteAtlas } from "./assets/spriteAtlas"; // 导入精灵图集加载功能，可以把多个小图合并成一张大图提高效率
import { burp } from "./audio/burp"; // 导入一个有趣的打嗝音效函数
import { play } from "./audio/play"; // 导入播放声音的核心函数
import { getVolume, setVolume, volume } from "./audio/volume"; // 导入控制音量的功能
import { ASCII_CHARS, EVENT_CANCEL_SYMBOL } from "./constants"; // 导入常量，比如 ASCII 字符集、事件取消符号
import { createEngine } from "./core/engine"; // 导入创建 Kaplay 引擎核心的函数 ✨ 这是关键！
import { handleErr } from "./core/errors"; // 导入错误处理函数
// 导入各种组件（Components）。组件是 Kaplay 构建游戏对象（GameObject）的基本单位，赋予对象不同的能力。
// --- 绘图相关的组件 ---
import { blend } from "./ecs/components/draw/blend"; // 混合模式组件（如叠加、正片叠底）
import { circle } from "./ecs/components/draw/circle"; // 绘制圆形组件
import { color } from "./ecs/components/draw/color"; // 颜色组件
import { drawon } from "./ecs/components/draw/drawon"; // 在指定画布上绘制的组件
import { ellipse } from "./ecs/components/draw/ellipse"; // 绘制椭圆组件
import { fadeIn } from "./ecs/components/draw/fadeIn"; // 淡入效果组件
import { mask } from "./ecs/components/draw/mask"; // 遮罩效果组件
import { opacity } from "./ecs/components/draw/opacity"; // 透明度组件
import { outline } from "./ecs/components/draw/outline"; // 轮廓线组件
import { particles } from "./ecs/components/draw/particles"; // 粒子效果组件
import { picture } from "./ecs/components/draw/picture"; // 离屏画布/图片组件
import { polygon } from "./ecs/components/draw/polygon"; // 绘制多边形组件
import { raycast } from "./ecs/components/draw/raycast"; // 光线投射（用于检测或视觉效果）组件
import { rect } from "./ecs/components/draw/rect"; // 绘制矩形组件
import { shader } from "./ecs/components/draw/shader"; // 应用着色器组件
import { sprite } from "./ecs/components/draw/sprite"; // 精灵图渲染组件
import { text } from "./ecs/components/draw/text"; // 文本渲染组件
import { uvquad } from "./ecs/components/draw/uvquad"; // 使用 UV 坐标绘制四边形（常用于纹理映射）组件
import { video } from "./ecs/components/draw/video"; // 播放视频组件
// --- 关卡和 AI 相关的组件 ---
import { agent } from "./ecs/components/level/agent"; // AI 代理（有简单行为逻辑）组件
import { level } from "./ecs/components/level/level"; // 关卡定义组件
import { pathfinder } from "./ecs/components/level/pathfinder"; // 寻路组件
import { patrol } from "./ecs/components/level/patrol"; // 巡逻行为组件
import { sentry } from "./ecs/components/level/sentry"; // 哨兵行为组件
import { tile } from "./ecs/components/level/tile"; // 瓦片地图组件
// --- 其他杂项组件 ---
import { animate, serializeAnimation } from "./ecs/components/misc/animate"; // 动画播放组件
import { fakeMouse } from "./ecs/components/misc/fakeMouse"; // 模拟鼠标行为组件
import { health } from "./ecs/components/misc/health"; // 生命值组件
import { lifespan } from "./ecs/components/misc/lifespan"; // 生命周期（自动销毁）组件
import { named } from "./ecs/components/misc/named"; // 命名组件（用于调试或查找）
import { state } from "./ecs/components/misc/state"; // 状态机组件
import { stay } from "./ecs/components/misc/stay"; // 保持在屏幕内组件
import { textInput } from "./ecs/components/misc/textInput"; // 文本输入组件
import { timer } from "./ecs/components/misc/timer"; // 定时器组件
// --- 物理相关的组件 ---
import { area } from "./ecs/components/physics/area"; // 碰撞区域组件
import { body } from "./ecs/components/physics/body"; // 物理刚体组件（受重力、碰撞影响）
import { doubleJump } from "./ecs/components/physics/doubleJump"; // 二段跳组件
import {
    areaEffector, // 区域效应器（如风区）
    buoyancyEffector, // 浮力效应器
    constantForce, // 恒定力效应器
    platformEffector, // 平台效应器（单向平台）
    pointEffector, // 点效应器（如引力点）
    surfaceEffector, // 表面效应器（如传送带）
} from "./ecs/components/physics/effectors"; // 各种物理效应器组件
// --- 变换相关的组件 (位置、旋转、缩放等) ---
import { anchor } from "./ecs/components/transform/anchor"; // 锚点（决定旋转和缩放的中心）组件
import { fixed } from "./ecs/components/transform/fixed"; // 固定在屏幕上（不受相机移动影响）组件
import { follow } from "./ecs/components/transform/follow"; // 跟随其他对象组件
import { layer } from "./ecs/components/transform/layer"; // 渲染层级组件
import { move } from "./ecs/components/transform/move"; // 移动方向组件（与 pos 结合使用）
import { offscreen } from "./ecs/components/transform/offscreen"; // 离开屏幕事件组件
import { pos } from "./ecs/components/transform/pos"; // 位置组件 ✨ 非常基础和常用！
import { rotate } from "./ecs/components/transform/rotate"; // 旋转组件
import { scale } from "./ecs/components/transform/scale"; // 缩放组件
import { z } from "./ecs/components/transform/z"; // Z 轴深度组件（影响绘制顺序）
import { KeepFlags } from "./ecs/make"; // 导入 GameObject 创建时的一些标志位类型
import { getCollisionSystem } from "./ecs/systems/collision"; // 导入碰撞检测系统
import { KEvent, KEventController, KEventHandler } from "./events/events"; // 导入事件系统的基本类型
// 导入全局事件监听函数。这些函数让你可以在特定事件发生时执行代码。
import {
    on, // 通用事件监听
    onAdd, // 当对象被添加到场景时
    onClick, // 当对象被点击时
    onCollide, // 当对象发生碰撞时
    onCollideEnd, // 当对象碰撞结束时
    onCollideUpdate, // 当对象持续碰撞时
    onDestroy, // 当对象被销毁时
    onDraw, // 在绘制阶段
    onError, // 当发生错误时
    onFixedUpdate, // 在固定更新阶段（用于物理计算）
    onHover, // 当鼠标悬停在对象上时
    onHoverEnd, // 当鼠标离开对象时
    onHoverUpdate, // 当鼠标持续悬停在对象上时
    onLoad, // 当所有资源加载完成时
    onLoadError, // 当资源加载失败时
    onLoading, // 在资源加载过程中
    onResize, // 当窗口大小改变时
    onTag, // 当给对象添加标签时
    onUntag, // 当移除对象标签时
    onUnuse, // 当对象不再使用某个组件时 (比较少用)
    onUpdate, // 在每帧更新阶段 ✨ 非常常用！
    onUse, // 当对象使用某个组件时 (比较少用)
    trigger, // 手动触发一个事件
} from "./events/globalEvents";
// 导入相机（Camera）相关的功能。相机决定了你在游戏世界里看到哪一部分。
import {
    camFlash, // 相机闪烁效果
    camPos, // 设置或获取相机位置
    camRot, // 设置或获取相机旋转
    camScale, // 设置或获取相机缩放
    camTransform, // 获取相机变换矩阵
    flash, // 全屏闪烁效果
    getCamPos, // 获取相机位置 (函数形式)
    getCamRot, // 获取相机旋转 (函数形式)
    getCamScale, // 获取相机缩放 (函数形式)
    getCamTransform, // 获取相机变换矩阵 (函数形式)
    setCamPos, // 设置相机位置 (函数形式)
    setCamRot, // 设置相机旋转 (函数形式)
    setCamScale, // 设置相机缩放 (函数形式)
    shake, // 屏幕震动效果
    toScreen, // 将世界坐标转换为屏幕坐标
    toWorld, // 将屏幕坐标转换为世界坐标
} from "./game/camera";
// 导入全局物理设置，比如重力。
import {
    getGravity, // 获取重力加速度
    getGravityDirection, // 获取重力方向
    setGravity, // 设置重力加速度
    setGravityDirection, // 设置重力方向
} from "./game/gravity";
import { initEvents } from "./game/initEvents"; // 导入初始化事件的函数
import { addKaboom } from "./game/kaboom"; // 导入添加一个 "Kaboom" 特效的函数（可能是彩蛋或调试用）
import { getDefaultLayer, getLayers, layers, setLayers } from "./game/layers"; // 导入图层管理功能
import { addLevel } from "./game/level"; // 导入创建关卡的函数
import { destroy, getTreeRoot } from "./game/object"; // 导入销毁对象和获取场景根节点的函数
import { getSceneName, go, onSceneLeave, scene } from "./game/scenes"; // 导入场景管理功能（切换场景、定义场景）
import { LCEvents, system } from "./game/systems"; // 导入系统（System）和生命周期事件类型。系统是处理具有特定组件的游戏对象的逻辑单元。
import { getBackground, setBackground } from "./gfx/bg"; // 导入设置和获取背景颜色的功能
import { FrameBuffer } from "./gfx/classes/FrameBuffer"; // 导入帧缓冲对象类（用于离屏渲染）
// 导入底层的绘图函数。通常你不需要直接调用这些，而是通过组件来绘制。
import { drawBezier } from "./gfx/draw/drawBezier"; // 绘制贝塞尔曲线
import { drawCanvas } from "./gfx/draw/drawCanvas"; // 绘制 Canvas 对象
import { drawCircle } from "./gfx/draw/drawCircle"; // 绘制圆形
import { drawCurve } from "./gfx/draw/drawCurve"; // 绘制曲线 (基于点集)
import { drawDebug } from "./gfx/draw/drawDebug"; // 绘制调试信息
import { drawEllipse } from "./gfx/draw/drawEllipse"; // 绘制椭圆
import { drawFormattedText } from "./gfx/draw/drawFormattedText"; // 绘制格式化文本（带样式）
import { drawFrame } from "./gfx/draw/drawFrame"; // 绘制一帧的内容（内部调用）
import { drawLine, drawLines } from "./gfx/draw/drawLine"; // 绘制直线和多段线
import { drawLoadScreen } from "./gfx/draw/drawLoadingScreen"; // 绘制加载屏幕
import { drawMasked } from "./gfx/draw/drawMasked"; // 使用遮罩绘制
import {
    appendToPicture, // 向离屏画布追加绘制指令
    beginPicture, // 开始录制离屏画布
    drawPicture, // 绘制一个已录制好的离屏画布
    endPicture, // 结束录制离屏画布
    Picture, // 离屏画布类型
} from "./gfx/draw/drawPicture"; // 导入离屏画布（Picture）相关功能
import { drawPolygon } from "./gfx/draw/drawPolygon"; // 绘制多边形
import { drawRect } from "./gfx/draw/drawRect"; // 绘制矩形
import { drawSprite } from "./gfx/draw/drawSprite"; // 绘制精灵图
import { drawSubtracted } from "./gfx/draw/drawSubstracted"; // 使用减去模式绘制 (用于特殊效果)
import { drawText } from "./gfx/draw/drawText"; // 绘制普通文本
import { drawTriangle } from "./gfx/draw/drawTriangle"; // 绘制三角形
import { drawUVQuad } from "./gfx/draw/drawUVQuad"; // 绘制带 UV 的四边形
import { compileStyledText, formatText } from "./gfx/formatText"; // 导入格式化文本处理功能
// 导入图形变换栈（Matrix Stack）相关的功能。用来管理复杂的坐标变换。
import {
    center, // 获取画布中心点坐标
    flush, // 强制绘制当前批次的所有内容
    height, // 获取画布高度
    loadMatrix, // 加载一个变换矩阵
    multRotate, // 乘以旋转矩阵
    multScaleV, // 乘以缩放矩阵
    multTranslateV, // 乘以平移矩阵
    popTransform, // 从栈顶弹出一个变换状态
    pushTransform, // 将当前变换状态压入栈顶
    width, // 获取画布宽度
} from "./gfx/stack";
import { updateViewport } from "./gfx/viewport"; // 导入更新视口（Viewport）的函数
const VERSION = packageJson.version; // 从 package.json 获取当前 Kaplay 的版本号

// 导入 Kaplay 自带的一些资源，比如 Logo
import boomSpriteSrc from "./kassets/boom.png";
import kaSpriteSrc from "./kassets/ka.png";
// 导入数学库中的各种工具函数和类。游戏开发离不开数学！
import { clamp } from "./math/clamp"; // 将数值限制在某个范围内
import { Color, hsl2rgb, rgb } from "./math/color"; // 颜色类和颜色转换函数 (RGB, HSL)
import easings from "./math/easings"; // 缓动函数（用于动画，如 easeInQuad, easeOutBounce 等）
import { gjkShapeIntersection, gjkShapeIntersects } from "./math/gjk"; // GJK 算法，用于精确的凸多边形碰撞检测
import {
    bezier, // 创建贝塞尔曲线函数
    cardinal, // 创建 Cardinal 样条曲线函数
    catmullRom, // 创建 Catmull-Rom 样条曲线函数
    chance, // 根据概率返回 true 或 false
    choose, // 从数组中随机选择一个元素
    chooseMultiple, // 从数组中随机选择多个元素
    Circle, // 圆形几何类
    clipLineToCircle, // 将线段裁剪到圆内
    clipLineToRect, // 将线段裁剪到矩形内
    curveLengthApproximation, // 近似计算曲线长度
    deg2rad, // 角度转弧度
    easingCubicBezier, // 三次贝塞尔缓动函数
    easingLinear, // 线性缓动函数
    easingSteps, // 步进缓动函数
    Ellipse, // 椭圆几何类
    evaluateBezier, // 计算贝塞尔曲线上某点的位置
    evaluateBezierFirstDerivative, // 计算贝塞尔曲线一阶导数（切线方向）
    evaluateBezierSecondDerivative, // 计算贝塞尔曲线二阶导数（曲率）
    evaluateCatmullRom, // 计算 Catmull-Rom 曲线上某点的位置
    evaluateCatmullRomFirstDerivative, // 计算 Catmull-Rom 曲线一阶导数
    evaluateQuadratic, // 计算二次贝塞尔曲线上某点的位置
    evaluateQuadraticFirstDerivative, // 计算二次贝塞尔曲线一阶导数
    evaluateQuadraticSecondDerivative, // 计算二次贝塞尔曲线二阶导数
    hermite, // 创建 Hermite 样条曲线函数
    isConvex, // 判断多边形是否为凸多边形
    kochanekBartels, // 创建 Kochanek-Bartels 样条曲线函数
    lerp, // 线性插值 ✨ 非常常用！
    Line, // 直线/线段几何类
    map, // 将一个值从一个范围映射到另一个范围
    mapc, // 同 map，但会将结果限制在新范围内
    Mat23, // 2x3 仿射变换矩阵类
    Mat4, // 4x4 变换矩阵类
    normalizedCurve, // 创建归一化曲线（长度为 1）
    Point, // 点几何类 (通常用 Vec2 代替)
    Polygon, // 多边形几何类
    Quad, // 四边形几何类
    quad, // 创建四边形对象的便捷函数
    rad2deg, // 弧度转角度
    rand, // 生成随机浮点数
    randi, // 生成随机整数
    randSeed, // 生成带种子的随机数
    Rect, // 矩形几何类 ✨ 非常常用！
    RNG, // 随机数生成器类
    shuffle, // 打乱数组元素顺序
    smoothstep, // 平滑步进插值
    step, // 步进函数
    testCirclePolygon, // 检测圆和多边形是否碰撞
    testLineCircle, // 检测线段和圆是否碰撞
    testLineLine, // 检测线段和线段是否碰撞
    testLinePoint, // 检测点是否在线段上
    testRectLine, // 检测矩形和线段是否碰撞
    testRectPoint, // 检测点是否在矩形内
    testRectRect, // 检测矩形和矩形是否碰撞 ✨ 非常常用！
    triangulate, // 将多边形三角化（分解成三角形）
    Vec2, // 二维向量类 ✨ 非常非常常用！表示位置、速度、方向等
    vec2, // 创建 Vec2 对象的便捷函数
    wave, // 生成周期性波形值（如正弦波）
} from "./math/math";
import { NavMesh } from "./math/navigationmesh"; // 导入导航网格类（用于复杂寻路）
// 导入 Kaplay 的核心类型定义
import {
    BlendMode, // 混合模式枚举
    type Canvas, // 画布类型
    type KAPLAYCtx, // Kaplay 核心上下文类型 ✨ 这是 `kaplay()` 函数返回的主要类型！
    type KAPLAYOpt, // Kaplay 初始化选项类型
    type KAPLAYPlugin, // Kaplay 插件类型
    type MergePlugins, // 合并插件类型工具
    type PluginList, // 插件列表类型
    type Recording, // 录屏对象类型
} from "./types";
// 导入一些实用工具函数
import {
    download, // 下载文件（通用）
    downloadBlob, // 下载 Blob 对象
    downloadJSON, // 下载 JSON 数据
    downloadText, // 下载文本数据
} from "./utils/dataURL"; // 导入数据 URL 和下载相关的工具函数

/**
 * KAPLAY.js internal data
 * Kaplay 内部使用的核心数据对象。通常你不需要直接访问它。
 * 它包含了引擎的各个子系统和状态。
 * @internal // 表示这是内部使用的，不建议外部直接用
 */
export let _k: KAPLAYCtx["_k"];

// If KAPLAY crashed // 一个标志位，记录 Kaplay 是否已经初始化，防止重复初始化。
let initialized = false;

/**
 * Initialize KAPLAY context. The starting point of all KAPLAY games.
 * 初始化 KAPLAY 上下文。所有 KAPLAY 游戏的起点！
 *
 * @example // 这里是使用示例代码
 * ```js
 * // Start KAPLAY with default options (will create a fullscreen canvas under <body>)
 * // 使用默认选项启动 KAPLAY (会在 <body> 下创建一个全屏画布)
 * kaplay()
 *
 * // Init with some options
 * // 使用一些自定义选项初始化
 * kaplay({
 *     width: 320, // 画布宽度
 *     height: 240, // 画布高度
 *     font: "sans-serif", // 默认字体
 *     canvas: document.querySelector("#mycanvas"), // 使用页面上已有的 canvas 元素
 *     background: [ 0, 0, 255, ], // 设置背景色为蓝色 (RGBA)
 * })
 *
 * // All KAPLAY functions are imported to global after calling kaplay()
 * // 调用 kaplay() 后，所有 KAPLAY 函数都会导入到全局作用域
 * add() // 添加游戏对象
 * onUpdate() // 注册每帧更新事件
 * onKeyPress() // 注册按键按下事件
 * vec2() // 创建二维向量
 *
 * // If you want to prevent KAPLAY from importing all functions to global and use a context handle for all KAPLAY functions
 * // 如果你不想让 KAPLAY 函数污染全局作用域，可以使用一个上下文句柄来调用所有函数
 * const k = kaplay({ global: false }) // 设置 global: false
 *
 * k.add(...) // 通过 k 对象调用 add
 * k.onUpdate(...) // 通过 k 对象调用 onUpdate
 * k.onKeyPress(...) // 通过 k 对象调用 onKeyPress
 * k.vec2(...) // 通过 k 对象调用 vec2
 * ```
 *
 * @group Start // 这个注释用于文档生成，表示这个函数属于 "Start" 分组
 */
// 定义 kaplay 函数。使用了泛型来支持插件和自定义按钮。
// TPlugins: 插件列表类型
// TButtons: 自定义按钮定义类型
// TButtonsName: 自定义按钮名称类型
const kaplay = <
    TPlugins extends PluginList<unknown> = [undefined], // 默认没有插件
    TButtons extends ButtonsDef = {}, // 默认没有自定义按钮
    TButtonsName extends string = keyof TButtons & string, // 按钮名称是 TButtons 的键
>(
    gopt: KAPLAYOpt<TPlugins, TButtons> = {}, // gopt 是用户传入的初始化选项，默认为空对象
): TPlugins extends [undefined] ? KAPLAYCtx<TButtons, TButtonsName> // 如果没有插件，返回基础的 KAPLAYCtx
    : KAPLAYCtx<TButtons, TButtonsName> & MergePlugins<TPlugins> => // 如果有插件，返回基础 KAPLAYCtx 与插件类型合并后的类型
{
    // 防止重复初始化
    if (initialized) {
        console.warn( // 在控制台打印警告信息
            "KAPLAY already initialized, you are calling kaplay() multiple times, it may lead bugs!",
            // "KAPLAY 已经初始化，你多次调用了 kaplay()，这可能导致 bug！"
        );
    }

    initialized = true; // 标记为已初始化

    // ✨✨✨ 核心步骤：创建引擎实例 ✨✨✨
    // 调用 `createEngine` (定义在 src/core/engine.ts) 来设置好 Kaplay 的所有内部状态和子系统。
    // `gopt` 是用户传入的配置选项。
    _k = createEngine(gopt);

    // 从创建好的引擎实例 `_k` 中解构出各个子系统/模块的引用，方便后续使用。
    const {
        ggl, // 底层 WebGL 封装 (可能是 "Good GL"?)
        assets, // 资源管理器
        audio, // 音频管理器
        frameRenderer, // 帧渲染器 (处理更新和绘制循环)
        gfx, // 图形管理器 (处理绘图状态和操作)
        app, // 应用程序管理器 (处理窗口、输入、主循环)
        game, // 游戏状态管理器 (处理场景、对象、系统)
        debug, // 调试工具
    } = _k;

    // 获取碰撞检测系统，并注册它的检查函数 `checkFrame` 到游戏循环中。
    // 碰撞检测需要在每次物理更新 (`AfterFixedUpdate`) 和逻辑更新 (`AfterUpdate`) 后运行。
    const { checkFrame } = getCollisionSystem();
    system("collision", checkFrame, [ // 注册一个名为 "collision" 的系统
        LCEvents.AfterFixedUpdate, // 在固定更新后运行
        LCEvents.AfterUpdate, // 在逻辑更新后运行
    ]);

    // TODO: make this an opt // 待办事项：让加载 Kaplay Logo 成为一个可选项
    // 加载 Kaplay 的 Logo 精灵图，存储在 game 对象中，可能用于某些默认效果或调试。
    game.kaSprite = loadSprite(null, kaSpriteSrc);
    game.boomSprite = loadSprite(null, boomSpriteSrc);

    /**
     * 创建一个离屏画布 (Canvas)。
     * 离屏画布就像一个看不见的画板，你可以在上面画画，然后再把整个画板一次性绘制到屏幕上。
     * 这对于实现一些特殊效果或者优化性能很有用。
     * @param w 画布宽度
     * @param h 画布高度
     * @returns 返回一个 Canvas 对象，包含绘制、清除、导出等方法。
     */
    function makeCanvas(w: number, h: number): Canvas {
        // 创建一个 FrameBuffer 对象，这是 WebGL 中用于离屏渲染的技术。
        const fb = new FrameBuffer(ggl, w, h);

        // 返回一个封装好的 Canvas 对象，提供更友好的 API。
        return {
            clear: () => fb.clear(), // 清除画布内容
            free: () => fb.free(), // 释放画布占用的资源
            toDataURL: () => fb.toDataURL(), // 将画布内容导出为 Data URL (可以用于图片保存)
            toImageData: () => fb.toImageData(), // 将画布内容导出为 ImageData 对象
            width: fb.width, // 画布宽度
            height: fb.height, // 画布高度
            // 在这个离屏画布上执行绘制操作
            draw: (action: () => void) => {
                flush(); // 先确保之前的绘制指令都提交了
                fb.bind(); // 将绘制目标切换到这个 FrameBuffer
                action(); // 执行用户提供的绘制函数 (例如 drawSprite, drawRect 等)
                flush(); // 提交在离屏画布上的绘制指令
                fb.unbind(); // 将绘制目标切换回主屏幕
            },\n            // 提供一个只读属性来访问底层的 FrameBuffer 对象 (如果需要更底层的操作)
            get fb() {
                return fb;
            },
        };
    }

    /**
     * 应用后期处理效果 (Post-processing Effect)。
     * 后期处理是在整个场景都绘制完毕后，对最终的画面进行处理，以实现各种视觉效果，
     * 比如模糊、色彩校正、CRT 屏幕模拟等。
     * @param name 要使用的着色器名称 (需要预先加载)
     * @param uniform 传递给着色器的 uniform 变量 (可以是静态对象或返回对象的函数)
     */
    function usePostEffect(name: string, uniform?: Uniform | (() => Uniform)) {
        gfx.postShader = name; // 设置要使用的后期处理着色器
        gfx.postShaderUniform = uniform ?? null; // 设置传递给着色器的 uniform 数据
    }

    /**
     * 从本地存储 (localStorage) 读取数据。
     * localStorage 是浏览器提供的一种简单的数据持久化方式，可以用来保存游戏进度、设置等。
     * @param key 数据的键名
     * @param def 如果没有找到对应的数据，返回的默认值
     * @returns 返回读取到的数据 (JSON 解析后)，如果读取失败或没有默认值，则返回 null。
     */
    function getData<T>(key: string, def?: T): T | null {
        try {
            // 尝试从 localStorage 读取并用 JSON 解析
            return JSON.parse(window.localStorage[key]);
        } catch {
            // 如果读取或解析失败
            if (def) {
                // 如果提供了默认值，就将默认值存入 localStorage 并返回
                setData(key, def);
                return def;
            }
            else {
                // 如果没有默认值，返回 null
                return null;
            }
        }
    }

    /**
     * 将数据写入本地存储 (localStorage)。
     * @param key 数据的键名
     * @param data 要存储的数据 (会被 JSON 序列化)
     */
    function setData(key: string, data: any) {
        // 使用 JSON.stringify 将数据转换为字符串，然后存入 localStorage
        window.localStorage[key] = JSON.stringify(data);
    }

    /**
     * 加载并启用一个 Kaplay 插件。
     * 插件可以扩展 Kaplay 的核心功能。
     * @param plugin 要加载的插件函数
     * @param args 传递给插件初始化函数的参数 (如果插件需要的话)
     * @returns 返回增强后的 Kaplay 上下文对象 (包含了插件添加的功能)
     */
    function plug<T extends Record<string, any>>( // T 是插件导出的功能集合类型
        plugin: KAPLAYPlugin<T>, // plugin 是符合 KAPLAYPlugin 规范的函数
        ...args: any // ...args 是传递给插件的可选参数
    ): KAPLAYCtx & T { // 返回值是原始 KAPLAYCtx 和插件 T 的合并类型
        // 调用插件函数，传入当前的 Kaplay 上下文 ctx
        const funcs = plugin(ctx);
        let funcsObj: T; // 用来存储插件最终提供的功能对象

        // 插件可以返回一个函数（如果它需要接收参数进行配置），或者直接返回功能对象
        if (typeof funcs === "function") {
            // 如果返回的是函数，就用传入的 args 调用它，得到最终的功能对象
            const plugWithOptions = funcs(...args);
            funcsObj = plugWithOptions(ctx); // 再次传入 ctx，有些插件可能需要
        }
        else {
            // 如果直接返回功能对象
            funcsObj = funcs;
        }

        // 将插件提供的所有功能（属性和方法）添加到 Kaplay 的主上下文 ctx 中
        for (const key in funcsObj) {
            // 使用类型断言，因为 TypeScript 可能无法直接推断 key 的类型
            ctx[key as keyof typeof ctx] = funcsObj[key];

            // 如果用户没有禁用全局模式 (gopt.global !== false)
            // 就把插件的功能也挂载到全局 window 对象上
            if (gopt.global !== false) {
                window[key as any] = funcsObj[key];
            }
        }
        // 返回合并了插件功能的 Kaplay 上下文对象
        // 使用 `as unknown as` 进行类型转换，这是告诉 TypeScript "相信我，我知道我在做什么"
        return ctx as unknown as KAPLAYCtx & T;
    }

    /**
     * 开始录制游戏画面。
     * @param frameRate 录制的帧率 (可选)
     * @returns 返回一个 Recording 对象，包含暂停、继续、停止、下载等方法。
     */
    function record(frameRate?: number): Recording {
        // 使用浏览器的 MediaStream Recording API 来捕获 canvas 的视频流
        const stream = app.canvas.captureStream(frameRate);
        // 创建一个音频目标节点，用于捕获游戏声音
        const audioDest = audio.ctx.createMediaStreamDestination();

        // 将主音频节点连接到捕获目标
        audio.masterNode.connect(audioDest);

        // TODO: Enabling audio results in empty video if no audio received
        // 待办事项：如果游戏没有声音，启用音频捕获会导致录制的视频为空。需要修复。
        // (以下是尝试添加音轨的代码，暂时注释掉了)
        // const audioStream = audioDest.stream
        // const [firstAudioTrack] = audioStream.getAudioTracks()
        // stream.addTrack(firstAudioTrack);

        // 创建 MediaRecorder 实例来处理录制过程
        const recorder = new MediaRecorder(stream);
        const chunks: any[] = []; // 用于存储录制下来的视频数据块

        // 当有新的数据块可用时，将其添加到 chunks 数组
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        // 录制出错时的清理操作
        recorder.onerror = () => {
            audio.masterNode.disconnect(audioDest); // 断开音频连接
            stream.getTracks().forEach(t => t.stop()); // 停止所有媒体轨道
        };

        // 开始录制
        recorder.start();

        // 返回一个控制录制的对象
        return {
            resume() { // 继续录制
                recorder.resume();
            },

            pause() { // 暂停录制
                recorder.pause();
            },

            // 停止录制并返回包含视频数据的 Blob 对象
            stop(): Promise<Blob> {
                recorder.stop();
                // 清理资源
                audio.masterNode.disconnect(audioDest);
                stream.getTracks().forEach(t => t.stop());
                // 返回一个 Promise，因为停止操作是异步的
                return new Promise((resolve) => {
                    // 当录制完全停止后
                    recorder.onstop = () => {
                        // 将所有数据块合并成一个 Blob 对象 (MP4 格式)
                        resolve(
                            new Blob(chunks, {
                                type: "video/mp4",
                            }),
                        );
                    };
                });
            },

            // 停止录制并直接下载视频文件
            download(filename = "kaboom.mp4") { // 默认文件名 "kaboom.mp4"
                this.stop().then((blob) => downloadBlob(filename, blob)); // 调用 stop 获取 Blob，然后下载
            },
        };
    }

    /**
     * 检查游戏画布当前是否获得焦点。
     * @returns 如果画布获得焦点，返回 true，否则返回 false。
     */
    function isFocused(): boolean {
        // `document.activeElement` 返回当前页面上获得焦点的元素
        return document.activeElement === app.canvas;
    }

    // --- 创建一些常用函数的别名 (Aliases) ---
    // 这些函数本质上是调用场景根节点 (game.root) 上对应的方法，
    // 但直接暴露出来可以方便用户使用，少打几个字。
    const add = game.root.add.bind(game.root); // 添加游戏对象到根场景
    const readd = game.root.readd.bind(game.root); // 重新添加一个之前被移除的对象 (保留状态)
    const destroyAll = game.root.removeAll.bind(game.root); // 销毁根场景下的所有对象
    const get = game.root.get.bind(game.root); // 获取根场景下的对象 (根据标签或其他条件)
    const wait = game.root.wait.bind(game.root); // 等待一段时间后执行回调
    const loop = game.root.loop.bind(game.root); // 每隔一段时间重复执行回调
    const query = game.root.query.bind(game.root); // 查询根场景下的对象 (类似 get，但选项更丰富)
    const tween = game.root.tween.bind(game.root); // 创建补间动画

    // --- 垃圾回收 (Garbage Collection) 相关 ---
    // 用于存储需要在游戏退出时执行的清理函数
    const gc: Array<() => void> = [];

    /**
     * 注册一个清理函数。
     * 这个函数会在调用 `quit()` 退出游戏时被执行。
     * @param action 要执行的清理操作。
     */
    function onCleanup(action: () => void) {
        gc.push(action);
    }

    /**
     * 退出游戏。
     * 这会停止游戏循环，并执行所有注册的清理函数。
     */
    function quit() {
        // 使用 onOnce 确保退出逻辑只在下一帧结束后执行一次
        game.events.onOnce("frameEnd", () => {
            // 停止应用程序主循环
            app.quit();

            // 清理 WebGL 画布
            gfx.gl.clear(\n                gfx.gl.COLOR_BUFFER_BIT | gfx.gl.DEPTH_BUFFER_BIT
                    | gfx.gl.STENCIL_BUFFER_BIT,
            );

            // --- 解绑 WebGL 资源 ---
            // 这是一个好习惯，虽然浏览器通常会自动回收，但显式解绑可以避免潜在问题。
            // 获取 GPU 支持的最大纹理单元数量
            const numTextureUnits = gfx.gl.getParameter(
                gfx.gl.MAX_TEXTURE_IMAGE_UNITS,
            );
            // 遍历所有纹理单元，解绑 2D 纹理和立方体贴图纹理
            for (let unit = 0; unit < numTextureUnits; unit++) {
                gfx.gl.activeTexture(gfx.gl.TEXTURE0 + unit); // 激活纹理单元
                gfx.gl.bindTexture(gfx.gl.TEXTURE_2D, null); // 解绑 2D 纹理
                gfx.gl.bindTexture(gfx.gl.TEXTURE_CUBE_MAP, null); // 解绑立方体贴图
            }
            // 解绑其他 WebGL 缓冲对象
            gfx.gl.bindBuffer(gfx.gl.ARRAY_BUFFER, null); // 顶点缓冲
            gfx.gl.bindBuffer(gfx.gl.ELEMENT_ARRAY_BUFFER, null); // 索引缓冲
            gfx.gl.bindRenderbuffer(gfx.gl.RENDERBUFFER, null); // 渲染缓冲
            gfx.gl.bindFramebuffer(gfx.gl.FRAMEBUFFER, null); // 帧缓冲

            // --- 执行清理 ---
            ggl.destroy(); // 调用底层 WebGL 封装的销毁方法
            gc.forEach((f) => f()); // 执行所有通过 onCleanup 注册的函数
        });
    }

    // 标记是否是游戏启动后的第一帧
    let isFirstFrame = true;

    // --- 启动游戏主循环 ---
    // 调用 app.run()，传入两个核心函数：
    // 1. 固定更新函数 (fixedUpdate): 用于处理物理模拟等需要固定时间步长的逻辑。
    // 2. 帧更新与绘制函数 (frameUpdate): 处理游戏逻辑更新、输入和画面绘制。
    app.run(
        // --- 固定更新函数 (Fixed Update) ---
        // 这个函数会以固定的时间间隔被调用 (由 app.fixedDt 控制)，不受实际帧率影响。
        () => {
            try { // 使用 try...catch 包裹，捕获可能发生的错误
                // 只有当所有资源都加载完毕后才执行固定更新逻辑
                if (assets.loaded) {
                    // 如果游戏没有被暂停
                    if (!debug.paused) {
                        // --- 执行固定更新前的系统 ---
                        // 遍历所有注册在 LCEvents.BeforeFixedUpdate 事件上的系统并运行它们
                        for (
                            const sys of game
                                .systemsByEvent[LCEvents.BeforeFixedUpdate]
                        ) {
                            sys.run();
                        }

                        // --- 执行核心固定更新逻辑 ---
                        // 调用 frameRenderer 来处理所有游戏对象的 fixedUpdate 事件
                        frameRenderer.fixedUpdateFrame();

                        // --- 执行固定更新后的系统 ---
                        // 遍历所有注册在 LCEvents.AfterFixedUpdate 事件上的系统并运行它们
                        // 例如，碰撞检测系统就在这里运行
                        for (
                            const sys of game
                                .systemsByEvent[LCEvents.AfterFixedUpdate]
                        ) {
                            sys.run();
                        }
                    }

                    // checkFrame(); // 之前的碰撞检测调用位置，现在通过系统注册来执行
                }
            } catch (e) {
                // 如果发生错误，调用错误处理函数
                handleErr(e as Error);
            }
        },
        // --- 帧更新与绘制函数 (Frame Update & Draw) ---
        // 这个函数会在浏览器的每个渲染帧被调用 (通常是 60 FPS)。
        // 它接收两个参数：processInput (处理输入) 和 resetInput (重置输入状态)。
        (processInput, resetInput) => {
            try { // 使用 try...catch 包裹
                // --- 处理输入 ---
                // 调用传入的 processInput 函数来处理键盘、鼠标、触摸、手柄等输入。
                processInput();

                // --- 检查资源加载状态 ---
                if (!assets.loaded) { // 如果资源尚未加载完成
                    // 如果加载进度达到 100% 并且不是第一帧 (防止在第一帧就触发 load 事件)
                    if (loadProgress() === 1 && !isFirstFrame) {
                        assets.loaded = true; // 标记资源已加载完成
                        // 触发 "loadError" 事件，报告加载失败的资源详情
                        getFailedAssets().forEach(details =>
                            game.events.trigger("loadError", ...details)
                        );
                        // 触发 "load" 事件，通知游戏资源已准备就绪
                        game.events.trigger("load");
                    }
                }

                // --- 绘制加载屏幕或游戏画面 ---
                if (
                    // 条件1: 资源未加载完成 且 用户没有禁用加载屏幕 (gopt.loadingScreen !== false)
                    (!assets.loaded && gopt.loadingScreen !== false)
                    // 条件2: 或者 这是游戏的第一帧 (即使资源已加载，也可能需要显示一下 Logo 或过渡)
                    || isFirstFrame
                ) {
                    // --- 绘制加载屏幕 ---
                    frameRenderer.frameStart(); // 准备开始绘制新的一帧
                    // TODO: Currently if assets are not initially loaded no updates or timers will be run, however they will run if loadingScreen is set to false. What's the desired behavior or should we make them consistent?
                    // 待办事项：目前，如果资源未加载，更新和计时器不会运行，但如果 loadingScreen 设置为 false，它们会运行。需要统一行为。
                    drawLoadScreen(); // 调用绘制加载屏幕的函数
                    frameRenderer.frameEnd(); // 完成并提交这一帧的绘制
                }
                else {
                    // --- 执行游戏逻辑更新 ---
                    // 如果游戏没有被暂停
                    if (!debug.paused) {
                        // --- 执行更新前的系统 ---
                        for (
                            const sys of game
                                .systemsByEvent[LCEvents.BeforeUpdate]
                        ) {
                            sys.run();
                        }

                        // --- 执行核心更新逻辑 ---
                        // 调用 frameRenderer 来处理所有游戏对象的 update 事件和计时器等
                        frameRenderer.updateFrame();

                        // --- 执行更新后的系统 ---
                        // 例如，碰撞检测系统也可能在这里运行 (取决于它的注册)
                        for (
                            const sys of game
                                .systemsByEvent[LCEvents.AfterUpdate]
                        ) {
                            sys.run();
                        }
                    }

                    // checkFrame(); // 之前的碰撞检测调用位置

                    // --- 执行绘制 ---
                    frameRenderer.frameStart(); // 准备开始绘制新的一帧

                    // --- 执行绘制前的系统 ---
                    for (
                        const sys of game.systemsByEvent[LCEvents.BeforeDraw]
                    ) {
                        sys.run();
                    }

                    // --- 核心绘制逻辑 ---
                    // 调用 drawFrame 来绘制所有游戏对象 (根据它们的组件和层级)
                    drawFrame();
                    // 如果用户没有禁用调试模式 (gopt.debug !== false)，则绘制调试信息
                    if (gopt.debug !== false) drawDebug();

                    // --- 执行绘制后的系统 ---
                    // 可以用于绘制 UI 覆盖层或其他最后绘制的内容
                    for (const sys of game.systemsByEvent[LCEvents.AfterDraw]) {
                        sys.run();
                    }

                    // --- 完成绘制 ---
                    frameRenderer.frameEnd(); // 完成并提交这一帧的绘制
                }

                // 如果这是第一帧，将标志位设为 false
                if (isFirstFrame) {
                    isFirstFrame = false;
                }

                // --- 触发帧结束事件 ---
                // 可以用于执行一些每帧结束时需要处理的逻辑
                game.events.trigger("frameEnd");

                // --- 重置输入状态 ---
                // 调用传入的 resetInput 函数，为下一帧的输入处理做准备
                // (例如，将 "isKeyPressed" 状态清除)
                resetInput();
            } catch (e) {
                // 如果发生错误，调用错误处理函数
                handleErr(e as Error);
            }
        },\n    ); // app.run() 调用结束

    // 初始化视口（Viewport），确保游戏画面正确显示在画布内
    updateViewport();
    // 初始化图形相关的事件监听器 (例如窗口大小改变事件)
    initEvents(_k.gfx);

    // --- 构建并导出 Kaplay 上下文对象 (ctx) ---
    // 这个 ctx 对象是 `kaplay()` 函数最终返回给用户的东西 (除非 global: true)。
    // 它包含了 Kaplay 提供的所有功能和状态。
    const ctx: KAPLAYCtx = {
        _k, // 内部引擎实例的引用 (不建议直接使用)
        VERSION, // Kaplay 版本号
        // --- 资源加载 API ---
        loadRoot, // 设置资源根目录
        loadProgress, // 获取加载进度 (0 到 1)
        loadSprite, // 加载精灵图
        loadSpriteAtlas, // 加载精灵图集
        loadSound, // 加载音效
        loadMusic, // 加载背景音乐 (通常是流式加载)
        loadBitmapFont, // 加载位图字体
        loadFont, // 加载 TTF/OTF 字体
        loadShader, // 加载着色器代码
        loadShaderURL, // 从 URL 加载着色器
        loadAseprite, // 加载 Aseprite 文件
        loadPedit, // 加载 Pedit 文件
        loadBean, // 加载默认的 "Bean" 精灵 (Kaplay吉祥物?)
        loadHappy: loadHappy, // 加载 "Happy" 位图字体 (可能是另一个内置字体)
        loadJSON, // 加载 JSON 文件
        load, // 通用资源加载器
        getSound, // 获取已加载的声音数据
        getFont, // 获取已加载的字体
        getBitmapFont, // 获取已加载的位图字体
        getSprite, // 获取已加载的精灵数据
        getShader, // 获取已加载的着色器
        getAsset, // 获取任何已加载的资源
        Asset, // 资源基类 (类型)
        SpriteData, // 精灵数据类型
        SoundData, // 声音数据类型
        // --- 查询画布和时间信息 ---
        width, // 画布宽度
        height, // 画布高度
        center, // 画布中心点坐标
        dt: app.dt, // 获取上一帧的渲染时间差 (delta time)
        fixedDt: app.fixedDt, // 获取固定更新的时间步长
        restDt: app.restDt, // 获取固定更新后剩余的时间 (用于插值)
        time: app.time, // 获取游戏运行的总时间 (秒)
        screenshot: app.screenshot, // 截屏函数
        record, // 开始录屏函数
        isFocused, // 检查画布是否获得焦点
        setCursor: app.setCursor, // 设置鼠标光标样式
        getCursor: app.getCursor, // 获取当前鼠标光标样式
        setCursorLocked: app.setCursorLocked, // 锁定/解锁鼠标光标
        isCursorLocked: app.isCursorLocked, // 检查鼠标光标是否被锁定
        setFullscreen: app.setFullscreen, // 进入/退出全屏模式
        isFullscreen: app.isFullscreen, // 检查是否处于全屏模式
        isTouchscreen: app.isTouchscreen, // 检查当前设备是否为触摸屏
        // --- 全局事件监听 ---
        onLoad, // 资源加载完成事件
        onLoadError, // 资源加载失败事件
        onLoading, // 资源加载中事件 (提供进度)
        onResize, // 窗口大小改变事件
        onGamepadConnect: app.onGamepadConnect, // 游戏手柄连接事件
        onGamepadDisconnect: app.onGamepadDisconnect, // 游戏手柄断开事件
        onError, // 游戏运行时错误事件
        onCleanup, // 注册游戏退出时的清理函数
        // --- 杂项功能 ---
        flash: flash, // 全屏闪烁效果
        // --- 相机控制 ---
        setCamPos: setCamPos, // 设置相机位置
        getCamPos: getCamPos, // 获取相机位置
        setCamRot: setCamRot, // 设置相机旋转
        getCamRot: getCamRot, // 获取相机旋转
        setCamScale: setCamScale, // 设置相机缩放
        getCamScale: getCamScale, // 获取相机缩放
        getCamTransform: getCamTransform, // 获取相机变换矩阵
        camPos, // 直接访问相机位置 (属性)
        camScale, // 直接访问相机缩放 (属性)
        camFlash, // 相机闪烁效果
        camRot, // 直接访问相机旋转 (属性)
        camTransform, // 直接访问相机变换 (属性)
        shake, // 屏幕震动
        toScreen, // 世界坐标转屏幕坐标
        toWorld, // 屏幕坐标转世界坐标
        // --- 全局物理设置 ---
        setGravity, // 设置重力加速度
        getGravity, // 获取重力加速度
        setGravityDirection, // 设置重力方向
        getGravityDirection, // 获取重力方向
        // --- 背景和手柄 ---
        setBackground, // 设置背景颜色
        getBackground, // 获取背景颜色
        getGamepads: app.getGamepads, // 获取所有连接的游戏手柄
        // --- 游戏对象操作 (根节点别名) ---
        getTreeRoot, // 获取场景根节点
        add, // 添加对象到根节点
        destroy, // 销毁对象 (需要传入对象引用)
        destroyAll, // 销毁所有对象
        get, // 获取对象 (根据标签等)
        query, // 查询对象 (更复杂的查询)
        readd, // 重新添加对象
        // --- 组件创建函数 ---
        // (这些函数返回组件对象，用于 `add()` 函数的数组参数中)
        pos, // 位置
        scale, // 缩放
        rotate, // 旋转
        color, // 颜色
        blend, // 混合模式
        opacity, // 透明度
        anchor, // 锚点
        area, // 碰撞区域
        sprite, // 精灵图
        text, // 文本
        polygon, // 多边形
        rect, // 矩形
        circle, // 圆形
        ellipse, // 椭圆
        uvquad, // UV 四边形
        video, // 视频
        picture, // 离屏画布
        outline, // 轮廓
        particles, // 粒子
        body, // 物理刚体
        // 物理效应器
        surfaceEffector,
        areaEffector,
        pointEffector,
        buoyancyEffector,
        platformEffector,
        constantForce,
        doubleJump, // 二段跳
        shader, // 着色器
        textInput, // 文本输入
        timer, // 定时器
        fixed, // 固定在屏幕
        stay, // 保持在屏幕内
        health, // 生命值
        lifespan, // 生命周期
        named, // 命名
        state, // 状态机
        z, // Z 轴深度
        layer, // 图层
        move, // 移动方向
        offscreen, // 离开屏幕事件
        follow, // 跟随
        fadeIn, // 淡入
        mask, // 遮罩
        drawon, // 在指定画布绘制
        raycast, // 光线投射
        tile, // 瓦片
        animate, // 动画
        serializeAnimation, // 序列化动画状态
        // AI 和关卡组件
        agent,
        sentry,
        patrol,
        pathfinder,
        level,
        fakeMouse, // 模拟鼠标
        // --- 事件监听 (针对特定对象或标签) ---
        trigger, // 手动触发事件
        on: on as KAPLAYCtx["on\"], // 通用事件监听 (类型断言以放宽内部严格类型)
        onFixedUpdate, // 固定更新事件
        onUpdate, // 每帧更新事件
        onDraw, // 绘制事件
        onAdd, // 添加到场景事件
        onDestroy, // 销毁事件
        onUse, // 使用组件事件
        onUnuse, // 停止使用组件事件
        onTag, // 添加标签事件
        onUntag, // 移除标签事件
        onClick, // 点击事件
        onCollide, // 碰撞开始事件
        onCollideUpdate, // 持续碰撞事件
        onCollideEnd, // 碰撞结束事件
        onHover, // 鼠标悬停开始事件
        onHoverUpdate, // 持续悬停事件
        onHoverEnd, // 鼠标悬停结束事件
        // --- 输入事件和状态查询 ---
        // 按键事件
        onKeyDown: app.onKeyDown, // 按键按下 (持续触发)
        onKeyPress: app.onKeyPress, // 按键按下 (单次触发)
        onKeyPressRepeat: app.onKeyPressRepeat, // 按键按下 (重复触发)
        onKeyRelease: app.onKeyRelease, // 按键释放
        // 鼠标事件
        onMouseDown: app.onMouseDown, // 鼠标按下 (持续触发)
        onMousePress: app.onMousePress, // 鼠标按下 (单次触发)
        onMouseRelease: app.onMouseRelease, // 鼠标释放
        onMouseMove: app.onMouseMove, // 鼠标移动
        // 字符输入事件
        onCharInput: app.onCharInput, // 文本输入
        // 触摸事件
        onTouchStart: app.onTouchStart, // 触摸开始
        onTouchMove: app.onTouchMove, // 触摸移动
        onTouchEnd: app.onTouchEnd, // 触摸结束
        // 滚动事件
        onScroll: app.onScroll, // 鼠标滚轮滚动
        // 窗口可见性事件
        onHide: app.onHide, // 页面隐藏
        onShow: app.onShow, // 页面显示
        // 游戏手柄事件
        onGamepadButtonDown: app.onGamepadButtonDown, // 手柄按钮按下 (持续)
        onGamepadButtonPress: app.onGamepadButtonPress, // 手柄按钮按下 (单次)
        onGamepadButtonRelease: app.onGamepadButtonRelease, // 手柄按钮释放
        onGamepadStick: app.onGamepadStick, // 手柄摇杆移动
        // 抽象按钮事件 (可映射到键盘、鼠标或手柄)
        onButtonPress: app.onButtonPress, // 按钮按下 (单次)
        onButtonDown: app.onButtonDown, // 按钮按下 (持续)
        onButtonRelease: app.onButtonRelease, // 按钮释放
        // 输入状态查询
        mousePos: app.mousePos, // 获取鼠标当前位置
        mouseDeltaPos: app.mouseDeltaPos, // 获取鼠标自上一帧以来的移动距离
        isKeyDown: app.isKeyDown, // 检查按键是否被持续按下
        isKeyPressed: app.isKeyPressed, // 检查按键是否在本帧被按下
        isKeyPressedRepeat: app.isKeyPressedRepeat, // 检查按键是否在本帧被按下 (重复)
        isKeyReleased: app.isKeyReleased, // 检查按键是否在本帧被释放
        isMouseDown: app.isMouseDown, // 检查鼠标按键是否被持续按下
        isMousePressed: app.isMousePressed, // 检查鼠标按键是否在本帧被按下
        isMouseReleased: app.isMouseReleased, // 检查鼠标按键是否在本帧被释放
        isMouseMoved: app.isMouseMoved, // 检查鼠标是否在本帧移动过
        isGamepadButtonPressed: app.isGamepadButtonPressed, // 检查手柄按钮是否在本帧被按下
        isGamepadButtonDown: app.isGamepadButtonDown, // 检查手柄按钮是否被持续按下
        isGamepadButtonReleased: app.isGamepadButtonReleased, // 检查手柄按钮是否在本帧被释放
        getGamepadStick: app.getGamepadStick, // 获取手柄摇杆状态
        isButtonPressed: app.isButtonPressed, // 检查抽象按钮是否在本帧被按下
        isButtonDown: app.isButtonDown, // 检查抽象按钮是否被持续按下
        isButtonReleased: app.isButtonReleased, // 检查抽象按钮是否在本帧被释放
        // 抽象按钮配置
        setButton: app.setButton, // 定义或修改一个抽象按钮的映射
        getButton: app.getButton, // 获取一个抽象按钮的定义
        pressButton: app.pressButton, // 模拟按下抽象按钮
        releaseButton: app.releaseButton, // 模拟释放抽象按钮
        getLastInputDeviceType: app.getLastInputDeviceType, // 获取最后使用的输入设备类型
        charInputted: app.charInputted, // 获取本帧输入的字符列表
        // --- 定时器 (根节点别名) ---
        loop, // 循环执行
        wait, // 等待执行
        // --- 音频 API ---
        play, // 播放声音
        setVolume: setVolume, // 设置全局音量
        getVolume: getVolume, // 获取全局音量
        volume, // 直接访问全局音量 (属性)
        burp, // 播放打嗝音效
        audioCtx: audio.ctx, // 访问底层的 Web Audio API 上下文
        // --- 数学库 API ---
        // 几何类型
        Line, Rect, Circle, Ellipse, Point, Polygon, Vec2, Color, Mat4, Mat23, Quad, RNG,
        // 便捷创建函数
        rand, randi, randSeed, vec2, rgb, hsl2rgb, quad,
        // 随机和选择
        choose, chooseMultiple, shuffle, chance,
        // 插值和映射
        lerp, step, smoothstep, tween, easings, map, mapc, wave, deg2rad, rad2deg, clamp,
        // 曲线计算
        evaluateQuadratic, evaluateQuadraticFirstDerivative, evaluateQuadraticSecondDerivative,
        evaluateBezier, evaluateBezierFirstDerivative, evaluateBezierSecondDerivative,
        evaluateCatmullRom, evaluateCatmullRomFirstDerivative,
        curveLengthApproximation, normalizedCurve,
        // 曲线创建
        hermite, cardinal, catmullRom, bezier, kochanekBartels,
        // 缓动函数创建
        easingSteps, easingLinear, easingCubicBezier,
        // 碰撞检测函数
        testLineLine, testRectRect, testRectLine, testRectPoint, testCirclePolygon,
        testLinePoint, testLineCircle,
        // 裁剪函数
        clipLineToRect, clipLineToCircle,
        // 高级碰撞检测和多边形处理
        gjkShapeIntersects, gjkShapeIntersection, isConvex, triangulate,
        // 导航网格
        NavMesh,
        // --- 底层绘制 API ---
        // (通常通过组件使用，但也可以直接调用)
        drawSprite, drawText, formatText, compileStyledText, drawRect, drawLine, drawLines,
        drawTriangle, drawCircle, drawEllipse, drawUVQuad, drawPolygon, drawCurve, drawBezier,
        drawFormattedText, drawMasked, drawSubtracted,
        // 离屏画布 (Picture) 操作
        beginPicture, appendToPicture, endPicture, drawPicture,
        // 变换栈操作
        pushTransform, popTransform, pushTranslate: multTranslateV, pushScale: multScaleV,
        pushRotate: multRotate, pushMatrix: loadMatrix,
        // 后期处理
        usePostEffect,
        // 画布创建和绘制
        makeCanvas, drawCanvas, Picture,
        // --- 调试 API ---
        debug, // 访问调试对象 (包含暂停、时间缩放、日志等功能)
        // --- 场景管理 API ---
        scene, // 定义一个新场景
        getSceneName, // 获取当前场景名称
        go, // 跳转到指定场景
        onSceneLeave, // 注册离开当前场景时的回调
        // --- 图层管理 API ---
        layers: layers, // 定义渲染图层顺序
        getLayers: getLayers, // 获取当前图层列表
        setLayers: setLayers, // 设置新的图层列表
        getDefaultLayer: getDefaultLayer, // 获取默认图层名称
        // --- 关卡 API ---
        addLevel, // 根据配置添加一个关卡对象
        // --- 本地存储 API ---
        getData, // 读取数据
        setData, // 存储数据
        download, // 下载通用文件
        downloadJSON, // 下载 JSON
        downloadText, // 下载文本
        downloadBlob, // 下载 Blob
        // --- 插件 API ---
        plug, // 加载插件
        system, // 注册系统
        // --- 字符集常量 ---
        ASCII_CHARS, // ASCII 字符集字符串
        // --- DOM 相关 ---
        canvas: app.canvas, // 直接访问游戏画布 DOM 元素
        // --- 杂项和快捷方式 ---
        addKaboom, // 添加 "Kaboom" 特效
        // 方向向量常量
        LEFT: Vec2.LEFT, RIGHT: Vec2.RIGHT, UP: Vec2.UP, DOWN: Vec2.DOWN,
        // 颜色常量
        RED: Color.RED, GREEN: Color.GREEN, BLUE: Color.BLUE, YELLOW: Color.YELLOW,
        MAGENTA: Color.MAGENTA, CYAN: Color.CYAN, WHITE: Color.WHITE, BLACK: Color.BLACK,
        quit, // 退出游戏函数
        // --- 辅助类型和常量 ---
        KEvent, // 事件类
        KEventHandler, // 事件处理器类型
        KEventController, // 事件控制器类型
        KeepFlags, // GameObject 保留标志枚举
        cancel: () => EVENT_CANCEL_SYMBOL, // 返回一个特殊符号，用于在事件回调中取消后续处理
        BlendMode, // 混合模式枚举 (类型)
    }; // ctx 对象定义结束

    // 将最终构建好的 ctx 挂载回内部引擎实例 _k 上，方便内部模块访问完整的 API 集。
    _k.k = ctx;

    // --- 加载用户配置的插件 ---
    // 类型断言，告诉 TypeScript gopt.plugins 是一个插件数组
    const plugins = gopt.plugins as KAPLAYPlugin<Record<string, unknown>>[];
    if (plugins) { // 如果用户在初始化选项中提供了插件列表
        plugins.forEach(plug); // 遍历并加载每个插件
    }

    // --- 将所有 API 导出到全局 window 对象 (如果需要) ---
    if (gopt.global !== false) { // 检查用户是否禁用了全局模式
        for (const key in ctx) { // 遍历 ctx 对象的所有属性/方法
            // 将 ctx 上的每个成员赋值给 window 对象的同名属性
            // 使用 <any> 类型断言来绕过 TypeScript 的严格检查
            (<any> window[<any> key]) = ctx[key as keyof KAPLAYCtx];
        }
    }

    // --- 自动聚焦画布 (如果需要) ---
    if (gopt.focus !== false) { // 检查用户是否禁用了自动聚焦
        app.canvas.focus(); // 让游戏画布获得焦点，这样才能接收键盘输入
    }

    // --- 返回最终的 Kaplay 上下文对象 ---
    // 根据是否有插件，返回正确的合并类型
    return ctx as unknown as TPlugins extends [undefined] ? KAPLAYCtx<TButtons, TButtonsName>
        : KAPLAYCtx<TButtons, TButtonsName> & MergePlugins<TPlugins>;
}; // kaplay 函数定义结束

// 导出 kaplay 函数，使其可以在其他文件中通过 import 使用
export { kaplay };
// 也将其作为默认导出，方便 `import kaplay from "kaplay"` 这样的用法
export default kaplay;

/**
 * =============================================================================
 * == 文件结束 ==
 * =============================================================================
 *
 * 呼～ 这个文件真是内容丰富！它就像 Kaplay 的中央枢纽，连接了所有子系统，
 * 并提供了统一的 API 接口。理解了这个文件，你就掌握了 Kaplay 的整体架构。
 *
 * 下一步建议：
 * - 查看 `src/core/engine.ts` 中的 `createEngine` 函数，了解引擎初始化的细节。
 * - 或者选择一个你感兴趣的模块（比如 `ecs`, `gfx`, `app`），深入研究它的实现。
 * - 也可以去看看 `examples/` 目录下的示例代码，了解如何实际使用这些 API。
 *
 * 继续探索吧！Have fun! 🎉
 */
