<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { useTrackStore, usePlayerStore } from '@/stores'
	import { getGridPixel } from '@/utils'
	import type { Resource, LineCoord, AdsorptionLine } from '@/types'

	const props = defineProps({
		isActive: Boolean,
		lineIndex: {
			type: Number,
			default: 0,
		},
		itemIndex: {
			type: Number,
			default: 0,
		},
	})

	const store = useTrackStore()
	const playerStore = usePlayerStore()

	const targetTrack = computed(() => store.trackList[props.lineIndex]?.list[props.itemIndex])

	const el = ref()

	// 定位数据缓存
	const positionLeft = ref(0)

	// 手柄可操作的属性配置
	const handlerData = ref({
		isVA: false,
		start: 0,
		end: 0,
		offsetR: 0,
		offsetL: 0,
		minStart: 0,
		maxStart: 0,
		minEnd: 0,
		maxEnd: 0,
	})

	const enableMove = ref(false)

	// 游标位置
	const otherCoords = ref<LineCoord[]>([])

	// 获取吸附辅助线
	const getFixLine = (x: number, distance = 10) => {
		const result = otherCoords.value.flatMap(coord => {
			const lines = []
			if (Math.abs(coord.left - x) <= distance) {
				lines.push({ position: coord.left, frame: coord.start })
			}
			if (Math.abs(coord.right - x) <= distance) {
				lines.push({ position: coord.right, frame: coord.end })
			}
			return lines
		})

		const trackPlayPointX = getGridPixel(store.trackScale, playerStore.playFrame)
		if (Math.abs(trackPlayPointX - x) <= distance) {
			result.push({ position: trackPlayPointX, frame: playerStore.playFrame })
		}

		return result
	}

	// 设置吸附
	const adsorption = (x: number, lines: AdsorptionLine[]) => {
		if (lines.length === 0) {
			return
		}

		return lines.reduce(
			(r, item) => (Math.abs(item.position - x) < Math.abs(r.position - x) ? item : r),
			{ position: Number.MAX_SAFE_INTEGER, frame: 0 },
		)
	}

	const frameWidth = computed(() => getGridPixel(store.trackScale, 1))

	// 初始化限制数据
	const initLimits = (lineData: Resource[], trackItem: Resource) => {
		const beforeTrack = props.itemIndex > 0 ? lineData[props.itemIndex - 1] : null
		const afterTrack = props.itemIndex < lineData.length ? lineData[props.itemIndex + 1] : null
		const isVA = ['video', 'audio'].includes(trackItem.type)

		const limitData = {
			isVA,
			start: trackItem.start,
			end: trackItem.end,
			offsetL: trackItem.offsetL,
			offsetR: trackItem.offsetR,
			minStart: beforeTrack?.end ?? 0,
			maxStart: trackItem.end - 1,
			minEnd: trackItem.start + 1,
			maxEnd: afterTrack?.start ?? 30 * 60 * 60,
		}

		if (isVA) {
			const rightMaxWidth = trackItem.frameCount - limitData.offsetL
			const leftMaxWidth = trackItem.frameCount - limitData.offsetR
			limitData.maxEnd = afterTrack
				? Math.min(afterTrack.start, limitData.start + rightMaxWidth)
				: Math.min(rightMaxWidth + limitData.start, 30 * 60 * 60)
			limitData.minStart = beforeTrack
				? Math.max(beforeTrack.end, limitData.end - leftMaxWidth)
				: Math.max(limitData.end - leftMaxWidth, 0)
		}

		Object.assign(handlerData.value, limitData)
	}

	// 设置轨道数据
	const setTrackFrameData = (frameCount: number, handleType: string) => {
		const {
			isVA,
			start: originStart,
			end: originEnd,
			offsetR,
			offsetL,
			minStart,
			maxStart,
			minEnd,
			maxEnd,
		} = handlerData.value
		const originWidth = originEnd - originStart
		const leftMaxWidth = offsetL + originWidth
		const rightMaxWidth = offsetR + originWidth
		const trackItem = store.trackList[props.lineIndex].list[props.itemIndex]

		if (handleType === 'left') {
			let newStart = Math.max(minStart, Math.min(maxStart, originStart + frameCount))
			let diffStart = newStart - originStart
			if (isVA) {
				if (originEnd - newStart > leftMaxWidth) {
					newStart = originEnd - leftMaxWidth
					diffStart = newStart - originStart
				}
				trackItem.offsetL = Math.max(offsetL + diffStart, 0)
			} else {
				trackItem.frameCount = originEnd - newStart
			}
			trackItem.start = newStart
		} else {
			let newEnd = Math.max(minEnd, Math.min(maxEnd, originEnd + frameCount))
			if (isVA) {
				if (newEnd - originStart > rightMaxWidth) {
					newEnd = originStart + rightMaxWidth
				}
				const diffEnd = newEnd - originEnd
				trackItem.offsetR = Math.max(offsetR - diffEnd, 0)
			} else {
				trackItem.frameCount = newEnd - originStart
			}
			trackItem.end = newEnd
		}
	}

	// 获取轨道中素材的游标
	const getTrackItemCoords = () => {
		otherCoords.value = store.trackList.flatMap((track, i) =>
			track.list.flatMap((item, j) =>
				i !== props.lineIndex || j !== props.itemIndex
					? [
							{
								start: item.start,
								end: item.end,
								left: getGridPixel(store.trackScale, item.start),
								right: getGridPixel(store.trackScale, item.end),
							},
						]
					: [],
			),
		)
	}

	const mouseDownHandler = (event: MouseEvent, type: string) => {
		event.preventDefault()
		event.stopPropagation()
		getTrackItemCoords()

		playerStore.isPause = true
		positionLeft.value = event.pageX
		enableMove.value = true
		initLimits(store.trackList[props.lineIndex]?.list ?? [], targetTrack.value)

		const start = targetTrack.value.start
		const end = targetTrack.value.end

		const trackItem = el.value.closest('.trackItem')
		const position =
			type === 'left' ? trackItem.offsetLeft : trackItem.offsetLeft + trackItem.offsetWidth

		const handleMouseMove = (documentEvent: MouseEvent) => {
			if (!enableMove.value) {
				return
			}
			const moveWidth = positionLeft.value - documentEvent.pageX
			const lines = getFixLine(position - moveWidth)

			store.dragData.fixLines = [lines]

			const result = adsorption(position - moveWidth, lines)
			const frameCount = result?.frame
				? type === 'left'
					? result.frame - start
					: result.frame - end
				: -Math.round(moveWidth / frameWidth.value)
			setTrackFrameData(frameCount, type)
		}

		const handleMouseUp = () => {
			enableMove.value = false
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}
</script>

<template>
	<div
		v-show="isActive"
		ref="el"
		class="absolute left-0 right-0 top-0 bottom-0 border z-20"
		:class="{ 'dark:border-gray-100 border-gray-600': isActive }"
	>
		<div
			ref="handlerLeft"
			class="cursor-c-resize flex flex-col justify-center absolute bottom-0 -top-px -bottom-px -left-2 text-center rounded-tl rounded-bl w-2 dark:bg-gray-100 bg-gray-600 dark:text-gray-800 text-gray-100"
			@mousedown="mouseDownHandler($event, 'left')"
		>
			<span>|</span>
		</div>

		<div
			ref="handlerRight"
			class="cursor-c-resize flex flex-col justify-center absolute bottom-0 -top-px -bottom-px -right-2 text-center rounded-tr rounded-br w-2 dark:bg-gray-100 bg-gray-600 dark:text-gray-800 text-gray-100"
			@mousedown="mouseDownHandler($event, 'right')"
		>
			<span>|</span>
		</div>
	</div>
</template>

<style scoped></style>
