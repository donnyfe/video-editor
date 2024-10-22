<script setup lang="ts">
import { ref, toRefs, computed, toRaw, reactive, watch, type ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useTrackStore } from '@/stores'
import { TextTrack } from '@/classes'

const activeCollapse = ref(['文本样式', '位置大小'])

const trackStore = useTrackStore()
const { selectResource, selectedTrack, trackList } = storeToRefs(trackStore);

const form = reactive({
	content: '文本内容',
	fontSize: 24,
	scale: 100,
	centerX: 0,
	centerY: 0
})

if (selectResource.value && selectResource.value.type === 'text') {
	Object.assign(form, { ...toRaw(selectResource.value) })
}

// 监听轨道和资源变化
watch([() => selectedTrack.value, () => selectResource.value], (newValue) => {

	const newResource = newValue[1] as TextTrack
	if (newResource) {
		Object.assign(form, { ...toRaw(newResource) })
	}
}, { immediate: true, deep: true, flush: 'post' })

// 监听属性变化
function onChange(key: string, value: any) {
	const track = trackList.value[selectedTrack.value.line].list[selectedTrack.value.index] as Record<string, any>
	track[key] = value
}

</script>

<template>
	<div class="flex flex-center justify-start px-5 py-2">文本属性</div>
	<el-form ref="formRef"
		class="px-5 flex flex-col"
		v-model="form"
		label-width="42px">
		<el-collapse v-model="activeCollapse">
			<el-collapse-item title="文本样式"
				name="文本样式">
				<el-form-item label-width="0">
					<el-input class="form-item"
						type="textarea"
						v-model="form.content"
						placeholder="文本内容"
						@change="onChange('content', $event)"
						@input="onChange('content', $event)"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="字号">
							<el-input-number class="form-item"
								v-model="form.fontSize"
								:min="0"
								@change="onChange('fontSize', $event)"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
			</el-collapse-item>
			<el-collapse-item title="位置大小"
				name="位置大小">
				<el-row>
					<el-col :span="24">
						<el-form-item label="缩放">
							<el-slider v-model="form.scale"
								show-input
								:min="0"
								:max="500"
								@change="onChange('scale', $event)"
								@input="onChange('scale', $event)"></el-slider>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="X">
							<el-input-number class="form-item"
								v-model="form.centerX"
								@change="onChange('centerX', $event)"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Y">
							<el-input-number class="form-item"
								v-model="form.centerY"
								@change="onChange('centerY', $event)"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
			</el-collapse-item>
		</el-collapse>
	</el-form>
</template>

<style lang="scss" scoped></style>
