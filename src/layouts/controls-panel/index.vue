<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useGlobalStore } from '@/stores/global'
import SplitLine from '@/layouts/split-line.vue'

const globalStore = useGlobalStore()

const panelStyle = computed(() => ({
	height: `${globalStore.controlsPanelHeight}px`,
}))

const limitSize = reactive({
	minHeight: 200,
	maxHeight: document.body.getBoundingClientRect().height - 200
})

</script>

<template>
	<div class="controls-panel flex flex-col overflow-hidden relative select-none bg-dark-300"
		:style="panelStyle">

		<SplitLine class="top-0 left-0 right-0"
			direction="horizontal"
			:limit-size="limitSize"
			v-model:newHeight="globalStore.controlsPanelHeight" />
		控制面板
	</div>
</template>

<style lang="scss" scoped></style>
