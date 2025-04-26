# Kaplay.js TypeScript配置说明

## tsconfig.json 文件详解

`tsconfig.json`是TypeScript项目的核心配置文件，它指导TypeScript编译器如何处理项目中的代码。对于Kaplay.js这样的大型游戏引擎，合理的TypeScript配置至关重要。

### 编译器选项

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Node",
    "noImplicitThis": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "emitDeclarationOnly": true,
    "declaration": true,
    "declarationMap": true,
    "declarationDir": "dist/declaration",
    "verbatimModuleSyntax": true,
    "strict": true,
    "types": [
      "./src/.env.d.ts"
    ]
  },
  ...
}
```

- **esModuleInterop**: 启用后可以更自然地导入CommonJS模块，就像它们是ES模块一样
  - 例如可以使用`import React from 'react'`而不是`import * as React from 'react'`

- **target** & **module**: "ESNext"设置意味着使用最新的JavaScript语法和模块系统
  - 相当于告诉编译器："使用最前沿的JavaScript特性"
  - 项目后续会通过其他工具(如esbuild)来处理浏览器兼容性问题

- **moduleResolution**: "Node"使用Node.js风格的模块解析策略
  - 决定了TypeScript如何查找导入的模块
  - 使得可以像Node.js那样通过相对路径、绝对路径或包名导入模块

- **noImplicitThis**: 禁止使用模糊不清的'this'引用
  - 这能捕获很多潜在的错误，例如在回调函数中错误地使用'this'

- **skipLibCheck**: 跳过库声明文件的类型检查，加快编译速度

- **resolveJsonModule**: 允许导入.json文件
  - 这让我们可以直接导入配置文件，如`import config from './config.json'`

- **emitDeclarationOnly**: 只生成类型声明文件(.d.ts)，不生成JavaScript代码
  - 因为实际的JavaScript转换由esbuild等工具处理

- **declaration** & **declarationMap**: 生成类型声明文件及其源映射
  - 这让Kaplay.js的用户可以获得完整的类型提示
  - 源映射可以让用户在查看类型定义时跳转到原始源代码

- **declarationDir**: 指定生成的类型声明文件存放目录

- **verbatimModuleSyntax**: 要求使用明确的导入类型语法
  - 强制区分类型导入和值导入
  - 例如：`import type { Vec2 } from './math'`

- **strict**: 启用所有严格类型检查选项
  - 这是打造可靠、健壮代码的基础，捕获更多潜在错误

- **types**: 指定需要包含的类型定义文件
  - 只包含了环境变量类型定义，避免意外引入不需要的全局类型

### 包含和排除文件

```json
{
  "include": [
    "src/**/*",
    "scripts/**/*"
  ],
  "exclude": [
    "src/index.ts",
    "./tests/**"
  ]
}
```

- **include**: 指定要编译的文件
  - 包括src目录下的所有源代码
  - 以及scripts目录下的构建和开发脚本

- **exclude**: 指定要排除的文件
  - 排除了src/index.ts(可能是特殊入口文件，由其他工具处理)
  - 排除了测试目录，测试有自己的tsconfig.json

### 小朋友理解版

想象TypeScript是一个非常聪明但有点固执的老师，它要帮你检查游戏代码是否有错误。`tsconfig.json`就是你写给这位老师的"指导信"，告诉老师：

1. "请用最新的知识来检查我的作业"(target: "ESNext")
2. "只需要检查这些文件夹里的作业"(include)
3. "这些作业不用检查，它们有专门的老师"(exclude)
4. "请特别严格地检查，不要放过任何小错误"(strict: true)
5. "帮我把作业的要点整理成笔记，放在这个文件夹里"(declaration & declarationDir)

这样，TypeScript老师就会按照你的要求帮你检查代码，确保你的游戏引擎又快又可靠！
