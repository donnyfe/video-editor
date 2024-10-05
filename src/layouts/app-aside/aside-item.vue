<script setup lang="ts">
import IconVideo from '@/components/icons/IconVideo.vue'
import IconAudio from '@/components/icons/IconAudio.vue'
import IconImage from '@/components/icons/IconImage.vue'
import IconText from '@/components/icons/IconText.vue'

const props = defineProps<{
	type: string,
	name: string,
	active?: string
}>()
</script>

<template>
	<div
		class="flex flex-col items-center hover:dark:text-white hover:text-gray-800 hover:cursor-pointer hover:bg-dark-600/20"
		:class="active === props.type ? 'dark:text-white text-gray-800' : 'dark:text-gray-400 text-gray-800/60'">

		<IconVideo v-if="props.type === 'video'" class="w-6 h-6" />
		<IconAudio v-if="props.type === 'audio'" class="w-6 h-6" />
		<IconImage v-if="props.type === 'image'" class="w-6 h-6" />
		<IconText v-if="props.type === 'text'" class="w-6 h-6" />
		<span>{{ props.name }}</span>
	</div>
</template>
