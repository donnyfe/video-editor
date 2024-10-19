<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
// import { storeToRefs } from 'pinia'
import CanvasCover from './CanvasCover.vue'
import { CanvasPlayer } from './canvasPlayer'
import { usePlayerStore } from '@/stores'

defineProps({
	width: {
		type: Number,
		default: 0
	},
	height: {
		type: Number,
		default: 0
	}
})

const canvasContainer = ref<HTMLDivElement | null>(null)

const editorCanvas = ref<HTMLCanvasElement | null>(null)

const playerStore = usePlayerStore()
const playerWidth = computed(() => playerStore.playerWidth)
const playerHeight = computed(() => playerStore.playerHeight)
// 播放器比例(纵横比)
const aspectRatio = computed(() => playerStore.aspectRatio)


function updateCanvasSize() {
	if (!canvasContainer.value) return
	const ratio = playerStore.aspectRatio

	const { width: containerWidth, height: containerHeight } = canvasContainer.value.getBoundingClientRect()

	let canvasW, canvasH
	const aspectRatio = ratio.split(':').map(Number) // 目标纵横比

	if (containerWidth / containerHeight > aspectRatio[0] / aspectRatio[1]) {
		// 容器更宽,以高度为基准
		canvasH = containerHeight
		canvasW = canvasH * (aspectRatio[0] / aspectRatio[1])
	} else {
		// 容器更高,以宽度为基准
		canvasW = containerWidth
		canvasH = canvasW * (aspectRatio[1] / aspectRatio[0])
	}
	playerStore.playerWidth = canvasW
	playerStore.playerHeight = canvasH

	editorCanvas.value
		?.getContext('2d')
		?.scale(canvasW / containerWidth, canvasH / containerHeight)

}

function onResizeCanvas() {
	const resizeObserver = new ResizeObserver(entries => {
		for (let entry of entries) {
			console.log('监听画布容器尺寸变化:', 'w:', entry.contentRect.width, 'h:', entry.contentRect.height);
			updateCanvasSize()
		}
	});
	if (canvasContainer.value) {
		resizeObserver.observe(canvasContainer.value);
	}
}

watch(aspectRatio, () => {
	onResizeCanvas()
})

onMounted(() => {
	onResizeCanvas()

	new CanvasPlayer({
		player: editorCanvas.value
	})

})


</script>

<template>
	<div ref="canvasContainer"
		class="canvas-container w-full h-full relative flex-center overflow-hidden bg-dark-600">

		<canvas ref="editorCanvas"
			id="editorCanvas"
			class="editor-canvas wh-full bg-dark-600"
			:style="{ width: `${playerWidth}px`, height: `${playerHeight}px` }" />

		<CanvasCover :style="{ width: `${playerWidth}px`, height: `${playerHeight}px` }" />

	</div>
</template>
