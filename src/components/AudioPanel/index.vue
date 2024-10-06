<script setup lang="ts">
import { ref } from 'vue'
import type { UploadInstance, UploadUserFile } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import AudioList from './AudioList.vue'

const fileList = ref<UploadUserFile[]>([])
const uploadRef = ref<UploadInstance>()
// uploadRef.value!.submit()

</script>

<template>
	<div class="audio-panel mx-4 my-4">

		<el-upload ref="uploadRef"
			v-model:file-list="fileList"
			class="upload-demo"
			drag
			multiple>

			<el-icon class="el-icon--upload">
				<UploadFilled />
			</el-icon>

			<div class="el-upload__text">
				拖拽文件到此处 或 <em>点击上传</em>
			</div>

			<template #tip>
				<div class="el-upload__tip">提示: 文件应小于 500MB</div>
			</template>
		</el-upload>

		<AudioList />
	</div>
</template>

<style lang="scss" scoped></style>
