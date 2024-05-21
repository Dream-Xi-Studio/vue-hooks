import { toValue, watchEffect, onMounted, onUnmounted } from 'vue'
import { validateConfig } from '@/validates/validateUseWatermark'
import { getContainerElement, debounce } from '@/utils/index'
import { WatermarkConfig } from '@/types/useWatermarkType'

/**
 * 向指定容器元素添加水印的钩子
 *
 * @param {WatermarkConfig} customConfig - 水印的自定义配置
 * @returns {void}
 */
export const useWatermark = (customConfig: WatermarkConfig = {}): void => {
  // 生成一个唯一的水印元素 ID，结合时间戳和随机数
  const WATERMARK_ELEMENT_ID = `watermark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  // 存储 MutationObserver 实例
  let watermarkObserver: MutationObserver | null = null

  // 验证并规范化自定义配置
  const validatedConfig = validateConfig(customConfig)

  /**
   * 从容器中移除水印元素
   * @returns {void}
   */
  const removeWatermarkElement = (): void => {
    const container = getContainerElement(validatedConfig.container!)
    const watermarkElement = document.getElementById(WATERMARK_ELEMENT_ID)
    if (watermarkElement) {
      // 停止观察水印元素的变化
      watermarkObserver?.disconnect()
      watermarkObserver = null
      // 从容器中移除水印元素
      container.removeChild(watermarkElement)
    }
  }

  /**
   * 生成水印图像并返回其数据 URL
   * @returns {string} 水印图像的数据 URL
   */
  const generateWatermarkImage = (): string => {
    const canvas = document.createElement('canvas')
    canvas.width = toValue(validatedConfig.width) as number
    canvas.height = toValue(validatedConfig.height) as number

    const context = canvas.getContext('2d')
    if (context) {
      // 清空画布
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.save()
      // 设置画布原点为中心点并旋转
      context.translate(canvas.width / 2, canvas.height / 2)
      context.rotate(
        (-(toValue(validatedConfig.rotateDeg) as number) * Math.PI) / 180
      )
      // 设置字体样式
      context.font = toValue(validatedConfig.font) as string
      context.fillStyle = toValue(validatedConfig.color) as string
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      // 绘制水印文本
      const contentArray = Array.isArray(validatedConfig.content)
        ? validatedConfig.content
        : [validatedConfig.content]
      contentArray.forEach((text, index) => {
        context.fillText(text as string, 0, index * 25)
      })

      context.restore()
    }

    // 返回水印图像的数据 URL
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
    const container = getContainerElement(validatedConfig.container!)

    // 创建水印 div 元素
    const watermarkDiv = document.createElement('div')
    watermarkDiv.id = WATERMARK_ELEMENT_ID
    Object.assign(watermarkDiv.style, {
      pointerEvents: 'none', // 禁用水印元素的指针事件
      position: 'absolute',
      top: toValue(validatedConfig.top),
      left: toValue(validatedConfig.left),
      opacity: toValue(validatedConfig.opacity),
      zIndex: toValue(validatedConfig.zIndex),
      width: '100%',
      height: '100%',
      background: `url(${watermarkImageUrl}) left top repeat`
    })

    // 将水印元素添加到容器中
    container.appendChild(watermarkDiv)
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
    watermarkObserver.observe(
      getContainerElement(validatedConfig.container!),
      observerOptions
    )
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
