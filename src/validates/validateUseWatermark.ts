/* eslint-disable @typescript-eslint/no-explicit-any */

import { WatermarkConfig } from '@/types/useWatermarkType'

const DEFAULT_CONFIG: WatermarkConfig = {
  container: document.body,
  content: '默认文本',
  width: 240,
  height: 140,
  top: '0px',
  left: '0px',
  rotateDeg: 25,
  font: '1.2rem Vedana',
  color: '#666',
  opacity: '0.1',
  zIndex: '100000'
}

/**
 * 验证水印配置的函数
 * @param customConfig 用户自定义的水印配置
 * @returns {WatermarkConfig} 经过验证后的水印配置
 */
export const validateConfig = (
  customConfig: WatermarkConfig
): WatermarkConfig => {
  /**
   * 确保值的类型正确，否则返回默认值
   * @param value 需要验证的值
   * @param defaultValue 默认值
   * @param type 值的预期类型
   * @returns {T} 验证后的值
   */
  const ensure = <T>(value: any, defaultValue: T, type: string): T => {
    return typeof value === type ? value : defaultValue
  }

  /**
   * 确保值为字符串或字符串数组，否则返回默认值
   * @param value 需要验证的值
   * @param defaultValue 默认值
   * @returns {string | string[]} 验证后的值
   */
  const ensureStringOrArray = (
    value: any,
    defaultValue: string | string[]
  ): string | string[] => {
    return typeof value === 'string' || Array.isArray(value)
      ? value
      : defaultValue
  }

  /**
   * 确保值为合法的容器（字符串 ID、HTMLElement 或函数），否则返回默认值
   * @param value 需要验证的值
   * @param defaultValue 默认值
   * @returns {HTMLElement} 验证后的容器
   */
  const ensureContainer = (
    value: any,
    defaultValue: HTMLElement
  ): HTMLElement => {
    if (typeof value === 'string') {
      return document.getElementById(value) || defaultValue
    } else if (typeof value === 'function') {
      return value()
    } else if (value instanceof HTMLElement) {
      return value
    }
    return defaultValue
  }

  return {
    container: ensureContainer(
      customConfig.container,
      DEFAULT_CONFIG.container as HTMLElement
    ),
    content: ensureStringOrArray(
      customConfig.content,
      DEFAULT_CONFIG.content as string
    ),
    width: ensure(customConfig.width, DEFAULT_CONFIG.width, 'number'),
    height: ensure(customConfig.height, DEFAULT_CONFIG.height, 'number'),
    top: ensure(customConfig.top, DEFAULT_CONFIG.top, 'string'),
    left: ensure(customConfig.left, DEFAULT_CONFIG.left, 'string'),
    rotateDeg: ensure(
      customConfig.rotateDeg,
      DEFAULT_CONFIG.rotateDeg,
      'number'
    ),
    font: ensure(customConfig.font, DEFAULT_CONFIG.font, 'string'),
    color: ensure(customConfig.color, DEFAULT_CONFIG.color, 'string'),
    opacity: ensure(customConfig.opacity, DEFAULT_CONFIG.opacity, 'string'),
    zIndex: ensure(customConfig.zIndex, DEFAULT_CONFIG.zIndex, 'string')
  }
}

export default validateConfig
