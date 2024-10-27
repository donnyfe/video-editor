<script setup lang="ts">
import { computed, type PropType } from 'vue'
import TrackItem from './TrackItem.vue'
import { useTrackStore } from '@/stores'

const props = defineProps({
	isMain: {
		type: Boolean,
		default: false,
	},
	lineType: {
		type: String,
		default: '',
	},
	lineIndex: {
		type: Number,
		default: 0,
	},
	lineData: {
		type: Array as PropType<Record<string, any>[]>,
		default() {
			return []
		},
	},
})

const TrackHeightMap = new Map([
	['video', 'h-16'],
	['audio', 'h-12'],
	['text', 'h-6'],
	['image', 'h-6'],
])

const store = useTrackStore()

const isActive = computed(() => {
	return store.selectedTrack.line === props.lineIndex
})
</script>

<template>
  <div
    class="mb-1 mt-1 relative ml-2 trackLine"
    :class="[
      TrackHeightMap.get(lineType),
      isActive ? 'dark:bg-gray-700 bg-gray-400 bg-opacity-20' : 'bg-gray-200 bg-opacity-10',
      isMain ? 'bg-blue-500 bg-opacity-20' : '',
    ]"
    :data-index="lineIndex"
    :data-type="lineType"
  >
    <template
      v-for="(item, index) of lineData"
      :key="item.id"
    >
      <TrackItem
        :line-index="lineIndex"
        :item-index="index"
        :track-item="item"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.showLine-t::after {
	content: '';
	display: block;
	position: absolute;
	top: 1px;
	left: 0;
	right: 0;
	height: 1px;
	background-color: #fcd34d;
	z-index: 30;
}

.showLine-b::before {
	content: '';
	display: block;
	position: absolute;
	bottom: 1px;
	left: 0;
	right: 0;
	height: 1px;
	background-color: #fcd34d;
	z-index: 30;
}
</style>
