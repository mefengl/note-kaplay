# Kaplay.js 项目配置说明

## package.json 文件详解

`package.json` 是Kaplay.js项目的核心配置文件，就像是整个项目的身份证，它告诉开发者和工具这个项目是什么、能做什么、需要什么。

### 基本信息部分

```json
{
  "name": "kaplay",
  "description": "KAPLAY is a JavaScript & TypeScript game library that helps you make games fast and fun!",
  "version": "4000.0.0-alpha.18",
  "license": "MIT",
  "homepage": "https://v4000.kaplayjs.com/",
  ...
}
```

- **name**: 项目的名称，也是npm安装时使用的包名
- **description**: 项目描述，简明扼要地说明项目是做什么的
- **version**: 版本号，使用语义化版本(semver)规范，当前是4000.0.0的alpha.18预发布版本
- **license**: 开源许可证类型，MIT是一种非常宽松的许可协议
- **homepage**: 项目官方网站地址

### 社区和贡献信息

```json
{
  "bugs": {
    "url": "https://github.com/kaplayjs/kaplay/issues"
  },
  "funding": {
    "type": "opencollective",
    "url": "https://opencollective.com/kaplay"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/kaplayjs/kaplay.git"
  },
  ...
}
```

- **bugs**: 提交问题和bug的地址
- **funding**: 项目的资金支持渠道，使用OpenCollective平台
- **repository**: 代码仓库信息，包括类型和URL

### 包配置

```json
{
  "type": "module",
  "main": "./dist/kaplay.cjs",
  "module": "./dist/kaplay.mjs",
  "types": "./dist/doc.d.ts",
  "readme": "./README.md",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/doc.d.ts",
        "default": "./dist/kaplay.mjs"
      },
      "require": {
        "types": "./dist/doc.d.ts",
        "default": "./dist/kaplay.cjs"
      }
    },
    "./global": "./dist/declaration/global.js"
  },
  "typesVersions": {
    "*": {
      "global": [
        "./dist/declaration/global.d.ts"
      ]
    }
  },
  ...
}
```

- **type**: 指定项目使用ES模块系统
- **main**: CommonJS格式的入口文件，适用于Node.js环境
- **module**: ES模块格式的入口文件，适用于现代浏览器和打包工具
- **types**: TypeScript类型定义文件入口
- **readme**: 项目说明文档路径
- **exports**: 现代Node.js包入口配置，根据导入方式提供不同格式的文件
  - 支持ES模块(import)和CommonJS(require)两种导入方式
  - 为每种导入方式提供对应的类型定义
  - 额外导出"global"入口点，用于全局变量模式
- **typesVersions**: 类型定义版本映射，为不同的导入路径提供对应的类型定义

### 关键字

```json
{
  "keywords": [
    "game development",
    "javascript",
    "typescript",
    "game engine",
    "2d games",
    "physics engine",
    "webgl",
    "canvas",
    ...
  ],
  ...
}
```

这些关键字帮助人们在npm或搜索引擎中找到这个项目，简明扼要地概括了项目的特点和用途。

### 小朋友理解版

想象一下`package.json`是游戏的"说明书"，它告诉电脑：
1. 这个游戏叫什么名字
2. 谁制作了这个游戏
3. 游戏需要哪些"魔法工具"才能运行
4. 怎样才能启动这个游戏
5. 如果游戏出bug了，应该去哪里报告

就像你玩玩具前会看说明书一样，计算机在运行Kaplay.js前，也会先看这个文件，了解应该怎么使用它！
