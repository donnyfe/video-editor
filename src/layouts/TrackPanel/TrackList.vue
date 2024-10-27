<script setup lang="ts">
import { ref, computed } from 'vue'
import { debounce } from 'lodash-es'
import TimeLine from './components/TimeLine.vue'
import TrackLine from './components/TrackLine.vue'
import TrackListIcon from './components/TrackListIcon.vue'
import TrackPlayPoint from './components/TrackPlayPoint.vue'
import IconVideo from '@/components/Icons/IconVideo.vue'
import { useTrackStore, usePlayerStore } from '@/stores'
import { getGridPixel, getSelectFrame, formatTime, isVideo } from '@/utils'
import type { VideoSource, InsertInfo, InsertLineInfo } from '@/types'

const trackStore = useTrackStore()
const playerStore = usePlayerStore()

const trackListContainer = ref<HTMLElement | null>(null)
const trackList = ref<HTMLElement | null>(null)

const offsetLine = {
	left: 10, // 容器 margin, 为了显示拖拽手柄
	right: 200,
}
const startX = ref(-offsetLine.left) // 与容器padding对齐
const startY = ref(0) // 左侧icons对齐
const trackScale = computed(() => trackStore.trackScale) // 轨道默认缩放

const trackStyle = computed(() => ({
	width: getGridPixel(trackScale.value, trackStore.frameCount) + offsetLine.right,
}))

const defaultFps = ref(30) // 帧率
const dropLineIndex = ref(-1) // 目标行
const insertBefore = ref(true) // 之前插入还是之后插入
let mainIndex = ref(0) // main 行下标

const trackListData = computed(() => {
	return trackStore.trackList.map((line, lineIndex) => {
		if (line.main) {
			mainIndex.value = lineIndex
		}
		const list = line.list.map((item) => {
			const { duration: time } = item.source as VideoSource
			return {
				...item,
				showWidth: `${getGridPixel(trackScale.value, item.end - item.start)}px`,
				showLeft: `${getGridPixel(trackScale.value, item.start)}px`,
				time: isVideo(line.type) ? `${formatTime(time * 1000 || 0).str}` : '',
			}
		})

		return {
			...line,
			list,
		}
	})
})

function setSelectTrack(event: Event, line: number, index: number) {
	event.preventDefault()
	event.stopPropagation()
	trackStore.selectedTrack.line = line
	trackStore.selectedTrack.index = index
}

function handlerSelectFrame(selectFrame: number) {
	const targetFrame = Math.max(0, Math.min(selectFrame - 1, trackStore.frameCount))
	playerStore.isPause = true
	playerStore.playFrame = targetFrame
}

let maxDelta = 0

const setScale = debounce(() => {
	trackStore.trackScale -= maxDelta > 0 ? 10 : -10
	maxDelta = 0
}, 100)

const handleWheel = (event: WheelEvent) => {
	if (event.ctrlKey || event.metaKey) {
		event.preventDefault()
		if (maxDelta) {
			maxDelta = event.deltaY
		}
		setScale()
	}
}
function handleScroll() {
	const { scrollLeft, scrollTop } = trackList.value as HTMLElement
	startX.value = scrollLeft - offsetLine.left
	startY.value = scrollTop
}
let dragElement: HTMLElement | null = null
let curCoord = { left: 0, right: 0, start: 0, end: 0 }
let otherCoords: Record<string, number>[] = []

function getComputedPosition(element: HTMLElement) {
	const style = window.getComputedStyle(element)
	return {
		left: parseInt(style.left),
		right: parseInt(style.left) + parseInt(style.width),
	}
}

