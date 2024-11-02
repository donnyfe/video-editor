// src/utils/video.ts

// 创建自定义视频控件
export function createCustomVideoControls(videoElement: HTMLVideoElement): void {
	const controls = document.createElement('div')
	controls.className = 'custom-video-controls'

	const playPauseButton = document.createElement('button')
	playPauseButton.textContent = '播放/暂停'
	playPauseButton.addEventListener('click', () => {
		if (videoElement.paused) {
			videoElement.play()
		} else {
			videoElement.pause()
		}
	})

	const progressBar = document.createElement('input')
	progressBar.type = 'range'
	progressBar.min = '0'
	progressBar.max = '100'
	progressBar.addEventListener('input', () => {
		const time = (parseFloat(progressBar.value) / 100) * videoElement.duration
		videoElement.currentTime = time
	})

	controls.appendChild(playPauseButton)
	controls.appendChild(progressBar)
	videoElement.parentNode?.insertBefore(controls, videoElement.nextSibling)

	videoElement.addEventListener('timeupdate', () => {
		const progress = (videoElement.currentTime / videoElement.duration) * 100
		progressBar.value = progress.toString()
	})
}

// 检查浏览器是否支持特定视频格式
export function isSupportedVideoFormat(format: string): boolean {
	const video = document.createElement('video')
	return video.canPlayType(format) !== ''
}

// 获取视频的宽度和高度
export function getVideoSize(videoElement: HTMLVideoElement): { width: number; height: number } {
	return {
		width: videoElement.videoWidth,
		height: videoElement.videoHeight
	}
}

// 获取视频缩略图
export function getVideoThumbnail(videoUrl: string, time = 0): Promise<string> {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video')
		video.src = videoUrl
		video.currentTime = time
		video.addEventListener('loadeddata', () => {
			const canvas = document.createElement('canvas')
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
			canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
			resolve(canvas.toDataURL())
		})
		video.addEventListener('error', reject)
	})
}

// 加载视频字幕
export function loadSubtitles(videoElement: HTMLVideoElement, subtitlesUrl: string): void {
	const track = document.createElement('track')
	track.kind = 'captions'
	track.label = '字幕'
	track.srclang = 'zh'
	track.src = subtitlesUrl

	videoElement.appendChild(track)
	// track.mode = 'showing'
}

// 获取视频的播放列表
export function getPlaylist(videoElement: HTMLVideoElement): HTMLSourceElement[] {
	return Array.from(videoElement.querySelectorAll('source'))
}

// 切换到下一个视频源
export function switchToNextSource(videoElement: HTMLVideoElement): void {
	const sources = getPlaylist(videoElement)
	const currentIndex = sources.findIndex(source => source.src === videoElement.currentSrc)
	const nextIndex = (currentIndex + 1) % sources.length
	videoElement.src = sources[nextIndex].src
	videoElement.play()
}

// 添加字幕轨道
export function addTextTrack(
	videoElement: HTMLVideoElement,
	kind: TextTrackKind,
	label: string,
	language: string
): TextTrack {
	return videoElement.addTextTrack(kind, label, language)
}

// 获取当前活动的字幕轨道
export function getActiveTextTrack(videoElement: HTMLVideoElement): TextTrack | null {
	return Array.from(videoElement.textTracks).find(track => track.mode === 'showing') || null
}

// 设置播放质量
export function setPlaybackQuality(videoElement: HTMLVideoElement, quality: string): void {
	if ('getVideoPlaybackQuality' in videoElement) {
		;(videoElement as any).setPlaybackQuality(quality)
	}
}

// 获取视频的播放历史
export function getPlayedRanges(videoElement: HTMLVideoElement): { start: number; end: number }[] {
	const played = videoElement.played
	const ranges = []
	for (let i = 0; i < played.length; i++) {
		ranges.push({
			start: played.start(i),
			end: played.end(i)
		})
	}
	return ranges
}

