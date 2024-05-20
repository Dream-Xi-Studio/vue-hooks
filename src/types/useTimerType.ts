import { Ref } from 'vue'
import { FormattedTime } from '@/utils/formatSecondsToTime'

/**
 * 计时器选项接口
 */
export interface TimerOptions {
  /** 初始时间（秒） */
  initialTime: number

  /** 时间单位，默认为 's' (秒) */
  timeUnit?: 's' | 'ms'

  /** 更新间隔（毫秒），默认值为 1000 毫秒 */
  interval?: number

  /** 是否格式化时间或格式化字符串，默认值为 false */
  format?: boolean | string

  /** 是否为倒计时模式，默认值为 true */
  isCountdown?: boolean

  /** 是否自动开始计时，默认值为 false */
  autoStart?: boolean

  /** 每次计时更新时的回调函数，接受当前时间作为参数 */
  onUpdate?: (currentTime: number) => void

  /** 计时结束时的回调函数 */
  onEnd?: () => void
}

/**
 * 计时器返回值接口
 */
export interface TimerReturn {
  /** 当前时间（秒） */
  currentTime: Ref<number>

  /** 格式化后的当前时间对象（可选） */
  formattedTime?: Ref<FormattedTime>

  /** 计时状态 */
  isRunning: Ref<boolean>

  /** 开始计时 */
  start: () => void

  /** 暂停计时 */
  pause: () => void

  /** 切换计时状态 */
  toggle: () => void

  /** 重置计时 */
  reset: () => void
}
