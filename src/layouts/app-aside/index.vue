<script setup lang="ts">
import { ref } from 'vue'
import AsideItem from '@/layouts/app-aside/aside-item.vue'
import type { MenuItem } from '@/types/global.ts'

const emit = defineEmits({
	toggle: (data: MenuItem) => typeof data === 'object'
})

const menuItems: MenuItem[] = [
	{ name: '视频', type: 'video' },
	{ name: '音频', type: 'audio' },
	{ name: '文字', type: 'text' },
	{ name: '贴纸', type: 'image' }
]

const activeType = ref<string>(menuItems[0].type)

function toggle(item: MenuItem) {
	activeType.value = item.type
	emit('toggle', item)
}
</script>

<template>
	<div class="app-aside flex flex-col justify-between py-4">
		<div class="w-full flex flex-col">
			<div class="py-3"
				v-for="item in menuItems"
				:key="item.type"
				@click="toggle(item)">

				<AsideItem :name="item.name"
					:type="item.type"
					:active="activeType" />
			</div>
		</div>
	</div>
</template>


<style lang="scss" scoped>
.app-aside {
	display: flex;
	flex-direction: column;
	width: 64px;
	height: 100vh;
}
</style>
