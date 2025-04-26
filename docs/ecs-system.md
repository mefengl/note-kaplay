# Kaplay ECS 系统实现说明

## 1. 组件系统

### 1.1 组件定义
组件是一个包含以下可选属性的对象:
- `id`: 组件唯一标识符
- `require`: 依赖的其他组件ID数组
- `add`: 组件添加时的回调
- `destroy`: 组件销毁时的回调
- 其他自定义属性和方法

### 1.2 组件生命周期
1. 创建阶段
   - 检查组件ID是否重复
   - 注册组件状态
   - 绑定组件方法到游戏对象

2. 运行阶段   
   - fixedUpdate: 物理更新(固定时间步长)
   - update: 逻辑更新(每帧)
   - draw: 渲染(每帧)

3. 销毁阶段
   - 触发destroy回调
   - 清理组件状态
   - 移除绑定的属性和方法

### 1.3 组件通信
组件间通信通过以下方式实现:
1. 直接引用: 通过 require 声明依赖
2. 事件系统: 发布/订阅模式
3. 查询系统: 使用 get/query 方法

## 2. 事件系统

### 2.1 核心事件
- fixedUpdateEvents: 物理相关更新
- updateEvents: 每帧逻辑更新
- drawEvents: 渲染相关
- 自定义事件: 通过 on/trigger 方法实现

### 2.2 事件处理
```typescript
// 注册事件
obj.on("eventName", callback)

// 触发事件
obj.trigger("eventName", ...args)
```

## 3. 变换系统

### 3.1 基本变换
- pos: 位置向量
- angle: 旋转角度
- scale: 缩放向量

### 3.2 层级关系
- parent: 父对象
- children: 子对象数组
- transform: 变换矩阵

### 3.3 变换计算
```typescript
// 更新变换
pushTransform()
if (pos) multTranslateV(pos)
if (angle) multRotate(angle)
if (scale) multScaleV(scale)
```

## 4. 渲染系统

### 4.1 渲染流程
1. drawTree: 递归渲染所有可见对象
2. collectAndTransform: 收集和变换对象
3. 按层级和Z序排序
4. 应用遮罩和特效

### 4.2 优化策略
- 使用脏标记避免不必要的更新
- 视口裁剪
- 层级渲染
- Z序排序

## 5. 优秀实践

### 5.1 组件设计
1. 保持组件职责单一
2. 使用依赖注入而不是硬编码引用
3. 优先使用事件通信而不是直接引用

### 5.2 性能优化
1. 使用对象池减少GC
2. 批量处理更新和渲染
3. 合理使用脏标记
4. 避免深层次的对象层级
