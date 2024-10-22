<script setup lang="ts">
import Player from '@/components/Player/index.vue'
import PlayerControl from '@/components/Player/PlayerControl.vue'

</script>
<template>
	<div class="editor-panel flex-1 el-theme overflow-hidden">

		<section class="h-full flex flex-col">
			<header class="editor-panel-header pl-2 h-10 mb-2 leading-10">
				播放器
			</header>
			<main class="editor-panel-content">
				<Player />
			</main>
			<footer class="editor-panel-footer">
				<PlayerControl />
			</footer>
		</section>
	</div>
</template>

<style lang="scss" scoped>
.editor-panel-header {
	flex: 0 0 auto;
	box-sizing: border-box;
}

.editor-panel-content {
	overflow: hidden;
	display: block;
	flex: 1 1;
	padding: 8px;
}

.editor-panel-footer {
	flex: 0 0 auto;
	box-sizing: border-box;
}
</style>
