<script setup lang="ts">
import { computed, reactive } from 'vue'
import SplitLine from '@/layouts/SplitLine.vue'
import TrackControl from './TrackControl.vue'
import TrackList from './TrackList.vue'
import { useGlobalStore, useTrackStore } from '@/stores'

const globalStore = useGlobalStore()
const trackStore = useTrackStore()

const panelStyle = computed(() => ({
	height: `${globalStore.controlsPanelHeight}px`,
}))

const limitSize = reactive({
	minHeight: 200,
	maxHeight: document.body.getBoundingClientRect().height / 2,
})
</script>

<template>
	<div
		class="track-panel select-none el-theme pr-2 pb-2 dark:bg-black"
		:style="panelStyle"
	>
		<div
			class="h-full flex flex-col relative overflow-hidden rounded-lg border-solid border-1px border-[var(--el-border-color)] dark:bg-[var(--el-bg-color)]"
		>
			<SplitLine
				v-model:new-height="globalStore.controlsPanelHeight"
				class="top-0 left-0 right-0"
				direction="horizontal"
				:limit-size="limitSize"
			/>

			<TrackControl v-model="trackStore.trackScale" />
			<TrackList />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
