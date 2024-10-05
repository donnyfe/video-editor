<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
	width: {
		type: Number,
		default: 300
	},
	height: {
		type: Number,
		default: 200
	},
	minWidth: {
		type: Number,
		default: 100
	},
	minHeight: {
		type: Number,
		default: 100
	},
	maxWidth: {
		type: Number,
		default: 1000
	},
	maxHeight: {
		type: Number,
		default: 1000
	},
	direction: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['resize'])

const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(props.width)
const containerHeight = ref(props.height)

const resizing = ref(false)
const resizeDirection = ref(props.direction)


// TODO: 根据 props.direction 值，动态获取拖拽手柄添加CSS，pointer-events:auto;属性

const cursorClass = computed(() => {
	switch (resizeDirection.value) {
		case 'left':
		case 'right':
			return 'cursor-ew-resize'
		case 'top':
		case 'bottom':
			return 'cursor-ns-resize'
		case 'top-left':
		case 'bottom-right':
			return 'cursor-nwse-resize'
		case 'top-right':
		case 'bottom-left':
			return 'cursor-nesw-resize'
	}
	return ''
})

const startResize = (direction: string, e: MouseEvent) => {
	console.log('startResize', direction, e.clientX, e.clientY)

	e.preventDefault() // 阻止默认行为
	e.stopPropagation() // 阻止事件冒泡

	resizing.value = true
	resizeDirection.value = direction

	document.addEventListener('mousemove', handleMouseMove)
	document.addEventListener('mouseup', stopResize)

}

const handleMouseMove = (e: MouseEvent) => {
	if (!resizing.value || !containerRef.value) { return }

	const rect = containerRef.value.getBoundingClientRect()
	let newWidth = containerWidth.value
	let newHeight = containerHeight.value

	switch (resizeDirection.value) {
		case 'right':
			newWidth = e.clientX - rect.left
			break
		case 'bottom':
			newHeight = e.clientY - rect.top
			break
		case 'left':
			newWidth = rect.right - e.clientX
			break
		case 'top':
			newHeight = rect.bottom - e.clientY
			break
		case 'top-left':
			newWidth = rect.right - e.clientX
			newHeight = rect.bottom - e.clientY
			break
		case 'top-right':
			newWidth = e.clientX - rect.left
			newHeight = rect.bottom - e.clientY
			break
		case 'bottom-left':
			newWidth = rect.right - e.clientX
			newHeight = e.clientY - rect.top
			break
		case 'bottom-right':
			newWidth = e.clientX - rect.left
			newHeight = e.clientY - rect.top
			break
	}

	containerWidth.value = Math.min(Math.max(newWidth, props.minWidth), props.maxWidth)
	containerHeight.value = Math.min(Math.max(newHeight, props.minHeight), props.maxHeight)

	emit('resize', { width: containerWidth.value, height: containerHeight.value })
}

const stopResize = () => {
	resizing.value = false
	resizeDirection.value = ''
	document.removeEventListener('mousemove', handleMouseMove)
	document.removeEventListener('mouseup', stopResize)
}
</script>

<template>
	<div ref="containerRef"
		class="relative"
		:style="{
			width: `${containerWidth}px`,
			height: `${containerHeight}px`,
		}"
		:class="{ [`${cursorClass}`]: resizing }">
		<slot></slot>

		<!-- 边框和角落的拖拽手柄 -->
		<div class="absolute inset-0 pointer-events-none">
			<div ref="topHandle"
				class="absolute top-0 left-0 w-full h-1 bg-amber cursor-ns-resize"
				@mousedown="startResize('top', $event)"></div>
			<div ref="bottomHandle"
				class="absolute bottom-0 left-0 w-full h-1 bg-cyan cursor-ns-resize"
				@mousedown="startResize('bottom', $event)"></div>
			<div ref="leftHandle"
				class="absolute top-0 left-0 w-1 bg-emerald h-full cursor-ew-resize"
				@mousedown="startResize('left', $event)"></div>
			<div ref="rightHandle"
				class="absolute top-0 right-0 w-1 bg-purple h-full cursor-ew-resize"
				@mousedown="startResize('right', $event)"></div>
			<div ref="topLeftHandle"
				class="absolute top-0 left-0 w-1 h-1 bg-red cursor-nwse-resize"
				@mousedown="startResize('top-left', $event)"></div>
			<div ref="topRightHandle"
				class="absolute top-0 right-0 w-1 h-1 bg-red cursor-nesw-resize"
				@mousedown="startResize('top-right', $event)"></div>
			<div ref="bottomLeftHandle"
				class="absolute bottom-0 left-0 w-1 h-1 bg-red cursor-nesw-resize"
				@mousedown="startResize('bottom-left', $event)"></div>
			<div ref="bottomRightHandle"
				class="absolute bottom-0 right-0 w-1 h-1 bg-red cursor-nwse-resize"
				@mousedown="startResize('bottom-right', $event)"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.relative {
	border: 1px solid #ccc;
}
</style>
