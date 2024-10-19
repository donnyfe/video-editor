<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
	offsetX: 0,
	offsetY: 0,
	scale: 0,
})
</script>

<template>
	<el-form ref="formRef"
		:model="form"
		label-width="80px">
		<el-form-item label="缩放">
			<el-input v-model="form.scale"
				placeholder="0"></el-input>
		</el-form-item>
	</el-form>
</template>

<style lang="scss" scoped></style>
