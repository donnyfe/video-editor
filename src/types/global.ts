declare global {
	interface Window {
		showSaveFilePicker: (options?: any) => Promise<FileSystemFileHandle>
	}
}

// 菜单项
export interface MenuItem {
	type: string
	name: string
	active?: boolean
}

// 视频源
export interface VideoSource {
	id: string
	url: string
	name: string
	format: string
	duration: number
	width: number
	height: number
}

// 音频源
export interface AudioSource {
	id: string
	url: string
	name: string
	format: string
	duration: number
}

// 图片源
export interface ImageSource {
	id: string
	url: string
	name: string
	format: string
	width: number
	height: number
}

// 文本源
export interface TextSource {
	content: string
	fill: string
	stroke?: string
	fontSize: number
	fontFamily: string
	textBackgroundColor?: string
	name: string
}

// 尺寸
export interface Size {
	width: number
	height: number
}

// 移动元素
export interface MoveableItem {
	id: string
	lineIndex: number
	itemIndex: number
	y: number
	x: number
	w: number
	h: number
	scale: number
	left: number
	top: number
	rotate?: number
}

export type CanvasContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
