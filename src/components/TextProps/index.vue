<script setup lang="ts">
import { ref, toRefs, computed, toRaw, reactive, watch } from 'vue'
import { useTrackStore } from '@/stores'
import { TextTrack } from '@/classes'

const activeCollapse = ref(['文本样式', '位置大小'])

const form = reactive({
	content: '',
	fontSize: 0,
	fontFamily: '',
	textBackgroundColor: '',
	stroke: '',
	fill: '',
	rotate: 0,
	offsetX: 0,
	offsetY: 0,
	scale: 0,
})

const trackStore = useTrackStore()
//
const resource = trackStore.selectResource as TextTrack

// 监听 resource 的变化,并更新 form
watch(() => resource, (newResource) => {
	console.log('watch __text__ resource: ', newResource)
	if (newResource) {
		Object.assign(form, {
			content: newResource?.content,
			fontSize: newResource?.fontSize,
			fontFamily: newResource?.fontFamily,
			textBackgroundColor: newResource?.textBackgroundColor,
			stroke: newResource?.stroke,
			fill: newResource?.fill,
			offsetX: newResource?.offsetX ?? 0,
			offsetY: newResource?.offsetY ?? 0,
			rotate: newResource?.rotate ?? 0,
			scale: newResource?.scale ?? 100,
		})
	}
}, { immediate: true, deep: true })

//
function onUpdate(key: string, value: any) {
	console.log('key: ', key, 'value: ', value)
	if (key in resource) {
		(resource as any)[key] = value
	}
}
</script>

<template>
	<el-form ref="formRef"
		class="px-5 py-5 flex flex-col"
		:model="form"
		label-width="42px">
		<el-collapse v-model="activeCollapse">
			<el-collapse-item title="文本样式"
				name="文本样式">
				<el-form-item label-width="0">
					<el-input class="form-item"
						type="textarea"
						v-model="form.content"
						placeholder="请输入"
						@input="onUpdate('content', $event)"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="字号">
							<el-input class="form-item"
								type="number"
								v-model="form.fontSize"
								placeholder="0"
								@change="onUpdate('fontSize', $event)"></el-input>
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
								@change="onUpdate('scale', $event)"
								@input="onUpdate('scale', $event)" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="X">
							<el-input class="form-item"
								type="number"
								v-model="form.offsetX"
								placeholder="0"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Y">
							<el-input class="form-item"
								type="number"
								v-model="form.offsetY"
								placeholder="0"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row>
					<el-col :span="12">
						<el-form-item label="旋转">
							<el-input class="form-item"
								type="number"
								v-model="form.rotate"
								placeholder="0"
								@change="onUpdate('rotate', $event)"></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
			</el-collapse-item>
		</el-collapse>
	</el-form>
</template>

<style lang="scss" scoped></style>
