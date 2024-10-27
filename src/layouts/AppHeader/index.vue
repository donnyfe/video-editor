<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { Sunny, Moon, Download } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import { Combinator, type OffscreenSprite } from '@webav/av-cliper'
import IconGithub from '@/components/Icons/IconGithub.vue'
import { useGlobalStore, useTrackStore, usePlayerStore } from '@/stores'
import { AudioTrack } from '@/classes'
import { createFileWriter } from '@/utils'
import { type Resource } from '@/types'

const globalStore = useGlobalStore()
const trackStore = useTrackStore()
const playerStore = usePlayerStore()

// 切换主题
function changeTheme() {
	useToggle(useDark())()
}

const title = ref(globalStore.pageTitle)

function openGithub() {
	window.open('https://github.com/donnyfe')
}

async function handleExport() {
	const loading = ElLoading.service({ text: '正在合成视频' })

	const sprs: Promise<OffscreenSprite>[] = []
	// 使用OffscreenSprite和Combinator进行视频合成
	const tracks = trackStore.trackList.reduce((res, { list }) => res.concat(list as any), [])

	// 视频分辨率尺寸集合
	const outputSizeMap = new Map([
		['16:9', { width: 1920, height: 1080 }],
		['4:3', { width: 1280, height: 960 }],
		['2:1', { width: 1080, height: 2160 }],
		['9:16', { width: 1080, height: 1920 }],
		['3:4', { width: 960, height: 1280 }],
		['1:1', { width: 1080, height: 1080 }],
	])
	// 根据纵横比选择输出尺寸
	const outputSize = outputSizeMap.get(playerStore.aspectRatio)

	for (const track of tracks) {
		if ((track as Resource).type === 'audio') {
			sprs.push((toRaw(track) as AudioTrack).combine())
		} else {
			const outputRatio = (outputSize as Record<string, number>).width / playerStore.playerWidth
			sprs.push(
				(toRaw(track) as Resource).combine(
					{
						width: playerStore.playerWidth,
						height: playerStore.playerHeight,
					},
					outputRatio,
				),
			)
		}
	}

	const sprites = await Promise.all(sprs)

	const com = new Combinator({
		...outputSize,
		bgColor: 'black',
	})

	await Promise.all(
		sprites.map((sprite, index) => {
			sprite.zIndex = 999 - index
			return com.addSprite(sprite)
		}),
	)

	console.time('合成耗时')
	await com.output().pipeTo(await createFileWriter())
	console.timeEnd('合成耗时')

	loading.close()
	ElMessage.success('合成完成')
}
</script>

<template>
	<header class="app-header">
		<div class="header-content">
			<div class="flex items-center">
				<IconGithub
					class="header-logo"
					@click="openGithub"
				/>
				<h1 class="header-title">
					{{ title }}
				</h1>
			</div>

			<div class="flex justify-end items-center pr-4">
				<el-switch
					v-model="globalStore.isDark"
					class="mr-4"
					size="large"
					:active-icon="Moon"
					:inactive-icon="Sunny"
					:inline-prompt="true"
					@change="changeTheme"
				/>

				<el-button
					type="primary"
					class="dark:bg-[var(--el-bg-color)] rounded-lg outline-none"
					@click="handleExport"
				>
					<ElIcon
						class="mr-1"
						:size="14"
						color="#fff"
					>
						<Download />
					</ElIcon>
					导出
				</el-button>
			</div>
		</div>
	</header>
</template>
<style lang="scss" scoped>
.app-header {
	@apply h-58px px-2 pt-2 bg-#fafafa dark:bg-[var(--el-bg-color)];
}

.header-content {
	@apply w-full h-full flex-center flex-between flex-nowrap el-theme rounded-lg bg-[var(--el-color-primary)] color-white;
}

.header-logo {
	@apply mx-4 cursor-pointer color-white dark:color-black;
}

.header-title {
	@apply text-xl font-bold color-white dark:color-black;
}
</style>
