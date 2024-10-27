<script setup lang="ts">
import type { MP4Clip } from '@webav/av-cliper'
import type { UploadUserFile } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import VideoList from './VideoList.vue'
import { VideoTrack } from '@/classes'
import { usePlayerStore, useTrackStore } from '@/stores'
import { decodeVideo } from '@/utils'
import MD5Worker from '@/utils/MD5Worker'

const trackStore = useTrackStore()
const playerStore = usePlayerStore()

async function onUpload(userFile: UploadUserFile) {
	const file = userFile.raw as File

	// TODO：性能优化-计算文件MD5可通过woker进行
	console.time('生成md5耗时')
	const md5 = await MD5Worker.getInstance().getFileMD5(file)
	console.timeEnd('生成md5耗时')

	const clip = (await decodeVideo(md5, file)) as MP4Clip

	addTrack(md5, file, clip)
}

/**
 * 添加视频轨道
 * @param id
 * @param file
 * @param clip
 */
function addTrack(id: string, file: File, clip: MP4Clip) {
	const width = clip.meta.width
	const height = clip.meta.height
	const duration = Math.round(clip.meta.duration / 1e6)

	const trackOptions = {
		id,
		url: URL.createObjectURL(file), // 返回一个blob URL，可以用来引用内存中的文件数据。
		name: file.name,
		format: file.type,
		width,
		height,
		duration,
	}

	// 创建视频轨道
	const videoTrack = new VideoTrack(trackOptions, playerStore.playFrame)
	videoTrack.resize({ width: playerStore.playerWidth, height: playerStore.playerHeight })
	trackStore.addTrack(videoTrack)
}
</script>

<template>
  <div class="video-panel mx-4 my-4">
    <el-upload
      ref="uploadRef"
      class="video-uploader"
      drag
      accept=".mp4"
      :multiple="false"
      :auto-upload="false"
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

    <VideoList />
  </div>
</template>

<style lang="scss" scoped></style>
