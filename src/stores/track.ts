import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { checkTrackListOverlap } from '@/utils'
import type { AdsorptionLine, Resource, TrackListItem } from '@/types'

export const useTrackStore = defineStore('trackStore', () => {
	// 轨道列表
	const trackList = reactive<TrackListItem[]>([])
	// 轨道放大比例
	const trackScale = ref(parseInt(localStorage.trackS || '50'))

	const dragData = reactive({
		// 拖拽数据
		dataInfo: {} as Resource,
		dragType: '',
		dragPoint: {
			x: 0,
			y: 0
		},
		// 吸附辅助线
		fixLines: [] as AdsorptionLine[][],
		moveX: 0,
		moveY: 0
	})

	// 行内移动
	const moveTrackData = reactive({
		lineIndex: -1,
		itemIndex: -1
	})

	// 选中轨道中的资源(索引), -1表示未选中
	const selectedTrack = reactive({
		line: -1,
		index: -1
	})

	// 选中资源元素
	const selectResource = computed(() => {
		if (selectedTrack.line === -1) {
			return null
		}
		return trackList[selectedTrack.line]?.list[selectedTrack.index] || null
	})

	const frameCount = computed(() => {
		return trackList.reduce((res, { list }) => {
			return Math.max(
				list.reduce((max, track) => Math.max(max, track.end), 0),
				res
			)
		}, 0)
	})

	/**
	 * 添加轨道
	 * 输入: 资源
	 */
	function addTrack(resource: Resource) {
		const line = trackList.find(
			item => item.type === resource.type && !checkTrackListOverlap(item.list, resource).hasOverlap
		) as TrackListItem | undefined

		if (line) {
			const { insertIndex } = checkTrackListOverlap(line.list, resource)
			line.list.splice(insertIndex, 0, resource)
			selectedTrack.line = trackList.indexOf(line)
			selectedTrack.index = insertIndex
			return
		}

		// 没有轨道时，新增轨道插入
		const trackListItem = { type: resource.type, list: [resource] }
		// 音频类型插入最底层
		if (['audio'].includes(resource.type)) {
			trackList.push(trackListItem)
			selectedTrack.line = 0
			selectedTrack.index = 0
		} else {
			// 其他类型插入最顶层
			trackList.unshift(trackListItem)
			selectedTrack.line = trackList.length - 1
			selectedTrack.index = 0
		}
	}

	/**
	 * 删除轨道
	 * 输入：轨道行索引，轨道元素索引
	 */
	function removeTrack(lineIndex: number, itemIndex: number) {
		trackList[lineIndex].list.splice(itemIndex, 1)
		// 确保轨道行资源为空
		if (trackList[lineIndex].list.length === 0 && !trackList[lineIndex].main) {
			trackList.splice(lineIndex, 1)
		}
		if (trackList.length === 1 && trackList[0].list.length === 0) {
			trackList.splice(0, 1)
		}
	}

	/**
	 * 根据id选择轨道
	 * 输入：id
	 */
	function selectTrackById(id: string) {
		trackList.forEach((item, index) => {
			item.list.forEach((trackItem, trackIndex) => {
				if (trackItem.id === id) {
					// 选中轨道
					selectedTrack.line = index
					selectedTrack.index = trackIndex
				}
			})
		})
	}

	// --------------------------------------

	return {
		frameCount, // 帧数
		dragData, // 拖拽数据
		trackScale, // 轨道放大比例
		trackList, // 轨道列表
		moveTrackData, // 行内移动
		selectedTrack, // 选中轨道元素
		selectResource, // 选中资源元素
		addTrack, // 添加轨道
		removeTrack, // 删除轨道
		selectTrackById // 根据id选择轨道
	}
})
