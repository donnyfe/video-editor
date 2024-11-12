import { BaseDeploy } from './BaseDeploy.js'
// NPM部署类
export class NpmDeploy extends BaseDeploy {
	constructor(options) {
		super()
		this.options = options
	}

	async deploy() {
		const isLogin = await this.checkNpmLogin()
		if (!isLogin) {
			await this.login()
		}
		await this.publish()
	}

	/**
	 * 检测NPM登录
	 */
	async checkNpmLogin() {
		const { publishRegistry } = this.options
		await this.execCommand(`npm config set registry=${publishRegistry}`)

		this.log.info(`当前源: ${publishRegistry}`)
		try {
			this.log.info('正在检查npm登录状态，过程可能比较缓慢，请稍后...')
			const { stdout } = await this.execCommand('npm whoami')
			return stdout.trim() !== ''
		} catch (error) {
			return false
		}
	}

	async login() {
		this.log.info('请登录npm...')
		await this.execCommand('npm login')
	}

	async publish() {
		const { defaultRegistry, publishScope } = this.options
		try {
			this.log.info('开始发布npm包...')
			const publishCmd = publishScope ? `npm publish --access ${publishScope}` : 'npm publish'
			await this.execCommand(publishCmd)
			await this.execCommand(`npm config set registry=${defaultRegistry}`)
			this.log.success('npm包发布成功!')
		} catch (error) {
			this.log.error(`npm包发布失败: ${error}`)
			throw error
		}
	}
}
