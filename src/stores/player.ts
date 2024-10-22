import { toRefs, reactive } from 'vue'
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('playerStore', () => {
	const playerConfig = reactive({
		// 1920*1080 = 16:9
		aspectRatio: '9:16', // 16:9 | 4:3 | 2:1 | 9:16 | 3:4 | 1:1
		playerWidth: 0,
		playerHeight: 0,
		isPause: true, // 播放是否暂停
		ingLoadingCount: 0,
		playFrame: 0, // 当前播放帧
		existVideo: false,
		frameCount: 0, // 要播放的总帧数
		playTargetTrackMap: new Map(), // 当前播放的元素集合
	})

	return {
		...toRefs(playerConfig),
	}
})
