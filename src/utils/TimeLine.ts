import { formatTime } from '@/utils'

export interface CanvasConfig {
	width: number
	height: number
	bgColor: string // 背景颜色
	ratio: number // 设备像素比
	textSize: number // 字号
	textScale: number // 支持更小号字： 10 / 12
	lineWidth: number // 线宽
	textBaseline: string // 文字对齐基线 (ts 中定义的textBaseLine是一个联合类型)
	textAlign: string // 文字对齐方式
	longColor: string // 长线段颜色
	shortColor: string // 短线段颜色
	textColor: string // 文字颜色
	subTextColor: string // 小文字颜色
	focusColor: string // 选中元素区间
	lineColor: string // 底线颜色
}

export interface UserConfig {
	start: number // 开始坐标
	step: number // 步进，与视频fps同步
	scale: number // 时间轴缩放比例
	focusPosition: {
		// 选中元素时在时间轴中高亮显示
		start: number // 起始帧数
		end: number // 结束帧数
		frameCount: number // 总帧数
	}
}

// 标尺中每小格代表的宽度(根据scale的不同实时变化)
const getGridSize = (scale: number): number => {
	const scaleNum = new Map([
		// 切换比例：最小单位为帧
		[100, 100],
		[90, 50],
		[80, 20],
		[70, 10],
		// 切换比例：最小单位为秒
		[60, 80],
		[50, 40],
		[40, 20],
		[30, 10],
		// 切换比例：最小单位为6秒 一大格为 1分钟
		[20, 40],
		[10, 25],
		[0, 10],
	])
	return scaleNum.get(scale) || 100
}

const lineWidth = 0.5 // 线条宽度

/**
 * 时间轴
 */
export class TimeLine {
	private canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D
	private userConfigs: UserConfig
	private canvasConfigs: CanvasConfig
	private step: number
	private gridSizeS: number
	private gridSizeB: number
	private startValueS: number
	private startValueB: number
	private offsetXS: number
	private offsetXB: number
	private endValue: number

	constructor(canvas: HTMLCanvasElement, userConfigs: UserConfig, canvasConfigs: CanvasConfig) {
		this.canvas = canvas
		this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
		this.userConfigs = userConfigs
		this.canvasConfigs = canvasConfigs

		const { start, scale, step: frameStep } = this.userConfigs
		this.step = this.getStep(scale, frameStep)
		this.gridSizeS = getGridSize(scale)
		this.gridSizeB = this.gridSizeS * this.step
		this.startValueS = Math.floor(start / this.gridSizeS) * this.gridSizeS
		this.startValueB = Math.floor(start / this.gridSizeB) * this.gridSizeB
		this.offsetXS = this.startValueS - start
		this.offsetXB = this.startValueB - start
		this.endValue = start + Math.ceil(this.canvasConfigs.width)
	}
	/**
	 * 计算文本在画布上的位置
	 * @param text 要绘制的文本
	 * @returns 文本的x和y坐标
	 */
	private calculateTextPosition(text: string) {
		const { ratio, textScale, textSize } = this.canvasConfigs
		return {
			x: text.length * 5 * textScale * ratio,
			y: ((textSize / ratio) * textScale) / ratio / 2,
		}
	}
	/**
	 * 绘制整个时间轴
	 */
	public draw() {
		// 初始化画布
		this.initializeCanvas()
		// 绘制选中元素
		this.drawFocusElement()
		// 绘制长间隔和对应的文本(如分钟、小时标记)
		this.drawLongIntervalsAndText()
		// 绘制短间隔和对应的文本(如秒、帧标记)
		this.drawShortIntervalsAndText()
		// 重置画布变换
		this.context.setTransform(1, 0, 0, 1, 0, 0)
	}
	/**
	 * 初始化画布,设置背景
	 */
	private initializeCanvas() {
		const { ratio, width, height, bgColor, textSize, textBaseline, textAlign } = this.canvasConfigs
		// 设置字体
		this.context.font = `${textSize * ratio}px -apple-system, ".SFNSText-Regular", "SF UI Text", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", "WenQuanYi Zen Hei", "Microsoft YaHei", Arial, sans-serif`
		this.context.lineWidth = lineWidth
		this.context.textBaseline = textBaseline as CanvasTextBaseline
		this.context.textAlign = textAlign as CanvasTextAlign
		// 缩放画布
		this.context.scale(ratio, ratio)
		this.context.clearRect(0, 0, width, height)
		this.context.fillStyle = bgColor
		this.context.fillRect(0, 0, width, height)
	}
	/**
	 * 获取步进
	 * @param scale 缩放比例
	 * @param frameStep 帧步进
	 * @returns 步进
	 */
	private getStep(scale: number, frameStep: number) {
		return scale > 60 ? frameStep : 10
	}
	/**
	 * 获取长文本
	 * @param count 大单元格数
	 * @param scale 缩放比例
	 * @returns 长文本
	 */
	private getLongText(count: number, scale: number) {
		let time = count // 一个大单元格为 1 秒
		if (scale < 30) {
			// 一个单元格为 1 分钟
			time *= 60
		} else if (scale < 70) {
			// 一个大单元格为 10 秒
			time *= 10
		}
		return formatTime(time * 1000).str
	}

