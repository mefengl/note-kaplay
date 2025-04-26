/**
 * Kaplay 游戏引擎的核心常量配置文件
 * 这个文件定义了引擎中使用的所有关键常量，从文本渲染到着色器模板都在这里配置
 */

/**
 * ASCII 字符集
 * 用于位图字体加载时的默认字符集
 * 包含了所有可打印的 ASCII 字符，从空格到波浪号
 */
export const ASCII_CHARS =
    " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

/**
 * 默认锚点位置
 * 在游戏对象定位时使用，"topleft" 表示以左上角为基准点
 */
export const DEF_ANCHOR = "topleft";

/**
 * 背景网格大小
 * 用于调试或编辑器中显示的网格尺寸，以像素为单位
 */
export const BG_GRID_SIZE = 64;

/**
 * 字体相关默认值
 */
export const DEF_FONT = "monospace";          // 默认字体
export const DBG_FONT = "monospace";          // 调试信息使用的字体
export const DEF_TEXT_SIZE = 36;              // 默认文字大小
export const DEF_TEXT_CACHE_SIZE = 64;        // 文字缓存的默认大小
export const MAX_TEXT_CACHE_SIZE = 256;       // 文字缓存的最大限制

/**
 * 纹理图集（Atlas）的尺寸配置
 * 这些值决定了字体和精灵的最大纹理尺寸
 */
export const FONT_ATLAS_WIDTH = 2048;         // 字体图集宽度
export const FONT_ATLAS_HEIGHT = 2048;        // 字体图集高度
export const SPRITE_ATLAS_WIDTH = 2048;       // 精灵图集宽度
export const SPRITE_ATLAS_HEIGHT = 2048;      // 精灵图集高度

/**
 * UV 坐标的填充值
 * 添加 0.1 像素的填充以防止纹理渲染产生瑕疵
 */
export const UV_PAD = 0.1;

/**
 * 默认哈希网格大小
 * 用于空间划分和碰撞检测的优化
 */
export const DEF_HASH_GRID_SIZE = 64;

/**
 * 字体渲染的默认过滤模式
 * "linear" 表示使用线性插值，让文字看起来更平滑
 */
export const DEF_FONT_FILTER = "linear";

/**
 * 调试日志配置
 */
export const LOG_MAX = 8;        // 最多显示的日志条数
export const LOG_TIME = 4;       // 日志显示的持续时间（秒）

/**
 * WebGL 顶点格式定义
 * 定义了每个顶点的属性结构：位置、UV坐标和颜色
 */
export const VERTEX_FORMAT = [
    { name: "a_pos", size: 2 },    // xy 位置
    { name: "a_uv", size: 2 },     // uv 纹理坐标
    { name: "a_color", size: 4 },  // rgba 颜色
];

/**
 * 批处理渲染的配置
 * 这些值决定了一次批处理能处理的最大图形数量
 */
const STRIDE = VERTEX_FORMAT.reduce((sum, f) => sum + f.size, 0);
const MAX_BATCHED_QUAD = 2048;
export const MAX_BATCHED_VERTS = MAX_BATCHED_QUAD * 4 * STRIDE;
export const MAX_BATCHED_INDICES = MAX_BATCHED_QUAD * 6;

/**
 * WebGL 着色器模板
 * 这些模板定义了基础的渲染管线，可通过替换 {{user}} 部分来自定义着色器行为
 */
export const VERT_TEMPLATE = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform float width;
uniform float height;
uniform mat4 camera;
uniform mat4 transform;

vec4 def_vert() {
    vec4 pos = camera * transform * vec4(a_pos, 0.0, 1.0);
    return vec4(pos.x / width * 2.0 - 1.0, pos.y / -height * 2.0 + 1.0, pos.z, pos.w);
}

{{user}}

void main() {
    vec4 pos = vert(a_pos, a_uv, a_color);
    v_pos = a_pos;
    v_uv = a_uv;
    v_color = a_color;
    gl_Position = pos;
}
`;

/**
 * 片段着色器模板
 * 定义了基础的像素着色逻辑，可通过替换 {{user}} 部分来自定义
 */
export const FRAG_TEMPLATE = `
precision mediump float;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
    vec4 texColor = texture2D(u_tex, v_uv);
    return vec4((v_color.rgb * texColor.rgb), texColor.a) * v_color.a;
}

{{user}}

void main() {
    gl_FragColor = frag(v_pos, v_uv, v_color, u_tex);
    if (gl_FragColor.a == 0.0) {
        discard;
    }
}
`;

/**
 * 默认顶点着色器代码
 * 当用户没有提供自定义着色器时使用
 */
export const DEF_VERT = `
vec4 vert(vec2 pos, vec2 uv, vec4 color) {
    return def_vert();
}
`;

/**
 * 默认片段着色器代码
 * 当用户没有提供自定义着色器时使用
 */
export const DEF_FRAG = `
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    return def_frag();
}
`;

/**
 * 组件系统相关常量
 */
// 组件描述符属性集合
export const COMP_DESC = new Set(["id", "require"]);

// 组件生命周期事件集合
export const COMP_EVENTS = new Set([
    "add",              // 组件添加时
    "fixedUpdate",      // 固定时间步长更新
    "update",           // 每帧更新
    "draw",             // 渲染时
    "destroy",          // 组件销毁时
    "inspect",          // 检查组件状态
    "drawInspect",      // 绘制检查信息
]);

/**
 * 离屏距离
 * 当游戏对象距离摄像机超过这个距离时，将被认为是离屏状态
 */
export const DEF_OFFSCREEN_DIS = 200;

/**
 * 最大跳跃力
 * 用于 body() 组件中，表示角色跳跃时的最大初速度
 */
export const DEF_JUMP_FORCE = 640;

/**
 * 最大速度
 * 用于限制游戏对象的最大移动速度
 */
export const MAX_VEL = 65536;

/**
 * 事件取消符号
 * 用于标记事件被取消的特殊符号
 */
export const EVENT_CANCEL_SYMBOL = Symbol.for("kaplay.cancel");
