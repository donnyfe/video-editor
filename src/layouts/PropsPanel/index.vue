<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import SplitLine from '@/layouts/SplitLine.vue'
import IconPropsEmpty from '@/components/Icons/IconPropsEmpty.vue'
import { useGlobalStore, useTrackStore } from '@/stores'
import resourceTypes from './resourceTypes'

const globalStore = useGlobalStore()
const trackStore = useTrackStore()

const panelStyle = computed(() => {
	return {
		width: `${globalStore.propsPanelWidth}px`,
	}
})

const limitSize = reactive({
	minWidth: 200,
	maxWidth: document.body.getBoundingClientRect().width - 200
})

const resourceType = ref('')

const hasSelectedTrack = ref(false)
const selectResource = computed(() => trackStore.selectResource)

function renderPropsPanel(resource: any) {
	if (!resource || !resource.type) return
	resourceType.value = resource.type
}

watch(selectResource, (newResource) => {
	if (newResource) {
		hasSelectedTrack.value = true
		renderPropsPanel(newResource)
	} else {
		hasSelectedTrack.value = false
	}
})

</script>

<template>
	<div class="select-none relative el-theme border-l-solid border-l-1px"
		:style="panelStyle">

		<SplitLine class="top-0 bottom-0 left-0"
			direction="vertical"
			:limit-size="limitSize"
			v-model:newWidth="globalStore.propsPanelWidth" />

		<div v-if="!hasSelectedTrack"
			class="h-full flex flex-center flex-col">
			<IconPropsEmpty />
			<span class="text-gray-500 text-sm">选中轨道调整属性</span>
		</div>

		<component v-else
			:is="(resourceTypes as Record<string, any>)[resourceType]">
		</component>

	</div>
</template>

<style lang="scss" scoped></style>
