<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTrackStore, usePlayerStore } from '@/stores'
import { getGridPixel, getSelectFrame } from '@/utils'

const trackStore = useTrackStore()
const playerStore = usePlayerStore()

const offsetLine = {
	left: 10
}

const trackStyle = computed(() => {
	return {
		left: `${offsetLine.left}px`,
		transform: `translate(${getGridPixel(trackStore.trackScale, playerStore.playFrame)}px, 0px)`
	}
})

const isDragging = ref(false)

function onMouseDown(event: MouseEvent) {
	event.stopPropagation()
	event.preventDefault()
	playerStore.isPause = true
	isDragging.value = true
}


function onMouseMove(event: MouseEvent) {
	if (isDragging.value) {
		const trackContainer = document.getElementById('track-container') as HTMLDivElement
		// 获取相对于#timeline的偏移量
		const rect = trackContainer.getBoundingClientRect()
		// 默认fps为30
		const FPS = 30
		const frame = getSelectFrame(event.pageX - offsetLine.left - rect.left, trackStore.trackScale, FPS)

		const targetFrame = frame - 1
		const startFrame = targetFrame < 0 ? 0 : targetFrame > trackStore.frameCount ? trackStore.frameCount : targetFrame
		playerStore.playFrame = startFrame
	}
}

function onMouseUp() {
	isDragging.value = false
}

document.addEventListener('mousemove', onMouseMove)
document.addEventListener('mouseup', onMouseUp)
</script>

<template>
	<div id="trackPlayPoint"
		class="z-30 w-px absolute -top-5 bottom-0 bg-gray-700 dark:bg-gray-100 transition-transform duration-75"
		:style="trackStyle"
		@mousedown="onMouseDown">
		<span
			class="playPoint block border-1 border-gray-600 bg-gray-600 h-3 w-2.5 dark:border-gray-100 dark:bg-gray-100 sticky top-0 right-0 left-0 cursor-move">
		</span>
	</div>
</template>

<style lang="scss" scoped>
.playPoint {
	transform: translateX(-50%);
}

.playPoint::after {
	content: '';
	display: block;
	width: 10px;
	height: 10px;
	border: 5px solid;
	position: absolute;
	top: 100%;
	border-right-color: transparent;
	border-left-color: transparent;
	border-bottom-color: transparent;
}
</style>