	/**
	 * 获取短文本
	 * @param count 小单元格数
	 * @param step 步进
	 * @param scale 缩放比例
	 * @returns 短文本
	 */
	private getShortText(count: number, step: number, scale: number) {
		const index = count % step
		let text = ''
		if (scale < 70) {
			// 一个单元格为 1 秒钟
			return ''
		} else {
			// 一个单元格为 1 帧
			text = scale > 80 ? (index === 0 ? '' : `${index < 10 ? '0' : ''}${index}f`) : ''
		}
		return text
	}
	/**
	 * 绘制焦点元素(选中区域)
	 */
	private drawFocusElement() {
		const { height, focusColor } = this.canvasConfigs
		const { scale, focusPosition } = this.userConfigs

		if (focusPosition) {
			const { start, end } = focusPosition
			let fStart = start
			let fCount = end - fStart
			if (scale < 70) {
				fStart /= 30
				fCount /= 30
			}
			if (scale < 30) {
				fStart /= 6
				fCount /= 6
			}
			const focusS = fStart * this.gridSizeS + lineWidth - this.userConfigs.start
			const focusW = fCount * this.gridSizeS - lineWidth
			if (focusW > this.gridSizeS) {
				this.context.fillStyle = focusColor
				this.context.fillRect(focusS, 0, focusW, (height * 3) / 8)
			}
		}
	}
	/**
	 * 绘制长间隔和对应的文本(如分钟、小时标记)
	 */
	private drawLongIntervalsAndText() {
		const { height, ratio, textScale, textColor, longColor } = this.canvasConfigs
		const { scale } = this.userConfigs
		this.context.beginPath()
		this.context.fillStyle = textColor
		this.context.strokeStyle = longColor

		for (
			let value = this.startValueB, count = 0;
			value < this.endValue;
			value += this.gridSizeB, count++
		) {
			const x = this.offsetXB + count * this.gridSizeB + lineWidth
			this.context.moveTo(x, 0)
			this.context.save()
			this.context.translate(x, height * 0.4)
			this.context.scale(textScale / ratio, textScale / ratio)
			const text = this.getLongText(value / this.gridSizeB, scale)
			const { x: textPositionX, y: textPositionY } = this.calculateTextPosition(text)
			this.context.fillText(text, textPositionX, textPositionY)
			this.context.restore()
			this.context.lineTo(x, (height * 10) / 16 / ratio)
		}
		this.context.stroke()
		this.context.closePath()
	}
	/**
	 * 绘制短间隔和对应的文本(如秒、帧标记)
	 */
	private drawShortIntervalsAndText() {
		const { height, ratio, textScale, subTextColor, shortColor } = this.canvasConfigs
		const { scale } = this.userConfigs
		this.context.beginPath()
		this.context.fillStyle = subTextColor
		this.context.strokeStyle = shortColor

		for (
			let value = this.startValueS, count = 0;
			value < this.endValue;
			value += this.gridSizeS, count++
		) {
			const x = this.offsetXS + count * this.gridSizeS + lineWidth
			this.context.moveTo(x, 0)
			const text = this.getShortText(value / this.gridSizeS, this.step, scale)
			if (text) {
				this.context.save()
				this.context.translate(x, height * 0.4)
				this.context.scale(textScale / ratio, textScale / ratio)
				const { x: textPositionX, y: textPositionY } = this.calculateTextPosition(text)
				this.context.fillText(text, textPositionX, textPositionY)
				this.context.restore()
			}
			if (value % (this.gridSizeS * this.step) !== 0) {
				this.context.lineTo(x, height / 3 / ratio)
			}
		}
		this.context.stroke()
		this.context.closePath()
	}
}

/**
 * 绘制时间轴的工厂函数
 * @param context Canvas 2D 上下文
 * @param userConfigs 用户配置
 * @param canvasConfigs 画布配置
 */
export const drawTimeLine = (
	canvas: HTMLCanvasElement,
	userConfigs: UserConfig,
	canvasConfigs: CanvasConfig,
) => {
	const timeLineDrawer = new TimeLine(canvas, userConfigs, canvasConfigs)
	timeLineDrawer.draw()
}
