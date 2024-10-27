class MD5Worker {
	private static instance: MD5Worker
	private worker: Worker

	private constructor() {
		this.worker = new Worker(new URL('../md5.worker.js', import.meta.url), { type: 'module' })
	}

	public static getInstance(): MD5Worker {
		if (!MD5Worker.instance) {
			MD5Worker.instance = new MD5Worker()
		}
		return MD5Worker.instance
	}

	public getFileMD5(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			this.worker.onmessage = (e) => {
				if (e.data.md5) {
					resolve(e.data.md5)
				} else if (e.data.error) {
					reject(new Error(e.data.error))
				}
			}

			this.worker.postMessage({ file })
		})
	}
}

export default MD5Worker
