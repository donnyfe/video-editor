<script setup lang="ts">
import { ref, watch, computed, defineEmits, defineProps } from 'vue'
import IconDArrowLeft from '@/components/Icons/IconDArrowLeft.vue'
import resourceTypes from './resourceTypes'

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

const resourcePanel = computed(() => {
	return resourceTypes[props.acitve as keyof typeof resourceTypes]
})

</script>

<template>
	<div class="flex flex-col overflow-x-hidden el-theme px-2 py-2 border-r-solid border-r-1px"
		:class="visible ? 'w-80' : 'w-0'">
		<div
			class="h-full flex flex-col overflow-hidden rounded-lg border-gray-300 dark:border-gray-500 dark:bg-[var(--el-bg-color)]"
			:class="visible ? 'border-1px border-solid' : ''">
			<div class="h-10 px-3 flex-between border-b-solid border-b-1px el-theme-border">
				<span class="inline leading-10 select-none">{{ title }}</span>
				<IconDArrowLeft class="w-4 h-4 hover:cursor-pointer"
					@click="toggle" />
			</div>
			<component :is="resourcePanel" />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
