<script setup lang="ts">
import { ref } from 'vue'
import AsideItem from './AsideItem.vue'
import type { MenuItem } from '@/types'

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
	<div class="app-aside w-64px h-full px-2 py-2 flex flex-col justify-between el-theme ">
		<div class="w-full h-full flex flex-col bg-[var(--el-color-primary)] rounded-lg">
			<div v-for="item in menuItems"
				class="py-3 hover:cursor-pointer"
				:class="activeType === item.type ? 'text-white text-dark' : 'dark:text-dark text-dark'"
				:key="item.type"
				@click="toggle(item)">

				<AsideItem :name="item.name"
					:type="item.type" />
			</div>
		</div>
	</div>
</template>


<style lang="scss" scoped></style>
