<!--
=============================================================================
== Kaplay.js 项目贡献指南 ==
=============================================================================

这个文档是写给想要参与Kaplay.js开发的程序员们的指南。就像是加入一个游戏开发团队的入职手册，
告诉你如何正确地参与项目，遵循团队的工作流程和规范。

文档主要包含以下重要内容：

1. 分支管理策略
   - 项目使用两个主要分支：v3001（用于修复bug）和master（用于新功能开发）
   - 如何针对不同版本提交代码修复

2. 开始贡献的步骤
   - 如何克隆代码库
   - 如何安装项目依赖

3. 开发和测试流程
   - 如何修改和测试示例代码
   - 源代码的入口点在哪里
   - 如何启动开发服务器

4. 文档规范
   - API文档是如何自动生成的
   - 组件、类型和接口的定义位置
   - 如何查找类型定义和文档注释

对想参与贡献的小朋友来说，可以这样理解：
这就像是一本"如何成为Kaplay游戏开发团队成员"的说明书，告诉你应该怎样正确地帮助改进这个游戏引擎，
让你的贡献能够顺利地被接受和合并到项目中！
-->

# Developing KAPLAY

We're currently working in two branches:

- `v3001`: the branch for v3001. This is the branch you should use to fix bugs
  on v3001 and v4000.
- `master`: the main branch, where we develop v4000. This is the branch you must
  use to develop new features.

When you publish a PR with a fix for v3001 and v4000, you should create 2 PRs,
one targeting `v3001` and the other targeting `master`. We recommend you using
[`cherry-pick`](https://dev.to/hakki/git-cherry-pick-a-guide-to-selectively-merging-commits-2i14)
to apply the fix to both branches.

## Cloning the repository

```sh
git clone https://github.com/kaplayjs/kaplay.git # to clone the repo.
cd kaplay # to enter the project directory.
pnpm install # to install dependencies.
```

## Editing examples

1. Pick on example to test and edit the corresponding `/examples/[name].js`, or
   create a new file under `/examples` to test anything you're working on.
1. The source entry point is `src/kaplay.ts`, editing any files referenced will
   automatically trigger rebuild. **Make sure not to break any existing
   examples**.
1. Run `pnpm dev` to start the dev server and try examples.

## Documentation

KAPLAY API documentation is auto-generated by JSDoc comments in the source code.

Normally the definitions of components, types, interfaces (i.e: `SpriteComp`,
`Vec2`, `RectComp`, `LifespanCompOpt`) are on their own files. For example

- `src/components/draw/sprite.ts` for `SpriteComp`
- `src/math/math.ts` for `Vec2`
- `src/components/draw/rect.ts` for `RectComp`
- `src/components/misc/lifespan.ts` for `LifespanCompOpt`

Your best option is use **ctrl + click** on the type to go to the definition and
see the JSDoc comments. Other option is to use the search feature of your IDE.

Types like the components one (`sprite()`, `rect()`, `lifespan()`) are defined
on `types.ts` file, in the `KAPLAYCtx` interface, this is because what
`kaplay()` returns is a `KAPLAYCtx` object. So even if component files has the
definition, the JSDoc comments are on `types.ts`.

**Help on improving the documentation is appreciated!**

## JSDoc comments

There is the structure of a JSDoc comment:

- The Description of the member.
- `@deprecated` when the member is deprecated.
- `@requires` when the member requires something to work. Usually a component.
- `@param` for each parameter. Each parameter should have - at start.
- `@example` for 1 (and only one) example.
- `@static` only if the value is an static method
- `@returns` for the return value description.
- `@since` for the version when the member was added.
- `@group` for the group of the member.

Example:

````ts
/**
   * Attach and render a circle to a Game Object.
   *
   * @param radius - The radius of the circle.
   * @param opt - Options for the circle component. See {@link CircleCompOpt `CircleCompOpt`}.
   *
   * @example
   * ```js
   * add([
   *     pos(80, 120),
   *     circle(16),
   * ])
   * ```
   *
   * @returns The circle comp.
   * @since v2000.0
   * @group Components
   */
  circle(radius: number, opt?: CircleCompOpt): CircleComp;
````

## Abbreviations

- `opt` for an options object.
- `pos` for a position vector.
- `dir` for a direction vector.
- `comp` for a component.
- `game obj` word for a game object.
- `lst` for a list of something.
- `action` the callback that is executed when smt happens.
- `btn` button
- `k` in some contexts, key, in others, KAPLAY interface

# Before commit

1. Follow our [conventional commits](#conventional-commits-guide) format. You
   can see how seeing the commit history.
2. `pnpm run check` to check TypeScript.
3. `pnpm run fmt` to format.

# Conventional Commits Guide

This guide should be followed for all commits to the repository, and also for
issues and PRs.

A commit starts with a type, a scope, and a subject:

```
<type>(<scope>): <subject>
```

- The **type** is mandatory. [Should be one of the following](#commit-types).
- We don't use the **scope** right now, you must omit it. This may change in the
  future.
- The subject must be a short description of the change. Use the imperative,
  present tense: "change" not "changed" nor "changes".

### Commit types

`feat`: a new feature or part of a feature

```
feat: add hello() component
```

`fix`: a bug fix

```
fix: fix platformer example
```

`docs`: changes to documentation (jsDoc, md files, etc)

```
docs: update add() component jsDoc example
```

`style`: changes that do not affect the meaning of the code (white-space,
formatting, missing semi-colons, etc)

```
style: format all files
```

`refactor`: a code change that neither fixes a bug nor adds a feature

```
refactor: move assets to src/assets
```

`test`: adding missing tests or correcting existing tests

```
test: added tests for add() component
```

`build`: changes that affect the build system or external dependencies (esbuild,
typescript)

```
build: update esbuild to 0.12.0
```

`ci`: changes to our CI configuration files and scripts (Github Actions)

```
ci: add examples test workflow
```

`revert`: reverts a previous commit

```
revert: feat: add hello() component
```

`chore`: updating tasks, general maintenance, etc (anything that doesn't fit in
the above types)

```
chore: update README.md
```

### Special Type

`bug`: for bugs on issues. Is not a commit type but used on issues.
