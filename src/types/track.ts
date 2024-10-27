import type { VideoTrack, AudioTrack, ImageTrack, TextTrack } from '@/classes'

// 帧集合
export type Frames = Record<string, any>[]

// 资源
export type Resource = AudioTrack | ImageTrack | TextTrack | VideoTrack

export type MoveableTrack = VideoTrack | ImageTrack | TextTrack

// 轨道项
export interface TrackListItem {
	type: Resource['type']
	list: Resource[]
	main?: boolean
}

// 轨道类型
export type ResourceType = 'video' | 'audio' | 'text' | 'image' | 'effect' | 'transition' | 'filter'

// 轨道项
export interface BaseTrack {
	id: string
	type: ResourceType
	name: string
	frameCount: number // 总帧数
	start: number // 在轨道上的起始位置，单位为帧
	end: number // 在轨道上的结束位置
}

// 吸附线
export interface AdsorptionLine {
	position: number
	frame: number
}

// 线坐标
export interface LineCoord {
	left: number
	right: number
	start: number
	end: number
}

export interface InsertInfo extends LineCoord {
	isNewLine: boolean
	insertIndex: number
	itemIndex: number
}

export interface InsertLineInfo {
	isNewLine: boolean
	insertIndex: number
	elem?: HTMLElement
}
