import { toValue, watchEffect, onMounted, onUnmounted } from 'vue'
import { getContainerElement, debounce } from '@/utils/index'
import { WatermarkConfig } from '@/types/useWatermarkType'

/**
 * 向指定容器元素添加水印的钩子
 *
 * @param {WatermarkConfig} customConfig - 水印的自定义配置
 * @returns {void}
 */
export const useWatermark = ({
  container = document.body,
  ...customConfig
}: WatermarkConfig = {}): void => {
  // 获取容器元素
  const containerElement = getContainerElement(container)
  // 生成水印元素ID，结合时间戳和随机数确保唯一性
  const WATERMARK_ELEMENT_ID = `watermark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  // 存储 MutationObserver 实例
  let watermarkObserver: MutationObserver | null = null

  /**
   * 从容器中移除水印元素
   * @returns {void}
   */
  const removeWatermarkElement = (): void => {
    const watermarkElement = document.getElementById(WATERMARK_ELEMENT_ID)
    watermarkElement?.remove()
    watermarkObserver?.disconnect()
    watermarkObserver = null
  }

  /**
   * 生成水印图像并返回其数据 URL
   * @returns {string} 水印图像的数据 URL
   */
  const generateWatermarkImage = (): string => {
    const {
      width = 240,
      height = 140,
      rotateDeg = 25,
      font = '1.2rem Vedana',
      color = '#666',
      content = '默认文本'
    } = customConfig
    const canvas = document.createElement('canvas')
    canvas.width = toValue(width) as number
    canvas.height = toValue(height) as number
    const context = canvas.getContext('2d')
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.save()
      context.translate(canvas.width / 2, canvas.height / 2)
      context.rotate((-(toValue(rotateDeg) as number) * Math.PI) / 180)
      context.font = toValue(font) as string
      context.fillStyle = toValue(color) as string
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      // 处理内容为数组或单个字符串的情况
      const contentArray = Array.isArray(toValue(content))
        ? (toValue(content) as string[])
        : [toValue(content) as string]
      contentArray.forEach((text, index) => {
        context.fillText(text as string, 0, index * 25)
      })
      context.restore()
    }
    return canvas.toDataURL('image/png')
  }

  /**
   * 在容器中渲染水印元素
   * @returns {void}
   */
  const renderWatermark = (): void => {
    // 首先移除现有的水印元素
    removeWatermarkElement()
    // 生成水印图像
    const watermarkImageUrl = generateWatermarkImage()
    // 应用自定义配置或默认值
    const {
      top = '0px',
      left = '0px',
      opacity = '0.1',
      zIndex = '100000'
    } = customConfig
    // 创建水印 div 元素
    const watermarkDiv = document.createElement('div')
    watermarkDiv.id = WATERMARK_ELEMENT_ID
    Object.assign(watermarkDiv.style, {
      pointerEvents: 'none', // 禁用水印元素的指针事件
      position: 'absolute',
      top: toValue(top),
      left: toValue(left),
      opacity: toValue(opacity),
      zIndex: toValue(zIndex),
      width: '100%',
      height: '100%',
      background: `url(${watermarkImageUrl}) left top repeat`
    })
    // 将水印元素添加到容器中
    containerElement.appendChild(watermarkDiv)
    // 开始观察水印元素的变化
    observeWatermarkChanges(watermarkDiv)
  }

  // 对 renderWatermark 函数进行防抖处理
  const debouncedRenderWatermark = debounce(renderWatermark, 100)

  /**
   * 观察水印元素的变化，并在必要时重新渲染水印
   * @param {HTMLElement} watermarkElement - 要观察的水印元素
   * @returns {void}
   */
  const observeWatermarkChanges = (watermarkElement: HTMLElement): void => {
    const observerOptions: MutationObserverInit = {
      attributes: true,
      childList: true,
      subtree: true
    }
    const handleMutations: MutationCallback = mutations => {
      for (const mutation of mutations) {
        // 当水印元素被移除时，重新渲染水印
        if (
          mutation.type === 'childList' &&
          Array.from(mutation.removedNodes).includes(watermarkElement)
        ) {
          debouncedRenderWatermark()
        }
        // 当水印元素的属性发生变化时，重新渲染水印
        if (
          mutation.type === 'attributes' &&
          mutation.target === watermarkElement
        ) {
          debouncedRenderWatermark()
        }
      }
    }

    // 创建并启动 MutationObserver 实例
    watermarkObserver = new MutationObserver(handleMutations)
    watermarkObserver.observe(containerElement, observerOptions)
  }

  // 在组件挂载时渲染水印
  onMounted(() => {
    if (!document.getElementById(WATERMARK_ELEMENT_ID)) {
      renderWatermark()
    }
  })

  // 在组件卸载时移除水印
  onUnmounted(removeWatermarkElement)

  // 当配置变化时重新渲染水印
  watchEffect(debouncedRenderWatermark)
}

export default useWatermark
