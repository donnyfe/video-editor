<script setup lang="ts">
	import { ref, watch, type PropType } from 'vue'
	import IconVideo from '@/components/Icons/IconVideo.vue'
	import IconAudio from '@/components/Icons/IconAudio.vue'
	import IconImage from '@/components/Icons/IconImage.vue'
	import IconText from '@/components/Icons/IconText.vue'
	import type { TrackListItem } from '@/types'

	const props = defineProps({
		listData: {
			type: Array as PropType<TrackListItem[]>,
			default() {
				return []
			},
		},
		offsetTop: {
			type: Number,
			default: 0,
		},
	})

	const componentMap = new Map([
		['video', IconVideo],
		['audio', IconAudio],
		['text', IconText],
		['image', IconImage],
	])

	const TrackHeightMap = new Map([
		['video', 'h-16'],
		['audio', 'h-12'],
		['text', 'h-6'],
		['image', 'h-6'],
	])

	const iconList = ref()
	watch(
		() => props.offsetTop,
		() => {
			iconList.value.scrollTop = props.offsetTop
		},
	)
</script>

<template>
	<div
		ref="iconList"
		class="relative w-12 flex h-full flex-col items-center justify-start overflow-y-hidden overflow-x-scroll dark:border-r-2 dark:border-darker border-gray-300 border-r"
	>
		<span class="w-full h-5 sticky top-0 left-0 right-0 z-20 dark:bg-gray-800 bg-gray-50" />
		<div
			class="absolute pt-10 pb-5 min-w-full flex flex-col justify-center min-h-full overflow-x-hidden left-0 right-0"
		>
			<template
				v-for="(lineData, lineIndex) of listData"
				:key="lineIndex"
			>
				<div
					class="z-10 flex justify-center items-center w-12 text-center mb-1 mt-1"
					:class="[
						TrackHeightMap.get(lineData.type),
						lineData.main ? 'bg-blue-500 bg-opacity-20' : '',
					]"
					:title="lineData.main ? '主轨道' : ''"
				>
					<component :is="componentMap.get(lineData.type)" />
				</div>
			</template>
		</div>
	</div>
</template>
