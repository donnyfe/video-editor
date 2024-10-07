<script setup lang="ts">
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadUserFile } from 'element-plus'
import VideoList from './VideoList.vue'
import { VideoTrack } from '@/components/video/VideoTrack'
import { usePlayerStore, useTrackStore } from '@/stores'
import { getMD5, videoDecoder } from '@/utils'

const fileList = ref<UploadUserFile[]>([])

const trackStore = useTrackStore()
const playerStore = usePlayerStore()

async function onUpload(userFile: UploadUserFile) {
	const file = userFile.raw as File

	// TODO：性能优化-计算文件MD5可通过woker进行
	console.time('生成md5耗时')
	const id = await getMD5(await file.arrayBuffer())
	console.timeEnd('生成md5耗时')
	// 解析视频
	console.time('解析视频耗时')
	const clip = await videoDecoder.decode({ id, stream: file.stream(), type: file.type })
	console.timeEnd('解析视频耗时')

	if (!clip) {
		return ElMessage.error('解析视频失败')
	}


	// 创建视频轨道
	const videoTrack = new VideoTrack({
		id,
		url: URL.createObjectURL(file), // 返回一个blob URL，可以用来引用内存中的文件数据。
		name: file.name,
		format: file.type,
		width: clip.meta.width,
		height: clip.meta.height,
		duration: Math.round(clip.meta.duration / 1e6)
	}, playerStore.playStartFrame)

	videoTrack.resize({
		width: playerStore.playerWidth,
		height: playerStore.playerHeight
	})

	trackStore.addTrack(videoTrack)
}
</script>

<template>
	<div class="video-panel mx-4 my-4">
		<el-upload ref="uploadRef"
			class="video-uploader"
			v-model:file-list="fileList"
			drag
			accept=".mp4"
			:multiple="false"
			:auto-upload="false"
			:on-change="onUpload">
			<el-icon class="el-icon--upload">
				<UploadFilled />
			</el-icon>
			<div class="el-upload__text">
				拖拽文件到此处 或 <em>点击上传</em>
			</div>
			<template #tip>
				<div class="el-upload__tip">提示: 此处是上传提示</div>
			</template>
		</el-upload>

		<VideoList />
	</div>
</template>

<style lang="scss" scoped></style>
