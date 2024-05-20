# `useTimer` Hook User Manual

`useTimer` is a custom hook designed for creating timers using Vue 3's Composition API. It supports both countdown and count-up modes and offers various configuration options and callback functions.

## Installation and Import

Ensure you have installed `vue-hooks`, then import the `useTimer` hook in your component:

```javascript
import { useTimer } from 'vue-hooks'
```

## Options

`useTimer` accepts an object containing several configuration options:

- `initialTime` (number): Initial time in seconds, must be a non-negative integer.
- `interval` (number): Update interval in milliseconds, default is 1000 milliseconds.
- `format` (boolean | string): Whether to format time or use a format string, default is `false`.
- `isCountdown` (boolean): Whether it's a countdown timer, default is `true`.
- `autoStart` (boolean): Whether to start the timer automatically, default is `false`.
- `onUpdate` (Function): Callback function triggered on each timer update, receives the current time as a parameter.
- `onEnd` (Function): Callback function triggered when the timer ends.

## Return Values

`useTimer` returns an object containing the following properties and methods:

- `currentTime` (Ref<number>): Current time in seconds.
- `formattedTime` (Ref<FormattedTime>): Formatted current time object (optional).
- `isRunning` (Ref<boolean>): Timer status.
- `start` (Function): Start the timer.
- `pause` (Function): Pause the timer.
- `toggle` (Function): Toggle the timer state.
- `reset` (Function): Reset the timer.

## Usage Examples

### Simple Timer

```vue
<template>
  <div>
    <p>Current Time: {{ currentTime }}</p>
    <button @click="start">Start</button>
    <button @click="pause">Pause</button>
    <button @click="toggle">Toggle</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { useTimer } from '@/hooks/useTimer'

const { currentTime, isRunning, start, pause, toggle, reset } = useTimer({
  initialTime: 60, // 60 seconds
  isCountdown: true, // Countdown mode
  autoStart: false, // Do not start automatically
  onUpdate: (time) => console.log('Update Time:', time),
  onEnd: () => console.log('Timer Ended')
})
</script>
```

### Timer with Formatted Time

```vue
<template>
  <div>
    <p>Formatted Time: {{ formattedTime }}</p>
    <button @click="start">Start</button>
    <button @click="pause">Pause</button>
    <button @click="toggle">Toggle</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { useTimer } from '@/hooks/useTimer'

const { currentTime, formattedTime, isRunning, start, pause, toggle, reset } = useTimer({
  initialTime: 3600, // 3600 seconds (1 hour)
  isCountdown: true, // Countdown mode
  autoStart: false, // Do not start automatically
  format: 'Hms', // Format time as Hms
  onUpdate: (time) => console.log('Update Time:', time),
  onEnd: () => console.log('Timer Ended')
})
</script>
```

## Parameter Validation

`useTimer` performs strict type validation on the input parameters:

- `initialTime` must be a non-negative integer.
- `interval` must be a positive integer.
- `format` must be a boolean or a string.
- `isCountdown` must be a boolean.
- `autoStart` must be a boolean.
- `onUpdate` and `onEnd` must be functions.

## Component Lifecycle Hooks

`useTimer` handles timer initialization and cleanup in the component's `onMounted` and `onUnmounted` hooks.

- In `onMounted`, it decides whether to start the timer immediately based on the `autoStart` parameter.
- In `onUnmounted`, it clears any active timers to prevent memory leaks.

## Formatting Time

If you need to format time, you can achieve this by passing the `format` parameter. The `format` parameter can be either a boolean or a format string. The default format string is `YMDHms`.

- If `format` is `true`, the default format string is used.
- If `format` is a string, that string is used for formatting.

The formatting functionality relies on a `formatSecondsToTime` function, which needs to be implemented according to specific requirements.

## Conclusion

`useTimer` is a powerful timer hook suitable for Vue 3's Composition API. It provides rich configuration options and callback functions to meet various timing needs. Hopefully, this user manual helps you get started quickly with `useTimer` and effectively utilize it in your projects.
