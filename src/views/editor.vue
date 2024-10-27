<script setup lang="ts">
import AppHeader from '@/layouts/AppHeader/index.vue'
import ResourcePanel from '@/layouts/ResourcePanel/index.vue'
import PropsPanel from '@/layouts/PropsPanel/index.vue'
import EditorPanel from '@/layouts/EditorPanel/index.vue'
import TrackPanel from '@/layouts/TrackPanel/index.vue'
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
				<TrackPanel />
			</div>
		</div>
	</div>
</template>
