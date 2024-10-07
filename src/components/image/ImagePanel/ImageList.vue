<script setup lang="ts">
import { uniqueId } from 'lodash-es'

const datas = [
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//4bbc14ed83cf7c6e93d2856d06c1194c',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//1e95d563c83418ec9e349fe2d00f68dd',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//b716298a03337703057a6e320d37efd7',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//7b50b48344e5be6fb8ca6b789dda8641',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//911a4ebf43020b16bb3f9f8b7d91f4e9',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//cc54ef6365c268587c8f19347a772a24',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//4bbc14ed83cf7c6e93d2856d06c1194c',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//1e95d563c83418ec9e349fe2d00f68dd',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//b716298a03337703057a6e320d37efd7',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//7b50b48344e5be6fb8ca6b789dda8641',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//911a4ebf43020b16bb3f9f8b7d91f4e9',
	},
	{
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//cc54ef6365c268587c8f19347a772a24',
	},
]

datas.forEach(item => {
	item.id = uniqueId()
})

</script>

<template>
	<ul class="list w-full">
		<li
			class="relative w-86px h-86px flex-center justify-center mx-1 my-1 bg-#333 rounded-4px el-theme"
			v-for="(item, index) in datas"
			:key="index"
			@click="handleClick(item.src)">
			<el-image class="w-82% h-auto"
				:src="item.src" />
		</li>
	</ul>
</template>

<style lang="scss" scoped>
.list {
	display: flex;
	flex-wrap: wrap;

	li {
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
</style>
