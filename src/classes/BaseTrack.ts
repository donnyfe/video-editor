class BaseTrack {
	// 资源信息
	id: string = ''
	type: string = ''
	name: string = ''
	// 绘制信息
	centerX: number = 0
	centerY: number = 0
	// 轨道信息
	frameCount: number = 0 // 帧数
	start: number = 0 // 在轨道上的起始位置，单位为帧
	end: number = 0 // 在轨道上的结束位置
	// 剪裁信息
	offsetL: number = 0
	offsetR: number = 0

	constructor(type: string, name: string) {
		// 设置资源信息
		this.id = ''
		this.type = type
		this.name = name
	}
}

export default BaseTrack
