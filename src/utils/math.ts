/**
 * 均匀采样
 * @param array
 * @param m
 * @returns
 */
export function getUniformSubarray(array: string[], m: number) {
	// 计算采样间隔
	const interval = array.length / m

	// 使用顺序采样的方法选取元素
	const subarray = []
	for (let i = 0; i < array.length && subarray.length < m; i += interval) {
		// 只有当元素数量还没有达到m时，才添加元素
		subarray.push(array[Math.min(Math.round(i), array.length - 1)])
	}
	return subarray
}