function onMouseDown(event: MouseEvent) {
	dragElement = (event.target as HTMLElement).closest('.trackItem') as HTMLElement
	if (!dragElement) {
		return
	}

	trackStore.dragData.moveX = 0
	trackStore.dragData.moveY = 0

	const lineIndex = Number(dragElement.dataset.line)
	const index = Number(dragElement.dataset.index)
	const dragItem = trackStore.trackList[lineIndex].list[index]

	// 获取当前鼠标位置
	trackStore.dragData.dragPoint.x = event.pageX
	trackStore.dragData.dragPoint.y = event.pageY
	// 设置拖拽信息
	trackStore.dragData.dataInfo = dragItem
	trackStore.dragData.dragType = dragElement.dataset.type ?? ''
	// 设置移动轨道信息
	trackStore.moveTrackData.lineIndex = lineIndex
	trackStore.moveTrackData.itemIndex = index
	// 重置当前选中的轨道
	trackStore.selectedTrack.line = -1
	trackStore.selectedTrack.index = 0

	curCoord = {
		start: dragItem.start,
		end: dragItem.end,
		left: getGridPixel(trackStore.trackScale, dragItem.start),
		right: getGridPixel(trackStore.trackScale, dragItem.end),
	}

	// 获取非当前位置的trackItem元素的left、right值
	otherCoords = []
	for (let i = 0; i < trackStore.trackList.length; i++) {
		for (let j = 0; j < trackStore.trackList[i].list.length; j++) {
			if (i !== lineIndex || j !== index) {
				const item = trackStore.trackList[i].list[j]
				otherCoords.push({
					start: item.start,
					end: item.end,
					left: getGridPixel(trackStore.trackScale, item.start),
					right: getGridPixel(trackStore.trackScale, item.end),
				})
			}
		}
	}
}

function isOverlap(
	dragItem: any,
	line: Record<string, any>,
	{ start, end }: { start: number; end: number },
) {
	if (dragItem.type !== line.type) {
		return { overlap: true, index: 0 }
	}
	// 插入的位置在trackLine中
	const nodes = line.list.filter((item: any) => item.id !== dragItem.id)
	if (nodes.length === 0) {
		return { overlap: false, index: 0 }
	}
	// 处理边界问题
	if (nodes[0].start >= end) {
		return { overlap: false, index: 0 }
	}
	if (nodes[nodes.length - 1].end <= start) {
		return { overlap: false, index: nodes.length }
	}
	for (let i = 0; i < nodes.length - 1; i++) {
		const node = nodes[i]
		const preNode = nodes[i + 1]
		if (start >= node.end && end <= preNode.right) {
			return { overlap: false, index: i + 1 }
		}
	}
	// 当重叠时，创建新行，所以插入位置为0
	return { overlap: true, index: 0 }
}

function getInsertLineInfo(): InsertLineInfo {
	const dragEl = dragElement as HTMLElement
	const center =
		dragEl.offsetTop + dragEl.offsetHeight / 2 + (dragEl.offsetParent as HTMLElement).offsetTop

	const elems = Array.from(document.querySelectorAll('.trackLine')) as HTMLElement[]

	// 处理边界情况
	// center在第一个元素之前
	if (elems[0].offsetTop > center) {
		return { isNewLine: true, insertIndex: 0 }
	}

	for (let i = 0; i < elems.length; i++) {
		const elem = elems[i]
		// center在一个元素中
		if (elem.offsetTop <= center && elem.offsetTop + elem.offsetHeight >= center) {
			return { isNewLine: false, insertIndex: i, elem }
		}
		if (i + 1 !== elems.length) {
			const elemNext = elems[i + 1]
			// center在两个元素之间
			if (elem.offsetTop + elem.offsetHeight <= center && elemNext.offsetTop >= center) {
				return { isNewLine: true, insertIndex: i + 1 }
			}
		}
	}
	// center在最后一个元素之后
	return { isNewLine: true, insertIndex: elems.length }
}

let fixPosition = { left: 0, right: 0, start: 0, end: 0 }

// 获取插入信息
// insertIndex插入的位置，isNewLine是否插入新行, 插入的位置left、right值，插入行的位置，itemIndex
function getInsertInfo(): InsertInfo {
	let { isNewLine, insertIndex, elem } = getInsertLineInfo()

	const style = getComputedPosition(dragElement as HTMLElement)

	const left = fixPosition.left || style.left
	const right = fixPosition.right || style.right

	const start = fixPosition.start || getSelectFrame(left, trackStore.trackScale, 30)
	const end = fixPosition.end || getSelectFrame(right, trackStore.trackScale, 30)

	if (!elem) {
		return { insertIndex, itemIndex: 0, isNewLine, left, right, start, end }
	}

	const dragItem = trackStore.dragData.dataInfo
	const line = trackStore.trackList[insertIndex]

	const { overlap, index: itemIndex } = isOverlap(dragItem, line, { start, end })
	const dragEl = dragElement as HTMLElement
	// 如果重叠，根据位置判断是插入当前行之前还是之后
	if (overlap) {
		isNewLine = true
		// 获取elem的中心点
		const center = elem.offsetLeft + elem.offsetWidth / 2
		if (
			center <
			dragEl.offsetTop + (dragEl.offsetParent as HTMLElement).offsetTop + dragEl.offsetHeight / 2
		) {
			insertIndex -= 1
		}
	}
	return { insertIndex, itemIndex, isNewLine, left, right, start, end }
}

