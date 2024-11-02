import { watch, toRaw } from 'vue'
import { usePlayerStore, useTrackStore } from '@/stores'
import { useResizeCanvas } from '@/hooks'

export class CanvasPlayer {
	player: HTMLCanvasElement // 播放器
	playerContext: ImageBitmapRenderingContext | null = null
	playerStore = usePlayerStore()
	trackStore = useTrackStore()

	constructor(options: Record<string, any>) {
		this.playerStore = usePlayerStore()
		this.trackStore = useTrackStore()

		this.player = options.player
		this.playerContext = this.player.getContext('bitmaprenderer')

		this.initWatch()
	}
	initWatch() {
		// 属性变化后重新渲染
		watch(
			[
				() => this.trackStore.trackList,
				() => this.playerStore.aspectRatio,
				() => this.playerStore.playFrame
			],
			(newVal, oldVal) => {
				if (newVal[1] !== oldVal[1]) {
					const rect = (this.player?.parentNode as HTMLElement).getBoundingClientRect()
					useResizeCanvas({ containerWidth: rect.width, containerHeight: rect.height })
				}
				this.drawCanvas()
			},
			{ deep: true }
		)
	}

	// 绘制
	async drawCanvas() {
		if (this.playerStore.ingLoadingCount !== 0) {
			return
		}

		const playerW = this.playerStore.playerWidth
		const playerH = this.playerStore.playerHeight
		const playFrame = this.playerStore.playFrame

		const offCanvas = new OffscreenCanvas(playerW, playerH)
		const ctx = offCanvas.getContext('2d')

		const taskList: Array<any> = []
		this.trackStore.trackList.forEach(({ list }: { list: Record<string, any>[] }) => {
			const trackItem = list.find((item: Record<string, any>) => {
				if (!['audio'].includes(item.type) && playFrame >= item.start && playFrame <= item.end) {
					return true
				}
				return false
			})

			if (trackItem) {
				const drawTask = () =>
					this.drawToRenderCanvas(ctx as OffscreenCanvasRenderingContext2D, trackItem, playFrame)
				taskList.unshift(drawTask)
			}
		})
		await taskList.reduce(
			(chain, nextPromise) => chain.then(() => nextPromise()),
			Promise.resolve()
		)
		// 顺序绘制，保证视频在底部
		this.drawToPlayerCanvas(offCanvas)
	}

	// 预渲染canvas先加载
	drawToRenderCanvas(
		ctx: OffscreenCanvasRenderingContext2D,
		trackItem: Record<string, any>,
		frameIndex: number
	) {
		const width = this.playerStore.playerWidth
		const height = this.playerStore.playerHeight

		return toRaw(trackItem)
			.draw(ctx, { width, height }, frameIndex)
			.then(() => {
				return true
			})
	}
	// 将预渲染好的canvas进行渲播放器渲染
	async drawToPlayerCanvas(canvas: OffscreenCanvas) {
		if (this.playerContext) {
			this.playerContext.transferFromImageBitmap(canvas.transferToImageBitmap())
		}
	}
}
