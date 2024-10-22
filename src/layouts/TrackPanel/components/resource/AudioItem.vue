<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import { usePlayerStore } from '@/stores'
import LoadingTrack from '@/components/LoadingTrack.vue'
import { useCheckTrackIsPlaying } from '@/hooks'

const waveOptions = {
	height: 28,
	width: '100%',
	splitChannels: false,
	normalize: true,
	waveColor: '#007bff',
	progressColor: '#dd5e98',
	cursorColor: '#ddd5e9',
	cursorWidth: 0,
	barWidth: 1,
	barGap: 1,
	barRadius: 1,
	barHeight: 0.6,
	barAlign: 'bottom',
	minPxPerSec: 1,
	fillParent: true,
	mediaControls: true,
	autoplay: false,
	interact: false,
	dragToSeek: false,
	hideScrollbar: false,
	audioRate: 0.1,
	autoScroll: true,
	autoCenter: true,
	sampleRate: 8000
}

const props = defineProps({
	trackItem: {
		type: Object,
		default() {
			return {
				showWidth: '0px',
				showLeft: '0px'
			}
		}
	}
})

const store = usePlayerStore()
store.ingLoadingCount++

const waveStyle = computed(() => {
	const { start, end, offsetL, offsetR, frameCount } = props.trackItem
	const showFrameCount = end - start
	return {
		transform: `scaleX(${(frameCount / showFrameCount).toFixed(2)})`,
		transformOrigin: 'left top',
		left: `-${offsetL / showFrameCount * 100}%`,
		right: `-${offsetR / showFrameCount * 100}%`
	}
})
const loading = ref(true)
const waveRef = ref<HTMLElement | string>()

async function initAudio() {
	WaveSurfer.create({
		container: waveRef.value,
		url: props.trackItem.source.url,
		...waveOptions
	})

	loading.value = false
	store.ingLoadingCount--
}

watch(() => {
	if (props.trackItem.source) {
		return waveRef.value
	}
}, () => {
	if (waveRef.value) {
		initAudio()
	}
}, {
	immediate: true
})
useCheckTrackIsPlaying(props)
</script>

<template>
	<div class="flex flex-col rounded overflow-hidden h-full">
		<div
			class="flex items-center text-xs pl-2 overflow-hidden h-5 leading-5 bg-blue-500 bg-opacity-50 text-gray-100">
			<IconAudio class="inline-block mr-2 shrink-0" />
			<span class="mr-4 shrink-0">{{ `${trackItem.name}.${trackItem.format}` }}</span>
		</div>
		<div class="overflow-hidden bg-blue-900 bg-opacity-60 flex-1 relative">
			<div ref="waveRef"
				class="absolute"
				:style="waveStyle">
			</div>
		</div>
		<LoadingTrack v-show="loading"
			class="pl-12 bg-opacity-70" />
	</div>
</template>
