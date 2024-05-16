import { ref, watch, onMounted, onBeforeUnmount, Ref } from 'vue'

/**
 * 倒计时计时器钩子函数的参数选项
 */
export interface UseCountdownOptions {
  /** 初始倒计时时间（毫秒） */
  initialTime: number
  /** 倒计时更新间隔（毫秒），默认值为 1000 毫秒 */
  interval?: number
  /** 倒计时结束时的回调函数 */
  onEnd?: () => void
}

/**
 * 倒计时计时器钩子函数的返回值
 */
export interface UseCountdownReturn {
  /** 剩余的倒计时时间 */
  remainingTime: Ref<number>
}

/**
 * 倒计时计时器钩子函数
 *
 * @param {UseCountdownOptions} options - 参数选项
 * @param {number} options.initialTime - 初始倒计时时间（毫秒）
 * @param {number} [options.interval=1000] - 倒计时更新间隔（毫秒）
 * @param {Function} [options.onEnd] - 倒计时结束时的回调函数
 *
 * @returns {UseCountdownReturn} 包含剩余时间的对象
 * @returns {Ref<number>} returns.remainingTime - 剩余的倒计时时间
 */
export const useCountdown = ({
  initialTime,
  interval = 1000,
  onEnd
}: UseCountdownOptions): UseCountdownReturn => {
  // 校验初始倒计时时间是否为正数
  if (typeof initialTime !== 'number' || initialTime <= 0) {
    throw new Error('初始倒计时时间必须为正数')
  }

  // 校验倒计时更新间隔是否为正数
  if (typeof interval !== 'number' || interval <= 0) {
    throw new Error('倒计时更新间隔必须为正数')
  }

  // 校验倒计时结束回调是否为函数
  if (onEnd && typeof onEnd !== 'function') {
    throw new Error('倒计时结束回调必须为函数')
  }

  // 剩余的倒计时时间
  const remainingTime = ref<number>(initialTime)
  // 计时器引用，用于清除定时器
  const countdownTimeout = ref<NodeJS.Timeout | null>(null)
  // 初始开始时间，用于计算经过的时间
  const initialStartTime = ref<number>(performance.now())
  // 下一次间隔调整时间
  const nextIntervalAdjustment = ref<number>(initialTime % interval)

  /**
   * 清除所有计时器
   */
  const clearTimeouts = (): void => {
    if (countdownTimeout.value !== null) {
      clearTimeout(countdownTimeout.value)
    }
  }

  /**
   * 更新倒计时逻辑
   */
  const updateCountdown = (): void => {
    clearTimeouts()
    const currentTime = performance.now()
    const elapsedTime = currentTime - initialStartTime.value
    const adjustmentTime = Math.abs(elapsedTime - nextIntervalAdjustment.value)

    // 更新剩余时间
    remainingTime.value = Math.max(
      remainingTime.value - Math.floor(elapsedTime / interval) * interval,
      0
    )

    // 计算下一次间隔调整时间
    nextIntervalAdjustment.value = interval - adjustmentTime
    initialStartTime.value = performance.now()

    // 使用 requestAnimationFrame 保证动画帧的流畅性
    countdownTimeout.value = setTimeout(() => {
      requestAnimationFrame(updateCountdown)
    }, nextIntervalAdjustment.value)
  }

  onMounted(() => {
    // 初始启动倒计时
    countdownTimeout.value = setTimeout(
      updateCountdown,
      nextIntervalAdjustment.value
    )
  })

  onBeforeUnmount(() => {
    // 组件卸载时清除计时器
    clearTimeouts()
  })

  watch(remainingTime, newTime => {
    // 当剩余时间为零时触发结束回调
    if (newTime <= 0) {
      clearTimeouts()
      if (onEnd) onEnd()
    }
  })

  return { remainingTime }
}
