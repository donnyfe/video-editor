<template>
	<div class="loading-overlay">
		<div class="progress-bar">
			<div class="progress"
				:style="{ width: `${progress}%` }"></div>
		</div>
		<p class="progress-text">正在加载中...{{ progress }}%</p>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const progress = ref(0)

onMounted(() => {
	// 使用CSS动画来模拟加载进度
	const interval = setInterval(() => {
		progress.value += 1
		if (progress.value >= 100) {
			clearInterval(interval)
		}
	}, 50)
})
</script>

<style scoped>
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 9999;
	@apply bg-dark-300;
}

.progress-bar {
	width: 200px;
	height: 10px;
	background-color: #f3f3f3;
	margin-top: 20px;
	border-radius: 5px;
	overflow: hidden;
}

.progress {
	height: 100%;
	background-color: #409eff;
	transition: width 0.5s ease-out;
}

.progress-text {
	margin-top: 10px;
	font-size: 14px;
	color: #fff;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
