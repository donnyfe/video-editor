import { OffscreenSprite } from '@webav/av-cliper'
import BaseTrack from './BaseTrack'
import { videoDecoder, splitClip } from '@/utils'
import type { VideoSource, Size } from '@/types'
import type { MP4Clip } from '@webav/av-cliper'

const baseFps = 30
const UnitFrame2μs = 1e6 / baseFps

export class VideoTrack extends BaseTrack {
	audio: HTMLAudioElement | null = null

	constructor(source: VideoSource, cutFrame: number) {
		super('video', source.name)
		this.source = source
		this.format = source.format
		this.width = source.width
		this.height = source.height
		// 设置轨道信息
		this.frameCount = source.duration * 30
		this.start = cutFrame || 0
		this.end = this.start + this.frameCount
	}

	async draw(ctx: CanvasRenderingContext2D, size: Size, frameIndex: number) {
		// 默认展示特定帧
		const frame = Math.max(frameIndex - this.start + this.offsetL, 1)

		try {
			const vf = await videoDecoder.getFrame(this.source.id, frame)
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
					this.drawHeight,
				)
			} else {
				console.warn(`未能获取帧 ${frame} 的数据`)
			}
		} catch (error) {
			console.error('绘制视频帧时发生错误:', error)
		}
	}

	play(cutFrame: number) {
		if (!this.audio) {
			this.audio = new Audio(this.source.url)
		}
		if (this.audio?.paused) {
			this.audio.currentTime = (cutFrame - this.start - this.offsetL) / 30
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
		const offset = this.start * UnitFrame2μs
		const duration = (this.end - this.start) * UnitFrame2μs

		spr.time = { offset, duration }
		spr.rect.x = this.getDrawX(playerSize.width) * outputRatio
		spr.rect.y = this.getDrawY(playerSize.height) * outputRatio
		spr.rect.w = this.drawWidth * outputRatio
		spr.rect.h = this.drawHeight * outputRatio

		return spr
	}
}
