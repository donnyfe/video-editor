<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import CanvasCover from './CanvasCover.vue'
import { CanvasPlayer } from './canvasPlayer'
import { usePlayerStore } from '@/stores'
import { useResizeCanvas } from '@/hooks'

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
const { playerWidth, playerHeight, aspectRatio } = storeToRefs(playerStore)

// 更新画布尺寸
function updateCanvasSize() {
	const resizeObserver = new ResizeObserver(entries => {
		for (let entry of entries) {

			const containerWidth = entry.contentRect.width
			const containerHeight = entry.contentRect.height
			useResizeCanvas({ containerWidth, containerHeight })

			editorCanvas.value
				?.getContext('2d')
				?.scale(containerWidth / playerWidth.value, containerHeight / playerHeight.value)
		}
	});
	if (canvasContainer.value) {
		resizeObserver.observe(canvasContainer.value);
	}
}

watch(aspectRatio, () => {
	updateCanvasSize()
}, { flush: 'post' })

onMounted(() => {
	updateCanvasSize()

	new CanvasPlayer({
		player: editorCanvas.value
	})
})


</script>

<template>
	<div ref="canvasContainer"
		class="canvas-container bg-dark">
		<canvas ref="editorCanvas"
			id="editorCanvas"
			class="editor-canvas"
			:style="{ width: `${playerWidth}px`, height: `${playerHeight}px` }" />

		<CanvasCover :style="{ width: `${playerWidth}px`, height: `${playerHeight}px` }" />
	</div>
</template>

<style lang="scss" scoped>
.canvas-container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 100%;
	height: 100%;
}
</style>
