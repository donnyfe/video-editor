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
	maxWidth: document.body.getBoundingClientRect().width / 2,
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
	<div
		class="select-none relative bg-#fafafa dark:bg-black pr-2 py-2"
		:style="panelStyle"
	>
		<div
			class="h-full relative overflow-hidden bg-#fff dark:bg-[var(--el-bg-color)] rounded-lg border-1px border-solid border-[var(--el-border-color)]"
		>
			<SplitLine
				class="top-2 bottom-2 left-0"
				direction="vertical"
				:limit-size="limitSize"
				v-model:newWidth="globalStore.propsPanelWidth"
			/>

			<div
				v-if="!hasSelectedTrack"
				class="flex flex-center justify-start px-5 py-2 el-theme-text"
			>
				属性
			</div>

			<div
				v-if="!hasSelectedTrack"
				class="h-full flex flex-center flex-col"
			>
				<IconPropsEmpty />
				<span class="text-gray-500 text-sm">选中轨道调整属性</span>
			</div>

			<component
				v-else
				:is="(resourceTypes as Record<string, any>)[resourceType]"
			>
			</component>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
