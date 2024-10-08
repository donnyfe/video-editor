import { AudioClip } from '@webav/av-cliper'
import { writeFile } from './file'

interface DecodeOptions {
	id: string
	stream?: ReadableStream<Uint8Array>
	type?: string
	url?: string
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
