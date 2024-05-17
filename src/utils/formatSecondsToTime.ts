import {
  SECONDS_IN_YEAR,
  SECONDS_IN_MONTH,
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE
} from '@/constants/date'

/**
 * 表示格式化后的时间对象
 */
export interface FormattedTime {
  /** 年数 */
  years?: number
  /** 月数 */
  months?: number
  /** 天数 */
  days?: number
  /** 小时数 */
  hours?: number
  /** 分钟数 */
  minutes?: number
  /** 秒数 */
  seconds: number
}

/**
 * 将秒数转换为格式化后的时间对象
 * @param {number} totalSeconds - 总秒数
 * @param {string} format - 格式化字符串，例如 "YMDHMS", "HMS", "MS"
 * @returns {FormattedTime} 格式化后的时间对象
 * @throws {Error} 参数校验失败时抛出错误
 */
export const formatSecondsToTime = (
  totalSeconds: number,
  format: string
): FormattedTime => {
  // 参数校验
  if (typeof totalSeconds !== 'number' || totalSeconds < 0) {
    throw new Error('总秒数必须是非负数')
  }
  if (typeof format !== 'string' || !/^[YMDHms]+$/.test(format)) {
    throw new Error('格式化字符串无效')
  }

  const result: FormattedTime = { seconds: 0 }

  if (format.includes('Y')) {
    result.years = Math.floor(totalSeconds / SECONDS_IN_YEAR)
    totalSeconds %= SECONDS_IN_YEAR
  }
  if (format.includes('M')) {
    result.months = Math.floor(totalSeconds / SECONDS_IN_MONTH)
    totalSeconds %= SECONDS_IN_MONTH
  }
  if (format.includes('D')) {
    result.days = Math.floor(totalSeconds / SECONDS_IN_DAY)
    totalSeconds %= SECONDS_IN_DAY
  }
  if (format.includes('H')) {
    result.hours = Math.floor(totalSeconds / SECONDS_IN_HOUR)
    totalSeconds %= SECONDS_IN_HOUR
  }
  if (format.includes('m')) {
    result.minutes = Math.floor(totalSeconds / SECONDS_IN_MINUTE)
    totalSeconds %= SECONDS_IN_MINUTE
  }
  result.seconds = totalSeconds

  return result
}

export default formatSecondsToTime
