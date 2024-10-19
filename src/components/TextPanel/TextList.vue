<script setup lang="ts">

import { calcTextStyle } from '@/utils'

export interface TextStyle {
	fill: string,
	stroke?: string,
	textBackgroundColor?: string
}

const datas: TextStyle[] = [
	{ fill: '#FFF', stroke: '#000000', textBackgroundColor: undefined },
	{ fill: '#000000', stroke: '#ffffff', textBackgroundColor: undefined },
	{ fill: '#FFDE02', stroke: '#000000', textBackgroundColor: undefined },
	{ fill: '#FFF', stroke: '#F57165', textBackgroundColor: undefined },
	{ fill: '#B7DCF6', stroke: '#000000', textBackgroundColor: undefined },
	{ fill: '#FFD9E8', stroke: '#FF619D', textBackgroundColor: undefined },
	{ fill: '#C0F1F5', stroke: '#1B81E7', textBackgroundColor: undefined },
	{ fill: '#DCE57E', stroke: '#2B6323', textBackgroundColor: undefined },
	{ fill: '#C1E8BF', stroke: '#027B88', textBackgroundColor: undefined },
	{ fill: '#FFF', stroke: '#FF2570', textBackgroundColor: undefined },
	{ fill: '#AB4A37', stroke: '#ffffff', textBackgroundColor: undefined },
	{ fill: '#F9F3C4', stroke: '#4A4238', textBackgroundColor: undefined },
	{ fill: '#FFD9C6', stroke: '#A74F59', textBackgroundColor: undefined },
	{ fill: '#69F0AE', stroke: '#000000', textBackgroundColor: undefined },
	{ fill: '#FFF', stroke: '#00A16C', textBackgroundColor: undefined },
	{ fill: '#0A0A15', stroke: undefined, textBackgroundColor: '#fff' },
	{ fill: '#FFF', stroke: undefined, textBackgroundColor: '#000000' },
	{ fill: '#FFF', stroke: undefined, textBackgroundColor: '#EB6969' },
	{ fill: '#000', stroke: undefined, textBackgroundColor: '#FFDE02' },
	{ fill: '#FFF', stroke: undefined, textBackgroundColor: '#00A16C' },
	{ fill: '#FFF', stroke: undefined, textBackgroundColor: '#2994D8' },
]

const emit = defineEmits(['add'])

function selectedText(item: TextStyle) {
	emit('add', item)
}
</script>

<template>
	<ul class="list w-full">
		<li
			class="relative w-86px h-86px flex-center justify-center mx-1 my-1 bg-#333 rounded-4px el-theme"
			v-for="(item, index) in datas"
			:key="index"
			@click="selectedText(item)">
			<span class="text"
				:style="calcTextStyle(item)">花字</span>
		</li>
	</ul>
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
