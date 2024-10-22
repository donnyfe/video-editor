import { VideoTrack } from '@/classes/VideoTrack'
import { AudioTrack } from '@/classes'
import { getTextRect } from './text'
import type { Resource, TrackListItem, Size } from '@/types'

/**
 * 检查 checkItem 是否与当前 trackList 存在帧重叠部分
 * */
export function checkTrackItemOverlap(trackList: any[], checkItem: any) {
	const { start: insertStart, end: insertEnd } = checkItem
	let overLapIndex = -1
	let insertIndex = 0
	const hasOverlap = trackList
		.filter((item) => item.id !== checkItem.id)
		.some((trackItem, index) => {
			const { start, end } = trackItem
			/**
			 * 判断是否重叠：
			 * 1. 落点在节点内部，重叠:start < insertStart < end || start < insertEnd < end
			 * 2. 落点在节点外，但是落点在两边，重叠:start >= insertStart && end <= insertEnd
			 */
			if (
				(start < insertStart && insertStart < end) ||
				(start < insertEnd && insertEnd < end) ||
				(start >= insertStart && end <= insertEnd)
			) {
				overLapIndex = index
				return true
			} else {
				if (end <= insertStart) {
					insertIndex = index + 1
				}
				return false
			}
		})
	return {
		hasOverlap,
		overLapIndex,
		insertIndex,
	}
}

type TypeGuard<T> = (value: unknown) => value is T

export function isOfCanPlayType(value: unknown): value is VideoTrack | AudioTrack {
	return value instanceof VideoTrack || value instanceof AudioTrack
}

export const getCurrentTrackItemList = <T>(
	trackList: TrackListItem[],
	currentFrame: number,
	isOfType: TypeGuard<T>,
): T[] => {
	const trackItems: T[] = []
	trackList.forEach(({ list }) => {
		list.forEach((trackItem) => {
			const { start, end } = trackItem
			if (start <= currentFrame && end >= currentFrame && isOfType(trackItem)) {
				trackItems.push(trackItem)
			}
		})
	})
	return trackItems
}

/**
 * 检查 checkItem 是否与当前 trackList 存在帧重叠部分
 * 返回值：
 * 1. 是否重叠
 * 2. 重叠的index
 * 3. 插入的index
 */
export function checkTrackListOverlap(trackList: Resource[], checkItem: Resource, moveIndex = -1) {
	const { start: insertStart, end: insertEnd } = checkItem
	let overLapIndex = -1
	let insertIndex = 0

	const hasOverlap = trackList.some((trackItem, index) => {
		// 行内移动情况下忽略掉移动元素
		if (moveIndex !== -1 && index === moveIndex) {
			return false
		}
		const { start, end } = trackItem
		// 当前列表中元素 开始帧处于新元素内部，或结束帧处于新元素内部，则视为重叠
		if (
			(start <= insertStart && end >= insertEnd) || // 添加节点的开始和结束位置位于老节点外 或 两端相等
			(start >= insertStart && start < insertEnd) || // 老节点开始位置在添加节点内部
			(end > insertStart && end <= insertEnd) // 老节点结束位置在添加节点内部
		) {
			overLapIndex = index
			return true
		} else {
			if (end <= insertStart) {
				insertIndex = index + 1
			}
			return false
		}
	})
	return {
		hasOverlap,
		overLapIndex,
		insertIndex,
	}
}

/**
 * 计算轨道元素属性
 * @param trackItem
 * @param canvasSize
 * @returns
 */
export function calcTrackItemAttr(trackItem: Record<string, any>, canvasSize: Size) {
	const {
		width: sourceWidth,
		height: sourceHeight,
		type,
		text = '默认文本',
		fontSize = 40,
		style,
	} = trackItem
	const { width: playerW, height: playerH } = canvasSize
	let defaultW = playerW
	let defaultH = playerH
	if (['image', 'video'].includes(type)) {
		const proportionalW = Math.floor((playerH / sourceHeight) * sourceWidth) // 等高宽度
		const proportionalH = Math.floor((playerW / sourceWidth) * sourceHeight) // 等宽高度
		// 默认渲染位置
		if (proportionalW > playerW) {
			// 等高场景下宽度溢出，则采用等宽， 高度上下留白
			defaultH = proportionalH
		} else if (proportionalH > playerH) {
			// 等宽场景下高度溢出，则采用等高， 宽度左右留白
			defaultW = proportionalW
		}

		if (sourceHeight < defaultH && sourceWidth < defaultW) {
			defaultW = sourceWidth
			defaultH = sourceHeight
		}
	}

	if (type === 'text') {
		const rect = getTextRect({ text, fontSize })
		if (rect) {
			defaultW = rect.width
			defaultH = rect.height
		}
	}
	return {
		width: defaultW,
		height: defaultH,
		centerX: 0,
		centerY: 0,
		scale: 100,
		drawWidth: defaultW,
		drawHeight: defaultH,
		text,
		fontSize,
		// color: style.fill,
		style,
	}
}

/**
 * 计算元素的显示区域
 * @param trackItem
 * @param canvasSize
 * @param trackAttr
 * @returns
 */
export function computedItemShowArea(
	trackItem: Record<string, any>,
	canvasSize: { width: number; height: number },
	trackAttr: Record<string, any>,
) {
	const { left = 0, top = 0, scale = 100, text, fontSize } = trackAttr
	const { width, height, type } = trackItem
	const { width: playerW, height: playerH } = canvasSize
	let defaultW = playerW
	let defaultH = playerH
	if (type === 'video') {
		const proportionalW = Math.floor((playerH / height) * width) // 等高宽度
		const proportionalH = Math.floor((playerW / width) * height) // 等宽高度
		// 默认渲染位置
		if (proportionalW > playerW) {
			// 等高场景下宽度溢出，则采用等宽， 高度上下留白
			defaultH = proportionalH
		} else if (proportionalH > playerH) {
			// 等宽场景下高度溢出，则采用等高， 宽度左右留白
			defaultW = proportionalW
		}
	}
	if (type === 'image') {
		defaultW = width
		defaultH = width
	}
	if (type === 'text') {
		defaultW = text.length * fontSize
		defaultH = fontSize * 1.2
	}
	// 由默认位置计算偏移缩放位置
	const scaleW = Math.floor((defaultW * scale) / 100)
	const scaleH = Math.floor((defaultH * scale) / 100)
	const scaleL = Math.floor(left + (defaultW - scaleW) / 2)
	const scaleT = Math.floor(top + (defaultH - scaleH) / 2)
	const diffW = Math.floor(playerW - scaleW)
	const diffH = Math.floor(playerH - scaleH)

	return {
		drawL: scaleL,
		drawT: scaleT,
		drawW: scaleW,
		drawH: scaleH,
		sourceWidth: width,
		sourceHeight: height,
		defaultW,
		defaultH,
		diffW,
		diffH,
	}
}
