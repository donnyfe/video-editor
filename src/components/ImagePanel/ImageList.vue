<script setup lang="ts">
import { defineProps, defineEmits, watch } from 'vue'
import { getImageFromUrl } from '@/utils'


const props = defineProps({
	list: {
		type: Array<{ id: string, src: string }>,
		default: () => [],
	},
})


const emit = defineEmits(['select'])

async function handleClick(item: { id: string, src: string }) {
	const file = await getImageFromUrl(item)
	emit('select', file)
}

</script>

<template>
	<ul class="list w-full h-full overflow-auto">
		<li
			class="flex-center align-start aspect-square rounded-4px overflow-hidden bg-#f2f2f2 dark:bg-#000"
			v-for="(item, index) in list"
			:key="index"
			@click="handleClick(item)">
			<el-image :src="item.src" />
		</li>
	</ul>
</template>

<style lang="scss" scoped>
.list {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
		gap: 10px;

	li {
		position: relative;
		width: 82px;
		cursor: pointer;

		&:hover::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			z-index: 999;
			display: block;
			width: 100%;
			height: 100%;
			border: 1px solid #409eff;
			border-radius: 4px;
		}
	}
}
</style>
