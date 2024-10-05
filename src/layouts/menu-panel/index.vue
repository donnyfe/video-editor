<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import IconDArrowLeft from '@/components/icons/IconDArrowLeft.vue'

const props = defineProps({
	acitve: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		default: ''
	},
	visible: {
		type: Boolean,
		default: true
	}
})

const emit = defineEmits({
	collapse(visible: boolean) {
		return visible !== null
	}
})

const visible = ref(props.visible)


watch(() => props.visible, (newVal) => {
	visible.value = newVal
})

function toggle() {
	visible.value = !visible.value
	emit('collapse', visible.value)
}
</script>

<template>
	<div
		class="flex flex-col transition-all duration-200 overflow-x-hidden el-theme border-r-solid border-r-1px"
		:class="visible ? 'w-80' : 'w-0'">
		<div class="min-h-full flex flex-col overflow-hidden ">
			<div
				class="h-10 px-3 flex-between border-b-solid border-b-1px el-theme-border">
				<span class="inline leading-10 select-none">{{ title }}</span>
				<IconDArrowLeft class="w-4 h-4 hover:cursor-pointer" @click="toggle" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
