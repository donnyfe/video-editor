<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
	scale: 0,
})
</script>

<template>
	<div class="flex flex-center justify-start px-5 py-2 el-theme-text">音频属性</div>
	<el-form
		ref="formRef"
		:model="form"
		label-width="80px"
	>
		<!-- <el-form-item label="缩放">
			<el-input v-model="form.scale"
				placeholder="0"></el-input>
		</el-form-item> -->
	</el-form>
</template>

<style lang="scss" scoped></style>
