<script setup lang="ts">
import { ref, nextTick, reactive, computed, watch } from 'vue'
import Moveable from 'vue3-moveable'
import { usePlayerStore, useTrackStore } from '@/stores'
import type { MoveableItem } from '@/types'

import type { VideoTrack } from '@/classes/VideoTrack'
import type { ImageTrack } from '@/components/image/ImageTrack'
import type { TextTrack } from '@/classes/TextTrack'

export type TrackItem = VideoTrack | ImageTrack | TextTrack

const defaultMoveOptions = {
	draggable: true,
	resizable: false,
	scalable: true,
	dragArea: false, // 开启 控制拖动区域
	origin: false, // 原点是否可见
	snappable: true, // 开启辅助线
	stopPropagation: true, // 阻止冒泡
	snapThreshold: 5,
	isDisplaySnapDigit: true, // 是否显示辅助线距离
	snapGap: true, // 画块辅助线
	snapElement: true, // 基于元素的辅助线
	snapCenter: true, // 中心辅助线
	snapDigit: 10, // 吸附距离
	snapVertical: true, // 垂直辅助线
	snapHorizontal: true, // 水平辅助线
	throttleDrag: 1,
	throttleResize: 1,
	throttleScale: 0.01,
	keepRatio: true, // 保持宽高比
	renderDirections: ['nw', 'ne', 'se', 'sw'], // 手柄锚点
	rotatable: false, // 是否可旋转
	throttleRotate: 0.1,
	elementGuidelines: [],
	pinchable: false // 捏合开关
}


const playerStore = usePlayerStore()
const trackStore = useTrackStore()

const canvasCover = ref()
const moveable = ref()
const moveTarget = ref()

const playerWidth = computed(() => playerStore.playerWidth)
const playerHeight = computed(() => playerStore.playerHeight)

const movableList = computed(() => {
	if (playerHeight.value === 0 && playerWidth.value === 0) {
		return []
	}

	const moveableItems: MoveableItem[] = []

	trackStore.trackList.forEach(({ list }, lineIndex) => {
		const index = list.findIndex((item) => {
			if (playerStore.playFrame >= item.start && playerStore.playFrame <= item.end && item.draw) {
				return true
			}
			return false
		})

		const trackItem = list[index] as any
		console.log('movableList - trackItem: ', trackItem)

		if (trackItem) {

			const scale = trackItem.scale / 100
			const w = trackItem.width * scale
			const h = trackItem.height * scale

			moveableItems.unshift({
				id: trackItem.id,
				lineIndex,
				itemIndex: index,
				x: trackItem.centerX,
				y: trackItem.centerY,
				w: w,
				h: h,
				scale,
				left: playerStore.playerWidth / 2 - w / 2,
				top: playerStore.playerHeight / 2 - h / 2
			})
		}
	})

	if (moveable.value) {
		moveable.value.updateRect()
	}
	return moveableItems
})

const moveableOptions = reactive({
	target: moveTarget,
	className: 'target-move',
	container: canvasCover.value,
	...defaultMoveOptions
})

function selectItem(eleId: string) {
	console.log('🚀 ~ selectItem ~ eleId:', eleId)
	playerStore.isPause = true
	trackStore.selectTrackById(eleId)
}

/**
 * 备注：
 * 拖拽只放大了选框，未放大图片元素，选框放大与图案元素变大不成比例
 */
function onDrag(params: Record<string, any>) {
	let { target, transform, translate } = params
	const { lineindex, itemindex } = target.dataset
	const [x, y] = translate
	//
	const trackItem = trackStore.trackList[lineindex].list[itemindex] as TrackItem
	trackItem.centerX = x
	trackItem.centerY = y
	trackItem.offsetX = parseInt(playerStore.playerWidth / 2 - (trackItem.width * trackItem.scale / 100) / 2 + x)
	trackItem.offsetY = parseInt(playerStore.playerHeight / 2 - (trackItem.height * trackItem.scale / 100) / 2 + y)

	target.style.transform = transform
	console.log(11, 'onDrag: ', params)
}

function onScale(params: Record<string, any>) {
	let { target, scale, transform } = params
	const { lineindex, itemindex } = target.dataset
	const newScale = Math.max(Math.round(scale[0] * 100), 1)
	const trackItem = trackStore.trackList[lineindex].list[itemindex] as TrackItem
	trackItem.scale = newScale
	console.log(22, 'onScale: ', params)
	target.style.transform = transform
}

function mousedown(event: MouseEvent, eleId: string) {
	event.stopPropagation()
	playerStore.isPause = true
	trackStore.selectTrackById(eleId)
	moveTarget.value = event.currentTarget
	nextTick(() => {
		moveable.value.dragStart(event)
	})
}

watch([trackStore.selectedTrack, movableList], () => {
	// 确保选中轨道元素
	const hasSelectedTrack = trackStore.selectedTrack.line !== -1 && trackStore.selectedTrack.index !== -1
	if (canvasCover.value && hasSelectedTrack) {
		const targetTrack = trackStore.trackList[trackStore.selectedTrack.line].list[trackStore.selectedTrack.index]
		if (targetTrack && movableList.value.find(item => item.id === targetTrack.id)) {
			moveTarget.value = canvasCover.value.querySelector(`.segment-widget[data-eleid='${targetTrack.id}']`)
		} else {
			moveTarget.value = null
		}
	} else {
		moveTarget.value = null
	}
}, { immediate: true, flush: 'post' })
</script>

<template>
	<div ref="canvasCover"
		class="canvas-cover">
		<div class="segment-widget absolute"
			v-for="(item, index) in movableList"
			:key="item.id"
			:data-eleId="item.id"
			:data-lineIndex="item.lineIndex"
			:data-itemIndex="item.itemIndex"
			:style="{
				zIndex: index,
				top: `${item.top}px`,
				left: `${item.left}px`,
				width: `${item.w}px`,
				height: `${item.h}px`,
				transform: `translate(${item.x}px, ${item.y}px) scale(${item.scale}) rotate(${item.rotate}deg)`
			}"
			@click.stop="selectItem(item.id)"
			@mousedown="mousedown($event, item.id)" />

		<Moveable ref="moveable"
			v-bind="moveableOptions"
			@drag="onDrag"
			@scale="onScale" />
	</div>
</template>

<style lang="scss" scoped>
body .target-move .moveable-control {
	@apply border w-3 h-3 border-yellow-400 bg-gray-50 -ml-1.5 -mt-1.5;
}

body .target-move .moveable-line {
	@apply bg-yellow-400 w-px;
}

.canvas-cover {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: transparent;
	box-shadow: 0 0 0 100vh var(--el-bg-color);
}
</style>
