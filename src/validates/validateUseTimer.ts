import { TimerOptions } from '@/types/useTimerType'

/**
 * 校验计时器参数选项
 * @param options 计时器参数选项
 * @returns {TimerOptions} 经过验证后的计时器参数选项
 */
export const validateOptions = (options: TimerOptions): TimerOptions => {
  const {
    initialTime,
    timeUnit,
    interval,
    format,
    isCountdown,
    autoStart,
    onUpdate,
    onEnd
  } = options

  if (!Number.isInteger(initialTime) || initialTime < 0) {
    throw new Error('初始时间必须为非负整数')
  }

  if (timeUnit && typeof timeUnit !== 'string') {
    throw new Error('时间单位必须为字符串')
  }

  if (
    timeUnit &&
    timeUnit.toLowerCase() !== 's' &&
    timeUnit.toLowerCase() !== 'ms'
  ) {
    throw new Error('时间单位必须为 "s" 或 "ms"')
  }

  if (interval && (!Number.isInteger(interval) || interval <= 0)) {
    throw new Error('更新间隔必须为正整数')
  }

  if (typeof format !== 'boolean' && typeof format !== 'string') {
    throw new Error('格式化选项必须为布尔值或字符串')
  }

  if (typeof isCountdown !== 'boolean') {
    throw new Error('倒计时选项必须为布尔值')
  }

  if (typeof autoStart !== 'boolean') {
    throw new Error('自动开始选项必须为布尔值')
  }

  if (onUpdate && typeof onUpdate !== 'function') {
    throw new Error('更新回调必须为函数')
  }

  if (onEnd && typeof onEnd !== 'function') {
    throw new Error('结束回调必须为函数')
  }

  return options
}

export default validateOptions
