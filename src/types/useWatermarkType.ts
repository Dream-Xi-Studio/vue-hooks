import { Ref } from 'vue'

/**
 * 水印的配置选项
 */
export interface WatermarkConfig {
  /** 水印所在的容器，可以是表示 DOM 元素 ID 的字符串、HTMLElement 引用，或返回容器 HTMLElement 的函数 */
  container?: string | HTMLElement | (() => HTMLElement)

  /** 水印的内容，可以是字符串或多行字符串数组 */
  content?: string | string[] | Ref<string | string[]>

  /** 水印的宽度 */
  width?: number | Ref<number>

  /** 水印的高度 */
  height?: number | Ref<number>

  /** 水印距容器顶部边缘的距离 */
  top?: string | Ref<string>

  /** 水印距容器左侧边缘的距离 */
  left?: string | Ref<string>

  /** 水印的旋转角度（单位：度） */
  rotateDeg?: number | Ref<number>

  /** 水印文字的字体样式 */
  font?: string | Ref<string>

  /** 水印文字的颜色 */
  color?: string | Ref<string>

  /** 水印的不透明度 */
  opacity?: string | Ref<string>

  /** 水印的层叠顺序 */
  zIndex?: string | Ref<string>
}
