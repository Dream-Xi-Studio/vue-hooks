/**
 * 获取容器元素
 *
 * @param {string | HTMLElement | (() => HTMLElement)} container - 容器，可以是 HTMLElement、字符串（元素的 ID）或返回 HTMLElement 的函数
 * @returns {HTMLElement} 找到的容器元素
 * @throws {Error} 如果传递的字符串 ID 没有对应的元素，或传递的函数没有返回 HTMLElement，或传递的类型无效
 */
export const getContainerElement = (
  container: string | HTMLElement | (() => HTMLElement)
): HTMLElement => {
  if (typeof container === 'string') {
    const element = document.getElementById(container)
    if (element) {
      return element
    } else {
      throw new Error(`Element with id '${container}' not found`)
    }
  } else if (typeof container === 'function') {
    const element = container()
    if (element instanceof HTMLElement) {
      return element
    } else {
      throw new Error('The provided function did not return an HTMLElement')
    }
  } else if (container instanceof HTMLElement) {
    return container
  } else {
    throw new Error('Invalid container type provided')
  }
}

/**
 * 防抖动函数
 *
 * @param {(...args: any[]) => void} fn - 需要防抖动处理的函数。
 * @param {number} delay - 延迟的毫秒数。
 * @returns {(...args: any[]) => void} 返回一个新的防抖动函数。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (
  fn: (...args: any[]) => void,
  delay: number
): ((...args: any[]) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: any[]): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
