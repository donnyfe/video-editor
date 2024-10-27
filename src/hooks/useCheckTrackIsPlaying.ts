import { watchEffect, onBeforeUnmount } from 'vue'
import { isEqual } from 'lodash-es'
import { usePlayerStore } from '@/stores'

// 跟踪正在播放的轨道，并维护一个当前正在播放的轨道项映射。
export function useCheckTrackIsPlaying(props: Record<string, any>) {
	const store = usePlayerStore()

	watchEffect(() => {
		const trackItem = props.trackItem
		// 检查当前播放帧是否在轨道项的时间范围内
		if (store.playFrame >= trackItem.start && store.playFrame <= trackItem.end) {
			// 更新播放目标轨道映射
			const oldPlayTargetTrackMap = store.playTargetTrackMap.get(trackItem.id)
			// 使用 isEqual 进行深度比较，避免不必要的更新
			if (!oldPlayTargetTrackMap || !isEqual(oldPlayTargetTrackMap, trackItem)) {
				store.playTargetTrackMap.set(trackItem.id, trackItem)
			}
		} else {
			// 移除不再播放的轨道项
			store.playTargetTrackMap.has(trackItem.id) && store.playTargetTrackMap.delete(trackItem.id)
		}
	})

	onBeforeUnmount(() => {
		store.playTargetTrackMap.has(props.trackItem.id) &&
			store.playTargetTrackMap.delete(props.trackItem.id)
	})
}
