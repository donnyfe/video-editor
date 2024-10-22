<script setup lang="ts">
import { ref } from 'vue'
import { uniqueId } from 'lodash-es'
import type { UploadUserFile } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { ImageTrack } from '@/classes'
import ImageList from './ImageList.vue'
import { useTrackStore, usePlayerStore } from '@/stores'
import { getMD5, decodeImage } from '@/utils'
import type { Frames } from '@/types'
import { datas } from './mock'

const trackStore = useTrackStore()
const playerStore = usePlayerStore()

const imageList = ref<{ id: string, src: string }[]>(datas)

function onSelect(file: File) {
	dillImage(file)
}

function onUpload(userFile: UploadUserFile) {
	const file = userFile.raw as File
	// 添加图片
	imageList.value.push({
		id: uniqueId(),
		src: URL.createObjectURL(file),
	})
	// 处理图像
	dillImage(file)
}

/**
 * 处理图像
 * @param file
 */
async function dillImage(file: File) {

// TODO：性能优化-计算内容MD5可通过woker进行
// 生成md5
	console.time('生成md5耗时')
	const md5 = await getMD5(await file.arrayBuffer())
	console.timeEnd('生成md5耗时')

	// 解码图像
	const frames = await decodeImage(md5, file) as Frames[]

	// 添加轨道
	addTrack(md5, file, frames)
}

/**
 * 添加轨道
 * @param md5
 * @param file
 * @param frames
 */
function addTrack(md5: string, file: File, frames: Frames) {
	const width = frames[0].codedWidth
	const height = frames[0].codedHeight
	const trackOptions = {
		id: md5,
		url: URL.createObjectURL(file),
		name: file.name,
		format: file.type,
		width,
		height
	}
	const imageTrack = new ImageTrack(trackOptions, playerStore.playFrame)
	imageTrack.resize({ width: playerStore.playerWidth, height: playerStore.playerHeight })
	trackStore.addTrack(imageTrack)
}

</script>

<template>
	<div class="p-4 flex-1 overflow-hidden flex flex-col">
		<div class="flex-1 overflow-hidden">
			<div class="h-full py-2 flex flex-col">
				<el-upload ref="uploadRef"
					class="image-uploader mb-4"
					drag
					accept="images/*"
					:multiple="false"
					:auto-upload="false"
					:show-file-list="false"
					:on-change="onUpload">
					<el-icon class="el-icon--upload">
						<UploadFilled />
					</el-icon>
					<div class="el-upload__text">
						拖拽文件到此处 或 <em>点击上传</em>
					</div>
				</el-upload>

				<div class="flex-1 overflow-hidden">
					<ImageList v-model:list="imageList"
						@select="onSelect" />
				</div>
			</div>
		</div>
	</div>

</template>

<style lang="scss" scoped></style>
