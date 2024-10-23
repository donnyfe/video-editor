/**
 * 实现首字母大写
 * @param str
 * @returns
 */
export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

interface TextItem {
	fill: string // 填充颜色
	stroke?: string // 描边颜色
	strokeWidth?: number // 描边宽度
	textBackgroundColor?: string // 背景颜色
}

/**
 * 计算文本样式
 * @param item
 * @returns
 */
export function calcTextStyle(item: TextItem) {
	const style = {
		color: item.fill,
		textShadow: '',
		backgroundColor: '',
	}
	const strokeWidth = item.strokeWidth || 2
	const strokeColor = item.stroke
	if (strokeColor) {
		style.textShadow = `-${strokeWidth}px -${strokeWidth}px ${strokeColor}, ${strokeWidth}px -${strokeWidth}px ${strokeColor}, -${strokeWidth}px ${strokeWidth}px ${strokeColor}, ${strokeWidth}px ${strokeWidth}px ${strokeColor}`
	}
	const backgroundColor = item.textBackgroundColor
	if (backgroundColor) {
		style.backgroundColor = backgroundColor
	}
	return style
}

interface TextOptions {
	text: string
	fontSize: number
	fontFamily?: string
}
/**
 * 获取文本的宽高
 * @param text
 * @param fontSize
 * @param fontFamily
 * @returns
 */
export function getTextRect({
	text = 'Hello World',
	fontSize = 40,
	fontFamily = 'Arial',
}: TextOptions) {
	const padding = 4
	const canvas = new OffscreenCanvas(1000, 1000)
	const ctx = canvas.getContext('2d')

	if (!ctx) {
		throw new Error('Canvas 2D context is not supported')
	}

	const lines = text.split('\n')
	ctx.font = `${fontSize}px ${fontFamily}`
	const lineHeight = fontSize * 1.2 // Adjust line height as needed

	// 测量文本宽度且取最大值
	const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width))
	// 计算文本总高度
	const totalHeight = lines.length * lineHeight

	return {
		width: textWidth + padding * 2,
		height: totalHeight + padding * 2,
		lineHeight,
		lines,
	}
}
