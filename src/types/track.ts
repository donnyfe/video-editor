import type { VideoTrack } from '@/components/video/VideoTrack'
import type { AudioTrack } from '@/components/audio/AudioTrack'
import type { ImageTrack } from '@/components/image/ImageTrack'
import type { TextTrack } from '@/components/text/TextTrack'

export type Track = AudioTrack | ImageTrack | TextTrack | VideoTrack

export interface TrackLineItem {
	type: Track['type']
	main?: boolean
	list: Track[]
}

// 轨道类型
export type TrackType = 'video' | 'audio' | 'text' | 'image' | 'effect' | 'transition' | 'filter'

// 轨道项
export interface BaseTrack {
	id: string
	type: TrackType
	name: string
	start: number // 在轨道上的起始位置，单位为帧
	end: number // 在轨道上的结束位置
	frameCount: number // 总帧数
}
