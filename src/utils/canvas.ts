// 标尺中每小格代表的宽度(根据scale的不同实时变化)
const getGridSize = (scale: number): number => {
	const scaleNum = new Map([
		// 切换比例：最小单位为帧
		[100, 100],
		[90, 50],
		[80, 20],
		[70, 10],
		// 切换比例：最小单位为秒
		[60, 80],
		[50, 40],
		[40, 20],
		[30, 10],
		// 切换比例：最小单位为6秒 一大格为 1分钟
		[20, 40],
		[10, 25],
		[0, 10]
	])
	return scaleNum.get(scale) || 100
}
/**
 * 获取当前缩放下的单元格像素
 * @param scale 缩放比例
 * @param frameCount 帧数
 * @returns 单元格像素
 */
export const getGridPixel = (scale: number, frameCount: number) => {
	const gridPixel = getGridSize(scale)
	let width = gridPixel * frameCount
	if (scale < 70) {
		// 1秒一格
		width = width / 30
	}
	if (scale < 30) {
		// 6秒一格
		width = width / 6
	}
	return width
}

// 获取选中点的帧坐标
export const getSelectFrame = (offsetX: number, scale: number, frameStep: number) => {
	const size = getGridSize(scale)
	if (scale < 70) {
		// 一个单元格为 1 秒
		offsetX *= frameStep
	}
	if (scale < 30) {
		// 一个单元格为 6 秒
		offsetX *= 6
	}
	return Math.round(offsetX / size)
}
