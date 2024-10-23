import { uniqueId } from 'lodash-es'
import { ImgClip, OffscreenSprite } from '@webav/av-cliper'
import BaseTrack from './BaseTrack'
import { getTextRect } from '@/utils'
import type { ResourceType, TextSource, Size, CanvasContext } from '@/types'

export interface DrawRoundRectOptions {
	x: number
	y: number
	width: number
	height: number
	radius: number
	color: string
	borderColor?: string
	borderWidth?: number
	scale?: number
}

export class TextTrack extends BaseTrack {
	source: TextSource
	_content: string
	_fontSize: number
	_fontFamily: string
	fill: string
	stroke?: string
	textBackgroundColor?: string

	constructor(source: TextSource, currentFrame: number) {
		super('text', '文本')
		this.source = source
		// 设置文本信息
		this._content = source.content
		this._fontSize = source.fontSize
		this._fontFamily = source.fontFamily
		this.fill = source.fill
		this.stroke = source.stroke
		this.textBackgroundColor = source.textBackgroundColor
		// 设置轨道信息
		this.frameCount = 180
		this.start = currentFrame
		this.end = this.start + this.frameCount
		this.calcSize()
	}
	get content() {
		return this._content
	}
	set content(value: string) {
		this._content = value
		this.calcSize()
	}

	get fontSize() {
		return this._fontSize
	}
	set fontSize(value: number) {
		this._fontSize = value
		this.calcSize()
	}

	get fontFamily() {
		return this._fontFamily
	}
	set fontFamily(value: string) {
		this._fontFamily = value
		this.calcSize()
	}

	calcSize() {
		const { width, height } = getTextRect({
			text: this.content,
			fontSize: this.fontSize,
			fontFamily: this.fontFamily,
		})
		// 计算文本宽高
		this.height = height
		this.width = width
	}

	// 绘制圆角矩形
	drawRoundRect(
		ctx: CanvasContext,
		{ x, y, width, height, radius, color, borderColor, borderWidth }: DrawRoundRectOptions,
	) {
		// 开始一个新的绘图路径
		ctx.beginPath()
		// 设置填充色
		ctx.fillStyle = color
		// 画笔移动至左上角圆弧起点
		ctx.moveTo(x + radius, y)
		// 绘制右上角
		ctx.arcTo(x + width, y, x + width, y + height, radius)
		// 绘制右下角
		ctx.arcTo(x + width, y + height, x, y + height, radius)
		// 绘制左下角
		ctx.arcTo(x, y + height, x, y, radius)
		// 绘制左上角
		ctx.arcTo(x, y, x + width, y, radius)
		// 闭合路径
		ctx.closePath()
		// ctx.scale(scale / 100, scale / 100)
		if (color) {
			ctx.fillStyle = color
			ctx.fill()
		}

		if (borderColor && borderWidth) {
			ctx.strokeStyle = borderColor
			ctx.lineWidth = borderWidth
			ctx.stroke()
		}
	}

	// 绘制文本
	async draw(ctx: CanvasContext, { width, height }: Size) {
		const padding = 4
		const radius = 4
		const text = this.content
		const x = this.getDrawX(width)
		const y = this.getDrawY(height)
		const size = (this.fontSize * this.scale) / 100
		const color = this.fill
		const fontFamily = this.fontFamily
		const strokeColor = this.stroke
		const strokeWidth = 4
		const backgroundColor = this.textBackgroundColor

		const font = `${size}px ${fontFamily}`
		ctx.font = font
		ctx.textBaseline = 'middle' as CanvasTextBaseline
		ctx.textAlign = 'center' as CanvasTextAlign

		await document.fonts.load(font)

		// 多行切割
		const lines = text.split('\n')
		const lineHeight = size * 1.2
		// 计算文本最大宽度和高度
		const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width))
		const textHeight = lines.length * lineHeight

		if (backgroundColor) {
			this.drawRoundRect(ctx, {
				width: textWidth + padding * 2,
				height: textHeight + padding * 2,
				color: backgroundColor,
				radius,
				x: x,
				y: y,
				scale: this.scale,
			})
		}

		lines.forEach((line, index) => {
			const lineY = y + (index + 0.5) * lineHeight

			if (strokeColor && strokeWidth) {
				ctx.strokeStyle = strokeColor
				ctx.lineWidth = strokeWidth
				ctx.strokeText(line, x + textWidth / 2 + padding, lineY + padding)
			}
			ctx.fillStyle = color
			ctx.fillText(line, x + textWidth / 2 + padding, lineY + padding)
		})
		return Promise.resolve()
	}

	// 生成合成对象
	async combine(playerSize?: Size, outputRatio?: number) {
		outputRatio = outputRatio ?? 1

		const canvas = new OffscreenCanvas(this.drawWidth, this.drawHeight)
		const ctx = canvas.getContext('2d')
		if (!ctx) {
			throw new Error('ctx is null')
		}
		this.draw(ctx, { width: this.drawWidth, height: this.drawHeight })
		const clip = new ImgClip(await createImageBitmap(canvas))

		await clip.ready
		const spr = new OffscreenSprite(clip)

		const baseFps = 30
		const UnitFrame2μs = 1e6 / baseFps

		spr.time = { offset: this.start * UnitFrame2μs, duration: this.frameCount * UnitFrame2μs }
		spr.rect.w = this.drawWidth * outputRatio
		spr.rect.h = this.drawHeight * outputRatio
		if (playerSize) {
			spr.rect.x = this.getDrawX(playerSize.width) * outputRatio
			spr.rect.y = this.getDrawY(playerSize.height) * outputRatio
		}

		return spr
	}
}
