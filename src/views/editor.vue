<script setup lang="ts">
import AppHeader from '@/layouts/app-header/index.vue'
import ResourcePanel from '@/layouts/resource-panel/index.vue'
import PropsPanel from '@/layouts/props-panel/index.vue'
import EditorPanel from '@/layouts/editor-panel/index.vue'
import ControlsPanel from '@/layouts/controls-panel/index.vue'

</script>

<template>
	<div class="video-editor w-full flex flex-col w-screen h-screen bg-dark-900 text-light-50">
		<AppHeader />
		<div class="flex-1 flex overflow-hidden">
			<ResourcePanel />
			<div class="flex flex-1 flex-col overflow-hidden">
				<div class="flex flex-1 flex-row flex-nowrap">
					<EditorPanel />
					<PropsPanel />
				</div>
				<ControlsPanel />
			</div>
		</div>
	</div>
</template>
