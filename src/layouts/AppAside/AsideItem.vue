<script setup lang="ts">
import { computed } from 'vue'
import AsideIcons from './icons'
import { capitalize } from '@/utils'

const props = defineProps<{
	type: string
	name?: string
	showText?: boolean
}>()

const computedIcon = computed(() => {
	return AsideIcons[`Icon${capitalize(props.type)}` as keyof typeof AsideIcons]
})
</script>

<template>
	<div class="flex flex-col items-center cursor-pointer">
		<component
			class="w-6 h-6"
			:is="computedIcon"
		/>
		<span v-if="props.showText">{{ props.name }}</span>
	</div>
</template>
