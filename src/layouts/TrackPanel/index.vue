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
	maxHeight: document.body.getBoundingClientRect().height - 200
})

</script>

<template>
	<div
		class="track-panel flex flex-col overflow-hidden relative select-none el-theme border-t-solid border-t-1px"
		:style="panelStyle">

		<SplitLine class="top-0 left-0 right-0"
			direction="horizontal"
			:limit-size="limitSize"
			v-model:newHeight="globalStore.controlsPanelHeight" />

		<TrackControl v-model="trackStore.trackScale" />
		<TrackList />
	</div>
</template>

<style lang="scss" scoped></style>
