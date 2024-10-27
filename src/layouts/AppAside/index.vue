<script setup lang="ts">
import { ref } from 'vue'
import AsideItem from './AsideItem.vue'
import type { MenuItem } from '@/types'

const emit = defineEmits({
	toggle: (data: MenuItem) => typeof data === 'object',
})

const menuItems: MenuItem[] = [
	{ name: '视频', type: 'video' },
	{ name: '音频', type: 'audio' },
	{ name: '文字', type: 'text' },
	{ name: '贴纸', type: 'image' },
]

const activeType = ref<string>(menuItems[0].type)

function toggle(item: MenuItem) {
	activeType.value = item.type
	emit('toggle', item)
}
</script>

<template>
  <div class="app-aside w-64px h-full pl-2 py-2 flex flex-col justify-between el-theme">
    <div class="px-2 py-2 h-full flex flex-col bg-[var(--el-color-primary)] rounded-lg">
      <div
        v-for="item in menuItems"
        :key="item.type"
        class="aside-item py-3 hover:cursor-pointer select-none"
        :class="
          activeType === item.type
            ? 'is-active text-dark dark:text-white'
            : 'text-white dark:text-dark'
        "
        @click.prevent="toggle(item)"
      >
        <el-tooltip
          :content="item.name"
          placement="right"
        >
          <AsideItem
            :type="item.type"
            :name="item.name"
          />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aside-item {
	border-radius: 4px;
	// background: #fff;
	// color: var(--el-color-primary);
}

.aside-item.is-active {
	@apply bg-white dark:bg-dark color-[var(--el-color-primary)] dark:color-white;
}
</style>
