<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import IconDArrowLeft from '@/components/Icons/IconDArrowLeft.vue'
import VideoPanel from '@/components/VideoPanel/index.vue'
import AudioPanel from '@/components/AudioPanel/index.vue'
import ImagePanel from '@/components/ImagePanel/index.vue'
import TextPanel from '@/components/TextPanel/index.vue'

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
	<div class="flex flex-col overflow-x-hidden el-theme border-r-solid border-r-1px"
		:class="visible ? 'w-80' : 'w-0'">
		<div class="min-h-full flex flex-col overflow-hidden ">
			<div class="h-10 px-3 flex-between border-b-solid border-b-1px el-theme-border">
				<span class="inline leading-10 select-none">{{ title }}</span>
				<IconDArrowLeft class="w-4 h-4 hover:cursor-pointer"
					@click="toggle" />
			</div>

			<VideoPanel v-if="acitve === 'video'" />
			<AudioPanel v-if="acitve === 'audio'" />
			<ImagePanel v-if="acitve === 'image'" />
			<TextPanel v-if="acitve === 'text'" />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
