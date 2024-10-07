class BaseTrack {
	id: string
	type: string
	name: string
	frameCount: number // 帧数
	start: number // 在轨道上的起始位置，单位为帧
	end: number // 在轨道上的结束位置

	constructor(type: string, name: string) {
		this.id = ''
		this.type = type
		this.name = name
		this.frameCount = 0
		this.start = 0
		this.end = 0
	}
	add() {}
	remove() {}
}

export default BaseTrack
