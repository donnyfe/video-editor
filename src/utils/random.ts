/**
 * 生成随机字符串
 * @param randomFlag 是否随机
 * @param min 最小长度
 * @param max 最大长度
 * @returns 随机字符串
 */
export function randomKey(randomFlag: boolean, min: number, max: number): string {
	let str = '',
		range = min

	const arr: string[] = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

	// 随机产生
	if (randomFlag) {
		range = Math.round(Math.random() * (max - min)) + min
	}
	for (let i = 0; i < range; i++) {
		const pos = Math.round(Math.random() * (arr.length - 1))
		str += arr[pos]
	}
	return str
}

/**
 *  获取随机ID，组件拖到预览视图后就会被设置个ID
 * */
export function getId(prefix = 't') {
	return `${prefix ? `${prefix}-` : ''}${getRandom(5)}${getRandom(3)}-${getRandom(4)}`
}

// 生成 16 进制指定长度的字符串
function getRandom(len: number) {
	return Math.floor((1 + Math.random()) * 16 ** len)
		.toString(16)
		.substring(1)
}
