<script setup lang="ts">
	import { ref, toRaw, reactive, watch } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useTrackStore } from '@/stores'
	import { TextTrack } from '@/classes'

	const activeCollapse = ref(['文字样式', '位置大小'])

	const predefineColors = ref([
		'#ff4500',
		'#ff8c00',
		'#ffd700',
		'#90ee90',
		'#00ced1',
		'#1e90ff',
		'#c71585',
		'rgba(255, 69, 0, 0.68)',
		'rgb(255, 120, 0)',
		'hsv(51, 100, 98)',
		'hsva(120, 40, 94, 0.5)',
		'hsl(181, 100%, 37%)',
		'hsla(209, 100%, 56%, 0.73)',
		'#c7158577',
	])

	const trackStore = useTrackStore()
	const { selectResource, selectedTrack, trackList } = storeToRefs(trackStore)

	const form = reactive({
		content: '文本内容',
		fontSize: 24,
		fill: '#fff',
		stroke: '#fff',
		textBackgroundColor: '#fff',
		scale: 100,
		centerX: 0,
		centerY: 0,
	})

	if (selectResource.value && selectResource.value.type === 'text') {
		Object.assign(form, { ...toRaw(selectResource.value) })
	}

	// 监听轨道和资源变化
	watch(
		[() => selectedTrack.value, () => selectResource.value],
		newValue => {
			const newResource = newValue[1] as TextTrack
			if (newResource) {
				Object.assign(form, { ...toRaw(newResource) })
			}
		},
		{ immediate: true, deep: true, flush: 'post' },
	)

	// 监听属性变化
	function onChange(key: string, value: any) {
		const track = trackList.value[selectedTrack.value.line].list[
			selectedTrack.value.index
		] as Record<string, any>
		track[key] = value
	}
</script>

<template>
	<div class="flex flex-center justify-start px-5 py-2 el-theme-text">文本属性</div>
	<el-form
		ref="formRef"
		v-model="form"
		class="px-5 flex flex-col"
		label-width="50px"
	>
		<el-collapse v-model="activeCollapse">
			<el-collapse-item
				title="文字样式"
				name="文字样式"
			>
				<el-form-item label-width="0">
					<el-input
						v-model="form.content"
						class="form-item"
						type="textarea"
						placeholder="文本内容"
						@change="onChange('content', $event)"
						@input="onChange('content', $event)"
					/>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="字号">
							<el-input-number
								v-model="form.fontSize"
								class="form-item"
								:min="0"
								@change="onChange('fontSize', $event)"
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row class="flex justify-around">
					<el-col :span="8">
						<el-form-item label="填充色">
							<el-color-picker
								v-model="form.fill"
								:predefine="predefineColors"
								@chaactive-changenge="onChange('fill', $event)"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="描边色">
							<el-color-picker
								v-model="form.stroke"
								:predefine="predefineColors"
								@active-change="onChange('stroke', $event)"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="背景色">
							<el-color-picker
								v-model="form.textBackgroundColor"
								:predefine="predefineColors"
								@active-change="onChange('textBackgroundColor', $event)"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-collapse-item>
			<el-collapse-item
				title="位置大小"
				name="位置大小"
			>
				<el-row>
					<el-col :span="24">
						<el-form-item label="缩放">
							<el-slider
								v-model="form.scale"
								show-input
								:min="0"
								:max="500"
								@change="onChange('scale', $event)"
								@input="onChange('scale', $event)"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="X">
							<el-input-number
								v-model="form.centerX"
								class="form-item"
								@change="onChange('centerX', $event)"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Y">
							<el-input-number
								v-model="form.centerY"
								class="form-item"
								@change="onChange('centerY', $event)"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-collapse-item>
		</el-collapse>
	</el-form>
</template>

<style lang="scss" scoped></style>
