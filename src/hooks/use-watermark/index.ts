import { toValue, watchEffect, onMounted, onUnmounted } from 'vue'
import { validateConfig } from '@/validates/validateUseWatermark'
import { WatermarkConfig } from '@/types/useWatermarkType'

export const useWatermark = (customConfig: WatermarkConfig = {}) => {
  const WATERMARK_DOM_ID = `watermark_${Date.now()}`
  let observer: MutationObserver | null = null
  let debouncedRender: number | null = null

  const config = validateConfig(customConfig)

  const resolveContainer = (): HTMLElement => {
    if (typeof config.container === 'string') {
      return document.getElementById(config.container) || document.body
    } else if (typeof config.container === 'function') {
      return config.container()
    } else {
      return config.container || document.body
    }
  }

  const removeWatermark = () => {
    const container = resolveContainer()
    const watermarkElement = document.getElementById(WATERMARK_DOM_ID)
    if (watermarkElement) {
      observer?.disconnect()
      container.removeChild(watermarkElement)
    }
  }

  const createWatermarkCanvas = () => {
    const canvas = document.createElement('canvas')
    canvas.width = toValue(config.width) || 240
    canvas.height = toValue(config.height) || 140

    const context = canvas.getContext('2d')
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.save()
      context.translate(canvas.width / 2, canvas.height / 2)
      context.rotate((-(toValue(config.rotateDeg) || 25) * Math.PI) / 180)
      context.font = toValue(config.font) || '1.2rem Vedana'
      context.fillStyle = toValue(config.color) || '#666'
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      const contentArray = Array.isArray(config.content)
        ? config.content
        : [config.content]
      contentArray.forEach((text, index) => {
        context.fillText(text as string, 0, index * 25)
      })

      context.restore()
    }

    return canvas.toDataURL('image/png')
  }

  const renderWatermark = () => {
    removeWatermark()

    const watermarkUrl = createWatermarkCanvas()
    const container = resolveContainer()

    const div = document.createElement('div')
    div.id = WATERMARK_DOM_ID
    Object.assign(div.style, {
      pointerEvents: 'none',
      position: 'absolute',
      top: toValue(config.top) || '0px',
      left: toValue(config.left) || '0px',
      opacity: toValue(config.opacity) || '0.1',
      zIndex: toValue(config.zIndex) || '100000',
      width: '100%',
      height: '100%',
      background: `url(${watermarkUrl}) left top repeat`
    })

    container.appendChild(div)
    observeDomChanges(div)
  }

  const observeDomChanges = (watermarkElement: HTMLElement) => {
    const observerConfig = {
      attributes: true,
      childList: true,
      subtree: true
    }

    const callback: MutationCallback = mutationsList => {
      for (const mutation of mutationsList) {
        if (
          mutation.target === watermarkElement ||
          Array.from(mutation.removedNodes).includes(watermarkElement)
        ) {
          if (debouncedRender) clearTimeout(debouncedRender)
          debouncedRender = window.setTimeout(renderWatermark, 100)
        }
      }
    }

    observer = new MutationObserver(callback)
    observer.observe(resolveContainer(), observerConfig)
  }

  onMounted(renderWatermark)
  onUnmounted(removeWatermark)

  watchEffect(renderWatermark)
}

export default useWatermark
