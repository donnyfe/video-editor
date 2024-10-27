export function isVideo(type: string) {
	return type === 'video'
}

// 封装json格式化, 避免error
export function getJsonParse(jsonStr: string): any {
	let res = ''
	try {
		res = JSON.parse(jsonStr)
	} catch (error) {
		res = ''
		console.error(error)
	}
	return res
}
