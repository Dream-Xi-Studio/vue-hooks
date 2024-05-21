# `useWatermark` Hook Documentation

`useWatermark` is a custom Hook for Vue 3 Composition API that adds a watermark to a specified container element. It provides rich configuration options to customize the watermark style and position flexibly.

## Installation and Import

Make sure you have installed `vue-hooks`, then import the `useWatermark` Hook in your component:

```javascript
import { useWatermark } from 'vue-hooks'
```

## Parameter Options

`useWatermark` accepts an object containing custom configurations for the watermark:

- `container` (string | HTMLElement | (() => HTMLElement)): The container element, can be a DOM element ID string, HTMLElement reference, or a function returning the container HTMLElement. Default is `document.body`.
- `content` (string | string[] | Ref<string | string[]>): The watermark content, can be a string, string array, or reactive value. Default is `["Default Text"]`.
- `width` (number | Ref<number>): The watermark width, can be a number, unit-bearing string, or reactive value. Default is `240`.
- `height` (number | Ref<number>): The watermark height, can be a number, unit-bearing string, or reactive value. Default is `140`.
- `top` (string | Ref<string>): The distance of the watermark from the top of the container, can be a number, unit-bearing string, or reactive value. Default is `'0px'`.
- `left` (string | Ref<string>): The distance of the watermark from the left of the container, can be a number, unit-bearing string, or reactive value. Default is `'0px'`.
- `opacity` (string | Ref<string>): The opacity of the watermark, ranging from `0` to `1`. Default is `0.1`.
- `zIndex` (string | Ref<string>): The stacking order of the watermark, can be a number, string, or reactive value. Default is `100000`.
- `rotateDeg` (number | Ref<number>): The rotation angle of the watermark in degrees. Default is `25`.
- `font` (string | Ref<string>): The font style of the watermark text. Default is `"1.2rem Vedana"`.
- `color` (string | Ref<string>): The color of the watermark text. Default is `"#666"`.

## Usage Example

```vue
<template>
  <div>
    <h1>This is an example using watermark</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWatermark } from '@/hooks/useWatermark'

// When the content changes, the useWatermark hook will automatically re-render the watermark
const content = ref(['CONFIDENTIAL'])

useWatermark({
  container: '#app', // Add the watermark to the container with the id 'app'
  content: content, // Set the watermark content to "CONFIDENTIAL"
  width: '100%', // Set the watermark width to the container width
  height: '100%', // Set the watermark height to the container height
  top: 0, // Set the watermark distance from the top of the container to 0
  left: 0, // Set the watermark distance from the left of the container to 0
  opacity: 0.1, // Set the watermark opacity to 0.1
  zIndex: 9999, // Set the watermark stacking order to 9999
  rotateDeg: 45, // Set the watermark rotation angle to 45 degrees
  font: '20px Arial', // Set the watermark text font style
  color: '#000000' // Set the watermark text color to black
})
</script>
```

## Notes

- Make sure the `container` parameter passed in specifies the correct container element, otherwise, the watermark may not display correctly.
- When dealing with dynamic values, use `Ref<T>` type variables directly, the `useWatermark` function will automatically re-render the watermark.

## Conclusion

The `useWatermark` Hook provides a simple yet effective way to add a watermark to specified container elements in a page. Hopefully, this documentation helps you quickly get started with `useWatermark` and successfully apply it in your projects.
