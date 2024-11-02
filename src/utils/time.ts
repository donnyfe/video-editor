/**
 * 格式化时间
 * @param seconds 秒
 * @returns 格式化后的时间
 */
export const formattedDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60
	return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * 格式化播放器时间
 * @param frameCount 帧数
 * @returns 格式化后的时间
 */
export function formatPlayerTime(frameCount: number) {
	const f = Math.round(frameCount % 30)
	frameCount = Math.floor(frameCount / 30)
	const s = frameCount % 60
	frameCount = Math.floor(frameCount / 60)
	const m = frameCount % 60
	frameCount = Math.floor(frameCount / 60)
	const h = frameCount
	return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}:${f < 10 ? '0' : ''}${f}`
}

/**
 *  时间格式化
 */
export function formatTime(time: number) {
	let second = Math.ceil(time / 1000)
	const s = second % 60
	second = Math.floor(second / 60)
	const m = second % 60
	second = Math.floor(second / 60)
	const h = second % 60
	return {
		s,
		m,
		h,
		str: `${h === 0 ? '' : `${h < 10 ? '0' : ''}${h}:`}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
	}
}

/**
 * 精确计时器
 * @param callback
 * @param interval
 * @returns
 */
export function preciseInterval(callback: () => void, interval: number) {
	let expected = performance.now() + interval
	let stop = false

	function step(timestamp: number) {
		if (stop) {
			return
		}

		if (timestamp >= expected) {
			callback()
			// 累积期望的时间，以保持精确的间隔
			expected += interval
		}

		requestAnimationFrame(step)
	}

	requestAnimationFrame(step)

	// 返回一个对象包含取消方法
	return {
		cancel: () => {
			stop = true
		}
	}
}
