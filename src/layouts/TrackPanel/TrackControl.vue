<script setup lang="ts">
import { reactive, computed } from 'vue'

import IconSub from '@/components/Icons/IconSub.vue'
import IconAdd from '@/components/Icons/IconAdd.vue'
import IconUndo from '@/components/Icons/IconUndo.vue'
import IconRedo from '@/components/Icons/IconRedo.vue'
import IconSplit from '@/components/Icons/IconSplit.vue'
import IconDelete from '@/components/Icons/IconDelete.vue'

import { useGlobalStore, useTrackStore, usePlayerStore } from '@/stores'


const props = defineProps({
	modelValue: {
		type: Number,
		default: 30
	}
})

const emit = defineEmits({
	'update:modelValue': val => {
		return val !== null
	}
})

const modelValue = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('update:modelValue', value)
	}
})

const globalStore = useGlobalStore()
const trackStore = useTrackStore()
const playerStore = usePlayerStore()

// 滑条配置属性
const sliderProps = reactive({
	showTooltip: false,
	size: 'small',
	step: 10,
	max: 100,
	min: 0
})

/**
 * 改变缩放
 * @param val
 */
function changeScale(val: number) {
	let newVal = modelValue.value + val
	if (newVal > sliderProps.max) {
		newVal = sliderProps.max
	}
	if (newVal < sliderProps.min) {
		newVal = sliderProps.min
	}
	modelValue.value = newVal
}

// 图标列表
const icons = computed(() => [
	{
		type: 'undo',
		title: '撤销',
		disable: true,
		icon: IconUndo
	},
	{
		type: 'redo',
		title: '前进',
		disable: true,
		icon: IconRedo
	},
	{
		type: 'split',
		title: '分割',
		disable: trackStore.selectedTrack.line === -1 && trackStore.selectedTrack.index === -1,
		icon: IconSplit
	},
	{
		type: 'delete',
		title: '删除',
		disable: trackStore.selectedTrack.line === -1 && trackStore.selectedTrack.index === -1,
		icon: IconDelete
	}
])

function handlerIcon(item: Record<string, any>) {
	const { type, disable } = item
	if (disable) {
		return
	}
	if (type === 'delete') {
		removeTrack()
	} else if (type === 'undo') {
		// TODO:
	} else if (type === 'redo') {
		// TODO:
	} else if (type === 'split') {
		splitTrack()
	}
}


/**
 * 删除轨道
 */
function removeTrack() {
	// TODO: 判断音视频类型且停止播放音视频

	// 判断音视频类型并停止播放
	const track = trackStore.trackList[trackStore.selectedTrack.line]?.list[trackStore.selectedTrack.index]
	if (track && ['audio', 'video'].includes(track.type)) {
		track.pause()
	}
	if (trackStore.selectedTrack.line !== -1 && trackStore.selectedTrack.index !== -1) {
		trackStore.removeTrack(trackStore.selectedTrack.line, trackStore.selectedTrack.index)
		trackStore.selectedTrack.line = -1
		trackStore.selectedTrack.index = -1
	}
}

/**
 * 分割轨道
 */
function splitTrack() {
	let track = trackStore.trackList[trackStore.selectedTrack.line].list[trackStore.selectedTrack.index]

	// 判断分割时间是否在视频内
	let splitTime = playerStore.playFrame

	if (track.type === 'video' && track.start < splitTime && splitTime < track.end) {
		const videoTrack = track.split(splitTime)

		videoTrack.resize({
			width: playerStore.playerWidth,
			height: playerStore.playerHeight
		})
		trackStore.addTrack(videoTrack)
	}

}

</script>

<template>
	<div class="w-full flex-between pl-4 pr-10 pb-1 h-10 border-b border-b-solid border-gray-300">
		<div class="h-9 w-32 flex flex-row flex-nowrap items-center justify-around">
			<div v-for="item of icons"
				:key="item.title"
				@click="handlerIcon(item)">
				<el-tooltip :disabled="item.disable"
					class="bg-gray-400"
					:effect="globalStore.isDark ? 'dark' : 'light'"
					:content="item.title"
					placement="bottom-start">
					<component :is="item.icon"
						class="focus:outline-0"
						:class="item.disable ? 'cursor-not-allowed text-gray-400' : ''" />
				</el-tooltip>
			</div>
		</div>

		<div class="flex w-52 justify-center items-center">
			<IconSub class="slider-icon mr-4"
				@click="changeScale(-10)" />

			<el-slider v-model="modelValue"
				v-bind="sliderProps" />

			<IconAdd class="slider-icon ml-4"
				@click="changeScale(10)" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.slider-icon {
	@apply box-content text-7 cursor-pointer;
}
</style>
