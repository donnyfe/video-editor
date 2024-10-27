<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import LoadingPage from './components/LoadingPage.vue'

const state = reactive({
	zIndex: 3000,
	size: 'small',
})

const isLoading = ref(true)

onMounted(() => {
	// 模拟页面加载时间
	setTimeout(() => {
		isLoading.value = false
	}, 1000)
	// 1秒后隐藏加载页面
})
</script>

<template>
	<div class="w-full h-full flex flex-col">
		<ElConfigProvider
			:size="state.size"
			:z-index="state.zIndex"
		>
			<LoadingPage v-if="isLoading" />
			<RouterView v-else />
		</ElConfigProvider>
	</div>
</template>
