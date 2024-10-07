<script setup lang="ts">
import { ref } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import IconGithub from '@/components/Icons/IconGithub.vue'
import { useGlobalStore } from '@/stores'

import { useDark, useToggle } from '@vueuse/core'

const globalStore = useGlobalStore()

// 切换主题
function changeTheme() {
	useToggle(useDark())()
}

const title = ref(globalStore.pageTitle)

function openGithub() {
	window.open('https://github.com/donnyfe')
}
</script>

<template>
	<header class="app-header border-b-solid border-b-1px">
		<div class="flex items-center">
			<IconGithub class="github-icon"
				@click="openGithub" />
			<h1 class="text-xl font-bold">{{ title }}</h1>
		</div>

		<div class="flex justify-end items-center">
			<el-switch class="mr-4"
				size="large"
				:active-icon="Moon"
				:inactive-icon="Sunny"
				:inline-prompt="true"
				v-model="globalStore.isDark"
				@change="changeTheme" />
		</div>
	</header>
</template>
<style lang="scss" scoped>
.app-header {
	@apply h-58px w-full flex-center flex-between flex-nowrap el-theme
}

.github-icon {
	@apply mx-4 cursor-pointer color-[var(--el-text-color-primary)]
}
</style>
