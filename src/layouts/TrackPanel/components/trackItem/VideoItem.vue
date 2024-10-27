<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import IconVideo from '@/components/Icons/IconVideo.vue'
import { usePlayerStore } from '@/stores'
import { useCheckTrackIsPlaying } from '@/hooks'
import LoadingTrack from '@/components/LoadingTrack.vue'
import { videoDecoder, getUniformSubarray } from '@/utils'
import type { FrameThumbnails } from '@/utils'

const props = defineProps({
	trackItem: {
		type: Object,
		default() {
			return {
				showWidth: '0px',
				showLeft: '0px',
			}
		},
	},
})
const playStore = usePlayerStore()
playStore.ingLoadingCount++

const container = ref()
const loading = ref(true)
const waveFileUrl = ref('')
const waveStyle = computed(() => {
	const { start, end, offsetL, offsetR, frameCount } = props.trackItem
	const showFrameCount = end - start

	return {
		// transform: `scaleX(${(frameCount / showFrameCount).toFixed(2)})`,
		transformOrigin: 'left top',
		left: `-${(offsetL / frameCount) * 100}%`,
		right: `-${(offsetR / frameCount) * 100}%`,
		width: `${(frameCount / showFrameCount) * 100}%`,
	}
})
const imgs = ref<string[]>([])

async function initVideo() {
	const { source } = props.trackItem
	// 获取视频轨道缩略图
	const thumbnails = await videoDecoder.thumbnails(source)

	imgs.value = (thumbnails as FrameThumbnails[]).map(({ img }) => URL.createObjectURL(img))

	/**
	 * TODO: 视频声音波形图
	 */
	loading.value = false
	playStore.ingLoadingCount--
}

const el = ref()

const containerWidth = ref<number>(100)

useResizeObserver(el, (entries) => {
	const entry = entries[0]
	const { width } = entry.contentRect
	containerWidth.value = width
})

const visibleThumbnails = computed(() => {
	if (imgs.value.length === 0) {
		return []
	}
	const { start, end, frameCount } = props.trackItem
	const showFrameCount = end - start
	const num = Math.ceil((containerWidth.value * frameCount) / showFrameCount / 50)
	return getUniformSubarray(imgs.value, num)
})

watch(
	() => {
		return props.trackItem.source
	},
	initVideo,
	{
		immediate: true,
		flush: 'post',
	},
)

useCheckTrackIsPlaying(props)
</script>

<template>
	<div
		class="flex flex-col rounded overflow-hidden h-full"
		ref="el"
	>
		<div
			class="flex items-center text-xs pl-2 overflow-hidden h-5 leading-5 bg-gray-500 bg-opacity-40 text-gray-200"
		>
			<IconVideo class="inline-block mr-2 shrink-0" />
			<span class="mr-4 shrink-0">{{ `${trackItem.name}.${trackItem.format}` }}</span>
			<span class="mr-4 shrink-0">{{ trackItem.time }}</span>
		</div>
		<div
			ref="container"
			class="overflow-hidden bg-gray-400 bg-opacity-70 flex-1 relative whitespace-nowrap"
			:style="waveStyle"
		>
			<img
				v-for="(item, index) in visibleThumbnails"
				:key="index"
				:src="item"
				alt=""
				class="image-item"
				draggable="false"
			/>
		</div>
		<div class="leading-3 pl-2 overflow-hidden h-3 bg-gray-700 relative">
			<img
				v-show="waveFileUrl"
				:src="waveFileUrl"
				class="absolute left-0 right-0 top-0 bottom-0 h-full min-w-full"
				:style="waveStyle"
				alt=""
			/>
		</div>
		<LoadingTrack
			v-show="loading"
			class="pl-12 bg-opacity-70"
		/>
	</div>
</template>

<style scope>
.image-item {
	display: inline-block;
	width: 50px;
	object-fit: cover;
	height: 100%;
}
</style>