function onMouseMove(event: MouseEvent) {
	if (dragElement) {
		trackStore.dragData.moveX = event.pageX - trackStore.dragData.dragPoint.x
		trackStore.dragData.moveY = event.pageY - trackStore.dragData.dragPoint.y

		const left = trackStore.dragData.moveX + curCoord.left
		const right = trackStore.dragData.moveX + curCoord.right

		trackStore.dragData.fixLines = [getFixLine(left), getFixLine(right)]

		// 设置吸附
		setAdsorption({ left, right }, trackStore.dragData.fixLines)
	}
}

// 获取吸附辅助线
function getFixLine(x: number, distance = 10) {
	// otherCoords、游标位置
	// 先获取与拖拽元素left、right，距离小于distance的元素
	const result = []
	otherCoords.forEach((coord) => {
		if (Math.abs(coord.left - x) <= distance) {
			result.push({ position: coord.left, frame: coord.start })
		}
		if (Math.abs(coord.right - x) <= distance) {
			result.push({ position: coord.right, frame: coord.end })
		}
	})
	// 获取与游标位置距离小于distance的元素
	const trackPlayPointX = getGridPixel(trackStore.trackScale, playerStore.playFrame)
	if (Math.abs(trackPlayPointX - x) <= distance) {
		result.push({ position: trackPlayPointX, frame: playerStore.playFrame })
	}

	return result
}

// 设置吸附
function setAdsorption({ left, right }: Record<string, number>, lines: Record<string, number>[][]) {
	fixPosition = { left: 0, right: 0, start: 0, end: 0 }
	if (lines[0].length === 0 && lines[1].length === 0) {
		return
	}

	const firstItem = { position: Number.MAX_SAFE_INTEGER, frame: 0 }
	// 吸附其实就是移动拖拽元素的位置
	// 找到最近的线，计算移动的距离
	const minLeftLine = lines[0].reduce((r, item) => {
		return Math.abs(item.position - left) < Math.abs(r.position - left) ? item : r
	}, firstItem)

	const minRightLine = lines[1].reduce((r, item) => {
		return Math.abs(item.position - right) < Math.abs(r.position - right) ? item : r
	}, firstItem)

	if (Math.abs(minLeftLine.position - left) < Math.abs(minRightLine.position - right)) {
		// 左对齐
		fixPosition.left = minLeftLine.position
		fixPosition.start = minLeftLine.frame
		trackStore.dragData.moveX = minLeftLine.position - curCoord.left
	} else {
		// 右对齐
		fixPosition.right = minRightLine.position
		fixPosition.end = minRightLine.frame
		trackStore.dragData.moveX = minRightLine.position - curCoord.right
	}
}

function insert(insertInfo: InsertInfo) {
	let dragInfo = trackStore.dragData.dataInfo
	const startFrame = Math.max(
		fixPosition.right !== 0
			? getSelectFrame(insertInfo.right, trackStore.trackScale, 30) -
					(dragInfo.end - dragInfo.start)
			: getSelectFrame(insertInfo.left, trackStore.trackScale, 30),
		0,
	)

	// 移动元素到新为止
	dragInfo.end = startFrame + (dragInfo.end - dragInfo.start)
	dragInfo.start = startFrame
	const newTrackItem = dragInfo
	// 先根据id将原本的trackItem设置为null
	let deleteLineIndex = 0
	let deleteItemIndex = 0
	trackStore.trackList.forEach((lineItem, lineIndex) => {
		lineItem.list.forEach((item, itemIndex) => {
			if (item.id === dragInfo.id) {
				deleteLineIndex = lineIndex
				deleteItemIndex = itemIndex
			}
		})
	})
	trackStore.trackList[deleteLineIndex].list.splice(deleteItemIndex, 1)
	if (insertInfo.isNewLine) {
		// 插入新行
		trackStore.trackList.splice(insertInfo.insertIndex, 0, {
			type: newTrackItem.type,
			list: [newTrackItem],
		})
	} else {
		// 插入当前行
		trackStore.trackList[insertInfo.insertIndex].list.splice(insertInfo.itemIndex, 0, newTrackItem)
	}
	// 删除store.trackList中，list为空的元素
	const deleteIndex = trackStore.trackList.findIndex((lineItem) => lineItem.list.length === 0)
	if (deleteIndex !== -1) {
		trackStore.trackList.splice(deleteIndex, 1)
	}
}

