<script setup lang="ts">
import { ref } from 'vue'
import { calcTextStyle, generateRandomColor } from '@/utils'

export interface TextStyle {
	fill: string,
	stroke?: string,
	textBackgroundColor?: string
}

const generateRandomTextStyles = (count: number): TextStyle[] => {
	const styles: TextStyle[] = []
	for (let i = 0; i < count; i++) {
		styles.push({
			fill: generateRandomColor(),
			stroke: Math.random() > 0.5 ? generateRandomColor() : undefined,
			textBackgroundColor: Math.random() > 0.7 ? generateRandomColor() : undefined
		})
	}
	return styles
}

const datas = ref<TextStyle[]>(generateRandomTextStyles(30))

const emit = defineEmits(['add'])

function selectedText(item: TextStyle) {
	emit('add', item)
}

function onChange() {
	datas.value = generateRandomTextStyles(30)
}
</script>

<template>
	<div class="flex justify-end align-center">
		<el-text type="info"
			class="cursor-pointer"
			@click="onChange">换一批</el-text>
	</div>
	<div class="overflow-y-auto h-full scrollbar-width-none">
		<ul class="list w-full">
			<li
				class="relative w-80px h-80px flex-center justify-center mx-1 my-1 bg-#f2f2f2 dark:bg-black rounded-4px el-theme"
				v-for="(item, index) in datas"
				:key="index"
				@click="selectedText(item)">
				<span class="text"
					:style="calcTextStyle(item)">花字</span>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.list {
	display: flex;
	flex-wrap: wrap;

	li {
		font-weight: 500;
		font-size: 16px;
		cursor: pointer;

		&:hover::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			z-index: 999;
			border-radius: 4px;
			display: block;
			width: 100%;
			height: 100%;
			border: 1px solid #409eff;
		}
																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																}
}

.text {
	display: inline-block;
	padding: 5px;
	border-radius: 8px;
	line-height: 1;
	font-size: 32px;
	font-weight: 800;
}
</style>
