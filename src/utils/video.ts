import { MP4Clip, AudioClip } from '@webav/av-cliper'
import { writeFile } from './file'
import type { VideoSource } from '@/types'

const baseFps = 20
const UnitFrame2μs = 1e6 / baseFps

interface DecodeOptions {
	id: string
	stream?: ReadableStream<Uint8Array>
	type?: string
	url?: string
}

// 视频帧缩略图
interface FrameThumbnails {
	img: Blob
	ts: number
}
/**
 * 视频解码器
 */
class VideoDecoder {
	// 视频修剪素材集
	#decoderMap = new Map<string, MP4Clip>()
	// 视频帧缩略图
	#thumbnailsMap = new Map<string, FrameThumbnails[]>()

	async thumbnails(source: VideoSource) {
		if (this.#thumbnailsMap.has(source.id)) {
			return this.#thumbnailsMap.get(source.id)
		}

		const clip = await this.decode({ id: source.id })
		if (!clip) {
			throw new Error('clip is not ready')
		}

		const thumbnails = await clip.thumbnails(50, { step: 1e6 })

		this.#thumbnailsMap.set(source.id, thumbnails)

		return thumbnails
	}

	async decode({ id, stream }: DecodeOptions) {
		if (this.#decoderMap.has(id)) {
			return this.#decoderMap.get(id)
		}

		stream = await writeFile(id, stream)

		const videoClip = new MP4Clip(stream)
		await videoClip.ready

		this.#decoderMap.set(id, videoClip)
		return videoClip
	}
	async getFrame(id: string, frameIndex: number) {
		let clip = this.#decoderMap.get(id)
		if (!clip) {
			clip = await this.decode({ id })
		}

		// tick根据时间获取帧，可能存在这一时间帧为空的情况，修改为在范围内寻找帧
		// 前几帧可能为空，所以限定最小时间为5/30秒
		const time = Math.max(((frameIndex - 1) / baseFps) * 1e6, (5 / 30) * 1e6)
		const frame = await (clip as MP4Clip).tick(time)

		return frame.video
	}
}

interface SplitClipOptions {
	offsetL: number
	offsetR: number
	frameCount: number
}

export const splitClip = async (
	source: AudioClip | MP4Clip,
	{ offsetL, offsetR, frameCount }: SplitClipOptions,
) => {
	if (offsetL === 0 && offsetR === 0) {
		return source
	}
	const start = offsetL * UnitFrame2μs
	// 使用start裁剪视频
	const clip = offsetL === 0 ? source : (await source.split(start))[1]
	const end = (frameCount - offsetR - offsetL) * UnitFrame2μs
	return offsetR === 0 ? clip : (await clip.split(end))[0]
}

export const videoDecoder = new VideoDecoder()

/**
 * 字幕
 */
interface ASR {
	beginTime: number
	endTime: number
	text: string
}

/**
 * 获取当前字幕
 * @param asr 字幕
 * @param frame 目标帧
 */
export const getCurSubtitle = (asr: ASR[], frame: number) => {
	const BASE_FPS = 30
	// 将frame转换为当前时间
	const time = (frame * 1000) / BASE_FPS
	// 当time在beginTime和endTime之间时，返回当前字幕
	for (let i = 0; i < asr.length; i++) {
		const { beginTime, endTime, text } = asr[i]
		if (time >= beginTime && time <= endTime) {
			return text
		}
	}
	return ''
}
