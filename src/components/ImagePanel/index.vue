<script setup lang="ts">
import ImageList from './ImageList.vue'
</script>

<template>
	<div class="p-4 flex-1 overflow-hidden flex flex-col">
		<div class="flex-1 overflow-hidden">
			<div class="overflow-y-auto h-full pt-6 scrollbar-width-none">
				<ImageList />
			</div>
		</div>
	</div>

</template>

<style lang="scss" scoped></style>
