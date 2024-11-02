import { ImgClip, OffscreenSprite } from '@webav/av-cliper'
import { imageDecoder } from '@/utils'
import BaseTrack from './BaseTrack'
import type { ImageSource, Size } from '@/types'

export class ImageTrack extends BaseTrack {
	url: string

	constructor(source: ImageSource, cutFrame: number) {
		super('image', '图像')
		this.source = source
		this.url = source.url
		this.format = source.format
		this.width = source.width
		this.height = source.height
		// 设置轨道信息
		this.frameCount = 120
		this.start = cutFrame
		this.end = this.start + this.frameCount
	}

	async draw(ctx: CanvasRenderingContext2D, size: Size, frameIndex: number) {
		const frame = Math.max(frameIndex - this.start, 0)
		const vf = await imageDecoder.getFrame(this.source.format, this.source.id, frame)
		if (vf) {
			ctx.drawImage(
				vf,
				0,
				0,
				this.source.width,
				this.source.height,
				this.getDrawX(size.width),
				this.getDrawY(size.height),
				this.drawWidth,
				this.drawHeight
			)
		}
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
			duration: this.frameCount * UnitFrame2μs
		}

		spr.rect.w = this.drawWidth * outputRatio
		spr.rect.h = this.drawHeight * outputRatio
		spr.rect.x = this.getDrawX(playerSize.width) * outputRatio
		spr.rect.y = this.getDrawY(playerSize.height) * outputRatio

		return spr
	}
}
