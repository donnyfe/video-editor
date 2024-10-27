<script setup lang="ts">
	import { ref, onMounted, watch } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useResizeObserver } from '@vueuse/core'
	import CanvasCover from './CanvasCover.vue'
	import { CanvasPlayer } from './canvasPlayer'
	import { usePlayerStore } from '@/stores'
	import { useResizeCanvas } from '@/hooks'
	defineProps({
		width: {
			type: Number,
			default: 0,
		},
		height: {
			type: Number,
			default: 0,
		},
	})

	const canvasContainer = ref<HTMLDivElement | null>(null)
	const editorCanvas = ref<HTMLCanvasElement | null>(null)

	const playerStore = usePlayerStore()
	const { playerWidth, playerHeight, aspectRatio } = storeToRefs(playerStore)

	// 更新画布尺寸
	function updateCanvasSize() {
		// 观察 canvasContainer 元素并重置画布尺寸
		useResizeObserver(canvasContainer.value, entries => {
			const entry = entries[0]
			const containerWidth = entry.contentRect.width
			const containerHeight = entry.contentRect.height

			useResizeCanvas({ containerWidth, containerHeight })

			editorCanvas.value
				?.getContext('2d')
				?.scale(containerWidth / playerWidth.value, containerHeight / playerHeight.value)
		})
	}

	watch(
		aspectRatio,
		() => {
			updateCanvasSize()
		},
		{ flush: 'post' },
	)

	onMounted(() => {
		updateCanvasSize()

		new CanvasPlayer({
			player: editorCanvas.value,
		})
	})
</script>

<template>
	<div
		ref="canvasContainer"
		class="canvas-container bg-black"
	>
		<canvas
			id="editorCanvas"
			ref="editorCanvas"
			class="editor-canvas"
			:style="{ width: `${playerWidth}px`, height: `${playerHeight}px` }"
		/>

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