// 获取视频的当前播放质量
export function getPlaybackQuality(videoElement: HTMLVideoElement): VideoPlaybackQuality | null {
	if ('getVideoPlaybackQuality' in videoElement) {
		return videoElement.getVideoPlaybackQuality()
	}
	return null
}

/* ----------------------------------------
	视频加载状态
---------------------------------------- */

// 获取视频的网络状态
export function getNetworkState(videoElement: HTMLVideoElement): number {
	return videoElement.networkState
}

// 设置视频预加载模式
export function setPreloadMode(
	videoElement: HTMLVideoElement,
	mode: 'none' | 'metadata' | 'auto'
): void {
	videoElement.preload = mode
}

// 检查视频是否已完全加载
export function isVideoFullyLoaded(videoElement: HTMLVideoElement): boolean {
	return (
		videoElement.buffered.length > 0 &&
		videoElement.buffered.end(videoElement.buffered.length - 1) === videoElement.duration
	)
}

// 检查视频是否正在缓冲
export function isBuffering(videoElement: HTMLVideoElement): boolean {
	return videoElement.readyState < videoElement.HAVE_FUTURE_DATA
}

// 获取视频缓冲状态
export function getBufferedRanges(
	videoElement: HTMLVideoElement
): { start: number; end: number }[] {
	const buffered = videoElement.buffered
	const ranges = []
	for (let i = 0; i < buffered.length; i++) {
		ranges.push({
			start: buffered.start(i),
			end: buffered.end(i)
		})
	}
	return ranges
}

/* ----------------------------------------
	视频播放状态
---------------------------------------- */
// 检测视频是否可以播放
export function isVideoPlayable(videoElement: HTMLVideoElement): boolean {
	return videoElement.readyState >= 2
}

// 获取视频的播放状态
export function getPlaybackState(videoElement: HTMLVideoElement): 'playing' | 'paused' | 'ended' {
	if (videoElement.ended) {
		return 'ended'
	}
	return videoElement.paused ? 'paused' : 'playing'
}

// 检查视频是否处于暂停状态
export function isVideoPaused(videoElement: HTMLVideoElement): boolean {
	return videoElement.paused
}

// 检查视频是否已结束
export function isVideoEnded(videoElement: HTMLVideoElement): boolean {
	return videoElement.ended
}

// 设置视频循环播放
export function setVideoLoop(videoElement: HTMLVideoElement, loop: boolean): void {
	videoElement.loop = loop
}

/* ----------------------------------------
	视频播放速率
---------------------------------------- */

// 检查视频是否支持倍速播放
export function supportsPlaybackRate(videoElement: HTMLVideoElement): boolean {
	return 'playbackRate' in videoElement
}

// 获取视频当前播放速度
export function getPlaybackRate(videoElement: HTMLVideoElement): number {
	return videoElement.playbackRate
}

// 设置视频的播放速度
export function setPlaybackRate(videoElement: HTMLVideoElement, rate: number): void {
	if (supportsPlaybackRate(videoElement)) {
		videoElement.playbackRate = rate
	}
}

/* ----------------------------------------
	视频时长
---------------------------------------- */

// 格式化视频时长
export function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = Math.floor(seconds % 60)

	let result = ''
	if (hours > 0) {
		result += `${hours}:`
	}
	result += `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`

	return result
}
// 获取视频的当前播放时间
export function getCurrentTime(videoElement: HTMLVideoElement): number {
	return videoElement.currentTime
}

// 跳转到视频的特定时间点
export function seekTo(videoElement: HTMLVideoElement, time: number): void {
	videoElement.currentTime = Math.max(0, Math.min(time, videoElement.duration))
}

// 设置视频的当前时间
export function setCurrentTime(videoElement: HTMLVideoElement, time: number): void {
	videoElement.currentTime = time
}

// 获取视频当前播放时间的百分比
export function getVideoProgressPercentage(videoElement: HTMLVideoElement): number {
	return (videoElement.currentTime / videoElement.duration) * 100
}

