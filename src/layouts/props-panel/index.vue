<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useGlobalStore } from '@/stores/global'
import SplitLine from '@/layouts/split-line.vue'
const globalStore = useGlobalStore()

const panelStyle = computed(() => ({
	width: `${globalStore.propsPanelWidth}px`,
}))

const limitSize = reactive({
	minWidth: 200,
	maxWidth: document.body.getBoundingClientRect().width - 200
})
</script>

<template>
	<div class=" bg-dark-100 select-none relative" :style="panelStyle">

		<SplitLine class="top-0 left-0 bottom-0"
			direction="vertical"
			:limit-size="limitSize"
			v-model:newWidth="globalStore.propsPanelWidth" />
		属性面板
	</div>
</template>

<style lang="scss" scoped></style>
