<script setup lang="ts">
import { reactive } from 'vue'
import TextList from './TextList.vue'
import type { TextStyle } from './TextList.vue'
import { TextTrack } from '@/classes/TextTrack'
import { usePlayerStore, useTrackStore } from '@/stores'


const trackStore = useTrackStore()
const playerStore = usePlayerStore()

function createTrack(style: TextStyle) {
	addTrack(style)
}

function addTrack(style: TextStyle) {
	const textOptions = {
		name: '文本',
		content: '文本内容',
		fontSize: 24,
		fontFamily: 'Arial',
		...style
	}

	const textTrack = reactive(new TextTrack(textOptions, playerStore.playFrame))
	trackStore.addTrack(textTrack)
}


</script>

<template>
	<div class="p-4 flex-1 overflow-hidden flex flex-col">
		<ElButton class="w-full"
			type="primary"
			@click="addTrack({ fill: '#fff' })">
			添加文字
		</ElButton>

		<div class="flex-1 overflow-hidden">
			<div class="overflow-y-auto h-full pt-6 scrollbar-width-none">
				<TextList @add="createTrack" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
