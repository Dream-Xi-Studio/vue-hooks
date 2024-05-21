# `useWatermark` Hook 使用手册

`useWatermark` 是一个用于在 Vue 3 组合式 API 中向指定容器元素添加水印的自定义 Hook。它提供了丰富的配置选项，可以灵活地定制水印样式和位置。

## 安装和导入

确保您已经安装了 `vue-hooks`，然后在组件中导入 `useWatermark` Hook：

```javascript
import { useWatermark } from 'vue-hooks'
```

## 参数选项

`useWatermark` 接受一个包含水印的自定义配置的对象：

- `container` (string | HTMLElement | (() => HTMLElement)): 容器元素，可以是一个 DOM 元素 ID 的字符串、HTMLElement 引用，或返回容器 HTMLElement 的函数，默认为 `document.body`。
- `content` (string | string[] | Ref<string | string[]>): 水印内容，可以是一个字符串或字符串数组或响应式值，默认为 `["默认文本"]`。
- `width` (number | Ref<number>): 水印宽度，可以是一个数字、带单位的字符串或响应式值，默认为 `240`。
- `height` (number | Ref<number>): 水印高度，可以是一个数字、带单位的字符串或响应式值，默认为 `140`。
- `top` (string | Ref<string>): 水印距离容器顶部的距离，可以是一个数字、带单位的字符串或响应式值，默认为 `'0px'`。
- `left` (string | Ref<string>): 水印距离容器左侧的距离，可以是一个数字、带单位的字符串或响应式值，默认为 `'0px'`。
- `opacity` (string | Ref<string>): 水印透明度，取值范围为 `0` 到 `1`，默认为 `0.1`。
- `zIndex` (string | Ref<string>): 水印的层叠顺序，可以是一个数字、字符串或响应式值，默认为 `100000`。
- `rotateDeg` (number | Ref<number>): 水印旋转角度，单位为度，默认为 `25`。
- `font` (string | Ref<string>): 水印文字的字体样式，默认为 `"1.2rem Vedana"`。
- `color` (string | Ref<string>): 水印文字的颜色，默认为 `"#666"`。

## 使用示例

```vue
<template>
  <div>
    <h1>这是一个使用水印的示例</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWatermark } from '@/hooks/useWatermark'

// 当 content 内容改变时，useWatermark 钩子会自动重新渲染水印
const content = ref(['CONFIDENTIAL'])

useWatermark({
  container: '#app', // 将水印添加到 id 为 app 的容器中
  content: content, // 设置水印内容为 "CONFIDENTIAL"
  width: '100%', // 设置水印宽度为容器宽度
  height: '100%', // 设置水印高度为容器高度
  top: 0, // 水印距离容器顶部距离为 0
  left: 0, // 水印距离容器左侧距离为 0
  opacity: 0.1, // 设置水印透明度为 0.1
  zIndex: 9999, // 设置水印层叠顺序为 9999
  rotateDeg: 45, // 设置水印旋转角度为 45 度
  font: '20px Arial', // 设置水印文字字体样式
  color: '#000000' // 设置水印文字颜色为黑色
})
</script>
```

## 注意事项

- 请确保传入的 `container` 参数指定了正确的容器元素，否则水印可能无法正常显示。
- 当存在动态值时，请使用 `Ref<T>` 类型的变量直接传入，`useWatermark` 函数会自动重新渲染水印。

## 结束语

`useWatermark` Hook 提供了一种简单而有效的方法来向页面中的指定容器元素添加水印。希望这个使用手册能帮助您快速上手 `useWatermark`，并在项目中成功应用它。