// 获取视频的总时长
export function getVideoDuration(videoElement: HTMLVideoElement): number {
	return videoElement.duration
}

/* ----------------------------------------
	视频音量
---------------------------------------- */

// 获取视频的当前音量
export function getVideoVolume(videoElement: HTMLVideoElement): number {
	return videoElement.volume
}

// 设置视频的音量
export function setVideoVolume(videoElement: HTMLVideoElement, volume: number): void {
	videoElement.volume = Math.max(0, Math.min(1, volume))
}

// 检查视频是否处于静音状态
export function isVideoMuted(videoElement: HTMLVideoElement): boolean {
	return videoElement.muted
}

// 静音/取消静音
export function toggleMute(videoElement: HTMLVideoElement): void {
	videoElement.muted = !videoElement.muted
}

/* ----------------------------------------
	视频画面 全屏 / 画中画
---------------------------------------- */

// 检查视频是否支持全屏
export function isFullscreenSupported(videoElement: HTMLVideoElement): boolean {
	return !!videoElement.requestFullscreen
}

// 切换全屏模式
export function toggleFullscreen(element: HTMLElement): void {
	if (!document.fullscreenElement) {
		element.requestFullscreen().catch(err => {
			console.error(`全屏请求失败: ${err.message}`)
		})
	} else {
		document.exitFullscreen()
	}
}

// 检查视频是否支持画中画模式
export function supportsPictureInPicture(): boolean {
	return 'pictureInPictureEnabled' in document
}

// 进入画中画模式
export function enterPictureInPicture(
	videoElement: HTMLVideoElement
): Promise<PictureInPictureWindow> {
	if (supportsPictureInPicture()) {
		return videoElement.requestPictureInPicture()
	}
	return Promise.reject(new Error('画中画模式不受支持'))
}

// 退出画中画模式
export function exitPictureInPicture(): Promise<void> {
	if (document.pictureInPictureElement) {
		return document.exitPictureInPicture()
	}
	return Promise.reject(new Error('当前没有处于画中画模式的视频'))
}

// 切换画中画模式
export function togglePictureInPicture(videoElement: HTMLVideoElement): Promise<any> {
	if (document.pictureInPictureElement) {
		return document.exitPictureInPicture()
	} else if (document.pictureInPictureEnabled) {
		return videoElement.requestPictureInPicture()
	}
	return Promise.reject(new Error('画中画模式不受支持'))
}
/* ----------------------------------------
	视频字幕
---------------------------------------- */

// 获取视频的文本轨道(字幕)
export function getTextTracks(videoElement: HTMLVideoElement): TextTrack[] {
	return Array.from(videoElement.textTracks)
}

// 切换文本轨道(字幕)
export function switchTextTrack(videoElement: HTMLVideoElement, trackIndex: number): void {
	const tracks = getTextTracks(videoElement)
	if (tracks.length > trackIndex) {
		tracks.forEach((track, index) => {
			track.mode = index === trackIndex ? 'showing' : 'hidden'
		})
	}
}

/* ----------------------------------------
	视频音频
---------------------------------------- */

// // 获取视频的音频轨道
// export function getAudioTracks(videoElement: HTMLVideoElement): AudioTrack[] {
// 	return Array.from(videoElement.audioTracks)
// }

// // 检查视频是否支持音轨切换
// export function hasAudioTracks(videoElement: HTMLVideoElement): boolean {
// 	return videoElement?.audioTracks?.length > 1
// }

// // 切换音轨
// export function switchAudioTrack(videoElement: HTMLVideoElement, trackIndex: number): void {
// 	if (hasAudioTracks(videoElement)) {
// 		for (let i = 0; i < videoElement.audioTracks.length; i++) {
// 			videoElement.audioTracks[i].enabled = i === trackIndex
// 		}
// 	}
// }
