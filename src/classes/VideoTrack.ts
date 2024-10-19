import { uniqueId } from 'lodash-es'
import { OffscreenSprite } from '@webav/av-cliper'
import BaseTrack from './BaseTrack'
import { videoDecoder, splitClip } from '@/utils'
import type { ResourceType, VideoSource, Size } from '@/types'
import type { MP4Clip, AudioClip } from '@webav/av-cliper'

const baseFps = 30
const UnitFrame2μs = 1e6 / baseFps

export class VideoTrack extends BaseTrack {
	id: string
	type: ResourceType = 'video'
	source: VideoSource
	name: string // 视频名称
	format: string // 视频格式

	width: number // 视频宽度
	height: number // 视频高度
	scale: number = 100 // 缩放比例
	rotate: number = 0 // 旋转角度
	centerX: number = 0 // 中心点x
	centerY: number = 0 // 中心点y

	frameCount: number = 0 // 视频帧数
	start: number = 0 // 开始帧
	end: number = 0 // 结束帧

	audio: HTMLAudioElement | null = null

	constructor(source: VideoSource, cutFrame: number) {
		super('video', source.name)

		// 设置ID
		this.id = uniqueId()
		// 获取文件名称
		this.name = source.name
		// 设置视频信息
		this.source = source
		// 获取文件类型
		this.format = source.format
		// 设置绘制信息
		this.width = source.width
		this.height = source.height

		// 设置轨道信息
		this.frameCount = source.duration * 30
		this.start = cutFrame || 0
		this.end = this.start + this.frameCount
	}
	// 获取绘制高度
	get drawHeight() {
		return (this.height * this.scale) / 100
	}
	// 获取绘制宽度
	get drawWidth() {
		return (this.width * this.scale) / 100
	}
	// 获取绘制x坐标
	getDrawX(width: number) {
		return width / 2 - this.drawWidth / 2 + this.centerX
	}
	// 获取绘制y坐标
	getDrawY(height: number) {
		return height / 2 - this.drawHeight / 2 + this.centerY
	}
	/**
	 * 渲染需要优化
	 * TODO: 优化画布渲染
	 * TODO: 不需要每一次都去解码
	 */
	draw(ctx: CanvasRenderingContext2D, { width, height }: Size, frameIndex: number) {
		// 默认展示特定帧
		const frame = Math.max(frameIndex - this.start + this.offsetL, 1)

		return videoDecoder
			.getFrame(this.source.id, frame)
			.then(async (vf) => {
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
					vf?.close()
				} else {
					console.warn(`未能获取帧 ${frame} 的数据`)
				}
			})
			.catch((error) => {
				console.error('绘制视频帧时发生错误:', error)
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

	play(cutFrame: number) {
		if (!this.audio) {
			this.audio = new Audio(this.source.url)
		}
		if (this.audio?.paused) {
			this.audio.currentTime = (cutFrame - this.start - this.offsetL) / 30
			console.log('🚀 ~ VideoTrack ~ play ~ this.audio.currentTime:', this.audio.currentTime)
			this.audio.play()
		}
	}
	pause() {
		if (this.audio && !this.audio.paused) {
			this.audio?.pause()
		}
	}
	/**
	 * 根据cutFrame对视频进行分割
	 * @param cutFrame 切割帧
	 * @returns 分割后的视频轨道
	 */
	split(cutFrame: number) {
		this.end = cutFrame
		this.offsetR = this.frameCount + this.start - cutFrame // 根据cutFrame对视频进行分割
		// 根据cutFrame对视频进行分割
		const copy = new VideoTrack(this.source, cutFrame)

		copy.offsetL = cutFrame - this.start
		return copy
	}

	// 生成合成对象
	async combine(playerSize: Size, outputRatio: number) {
		const video = await videoDecoder.decode({ id: this.source.id })
		const clip = await splitClip(video as MP4Clip, {
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