function onMouseUp(event: MouseEvent) {
	if (dragElement) {
		trackStore.dragData.moveX = event.pageX - trackStore.dragData.dragPoint.x
		trackStore.dragData.moveY = event.pageY - trackStore.dragData.dragPoint.y

		const left = trackStore.dragData.moveX + curCoord.left
		const right = trackStore.dragData.moveX + curCoord.right

		trackStore.dragData.fixLines = [getFixLine(left), getFixLine(right)]

		// 设置吸附
		setAdsorption({ left, right }, trackStore.dragData.fixLines)

		const info = getInsertInfo()
		insert(info)
	}

	// 重置移动轨道信息
	resetDragData()
}

const resetDragData = () => {
	dragElement = null
	trackStore.moveTrackData.lineIndex = -1
	trackStore.moveTrackData.itemIndex = -1
	trackStore.dragData.fixLines = []
	trackStore.dragData.moveX = 0
	trackStore.dragData.moveY = 0
}
</script>

<template>
	<div class="trackList flex flex-1 flex-row w-full overflow-x-hidden overflow-y-auto relative">
		<TrackListIcon
			:list-data="trackListData"
			:offset-top="startY"
		/>

		<div
			ref="trackList"
			class="flex-1 overflow-x-scroll overflow-y-auto flex-col shrink-0 grow relative"
			@scroll="handleScroll"
			@wheel="handleWheel"
			@click="setSelectTrack($event, -1, -1)"
		>
			<!-- 时间轴 -->
			<TimeLine
				:start="startX"
				:scale="trackScale"
				:step="defaultFps"
				:focus-position="trackStore.selectResource as any"
				@select="handlerSelectFrame"
			/>

			<div
				ref="trackListContainer"
				class="absolute top-5 flex shrink-0 grow min-w-full"
				:style="{ 'min-height': 'calc(100% - 20px)' }"
				@mousedown="onMouseDown"
				@mousemove="onMouseMove"
				@mouseup="onMouseUp"
				@mouseleave="onMouseUp"
			>
				<template v-if="trackListData.length === 0">
					<div
						class="flex justify-center items-center h-24 m-auto w-2/3 dark:bg-gray-500 bg-gray-200 rounded-md text-sm border-dashed border-2 dark:border-gray-500 border-gray-200 hover:dark:border-blue-300 hover:border-blue-400"
					>
						<IconVideo class="text-xl mr-4" />
						添加素材，开始编辑你的大作吧~
					</div>
				</template>
				<div
					v-else
					id="track-container"
					class="z-10 pt-5 pb-5 min-w-full flex shrink-0 grow flex-col justify-center min-h-full"
					:style="{ width: `${trackStyle.width}px` }"
				>
					<template
						v-for="(lineData, lineIndex) of trackListData"
						:key="lineData.list.reduce((r, item) => r + item.id, 'line')"
					>
						<TrackLine
							:class="[
								dropLineIndex === lineIndex ? insertBefore ? 'showLine-t' : 'showLine-b' : '',
							]"
							:line-type="lineData.type"
							:is-active="trackStore.selectedTrack.line === lineIndex"
							:line-index="lineIndex"
							:is-main="lineData.main"
							:line-data="lineData.list"
							:style="{ 'margin-left': `${offsetLine.left}px` }"
						/>
					</template>
				</div>

				<TrackPlayPoint v-show="trackListData.length !== 0" />

				<template v-if="trackListData.length !== 0">
					<div
						v-for="(line, index) in trackStore.dragData.fixLines.reduce(
							(r, item) => r.concat(item),
							[],
						)"
						:key="index"
						class="z-30 w-px absolute -top-5 bottom-0 bg-yellow-300 dark:bg-yellow-300 pointer-events-none"
						:style="{ left: `${line.position + 10}px` }"
					/>
				</template>
			</div>
		</div>
	</div>
</template>
