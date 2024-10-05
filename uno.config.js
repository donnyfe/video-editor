import { defineConfig, presetAttributify, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
	presets: [presetUno(), presetAttributify()],
	transformers: [transformerDirectives()],
	theme: {
		colors: {
			primary: 'var(--el-color-primary)',
			background: 'var(--el-bg-color)',
			border: 'var(--el-border-color)',
			text: 'var(--el-text-color-primary)',
		},
	},
	shortcuts: {
		'wh-full': 'w-full h-full',
		center: 'flex items-center justify-center',
		'flex-center': 'flex flex-row items-center',
		'flex-between': 'flex flex-row items-center justify-between',
		// element plus
		'el-theme-bg': 'bg-[var(--el-bg-color)]',
		'el-theme-text': 'color-[var(--el-text-color-primary)]',
		'el-theme-border': 'border-[var(--el-border-color)]',
		'el-theme':
			'bg-[var(--el-bg-color)] color-[var(--el-text-color-primary)] border-[var(--el-border-color)]',
	},
})
