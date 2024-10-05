<script setup lang="ts">
import { ref } from 'vue'
import IconGithub from '@/components/icons/IconGithub.vue'
import { ElButton } from 'element-plus'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const title = ref(globalStore.pageTitle)

function openGithub() {
	window.open('https://github.com/donnyfe')
}
</script>

<template>
	<header class="flex items-center justify-between px-4 py-2 bg-dark-600 text-light-50">
		<div class="flex items-center">
			<IconGithub class="github-icon mx-4 cursor-pointer"
				:class="true ? 'text-white' : 'text-black'"
				@click="openGithub" />
			<h1 class="text-xl font-bold hidden sm:inline">{{ title }}</h1>
		</div>
		<ElButton
			type="primary"
			size="small"
			class="ml-auto sm:ml-0">
			登录
		</ElButton>
	</header>
</template>
<style lang="scss" scoped>
.github-icon {
	fill: currentColor;
}
</style>
