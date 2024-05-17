import { ref, computed, watch, onMounted, onBeforeUnmount, Ref } from 'vue'
import { formatSecondsToTime, FormattedTime } from '@/utils/formatSecondsToTime'

/**
 * 倒计时计时器钩子函数的参数选项
 */
export interface UseCountdownOptions {
  /** 初始倒计时时间（秒） */
  initialTime: number
  /** 倒计时更新间隔（毫秒），默认值为 1000 毫秒 */
  interval?: number
  /** 倒计时结束时的回调函数 */
  onEnd?: () => void
  /** 是否格式化剩余时间或格式化字符串，默认值为 false */
  format?: boolean | string
}

/**
 * 倒计时计时器钩子函数的返回值
 */
export interface UseCountdownReturn {
  /** 剩余的倒计时时间（秒） */
  remainingTime: Ref<number>
  /** 格式化后的剩余时间对象（可选） */
  formattedTime?: Ref<FormattedTime>
}

/**
 * 倒计时计时器钩子函数
 *
 * @param {UseCountdownOptions} options - 参数选项
 * @param {number} options.initialTime - 初始倒计时时间（秒）
 * @param {number} [options.interval=1000] - 倒计时更新间隔（毫秒）
 * @param {Function} [options.onEnd] - 倒计时结束时的回调函数
 * @param {boolean | string} [options.format=false] - 是否格式化剩余时间或格式化字符串
 *
 * @returns {UseCountdownReturn} 包含剩余时间的对象
 * @returns {Ref<number>} returns.remainingTime - 剩余的倒计时时间（秒）
 * @returns {Ref<FormattedTime>} [returns.formattedTime] - 格式化后的剩余时间对象
 */
export const useCountdown = ({
  initialTime,
  interval = 1000,
  onEnd,
  format = false
}: UseCountdownOptions): UseCountdownReturn => {
  // 校验初始倒计时时间是否为正整数
  if (!Number.isInteger(initialTime) || initialTime <= 0) {
    throw new Error('初始倒计时时间必须为正整数')
  }

  // 校验倒计时更新间隔是否为正整数
  if (!Number.isInteger(interval) || interval <= 0) {
    throw new Error('倒计时更新间隔必须为正整数')
  }

  // 校验倒计时结束回调是否为函数
  if (onEnd && typeof onEnd !== 'function') {
    throw new Error('倒计时结束回调必须为函数')
  }

  // 剩余的倒计时时间（秒）
  const remainingTime = ref<number>(initialTime)
  // 计时器引用，用于清除定时器
  let countdownTimeout: NodeJS.Timeout | null = null
  // 初始开始时间，用于计算经过的时间
  let initialStartTime: number = performance.now()
  // 下一次间隔调整时间（毫秒）
  let nextIntervalAdjustment: number = (initialTime * 1000) % interval

  /**
   * 清除计时器
   */
  const clearTimeouts = (): void => {
    if (countdownTimeout !== null) {
      clearTimeout(countdownTimeout)
      countdownTimeout = null
    }
  }

  /**
   * 更新倒计时逻辑
   */
  const updateCountdown = (): void => {
    clearTimeouts()
    const currentTime = performance.now()
    const elapsedTime = currentTime - initialStartTime
    const adjustmentTime = Math.abs(elapsedTime - nextIntervalAdjustment)

    // 更新剩余时间（秒）
    remainingTime.value = Math.max(
      remainingTime.value - Math.floor(elapsedTime / interval),
      0
    )

    // 计算下一次间隔调整时间
    nextIntervalAdjustment = interval - adjustmentTime
    initialStartTime = performance.now()

    // 使用 requestAnimationFrame 保证动画帧的流畅性
    countdownTimeout = setTimeout(() => {
      requestAnimationFrame(updateCountdown)
    }, nextIntervalAdjustment)
  }

  onMounted(() => {
    // 初始启动倒计时
    countdownTimeout = setTimeout(updateCountdown, nextIntervalAdjustment)
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

  // 如果需要格式化时间，则计算格式化后的时间对象
  const formattedTime =
    typeof format === 'string'
      ? computed(() => formatSecondsToTime(remainingTime.value, format))
      : format
        ? computed(() => formatSecondsToTime(remainingTime.value, 'YMDHms'))
        : undefined

  return { remainingTime, formattedTime }
}

export default useCountdown
