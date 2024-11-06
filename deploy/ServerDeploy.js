import { Client } from 'ssh2'
import * as fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { BaseDeploy } from './BaseDeploy.js'

// 服务器部署类
export class ServerDeploy extends BaseDeploy {
	constructor(options) {
		super()
		this.options = options
		this.client = new Client()
	}

	async deploy() {
		try {
			await this.compression()
			await this.uploadToServer()
		} finally {
			this.client?.end()
		}
	}

	async compression() {
		this.log.info('正在压缩代码包...')
		await this.execCommand('tar zcvf dist.tar.gz dist')
		this.log.success('代码包压缩成功!')
	}

	async uploadToServer() {
		try {
			this.log.info('开始部署服务器...')
			await this.connect(async () => {
				await this.upload()
				await this.runShell(this.options.shell)
			})
		} catch (error) {
			this.log.error(`部署失败: ${error}`)
			throw error
		}
	}

	/**
	 * 连接服务器
	 */
	async connect(excutor) {
		this.log.info('正在连接远程服务器……')
		return new Promise((resolve, reject) => {
			// 连接ssh上传
			this.client.connect(this.options.ssh).on('ready', async () => {
				this.log.info('SSH2连接成功!')

				await excutor(this.client)
				resolve()
			})
		})
	}

	/**
	 * 上传资源文件
	 */
	async upload() {
		return new Promise((resolve, reject) => {
			// 建立sftp连接
			this.client.sftp(async (err, sftp) => {
				if (err) {
					this.log.error('SFTP连接失败')
					return reject(err)
				}

				const { files, rootPath } = this.options

				try {
					// 使用Promise.all并行处理所有文件上传
					await Promise.all(
						files.map(async file => {
							const filePath = path.join(
								path.resolve(dirname(fileURLToPath(import.meta.url)), '..'),
								file
							)

							// 检查文件是否存在
							if (!(await fs.stat(filePath)).isFile()) {
								throw new Error(`本地文件不存在: ${filePath}`)
							}

							this.log.info(`本地路径: ${filePath}`)

							const remotePath = path.join(rootPath, file)
							this.log.info(`远程路径: ${remotePath}`)

							// 上传单个文件
							await this.uploadFile(sftp, filePath, remotePath)
						})
					)

					resolve()
				} catch (error) {
					reject(error)
				}
			})
		})
	}

	// 抽取单个文件上传逻辑为独立方法
	async uploadFile(sftp, localPath, remotePath) {
		return new Promise((resolve, reject) => {
			const startTime = Date.now()
			const fileName = path.basename(localPath)

			sftp.fastPut(
				localPath,
				remotePath,
				{
					step: (transferred, chunk, total) => {
						const percent = Math.round((transferred / total) * 100)
						this.log.info(`${fileName} 上传进度: ${percent}%`)
					}
				},
				err => {
					if (err) {
						this.log.error(`文件 ${fileName} 上传失败`)
						return reject(err)
					}
					const duration = ((Date.now() - startTime) / 1000).toFixed(2)
					this.log.success(`文件 ${fileName} 上传成功! 耗时${duration}秒`)
					resolve()
				}
			)
		})
	}
}
