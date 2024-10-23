import { uniqueId } from 'lodash-es'
import type { ResourceType, Size } from '@/types'

export default abstract class BaseTrack {
	id: string
	type: ResourceType
	name: string

	// 资源信息
	source: any
	format: string = ''

	// 绘制信息
	width: number = 0
	height: number = 0
	scale: number = 100
	rotate: number = 0
	centerX: number = 0
	centerY: number = 0

	// 轨道信息
	frameCount: number = 0
	start: number = 0
	end: number = 0

	// 剪裁信息
	offsetL: number = 0
	offsetR: number = 0

	constructor(type: ResourceType, name: string) {
		this.id = uniqueId()
		this.type = type
		this.name = name
	}

	get drawWidth(): number {
		return (this.width * this.scale) / 100
	}

	get drawHeight(): number {
		return (this.height * this.scale) / 100
	}

	getDrawX(width: number): number {
		return width / 2 - this.drawWidth / 2 + this.centerX
	}

	getDrawY(height: number): number {
		return height / 2 - this.drawHeight / 2 + this.centerY
	}

	resize(size: Size): void {
		let scale = 1
		if (this.width > size.width) {
			scale = size.width / this.width
		}
		if (this.height > size.height) {
			scale = Math.min(scale, size.height / this.height)
		}
		this.width *= scale
		this.height *= scale
	}

	abstract draw(ctx: CanvasRenderingContext2D, size: Size, frameIndex: number): Promise<void>
	abstract combine(playerSize: Size, outputRatio: number): Promise<any>
}
