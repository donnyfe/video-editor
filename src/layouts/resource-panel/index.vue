<script setup lang="ts">
import { ref, nextTick } from 'vue'
import AppAside from '@/layouts/app-aside/index.vue'
import MenuPanel from '@/layouts/menu-panel/index.vue'
import { useGlobalStore } from '@/stores/global'
import type { MenuItem } from '@/types/global'

const globalStore = useGlobalStore()

const selected = ref<MenuItem>({
	type: 'video',
	name: '视频',
})

const toggle = (item: MenuItem) => {
	selected.value = item

	if (!globalStore.showMenuPanel) {
		globalStore.showMenuPanel = true
	}
}

function onCollapse(visible: boolean) {
	nextTick(() => {
		globalStore.showMenuPanel = visible
	})
}

</script>

<template>
	<div class="flex h-full overflow-hidden relative">
		<AppAside @toggle="toggle" />

		<MenuPanel :title="selected.name"
			:acitve="selected.type"
			:visible="globalStore.showMenuPanel"
			@collapse="onCollapse" />
	</div>
</template>

<style lang="scss" scoped></style>
