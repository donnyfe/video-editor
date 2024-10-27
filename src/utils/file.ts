import { file as opfsFile, write } from 'opfs-tools'

/**
 * 将字节数格式化为文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number) {
	if (bytes === 0) {
		return '0 B'
	}
	const k = 1024
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	return `${parseFloat((bytes / k ** i).toFixed(2))} ${units[i]}`
}

/**
 * 比较文件大小，第一个参数为文件大小，为纯数字，第二个参数为目标大小，是一个数字+单位的字符串，如'1MB'
 * @param size
 * @param target
 */
export const compareSize = (size: number, target: string): boolean => {
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	const i = sizes.findIndex((item) => item === target.replace(/\d+/, ''))
	return size > parseInt(target) * k ** i
}

/**
 * 将数据流写入opfs
 * opfs-tools 方案，部署线上需要https环境
 */
export async function writeFile(id: string, stream?: ReadableStream<Uint8Array>) {
	if (!stream) {
		// 没有数据流，尝试从opfs中获取
		stream = await opfsFile(id).stream()
		if (!stream) {
			throw new Error('stream is not ready')
		}
	}

	// 如果opfs中没有数据则存储
	if (!(await opfsFile(id).exists())) {
		console.time('opfs存储文件耗时')
		await write(id, stream)
		console.timeEnd('opfs存储文件耗时')

		console.time('opfs读取文件耗时')
		stream = await opfsFile(id).stream()
		console.timeEnd('opfs读取文件耗时')
	}
	return stream
}

/**
 *
 * 备注：使用 Web Streams API方案 将文件数据流写入内存中，缺点：占用内存
 */
export const writeFileByBlob = async (id: string, stream?: ReadableStream<Uint8Array>) => {
	if (!stream) {
		throw new Error('stream is not ready')
	}

	const chunks: Uint8Array[] = []
	const reader = stream.getReader()

	while (true) {
		const { done, value } = await reader.read()
		if (done) {
			break
		}
		chunks.push(value)
	}

	// 合并所有数据块
	const blob = new Blob(chunks)
	return blob.stream()
}

/**
 * 创建文件写入器
 * @param extName 文件扩展名
 * @returns 文件写入器
 *
 * 说明：
 * window.showSaveFilePicker() 用于显示一个文件选择器,允许用户保存文件。用户可以选择一个现有文件或输入一个新文件名.
 * 1. 它是一个实验性的API,目前仅在支持File System Access API的浏览器中可用。
	 2. 它返回一个Promise,该Promise的fulfillment处理程序接收一个FileSystemFileHandle对象。
	 3. 它需要在安全上下文(HTTPS)中使用
 */
export async function createFileWriter(extName = 'mp4'): Promise<FileSystemWritableFileStream> {
	if ('showSaveFilePicker' in window) {
		const fileHandle = await window.showSaveFilePicker({
			suggestedName: `WebAV-export-${Date.now()}.${extName}`,
		})
		return fileHandle.createWritable()
	} else {
		throw new Error('showSaveFilePicker is not supported')
	}
}

interface FileUploadOptions {
	accept: string
	multiple: boolean
	max?: string
}

/**
 * 选择文件
 * @param options 文件上传选项
 * @returns 选择的文件列表
 */
export const selectFile = (options: FileUploadOptions): Promise<File[]> => {
	return new Promise((resolve, reject) => {
		// 创建input[file]元素
		const input = document.createElement('input')
		input.setAttribute('type', 'file')
		input.setAttribute('accept', options.accept)
		// 是否支持多选
		if (options.multiple) {
			input.setAttribute('multiple', 'multiple')
		} else {
			input.removeAttribute('multiple')
		}
		// 绑定事件
		input.onchange = function () {
			let files = Array.from((this as any).files)
			// 获取文件列表
			if (files) {
				const length = files.length
				files = files.filter((file) => {
					if (options.max) {
						return !compareSize((file as File).size, options.max)
					} else {
						return true
					}
				})
				if (files && files.length > 0) {
					if (length !== files.length) {
						// message.warning(`已过滤上传文件中大小大于${options.max}的文件`);
					}
					resolve(files as File[])
				} else {
					// message.warning(`上传文件大小不能大于${options.max}`);
					reject(new Error(`上传文件大小不能大于${options.max}`))
				}
			} else {
				reject(new Error('No files selected'))
			}
		}

		input.oncancel = function () {
			reject(new Error('No files selected'))
		}
		input.click()
	})
}

/**
 * 获取资源类型
 * @param url 资源URL
 * @returns 资源类型
 */
export async function getResourceTypeByResponse(url: string) {
	try {
		const response = await fetch(url)
		const contentType = response.headers.get('Content-Type')
		return contentType || null // 如果没有 Content-Type 头，返回null
	} catch (error) {
		console.error('Error fetching image type:', error)
		return null
	}
}

/**
 * 下载文件
 * @param url 文件URL
 * @param fileName 文件名
 */
export function downloadFileUrl(href: string, fileName: string) {
	const link = document.createElement('a')
	link.href = href
	link.download = fileName // 下载后文件名
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	window.URL.revokeObjectURL(href) // 释放掉blob对象
	link.href = ''
}

/**
 * 将文件转换为DataURL
 * @param file 要转换的文件
 * @returns 转换后的DataURL
 */
export const fileAsDataUrl = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			resolve(reader.result as string)
		}
		reader.onerror = () => {
			reject(reader.error)
		}
		reader.readAsDataURL(file)
	})
}

/**
 * 将 Blob 转换为 File 对象
 * @param blob 要转换的 Blob 对象
 * @param fileName 文件名
 * @returns 转换后的 File 对象
 */
export function blobToFile(blob: Blob, fileName: string) {
	return new File([blob], fileName, { type: blob.type })
}

/**
 * 将Base64数据转换为Blob对象
 * @param base64Data Base64编码的数据字符串
 * @param contentType 内容类型
 * @returns Blob对象
 */
export function base64ToBlob(base64Data: string, contentType = ''): Blob {
	const byteCharacters = atob(base64Data)
	const byteArrays = new Uint8Array(byteCharacters.length)

	for (let i = 0; i < byteCharacters.length; i++) {
		byteArrays[i] = byteCharacters.charCodeAt(i)
	}

	return new Blob([byteArrays], { type: contentType })
}

// // 将Base64数据转换为Blob对象
// export function base64ToBlob(base64Data: string, contentType: string) {
// 	contentType = contentType || ''
// 	const sliceSize = 1024
// 	const byteCharacters = atob(base64Data)
// 	const byteArrays = []

// 	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
// 		const slice = byteCharacters.slice(offset, offset + sliceSize)
// 		const byteNumbers = new Array(slice.length)
// 		for (let i = 0; i < slice.length; i++) {
// 			byteNumbers[i] = slice.charCodeAt(i)
// 		}

// 		const byteArray = new Uint8Array(byteNumbers)
// 		byteArrays.push(byteArray)
// 	}
// 	return new Blob(byteArrays, { type: contentType })
// }
