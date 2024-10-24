<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { usePlayerStore, useTrackStore } from '@/stores'
import {
	formatPlayerTime,
	preciseInterval,
	getCurrentTrackItemList,
	isOfCanPlayType
} from '@/utils'


const props = defineProps({
	disable: {
		type: Boolean,
		default: false
	}
})
const store = usePlayerStore()
const trackStore = useTrackStore()

const playTime = computed(() => {
	return formatPlayerTime(store.playFrame)
})
const allTime = computed(() => {
	return formatPlayerTime(trackStore.frameCount)
})
let playTimer = ref()
const timeStamp = 1000 / 30
// 视频暂停
const pauseVideo = () => {
	if (props.disable) { return }
	store.isPause = true
	playTimer.value?.cancel()

	const trackItemList = getCurrentTrackItemList(trackStore.trackList, store.playFrame, isOfCanPlayType)
	trackItemList.forEach(item => {
		item?.pause()
	})
}

/**
 * 开始播放
 */
function startPlay() {
	if (props.disable) { return }
	if (store.playFrame >= trackStore.frameCount) {
		store.playFrame = 0
	}
	store.isPause = false
	playTimer.value?.cancel()
	playTimer.value = preciseInterval(() => {
		store.playFrame++
		if (store.playFrame === trackStore.frameCount) {
			pauseVideo()
		}
	}, timeStamp)
}
// 在一些操作时，需要暂停播放
watch(() => store.isPause, () => {
	if (store.isPause) {
		pauseVideo()
	}
})
watch(() => store.playFrame, () => {
	if (!store.isPause) {
		// 播放声音，查询当前帧的数据
		const trackItemList = getCurrentTrackItemList(trackStore.trackList, store.playFrame, isOfCanPlayType)
		trackItemList.forEach(item => {
			item?.play(store.playFrame)
		})
	}
})


const aspectRatioList = [
	{ label: '16:9', value: '16:9' },
	{ label: '9:16', value: '9:16' },
]

function onChangeAspectRatio(val: string) {
	store.aspectRatio = val
}
</script>

<template>
	<div class="flex flex-center pl-4 pr-4 h-8 border-t dark:border-darker border-gray-300">
		<div class="h-full text-xs leading-8">
			<span class="text-[var(--el-color-primary)] mr-1 w-20 inline-block">{{ playTime
				}}</span>/<span class="ml-2 w-20">{{ allTime }}</span>
		</div>

		<div class="flex items-center m-auto">
			<ElIcon :size="24"
				class="cursor-pointer box-content"
				:class="[disable ? 'cursor-not-allowed' : 'cursor-pointer']">
				<VideoPause v-show="!store.isPause"
					@click="pauseVideo" />
				<VideoPlay v-show="store.isPause"
					@click="startPlay" />
			</ElIcon>
		</div>

		<div class="w-22 flex items-center justify-end">
			<el-select v-model="store.aspectRatio"
				@change="onChangeAspectRatio"
				placeholder="选择比例">
				<el-option v-for="item in aspectRatioList"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					<span>{{ item.label }}</span>
				</el-option>
			</el-select>
		</div>
	</div>
</template>


<style lang="scss" scoped></style>
