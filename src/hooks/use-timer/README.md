# `useTimer` Hook 使用手册

`useTimer` 是一个用于在 Vue 3 组合式 API 中创建计时器的自定义 Hook。它可以处理倒计时和正计时模式，并提供多种配置选项和回调函数。

## 安装和导入

确保您已经安装了 `vue-hooks`，然后在组件中导入 `useTimer` Hook：

```javascript
import { useTimer } from 'vue-hooks'
```

## 参数选项

`useTimer` 接受一个包含多个配置选项的对象：

- `initialTime` (number): 初始时间（秒），必须为非负整数。
- `interval` (number): 更新间隔（毫秒），默认值为 1000 毫秒。
- `format` (boolean | string): 是否格式化时间或使用格式化字符串，默认值为 `false`。
- `isCountdown` (boolean): 是否为倒计时模式，默认值为 `true`。
- `autoStart` (boolean): 是否自动开始计时，默认值为 `false`。
- `onUpdate` (Function): 每次计时更新时的回调函数，接受当前时间作为参数。
- `onEnd` (Function): 计时结束时的回调函数。

## 返回值

`useTimer` 返回一个包含以下属性和方法的对象：

- `currentTime` (Ref<number>): 当前时间（秒）。
- `formattedTime` (Ref<FormattedTime>): 格式化后的当前时间对象（可选）。
- `isRunning` (Ref<boolean>): 计时状态。
- `start` (Function): 开始计时。
- `pause` (Function): 暂停计时。
- `toggle` (Function): 切换计时状态。
- `reset` (Function): 重置计时。

## 使用示例

### 简单计时器

```vue
<template>
  <div>
    <p>当前时间: {{ currentTime }}</p>
    <button @click="start">开始</button>
    <button @click="pause">暂停</button>
    <button @click="toggle">切换</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script setup>
import { useTimer } from '@/hooks/useTimer'

const { currentTime, isRunning, start, pause, toggle, reset } = useTimer({
  initialTime: 60, // 60秒
  isCountdown: true, // 倒计时
  autoStart: false, // 不自动开始
  onUpdate: (time) => console.log('更新时间:', time),
  onEnd: () => console.log('计时结束')
})
</script>
```

### 格式化时间的计时器

```vue
<template>
  <div>
    <p>格式化时间: {{ formattedTime }}</p>
    <button @click="start">开始</button>
    <button @click="pause">暂停</button>
    <button @click="toggle">切换</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script setup>
import { useTimer } from '@/hooks/useTimer'

const { currentTime, formattedTime, isRunning, start, pause, toggle, reset } = useTimer({
  initialTime: 3600, // 3600秒 (1小时)
  isCountdown: true, // 倒计时
  autoStart: false, // 不自动开始
  format: 'Hms', // 格式化时间为 Hms
  onUpdate: (time) => console.log('更新时间:', time),
  onEnd: () => console.log('计时结束')
})
</script>
```

## 参数校验

`useTimer` 对传入参数进行了严格的类型校验：

- `initialTime` 必须为非负整数。
- `interval` 必须为正整数。
- `format` 必须为布尔值或字符串。
- `isCountdown` 必须为布尔值。
- `autoStart` 必须为布尔值。
- `onUpdate` 和 `onEnd` 必须为函数。

## 组件生命周期钩子

`useTimer` 在组件的 `onMounted` 和 `onUnmounted` 钩子中处理了计时器的启动和清理。

- 在 `onMounted` 中，根据 `autoStart` 参数决定是否立即开始计时。
- 在 `onUnmounted` 中，清除任何活动的计时器，以防止内存泄漏。

## 格式化时间

如果需要格式化时间，可以通过传递 `format` 参数来实现。`format` 参数可以是一个布尔值或者一个格式化字符串。默认格式化字符串为 `YMDHms`。

- 如果 `format` 为 `true`，则使用默认格式化字符串。
- 如果 `format` 为字符串，则使用该字符串进行格式化。

格式化功能依赖于 `formatSecondsToTime` 函数，该函数需要根据具体需求实现。

## 结束语

`useTimer` 是一个功能强大的计时器钩子，适用于 Vue 3 组合式 API。它提供了丰富的配置选项和回调函数，可以满足各种计时需求。希望这个使用手册能帮助您快速上手 `useTimer`，并在项目中有效利用它。
