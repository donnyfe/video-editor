import { uniqueId } from 'lodash-es'
import { OffscreenSprite } from '@webav/av-cliper'
import BaseTrack from '@/components/BaseTrack'
import { videoDecoder, splitClip } from '@/utils'
import type { TrackType, VideoSource } from '@/types'

interface PlayerSize {
	width: number
	height: number
}

const UnitFrame2μs = 1e6 / 30

export class VideoTrack extends BaseTrack {
	id: string
	type: TrackType = 'video'
	source: VideoSource
	name: string // 视频名称
	format: string // 视频格式
	start: number // 开始帧
	end: number // 结束帧
	frameCount: number // 视频帧数
	centerX: number // 中心点x
	centerY: number // 中心点y
	scale: number // 缩放比例
	height: number // 高度
	width: number // 宽度
	offsetL: number // 左偏移量
	offsetR: number // 右偏移量
	audio: HTMLAudioElement | null = null
	private frameCache: Map<number, any> = new Map()

	constructor(source: VideoSource, currentFrame: number) {
		super('video', source.name)

		// 设置ID
		this.id = uniqueId()
		// 设置视频信息
		this.source = source
		// 获取文件名称
		this.name = source.name
		// 获取文件类型
		this.format = source.format
		// 设置轨道信息
		this.frameCount = source.duration * 30
		this.start = currentFrame
		this.end = this.start + this.frameCount

		// 设置绘制信息
		this.centerX = 0
		this.centerY = 0
		this.scale = 100
		this.height = source.height
		this.width = source.width

		// 设置裁剪信息
		this.offsetL = 0
		this.offsetR = 0
	}
	get drawHeight() {
		return (this.height * this.scale) / 100
	}
	get drawWidth() {
		return (this.width * this.scale) / 100
	}
	getDrawX(width: number) {
		return width / 2 - this.drawWidth / 2 + this.centerX
	}
	getDrawY(height: number) {
		return height / 2 - this.drawHeight / 2 + this.centerY
	}
	/**
	 * 渲染需要优化
	 * TODO: 不需要每一次都去解码
	 * TODO: 优化画布渲染
	 */
	draw(ctx: CanvasRenderingContext2D, { width, height }: PlayerSize, frameIndex: number) {
		// 默认展示首帧
		const frame = Math.max(frameIndex - this.start + this.offsetL, 1)

		return videoDecoder.getFrame(this.source.id, frame).then(async (videoFrame) => {
			if (videoFrame) {
				ctx.drawImage(
					videoFrame,
					0,
					0,
					this.source.width,
					this.source.height,
					this.getDrawX(width),
					this.getDrawY(height),
					this.drawWidth,
					this.drawHeight,
				)
				videoFrame?.close()
			}
		})
	}

	resize({ width, height }: PlayerSize) {
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

	play(currentFrame: number) {
		if (!this.audio) {
			this.audio = new Audio(this.source.url)
		}
		if (this.audio?.paused) {
			this.audio.currentTime = (currentFrame - this.start - this.offsetL) / 30
			console.log('🚀 ~ VideoTrack ~ play ~ this.audio.currentTime:', this.audio.currentTime)
			this.audio.play()
		}
	}
	pause() {
		if (this.audio && !this.audio.paused) {
			this.audio?.pause()
		}
	}

	split(cutFrame: number) {
		this.end = cutFrame
		this.offsetR = this.frameCount + this.start - cutFrame // 根据cutFrame对视频进行分割
		// 根据cutFrame对视频进行分割
		const copy = new VideoTrack(this.source, cutFrame)

		copy.offsetL = cutFrame - this.start
		return copy
	}

	// 生成合成对象
	async combine(playerSize: PlayerSize, outputRatio: number) {
		const video = await videoDecoder.decode({ id: this.source.id })
		const clip = await splitClip(video, {
			offsetL: this.offsetL,
			offsetR: this.offsetR,
			frameCount: this.frameCount,
		})
		if (!clip) {
			throw new Error('clip is not ready')
		}
		const spr = new OffscreenSprite(clip)
		// TODO：需支持裁剪
		spr.time = {
			offset: this.start * UnitFrame2μs,
			duration: (this.end - this.start) * UnitFrame2μs,
		}
		spr.rect.x = this.getDrawX(playerSize.width) * outputRatio
		spr.rect.y = this.getDrawY(playerSize.height) * outputRatio
		spr.rect.w = this.drawWidth * outputRatio
		spr.rect.h = this.drawHeight * outputRatio

		return spr
	}
}
