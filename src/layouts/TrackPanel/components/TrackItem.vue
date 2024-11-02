<script setup lang="ts">
	import { computed } from 'vue'
	import TrackHandler from './TrackHandler.vue'
	import VideoItem from './trackItem/VideoItem.vue'
	import AudioItem from './trackItem/AudioItem.vue'
	import TextItem from './trackItem/TextItem.vue'
	import ImageItem from './trackItem/ImageItem.vue'
	import { useTrackStore } from '@/stores'

	const props = defineProps({
		trackType: {
			type: String,
			default: ''
		},
		lineIndex: {
			type: Number,
			default: 0
		},
		itemIndex: {
			type: Number,
			default: 0
		},
		trackItem: {
			type: Object,
			default() {
				return {
					width: '0px',
					left: '0px'
				}
			}
		}
	})

	const componentMap = new Map<string, any>([
		['video', VideoItem],
		['audio', AudioItem],
		['text', TextItem],
		['image', ImageItem]
	])

	const TrackHeightMap = new Map([
		['video', 'h-16'],
		['audio', 'h-12'],
		['text', 'h-6'],
		['image', 'h-6']
	])

	const store = useTrackStore()

	const isActive = computed(() => {
		return (
			store.selectedTrack.line === props.lineIndex && store.selectedTrack.index === props.itemIndex
		)
	})

	const isDragState = computed(() => {
		return (
			store.moveTrackData.lineIndex === props.lineIndex &&
			store.moveTrackData.itemIndex === props.itemIndex
		)
	})

	function setSelectTrack(event: Event) {
		event.preventDefault()
		event.stopPropagation()
		store.selectedTrack.line = props.lineIndex
		store.selectedTrack.index = props.itemIndex
	}

	const itemStyle = computed(() => {
		if (isDragState.value) {
			return {
				width: props.trackItem.showWidth,
				left: `${parseInt(props.trackItem.showLeft) + store.dragData.moveX}px`,
				top: `${store.dragData.moveY}px`
			}
		}
		return {
			width: props.trackItem.showWidth,
			left: props.trackItem.showLeft
		}
	})
</script>

<template>
	<div
		class="trackItem absolute text-left text-sm top-0"
		:class="[TrackHeightMap.get(props.trackItem.type), isDragState ? 'z-50 isDrag' : 'z-10']"
		:style="[itemStyle]"
		:data-type="props.trackItem.type"
		:data-line="lineIndex"
		:data-index="itemIndex"
		@click="setSelectTrack"
	>
		<!-- 操作手柄 -->
		<TrackHandler
			:is-active="isActive"
			:line-index="lineIndex"
			:item-index="itemIndex"
		/>
		<!-- 容器 -->
		<component
			:is="componentMap.get(trackItem.type)"
			:track-item="trackItem"
		/>
	</div>
</template>
