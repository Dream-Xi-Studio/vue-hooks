/**
 * 水印的配置选项
 */
export interface WatermarkConfig {
  /** 水印所在的容器，可以是表示 DOM 元素 ID 的字符串、HTMLElement 引用，或返回容器 HTMLElement 的函数 */
  container?: string | HTMLElement | (() => HTMLElement)

  /** 水印的内容，可以是字符串或多行字符串数组 */
  content?: string | string[]

  /** 水印的宽度 */
  width?: number

  /** 水印的高度 */
  height?: number

  /** 水印距容器顶部边缘的距离 */
  top?: string

  /** 水印距容器左侧边缘的距离 */
  left?: string

  /** 水印的旋转角度（单位：度） */
  rotateDeg?: number

  /** 水印文字的字体样式 */
  font?: string

  /** 水印文字的颜色 */
  color?: string

  /** 水印的不透明度 */
  opacity?: string

  /** 水印的层叠顺序 */
  zIndex?: string
}
