import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores'

const playerStore = usePlayerStore()
const { aspectRatio, playerWidth, playerHeight } = storeToRefs(playerStore)

export function useResizeCanvas({
	containerWidth,
	containerHeight,
}: {
	containerWidth: number
	containerHeight: number
}) {
	let canvasW, canvasH
	const ratio = aspectRatio.value.split(':').map(Number) // 纵横比

	if (containerWidth / containerHeight > ratio[0] / ratio[1]) {
		// 容器更宽,以高度为基准
		canvasH = containerHeight
		canvasW = canvasH * (ratio[0] / ratio[1])
	} else {
		// 容器更高,以宽度为基准
		canvasW = containerWidth
		canvasH = canvasW * (ratio[1] / ratio[0])
	}
	// 留出 20 空隙便于轨道面板拖拽
	playerWidth.value = canvasW - 20
	playerHeight.value = canvasH - 20

	return { width: canvasW, height: canvasH }
}
