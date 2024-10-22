import { ElMessage } from 'element-plus'
import { MP4Clip, AudioClip, decodeImg } from '@webav/av-cliper'
import { writeFile } from './file'
import type { VideoSource } from '@/types'

export interface DecodeOptions {
	id: string
	stream?: ReadableStream<Uint8Array>
	type?: string
	url?: string
}

// 视频帧缩略图
export interface FrameThumbnails {
	img: Blob
	ts: number
}

const baseFps = 20
const UnitFrame2μs = 1e6 / baseFps

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

		const clip = new MP4Clip(stream)
		await clip.ready

		// console.log('utils/video.ts -> decode -> clip: ', clip)
		this.#decoderMap.set(id, clip)
		return clip
	}

	async getFrame(id: string, frameIndex: number) {
		const clip = this.#decoderMap.get(id)
		console.log('utils/video.ts -> getFrame -> clip: ', clip)

		// tick根据时间获取帧，可能存在着这一时间帧为空的情况，修改为在范围内寻找帧
		// 前几帧可能为空，所以限定小时间为5/30秒
		const time = Math.max(((frameIndex - 1) / baseFps) * 1e6, (5 / 30) * 1e6)
		const frame = await (clip as MP4Clip).tick(time)

		return frame.video
	}
}

export const videoDecoder = new VideoDecoder()

/**
 * 视频解码
 * @param md5
 * @param file
 * @returns
 */
export function decodeVideo(id: string, file: File) {
	return new Promise((resolve, reject) => {
		console.time('解析视频耗时')
		videoDecoder
			.decode({
				id,
				type: file.type,
				stream: file.stream(),
			})
			.then((clip) => {
				console.timeEnd('解析视频耗时')
				if (!clip) {
					return ElMessage.error('解析视频失败')
				}
				resolve(clip)
			})
			.catch((err) => {
				reject(err)
			})
	})
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

/**
 * 图片解码器
 */
class ImageDecoder {
	#decoderMap = new Map<string, VideoFrame[]>()
	async decode({ id, stream, type }: DecodeOptions) {
		if (this.#decoderMap.has(id)) {
			return this.#decoderMap.get(id)
		}

		stream = await writeFile(id, stream)

		if (!type) {
			throw new Error('type is not ready')
		}

		// 如果是远程数据(URL)，可以直接使用URL作为source，
		// 如果是本地数据(file)，可以使用FileReader读取数据，然后使用URL.createObjectURL创建URL作为source，但是这样缓存数据没法还原为File对象, 要解决这个问题，可以引入https://hughfenghen.github.io/posts/2024/03/14/web-storage-and-opfs/, 但会增加复杂度，所以暂时不考虑，

		// TODO: 使用OPFS解决本地数据问题
		const frames = await decodeImg(stream, type)

		// 存储解析后的帧
		this.#decoderMap.set(id, frames)

		return frames
	}
	async getFrame(type: string, id: string, frameIndex: number) {
		let frames = this.#decoderMap.get(id)
		if (!frames) {
			await this.decode({ id, type })
			frames = this.#decoderMap.get(id)
		}
		return frames?.[frameIndex % frames.length]
	}
}

export const imageDecoder = new ImageDecoder()

/**
 * 解析图像
 * @param md5
 * @param file
 * @returns
 */
export function decodeImage(id: string, file: File): Promise<any> {
	return new Promise((resolve, reject) => {
		console.time('解析图像耗时')
		imageDecoder
			.decode({ id, stream: file.stream(), type: file.type })
			.then((frames) => {
				console.timeEnd('解析图像耗时')
				if (!frames) {
					return ElMessage.error('解析图像失败')
				}
				resolve(frames)
			})
			.catch((err) => {
				reject(err)
			})
	})
}

/**
 * 音频解码器
 */
class AudioDecoder {
	#decoderMap = new Map<string, AudioClip>()
	async decode({ id, stream, type }: DecodeOptions) {
		if (this.#decoderMap.has(id)) {
			return this.#decoderMap.get(id)
		}

		stream = await writeFile(id, stream)

		if (!type) {
			throw new Error('type is not ready')
		}

		const clip = new AudioClip(stream)

		if (!clip) {
			// 提示解析视频失败
			throw new Error('解析视频失败')
		}

		await clip.ready

		this.#decoderMap.set(id, clip)

		return clip
	}
}
export const audioDecoder = new AudioDecoder()