<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { useTrackStore, usePlayerStore } from '@/stores'
import { decodeAudio } from '@/utils'
import { AudioTrack } from '@/classes'
// import AudioList from './AudioList.vue'
import type { AudioClip } from '@webav/av-cliper'
import type { UploadUserFile } from 'element-plus'
import MD5Worker from '@/utils/MD5Worker'

const trackStore = useTrackStore()
const playerStore = usePlayerStore()

async function onUpload(userFile: UploadUserFile) {
	const file = userFile.raw as File

	console.time('生成md5耗时')
	const md5 = await MD5Worker.getInstance().getFileMD5(file)
	console.timeEnd('生成md5耗时')

	const clip = (await decodeAudio(md5, file)) as AudioClip

	addTrack(md5, file, clip)
}

/**
 * 添加音频轨道
 * @param id
 * @param file
 * @param clip
 */
function addTrack(id: string, file: File, clip: AudioClip) {
	const duration = Math.round(clip.meta.duration / 1e6)

	const trackOptions = {
		id,
		url: URL.createObjectURL(file), // 返回一个blob URL，可以用来引用内存中的文件数据。
		name: file.name,
		format: file.type,
		duration,
	}

	// 创建音频轨道
	const audioTrack = new AudioTrack(trackOptions, playerStore.playFrame)
	trackStore.addTrack(audioTrack)
}
</script>

<template>
	<div class="audio-panel mx-4 my-4">
		<el-upload
			ref="uploadRef"
			class="upload-demo"
			drag
			accept=".mp3,.wav"
			:multiple="false"
			:auto-upload="false"
			:show-file-list="false"
			:on-change="onUpload"
		>
			<el-icon class="el-icon--upload">
				<UploadFilled />
			</el-icon>

			<div class="el-upload__text">
				拖拽文件到此处 或 <em>点击上传</em>
			</div>

			<template #tip>
				<div class="el-upload__tip">
					提示: 文件应小于500MB
				</div>
			</template>
		</el-upload>

		<!-- <AudioList /> -->
	</div>
</template>

<style lang="scss" scoped></style>
