<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import ImageList from './ImageList.vue'
import { ImageTrack } from '@/components/image/ImageTrack'
import { useTrackStore, usePlayerStore } from '@/stores'
import { getMD5, imageDecoder } from '@/utils'
import type { UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([])


const trackStore = useTrackStore()
const playerStore = usePlayerStore()

async function onUpload(userFile: UploadUserFile) {
	const file = userFile.raw as File

	// TODO：性能优化-计算文件MD5可通过woker进行
	console.time('生成md5耗时')
	const id = await getMD5(await file.arrayBuffer())
	console.timeEnd('生成md5耗时')
	//
	console.time('解析视频耗时')
	const frames = await imageDecoder.decode({ id, stream: file.stream(), type: file.type })
	console.timeEnd('解析视频耗时')


	if (!frames) {
		return ElMessage.error('解析视频失败')
	}

	const imageTrack = new ImageTrack({
		id,
		url: id,
		name: file.name,
		format: file.type,
		width: frames[0].codedWidth,
		height: frames[0].codedHeight
	}, playerStore.playStartFrame)

	imageTrack.resize({
		width: playerStore.playerWidth,
		height: playerStore.playerHeight
	})

	trackStore.addTrack(imageTrack)
}
</script>

<template>
	<div class="p-4 flex-1 overflow-hidden flex flex-col">
		<div class="flex-1 overflow-hidden">
			<div class="overflow-y-auto h-full pt-6 scrollbar-width-none">
				<el-upload ref="uploadRef"
					class="image-uploader"
					v-model:file-list="fileList"
					drag
					accept="images/*"
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

				<ImageList />
			</div>
		</div>
	</div>

</template>

<style lang="scss" scoped></style>
