import { uniqueId } from 'lodash-es'
import { OffscreenSprite, AudioClip } from '@webav/av-cliper'
import { audioDecoder, splitClip } from '@/utils'
import type { ResourceType, AudioSource } from '@/types'
import BaseTrack from './BaseTrack'

export class AudioTrack extends BaseTrack {
	id: string
	type: ResourceType = 'audio'
	source: AudioSource
	name: string
	format: string

	frameCount: number
	start: number
	end: number
	offsetL: number = 0
	offsetR: number = 0
	audio: HTMLAudioElement | null = null

	constructor(source: AudioSource, cutFrame: number) {
		super('audio', source.name)
		// 设置ID
		this.id = uniqueId()
		// 设置音频信息
		this.source = source
		// 获取文件名称
		this.name = source.name
		// 获取文件类型
		this.format = source.format

		// 获取音频时长，转换为frameCount
		this.frameCount = source.duration * 30
		this.start = cutFrame
		this.end = this.start + this.frameCount

		// 设置裁剪信息
		this.offsetL = 0
		this.offsetR = 0
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