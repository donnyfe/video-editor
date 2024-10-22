import { ImgClip, OffscreenSprite } from '@webav/av-cliper'
import { uniqueId } from 'lodash-es'
import { imageDecoder } from '@/utils'
import BaseTrack from './BaseTrack'
import type { ResourceType, ImageSource, Size } from '@/types'

export class ImageTrack extends BaseTrack {
	id: string
	source: ImageSource
	type: ResourceType = 'image'
	name: string
	url: string
	format: string
	width: number
	height: number
	scale: number = 100
	rotate: number = 0

	get drawHeight() {
		return (this.height * this.scale) / 100
	}
	get drawWidth() {
		return (this.width * this.scale) / 100
	}

	constructor(source: ImageSource, cutFrame: number) {
		super('image', '图像')
		// 设置ID
		this.id = uniqueId()
		// 设置图片信息
		this.source = source
		// 获取文件名称
		this.name = source.name
		this.url = source.url
		// 获取文件类型
		this.format = source.format

		// 设置绘制信息
		this.width = source.width
		this.height = source.height
		this.scale = 100

		// 设置轨道信息
		this.frameCount = 120
		this.start = cutFrame
		this.end = this.start + this.frameCount
	}
	getDrawX(width: number) {
		return width / 2 - this.drawWidth / 2 + this.centerX
	}
	getDrawY(height: number) {
		return height / 2 - this.drawHeight / 2 + this.centerY
	}
	draw(ctx: CanvasRenderingContext2D, { width, height }: Size, frameIndex: number) {
		const frame = Math.max(frameIndex - this.start, 0) // 默认展示首帧
		return imageDecoder.getFrame(this.source.format, this.source.id, frame).then(async (vf) => {
			if (vf) {
				ctx.drawImage(
					vf,
					0,
					0,
					this.source.width,
					this.source.height,
					this.getDrawX(width),
					this.getDrawY(height),
					this.drawWidth,
					this.drawHeight,
				)
			}
		})
	}
	resize({ width, height }: Size) {
		// 视频、图片元素，在添加到画布中时，需要缩放为合适的尺寸，目标是能在画布中完整显示内容
		let scale = 1
		if (this.source.width > width) {
			scale = width / this.source.width
		}
		if (this.source.height > height) {
			scale = Math.min(scale, height / this.source.height)
		}
		this.width = this.source.width * scale
		this.height = this.source.height * scale
	}
	// 生成合成对象
	async combine(playerSize: Size, outputRatio: number) {
		outputRatio = outputRatio ?? 1

		const frames = await imageDecoder.decode({ id: this.source.id })
		if (!frames) {
			throw new Error('frames is not ready')
		}
		const clip = new ImgClip(frames)
		const spr = new OffscreenSprite(clip)

		const baseFps = 30
		const UnitFrame2μs = 1e6 / baseFps

		spr.time = {
			offset: this.start * UnitFrame2μs,
			duration: this.frameCount * UnitFrame2μs,
		}

		spr.rect.w = this.drawWidth * outputRatio
		spr.rect.h = this.drawHeight * outputRatio
		spr.rect.x = this.getDrawX(playerSize.width) * outputRatio
		spr.rect.y = this.getDrawY(playerSize.height) * outputRatio

		return spr
	}
}
