import { Ref } from 'vue'

/**
 * 水印的配置选项
 */
export interface WatermarkConfig {
  /** 水印所在的容器，可以是表示 DOM 元素 ID 的字符串、HTMLElement 引用，或返回容器 HTMLElement 的函数，默认值为 document.body */
  container?: string | HTMLElement | (() => HTMLElement)

  /** 水印的内容，可以是字符串或多行字符串数组，默认值为 '默认文本' */
  content?: string | string[] | Ref<string | string[]>

  /** 水印的宽度，默认值为 240 */
  width?: number | Ref<number>

  /** 水印的高度，默认值为 140 */
  height?: number | Ref<number>

  /** 水印距容器顶部边缘的距离，默认值为 '0px' */
  top?: string | Ref<string>

  /** 水印距容器左侧边缘的距离，默认值为 '0px' */
  left?: string | Ref<string>

  /** 水印的旋转角度（单位：度），默认值为 25 */
  rotateDeg?: number | Ref<number>

  /** 水印文字的字体样式，默认值为 '1.2rem Vedana' */
  font?: string | Ref<string>

  /** 水印文字的颜色，默认值为 '#666' */
  color?: string | Ref<string>

  /** 水印的不透明度，默认值为 '0.1' */
  opacity?: string | Ref<string>

  /** 水印的层叠顺序，默认值为 '100000' */
  zIndex?: string | Ref<string>
}
