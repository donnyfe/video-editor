import * as childProcess from 'child_process'

// 基础部署类
export class BaseDeploy {
	constructor() {
		this.log = this.initLogger()
	}

	initLogger() {
		return {
			info: msg => console.log(`[INFO] ${msg}`),
			error: msg => console.error(`[ERROR] ${msg}`),
			success: msg => console.log(`[SUCCESS] ${msg}`)
		}
	}
	/**
	 * 执行命令语句
	 * @param {*} command
	 * @returns
	 */
	async execCommand(command) {
		return new Promise((resolve, reject) => {
			let stdout = ''
			let stderr = ''

			const pro = childProcess.exec(command, err => {
				if (err) reject(err)
			})

			pro.stdout?.on('data', data => {
				stdout += data
				process.stdout.write(data)
			})

			pro.stderr?.on('data', data => {
				stderr += data
				process.stderr.write(data)
			})

			pro.on('exit', code => {
				if (code === 0) {
					resolve({ stdout, stderr })
				} else {
					reject(new Error(`命令执行失败,退出码: ${code}`))
				}
			})
		})
	}
	/**
	 * 执行shell脚本
	 */
	async runShell(shell) {
		return new Promise((resolve, reject) => {
			try {
				this.client.shell((err, stream) => {
					if (err) {
						this.log.error('shell执行失败')
						return reject(err)
					}

					stream
						.on('data', data => {
							this.log.info(`Shell输出: ${data.toString()}`)
						})
						.on('close', () => {
							this.log.info('Shell已关闭')
							this.client.end()
							// 使用0表示正常退出, 优雅退出
							process.exit(0)
						})
						.on('error', err => {
							this.log.error('Shell执行错误')
							// 使用非0状态码，错误退出
							process.exit(1)
						})
						.end(shell.join('\n'))
				})
			} catch (err) {
				this.log.error(`shell执行失败: ${err.message}`)
				process.exit(1)
			}
		})
	}
}
