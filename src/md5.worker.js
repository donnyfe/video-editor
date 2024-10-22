import SparkMD5 from 'spark-md5'

self.onmessage = function (e) {
	const file = e.data.file
	const chunkSize = 2097152 // 读取2MB的块
	const spark = new SparkMD5.ArrayBuffer()
	const fileReader = new FileReader()
	let currentChunk = 0
	const chunks = Math.ceil(file.size / chunkSize)

	fileReader.onload = function (event) {
		spark.append(event.target.result)
		currentChunk++

		if (currentChunk < chunks) {
			loadNext()
		} else {
			const md5 = spark.end()
			self.postMessage({ md5 })
		}
	}

	fileReader.onerror = function () {
		self.postMessage({ error: 'MD5计算失败' })
	}

	function loadNext() {
		const start = currentChunk * chunkSize
		const end = start + chunkSize >= file.size ? file.size : start + chunkSize
		fileReader.readAsArrayBuffer(file.slice(start, end))
	}

	loadNext()
}
