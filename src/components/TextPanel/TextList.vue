<script setup lang="ts">
import { datas } from './data'
import { calcTextStyle } from '@/utils/text'

</script>

<template>
	<ul class="list w-full">
		<li
			class="relative w-86px h-86px flex-center justify-center mx-1 my-1 bg-#333 rounded-4px el-theme"
			v-for="(item, index) in datas"
			:key="index"
			@click="$emit('add', item)">
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
