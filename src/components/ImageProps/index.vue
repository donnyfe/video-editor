<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useTrackStore } from '@/stores'
import { ImageTrack } from '@/classes'

const activeCollapse = ref(['位置大小'])

const form = reactive({
	scale: 0,
	offsetX: 0,
	offsetY: 0,
})

const trackStore = useTrackStore()
//
const resource = trackStore.selectResource as ImageTrack

// 监听 resource 的变化,并更新 form
watch(() => resource, (newResource) => {
	console.log('watch __image__ resource: ', newResource)
	if (newResource) {
		Object.assign(form, {
			scale: newResource?.scale ?? 0,
			offsetX: (newResource?.offsetX ?? 0).toFixed(0),
			offsetY: (newResource?.offsetY ?? 0).toFixed(0),
		})
	}
}, { immediate: true, deep: true })

//
function onUpdate(key: string, value: any) {
	console.log('Key: ', key, 'Value: ', value)
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
								placeholder="0"
								@input="onUpdate('offsetX', $event)"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Y">
							<el-input class="form-item"
								type="number"
								v-model="form.offsetY"
								placeholder="0"
								@input="onUpdate('offsetY', $event)"></el-input>
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
