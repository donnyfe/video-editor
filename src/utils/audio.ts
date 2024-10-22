// 创建音频上下文
export function createAudioContext(): AudioContext {
	return new (window.AudioContext || (window as any).webkitAudioContext)()
}

// 加载音频文件
export async function loadAudioBuffer(context: AudioContext, url: string): Promise<AudioBuffer> {
	const response = await fetch(url)
	const arrayBuffer = await response.arrayBuffer()
	return await context.decodeAudioData(arrayBuffer)
}

// 创建音频源节点
export function createAudioSource(
	context: AudioContext,
	buffer: AudioBuffer,
): AudioBufferSourceNode {
	const source = context.createBufferSource()
	source.buffer = buffer
	return source
}

// 创建增益节点
export function createGainNode(context: AudioContext, gain: number = 1): GainNode {
	const gainNode = context.createGain()
	gainNode.gain.setValueAtTime(gain, context.currentTime)
	return gainNode
}

// 创建立体声平移节点
export function createStereoPanner(context: AudioContext, pan: number = 0): StereoPannerNode {
	const panner = context.createStereoPanner() // 可能需要进行兼容性检查或提供降级方案
	panner.pan.setValueAtTime(pan, context.currentTime)
	return panner
}

// 连接节点
export function connectNodes(source: AudioNode, ...destinations: AudioNode[]): void {
	destinations.forEach((dest) => source.connect(dest))
}

// 播放音频
export function playAudio(source: AudioBufferSourceNode, when: number = 0): void {
	source.start(when)
}

// 停止音频
export function stopAudio(source: AudioBufferSourceNode, when: number = 0): void {
	source.stop(when)
}

/**
// 使用示例
import { createAudioContext, loadAudioBuffer, createAudioSource, createGainNode, connectNodes, playAudio } from './utils/audio'

async function setupAudioPlayer(audioUrl: string) {
  const context = createAudioContext()
  const buffer = await loadAudioBuffer(context, audioUrl)
  const source = createAudioSource(context, buffer)
  const gainNode = createGainNode(context, 0.5) // 设置初始音量为50%

  connectNodes(source, gainNode, context.destination)

  playAudio(source)
}

setupAudioPlayer('path/to/your/audio.mp3')
 */
