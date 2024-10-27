<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
	disabled: {
		type: Boolean,
		default: false,
	},
	newWidth: {
		type: Number,
		default: 0,
	},
	newHeight: {
		type: Number,
		default: 0,
	},
	direction: {
		type: String,
		default: 'horizontal',
	},
	limitSize: {
		type: Object,
		default() {
			return {
				minHeight: 0,
				maxHeight: 999999,
				minWidth: 0,
				maxWidth: 999999,
			}
		},
	},
})

const emit = defineEmits({
	// 校验事件
	'update:newWidth': (val) => {
		return val !== null
	},
	'update:newHeight': (val) => {
		return val !== null
	},
})

const newWidthValue = computed({
	get() {
		return props.newWidth
	},
	set(newValue) {
		emit('update:newWidth', newValue)
	},
})
const newHeightValue = computed({
	get() {
		return props.newHeight
	},
	set(newValue) {
		emit('update:newHeight', newValue)
	},
})

const splitLineEl = ref()

const isVertical = computed(() => props.direction === 'vertical')

// 定位数据缓存
const posState = {
	left: 0,
	top: 0,
}

let enableMove = false

function mouseEnterHandler() {
	splitLineEl.value.classList.add('line-active')
}

function mouseLeaveHandler() {
	splitLineEl.value.classList.remove('line-active')
}

function mouseDownHandler() {
	if (props.disabled) {
		return
	}

	splitLineEl.value.classList.add('line-active')
	const { left, top } = splitLineEl.value.getBoundingClientRect()
	posState.left = parseInt(left)
	posState.top = parseInt(top)
	enableMove = true

	document.onmousemove = (event) => {
		if (!enableMove) {
			return
		}

		const { pageX, pageY } = event
		const { top: startTop, left: startLeft } = posState
		const { minHeight, maxHeight, minWidth, maxWidth } = props.limitSize
		const offsetX = pageX - startLeft
		const offsetY = pageY - startTop

		posState.left = pageX
		posState.top = pageY

		if (isVertical.value) {
			const endWidth = newWidthValue.value - offsetX
			newWidthValue.value =
				endWidth > maxWidth ? maxWidth : endWidth < minWidth ? minWidth : endWidth
		} else {
			const endHeight = newHeightValue.value - offsetY
			newHeightValue.value =
				endHeight > maxHeight ? maxHeight : endHeight < minHeight ? minHeight : endHeight
		}
	}

	document.onmouseup = () => {
		enableMove = false
		document.onmouseup = null
		document.onmousemove = null
		splitLineEl.value.classList.remove('line-active')
	}
}
</script>

<template>
	<div
		ref="splitLineEl"
		class="flex absolute justify-center items-center hover:bg-[var(--el-color-primary)]"
		:class="[
			disabled ? 'cursor-no-drop' : isVertical ? 'cursor-col-resize' : 'cursor-row-resize',
			isVertical ? 'w-0.5 h-full flex-col' : 'h-0.5 w-full flex-row',
		]"
		@mouseenter="mouseEnterHandler"
		@mouseleave="mouseLeaveHandler"
		@mousedown="mouseDownHandler"
	>
		<i
			class="block dark:bg-dark-800"
			:class="isVertical ? 'dark:w-0 w-px h-full' : 'dark:h-0 h-px w-full'"
		/>
	</div>
</template>
<style scoped>
.line-active {
	background-color: rgb(165 243 252 / var(200));
}
</style>
