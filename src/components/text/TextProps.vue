<script setup lang="ts">

let props = defineProps({
	control: Object,
	formProps: Object,
})
</script>

<template>
	<el-form ref="formRef"
		:model="control.props"
		:rules="control.props.rules"
		label-width="80px">
		<el-form-item label="旋转">
			<!-- <el-input v-model="control.props.rotation" placeholder="0"></el-input> -->
			<el-input :model-value="control.props.rotation"
				@update:model-value="(value) => $emit('update:control', { ...control, props: { ...control.props, rotation: value } })"
				placeholder="0"></el-input>
		</el-form-item>
	</el-form>
</template>

<style lang="scss" scoped></style>
