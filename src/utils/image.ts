import { decodeImg } from '@webav/av-cliper'
import { writeFile } from './file'

interface DecodeOptions {
	id: string
	stream?: ReadableStream<Uint8Array>
	type?: string
	url?: string
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

		// 接收的数据可能是远程数据（URL），也可能是本地数据（file）
		// 如果是远程数据，可以直接使用URL作为source，
		// 如果是本地数据，可以使用FileReader读取数据，然后使用URL.createObjectURL创建URL作为source，但是这样缓存数据没法还原为File对象
		// 要解决这个问题，可以引入https://hughfenghen.github.io/posts/2024/03/14/web-storage-and-opfs/, 但会增加复杂度，所以暂时不考虑，

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
