import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Unocss from 'unocss/vite'


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), vueJsx(), Unocss(), vueDevTools()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},

	build: {
		sourcemap: false,
		rollupOptions: {
			output: {
				// 分包策略
				manualChunks: {
					// 将 Vue 相关库打包到 vue.js
					'chunk-vue': ['vue', 'vue-router', 'pinia'],
					// 将 Element Plus 单独打包
					'chunk-element': ['element-plus'],
					// 工具库打包到 utils.js
					'chunk-utils': ['lodash-es', '@vueuse/core'],
				},
				// 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
				chunkFileNames: 'assets/js/[name]-[hash].js',
				// 用于输出静态资源的命名，[ext]表示文件扩展名
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
				// 拆分js到模块文件夹
				entryFileNames: 'assets/js/[name]-[hash].js',
			},
		},
		// 设置最大超过多少才打包
		chunkSizeWarningLimit: 500,
	},
})
