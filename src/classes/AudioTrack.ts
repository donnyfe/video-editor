import { OffscreenSprite, AudioClip } from '@webav/av-cliper'
import { audioDecoder, splitClip } from '@/utils'
import type { AudioSource } from '@/types'
import BaseTrack from './BaseTrack'

export class AudioTrack extends BaseTrack {
	audio: HTMLAudioElement | null = null

	constructor(source: AudioSource, cutFrame: number) {
		super('audio', source.name)
		this.source = source
		this.format = source.format
		// 获取音频时长，转换为frameCount
		this.frameCount = source.duration * 30
		this.start = cutFrame
		this.end = this.start + this.frameCount
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
			this.audio.pause()
		}
	}
	async draw() {
		// Audio tracks don't need to be drawn
		return Promise.resolve()
	}
	// 生成合成对象
	async combine() {
		const baseFps = 30
		const UnitFrame2μs = 1e6 / baseFps

		const audio = (await audioDecoder.decode({ id: this.source.id })) as AudioClip

		const clip = await splitClip(audio, {
			offsetL: this.offsetL,
			offsetR: this.offsetR,
			frameCount: this.frameCount,
		})
		if (!clip) {
			throw new Error('clip is not ready')
		}
		const spr = new OffscreenSprite(clip)
		// TODO：需要支持裁剪
		spr.time = {
			offset: this.start * UnitFrame2μs,
			duration: (this.end - this.start) * UnitFrame2μs,
		}

		return spr
	}
}
