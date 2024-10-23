<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch, reactive, toRefs } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useGlobalStore } from '@/stores'
import { getSelectFrame } from '@/utils'
import { drawTimeLine, type UserConfig, type CanvasConfig } from '@/utils/TimeLine'

const props = defineProps({
	// 开始坐标
	start: {
		type: Number,
		default: 0
	},
	// 步进，与视频fps同步
	step: {
		type: Number,
		default: 30
	},
	// 时间轴缩放比例
	scale: {
		type: Number,
		default: 0
	},
	// 选中元素时在时间轴中高亮显示
	focusPosition: {
		type: Object,
		default() {
			return {
				start: 0, // 起始帧数
				end: 0 // 结束帧数
			}
		}
	}
})

const emits = defineEmits({
	select(val: number) {
		return val !== null
	}
})

const timelineWrapper = ref<HTMLDivElement>()
const timeLine = ref<HTMLCanvasElement>()

const { isDark } = toRefs(useGlobalStore())

const canvasConfigs = computed(() => ({
	bgColor: isDark.value ? '#374151' : '#E5E7EB', // 背景颜色
	ratio: window.devicePixelRatio || 1, // 设备像素比
	textSize: 12, // 字号
	textScale: 0.83, // 支持更小号字： 10 / 12
	lineWidth: 1, // 线宽
	textBaseline: 'middle' as CanvasTextBaseline, // 文字对齐基线 (ts 中定义的textBaseLine是一个联合类型)
	textAlign: 'center' as CanvasTextAlign, // 文字对齐方式
	longColor: isDark.value ? '#E5E7EB' : '#374151', // 长线段颜色
	shortColor: isDark.value ? '#9CA3AF' : '#6B7280', // 短线段颜色
	textColor: isDark.value ? '#E5E7EB' : '#374151', // 文字颜色
	subTextColor: isDark.value ? '#9CA3AF' : '#6B7280', // 小文字颜色
	focusColor: isDark.value ? '#6D28D9' : '#C4B5FD' // 选中元素区间
}))

const canvasSize = reactive({
	width: 0,
	height: 0
})

const canvasStyle = computed(() => {
	return {
		width: `${canvasSize.width / canvasConfigs.value.ratio}px`,
		height: `${canvasSize.height / canvasConfigs.value.ratio}px`
	}
})

// 重绘线条
function renderTimeLine() {
	drawTimeLine(
		timeLine.value as HTMLCanvasElement,
		{ ...props } as UserConfig,
		{ ...canvasSize, ...canvasConfigs.value } as CanvasConfig
	)
}

// 设置 canvas 大小
function setCanvasRect(width: number, height: number) {
	canvasSize.width = width * canvasConfigs.value.ratio
	canvasSize.height = height * canvasConfigs.value.ratio
	nextTick(() => {
		renderTimeLine()
	})
}

// 点击时间轴
function handleClick(event: MouseEvent) {
	const offset = event.offsetX
	const frameIndex = getSelectFrame(props.start + offset, props.scale, props.step)
	emits('select', frameIndex)
}

watch(canvasConfigs, renderTimeLine)
watch(props, renderTimeLine)


onMounted(() => {
	// 开始观察 timelineWrapper 元素
	useResizeObserver(timelineWrapper.value, entries => {
		const entry = entries[0]
		const { width, height } = entry.contentRect
		setCanvasRect(width, height)
	})
})

onUnmounted(() => {

})
</script>

<template>
	<div ref="timelineWrapper"
		class="sticky top-0 left-0 right-0 h-5 text-center leading-5 text-sm z-20">
		<canvas ref="timeLine"
			:style="canvasStyle"
			v-bind="canvasSize"
			@click="handleClick" />
	</div>
</template>
