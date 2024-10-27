<script setup lang="ts">
import { ref, nextTick, reactive, computed, watch } from 'vue'
import Moveable from 'vue3-moveable'
import { usePlayerStore, useTrackStore } from '@/stores'
import type { MoveableTrack } from '@/types'

const playerStore = usePlayerStore()
const trackStore = useTrackStore()

const canvasCover = ref()
const moveable = ref()
const moveTarget = ref()

const isCanvasItemVisible = (item: any) =>
	playerStore.playFrame >= item.start &&
	playerStore.playFrame <= item.end &&
	['image', 'video', 'text'].includes(item.type)

const movableList = computed(() => {
	if (playerStore.playerWidth === 0 && playerStore.playerHeight === 0) {
		return []
	}
	const result = trackStore.trackList.flatMap(({ list }, lineIndex) => {
		const trackItem = list.find(isCanvasItemVisible)

		if (!trackItem) { return [] }

		const { id, width: w, height: h, scale, centerX, centerY } = trackItem as any
		const scaleFactor = scale / 100

		return [
			{
				id,
				lineIndex,
				itemIndex: list.indexOf(trackItem),
				x: centerX,
				y: centerY,
				w,
				h,
				scale: scaleFactor,
				left: playerStore.playerWidth / 2 - w / 2,
				top: playerStore.playerHeight / 2 - h / 2,
			},
		]
	})

	if (moveable.value) {
		moveable.value.updateRect()
	}
	return result
})

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
	pinchable: false, // 捏合开关
}

const moveableOptions = reactive({
	target: moveTarget,
	className: 'target-move',
	container: canvasCover.value,
	...defaultMoveOptions,
})

function selectItem(eleId: string) {
	playerStore.isPause = true
	trackStore.selectTrackById(eleId)
}

function updateTrackItem(lineIndex: number, itemIndex: number, updates: Partial<MoveableTrack>) {
	const item = trackStore.trackList[lineIndex].list[itemIndex]
	Object.assign(item, updates)
}

/**
 * 处理拖拽事件
 * @param params 拖拽事件参数
 */
function onDrag(params: Record<string, any>) {
	let { target, transform, translate } = params
	const { lineindex, itemindex } = target.dataset
	const [x, y] = translate
	updateTrackItem(lineindex, itemindex, { centerX: x, centerY: y })
	target.style.transform = transform
}

/**
 * 处理缩放事件
 * @param params 缩放事件参数
 */
function onScale(params: Record<string, any>) {
	let { target, scale, transform } = params
	const { lineindex, itemindex } = target.dataset
	const newScale = Math.max(Math.round(scale[0] * 100), 1)
	updateTrackItem(lineindex, itemindex, { scale: newScale })
	target.style.transform = transform
}

/**
 * 处理鼠标按下事件
 * @param event 鼠标事件对象
 * @param eleId 元素ID
 */
function mousedown(event: MouseEvent, eleId: string) {
	event.stopPropagation()
	event.preventDefault()

	playerStore.isPause = true
	trackStore.selectTrackById(eleId)
	moveTarget.value = event.currentTarget
	nextTick(() => {
		moveable.value.dragStart(event)
	})
}

/**
 * 获取选中的轨道元素
 */
const selectedTrackElement = computed(() => {
	const { line, index } = trackStore.selectedTrack
	if (line === -1 || index === -1) { return null }

	const targetTrack = trackStore.trackList[line]?.list[index]
	if (!targetTrack || !movableList.value.find((item) => item.id === targetTrack.id)) { return null }

	return canvasCover.value?.querySelector(`.segment-widget[data-eleid='${targetTrack.id}']`) ?? null
})

const playerWidth = computed(() => playerStore.playerWidth)

watch(
	[trackStore.selectedTrack, movableList, () => playerWidth.value],
	() => {
		// 设置选移动目标
		moveTarget.value = selectedTrackElement.value

		if (moveable.value) {
			moveable.value.updateRect()
		}
	},
	{ immediate: true, flush: 'post' },
)
</script>

<template>
	<div
		ref="canvasCover"
		class="canvas-cover"
	>
		<div
			v-for="(item, index) in movableList"
			:key="item.id"
			class="segment-widget absolute"
			:data-eleId="item.id"
			:data-lineIndex="item.lineIndex"
			:data-itemIndex="item.itemIndex"
			:style="{
				zIndex: 999 - index,
				top: `${item.top}px`,
				left: `${item.left}px`,
				width: `${item.w}px`,
				height: `${item.h}px`,
				transform: `translate(${item.x}px, ${item.y}px) scale(${item.scale})`,
			}"
			@click.stop="selectItem(item.id)"
			@mousedown="mousedown($event, item.id)"
		/>

		<Moveable
			ref="moveable"
			v-bind="moveableOptions"
			@drag="onDrag"
			@scale="onScale"
		/>
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
	overflow: hidden;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: transparent;
	box-shadow: 0 0 0 100vh var(--el-bg-color);
}
</style>
