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
		class="bg-dark-400 flex flex-col transition-all duration-200 overflow-xhidden dark:border-r-2 dark:border-darker border-gray-300 border-r"
		:class="visible ? 'w-80' : 'w-0'">
		<div class="min-h-full flex flex-col overflow-hidden dark:border-darker border-gray-300">
			<div class="h-10 px-3 dark:border-darker border-gray-300 flex items-center justify-between">
				<span class="inline leading-10 select-none">{{ title }}</span>
				<IconDArrowLeft class="w-4 h-4" @click="toggle" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
