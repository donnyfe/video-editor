import globals from 'globals'
import eslintJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
	eslintJs.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs['flat/essential'],

	// 指定文件匹配模式
	{ files: ['**/*.{js,mjs,cjs,ts,vue}'] },

	/** 配置全局变量 */
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				/** custom */
				// ...
			},
		},
	},

	/** vue 配置 */
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				parser: tseslint.parser,
				ecmaFeatures: {
					jsx: true,
					tsx: true,
				},
			},
		},
		/** @link https://eslint.vuejs.org/rules/ */
		rules: {
			'vue/max-attributes-per-line': [
				'error',
				{
					singleline: { max: 2 },
					multiline: { max: 1 },
				},
			],

			'vue/html-closing-bracket-spacing': [
				'error',
				{
					startTag: 'never',
					endTag: 'never',
					selfClosingTag: 'always',
				},
			],
			// 添加 Sass 相关规则
			'vue/style-compiler-options': [
				'error',
				{
					sass: {
						// 使用新的 JavaScript API
						implementation: 'sass',
					},
				},
			],
			'vue/no-async-in-computed-properties': 'error',
			'vue/no-extra-parens': ['error', 'all'],
			'vue/multiline-ternary': ['error', 'always-multiline'],
			// 关闭操作符换行规则的检查。默认ESLint会要求你在操作符前后换行，配置项可关闭这种检查。
			'vue/operator-linebreak': 'off',
			// 关闭单行 HTML 元素内容新行的规则。默认情况下，ESLint 可能会要求在单行 HTML 元素的内容后面有新行，这个配置项可以关闭这种要求。
			'vue/singleline-html-element-content-newline': 'off',
			// 关闭组件名称必须是多单词的规则。默认情况下，ESLint 可能会要求组件名称由多个单词组成，这个配置项允许单词少于两个的组件名称。
			'vue/multi-word-component-names': 'off',
			// 关闭对 `v-model` 参数使用的规则。默认情况下，ESLint 可能会对 `v-model` 的参数使用进行检查，这个配置项可以关闭这种检查。
			'vue/no-v-model-argument': 'off',
			// 关闭要求组件 `prop` 必须有默认值的规则。默认情况下，ESLint 可能会要求每个 `prop` 都有一个默认值，这个配置项允许没有默认值的 `prop`。
			'vue/require-default-prop': 'off',
			// 关闭要求组件 `prop` 必须有类型定义的规则。默认情况下，ESLint 可能会要求每个 `prop` 都有一个类型定义，这个配置项允许没有类型定义的 `prop`。
			'vue/require-prop-types': 'off',
			// 关闭 HTML 自闭合标签规则的检查。默认情况下，ESLint 可能会要求 HTML 标签自闭合的风格，这个配置项可以关闭这种检查。
			'vue/html-self-closing': 'off',
			// 关闭属性名引号使用规则的检查。默认情况下，ESLint 可能会要求在对象属性名周围使用引号，这个配置项可以关闭这种检查。
			'vue/quote-props': 'off',
			// 关闭检查不规则空白字符的规则。默认情况下，ESLint 可能会检查代码中是否有不规则的空白字符，这个配置项可以关闭这种检查。
			'vue/no-irregular-whitespace': 'off',
			// 关闭 `prop` 名称大小写规则的检查。默认情况下，ESLint 可能会要求 `prop` 名称遵循特定的大小写规则，这个配置项可以关闭这种要求。
			'vue/prop-name-casing': 'off',
			// HTML 缩进规则检查。默认情况下，ESLint 可能会要求 HTML 标签按照特定的缩进方式对齐，这个配置项可以关闭这种检查。
			'vue/html-indent': ['error', 'tab'],
			// 关闭对保留组件名称的检查。默认情况下，ESLint 可能会禁止使用某些保留的组件名称，这个配置项允许使用这些名称。
			'vue/no-reserved-component-names': 'off',
		},
	},

	/** typescript 配置 */
	{
		files: ['**/*.ts', '**/*.vue'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: tseslint.parser,
		},
		/** @link https://typescript-eslint.io/rules/ */
		rules: {
			// 允许any类型
			'@typescript-eslint/no-explicit-any': 'off',
			// 允许未使用的表达式
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-async-promise-executor': 'off',
		},
	},

	/** 自定义规则 */
	{
		rules: {
			// 缩进使用
			indent: ['error', 'tab'],
			// 使用单引号
			quotes: ['error', 'single'],
			// 不使用分号结尾
			semi: ['error', 'never'],
			// 比较的时候使用严格等于
			eqeqeq: ['error', 'smart'],
			// 强制使用花括号的风格
			curly: ['error', 'all'],
			// 换行符
			'linebreak-style': ['off', 'lf'],
			// 要求 switch 语句中有 default 分支
			'default-case': 'off',
			// switch 冒号后要有空格
			'switch-colon-spacing': ['error', { before: false, after: true }],
			// 大括号风格 ["error", "1tbs"]
			'brace-style': ['error', '1tbs', { allowSingleLine: true }],
			// 对象中不允许出现重复的键
			'no-dupe-keys': 'error',
			// 禁止稀疏数组， [1,,2]
			'no-sparse-arrays': 'error',
			// 不允许出现空的代码块
			'no-empty': 'error',
			// 将变量声明放在合适的代码块里
			'block-scoped-var': 'error',
			// 不允许自身比较
			'no-self-compare': 'error',
			// 空行最多不能超过两行
			'no-multiple-empty-lines': ['error', { max: 2 }],
			// 禁止修改const声明的变量
			'no-const-assign': 'error',
			// 禁止重复声明变量
			'no-redeclare': 'error',
			// 禁止重复的函数声明
			'no-func-assign': 'error',
			// 外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
			'no-shadow': 'error',
			// 空格
			// 操作符周围的空格
			'space-infix-ops': ['error', { int32Hint: true }],
			// 函数定义时括号前的空格
			'space-before-function-paren': [
				'off',
				{ anonymous: 'never', named: 'never', asyncArrow: 'always' },
			],
			// 在块语句之前始终有一个空格
			'space-before-blocks': ['error', 'always'],
			// 要求模板字符串中的嵌入表达式周围空格的使用
			'template-curly-spacing': ['off', 'never'],
			// 对象字面量中冒号的前后空格
			'key-spacing': ['error', { beforeColon: false, afterColon: true }],
			// 数组内前后要求有空格
			'array-bracket-spacing': ['off', 'always'],
			// 对象内前后要求有空格
			'object-curly-spacing': ['error', 'always'],
			// 前头=> 前后都有空格
			'arrow-spacing': ['error', { before: true, after: true }],
			// 要求同一行内逗号后面有空格
			'comma-spacing': ['error', { before: false, after: true }],
			// 关键字前后的空格
			'keyword-spacing': 'error',
			// 一行最后不允许有空格
			'no-trailing-spaces': 'error',
			// 不允许出现多余的空格
			'no-multi-spaces': 'error',
		},
	},
	// 定义忽略内容
	{
		ignores: [
			'**/node_modules/**/*',
			'**/dist/**/*',
			'**/types/**/*.d.ts',
			'.vscode',
			'.husky',
			'yarn.lock',
			'package-lock.json',
			'deploy.js',
		],
	},
]
