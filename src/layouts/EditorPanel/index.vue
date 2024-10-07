<script setup lang="ts">
import { reactive } from 'vue'
import Player from '@/components/Player/index.vue'

const containerSize = reactive({
	width: 0,
	height: 0
})
</script>
<template>
	<div class="editor-panel flex-1 overflow-hidden relative el-theme">
		<span class="pl-2 inline-block w-full h-10 mb-2 leading-10 border-b border-gray-300">播放器</span>
		<Player :containerSize="containerSize" />
	</div>
</template>

<style lang="scss" scoped></style>
