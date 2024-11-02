interface Point {
	x: number
	y: number
}

/**
 * 根据中心点计算左上角顶点位置
 */
export function calcLeftTopByCenter(center: Point, width: number, height: number) {
	return {
		left: center.x - width / 2,
		top: center.y - height / 2
	}
}
