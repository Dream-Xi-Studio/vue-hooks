import { ref, computed, onMounted, onUnmounted } from 'vue'
import { validateOptions } from '@/validates/validateUseTimer'
import { formatSecondsToTime } from '@/utils/formatSecondsToTime'
import { TimerOptions, TimerReturn } from '@/types/useTimerType'

/**
 * 计时器钩子函数
 *
 * @param {TimerOptions} options - 计时器参数选项
 * @returns {TimerReturn} 返回包含当前时间、格式化后时间对象、计时状态和控制计时的相关函数的对象
 */
export const useTimer = (options: TimerOptions): TimerReturn => {
  // 参数校验
  const {
    initialTime = 0,
    timeUnit = 's',
    interval = 1000,
    format = false,
    isCountdown = true,
    autoStart = false,
    onUpdate,
    onEnd
  } = validateOptions(options)

  // 当前时间（秒或毫秒，取决于 timeUnit）
  const currentTime = ref<number>(initialTime)
  // 计时器引用，用于清除定时器
  let timeoutId: number | null = null
  // 初始开始时间，用于计算经过的时间
  let startTime: number = 0
  // 下一次间隔调整时间（毫秒）
  let nextInterval: number = interval
  // 计时状态
  const isRunning = ref<boolean>(false)

  /**
   * 清除计时器
   */
  const clearTimer = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  /**
   * 更新计时逻辑
   */
  const updateTimer = (): void => {
    if (!isRunning.value) return
    clearTimer()
    const currentTimeNow = performance.now()
    const elapsedTime = currentTimeNow - startTime

    const elapsed =
      timeUnit === 'ms' ? elapsedTime : Math.floor(elapsedTime / 1000)

    // 更新当前时间（秒或毫秒）
    currentTime.value = isCountdown
      ? Math.max(currentTime.value - elapsed, 0)
      : currentTime.value + elapsed

    // 如果有更新回调，则调用
    if (onUpdate) onUpdate(currentTime.value)

    // 如果当前时间为零且是倒计时模式，则触发结束回调
    if (isCountdown && currentTime.value <= 0) {
      isRunning.value = false
      if (onEnd) onEnd()
      return
    }

    // 计算下一次间隔调整时间
    nextInterval = interval - (elapsedTime % interval)
    startTime = performance.now()

    // 使用 requestAnimationFrame 保证动画帧的流畅性
    timeoutId = window.setTimeout(() => {
      requestAnimationFrame(updateTimer)
    }, nextInterval)
  }

  /**
   * 开始计时
   */
  const start = (): void => {
    if (!isRunning.value) {
      isRunning.value = true
      startTime = performance.now()
      timeoutId = window.setTimeout(updateTimer, nextInterval)
    }
  }

  /**
   * 暂停计时
   */
  const pause = (): void => {
    isRunning.value = false
    clearTimer()
  }

  /**
   * 切换计时状态
   */
  const toggle = (): void => {
    if (isRunning.value) {
      pause()
    } else {
      start()
    }
  }

  /**
   * 重置计时
   */
  const reset = (): void => {
    clearTimer()
    currentTime.value = initialTime
    startTime = performance.now()
    nextInterval = interval
    isRunning.value = false
  }

  onMounted(() => {
    // 根据 autoStart 参数决定是否立即开始计时
    if (autoStart) {
      start()
    } else {
      reset()
    }
  })

  onUnmounted(() => {
    // 组件卸载时清除计时器
    clearTimer()
  })

  // 如果需要格式化时间，则计算格式化后的时间对象
  const getFormattedTime = (time: number, formatString: string) => {
    const timeInSeconds = timeUnit === 'ms' ? time / 1000 : time
    return formatSecondsToTime(timeInSeconds, formatString)
  }

  const formattedTime =
    typeof format === 'string'
      ? computed(() => getFormattedTime(currentTime.value, format))
      : format
        ? computed(() => getFormattedTime(currentTime.value, 'YMDHms'))
        : undefined

  return { currentTime, formattedTime, isRunning, start, pause, toggle, reset }
}

export default useTimer
