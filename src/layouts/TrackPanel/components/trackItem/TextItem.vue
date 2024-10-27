<script setup lang="ts">
import IconText from '@/components/Icons/IconText.vue'
import { useCheckTrackIsPlaying } from '@/hooks'

const props = defineProps({
	trackItem: {
		type: Object,
		default() {
			return {
				width: '0px',
				left: '0px',
			}
		},
	},
})

useCheckTrackIsPlaying(props)
</script>

<template>
	<div class="flex flex-col rounded overflow-hidden h-full">
		<div
			class="flex items-center text-xs pl-2 overflow-hidden h-6 leading-6 bg-red-900 bg-opacity-70 text-gray-300"
		>
			<IconText class="inline-block mr-2 shrink-0" />
			<span class="mr-4 shrink-0">{{ props.trackItem.content || props.trackItem.name }}</span>
		</div>
	</div>
</template>
