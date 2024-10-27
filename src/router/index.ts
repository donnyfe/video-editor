import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../views/editor.vue'),
		},
	],
})

router.beforeEach((to, from, next) => {
	// 触发加载动画
	document.body.classList.add('page-loading')
	next()
})

router.afterEach(() => {
	// 页面加载完成后,移除加载动画
	setTimeout(() => {
		document.body.classList.remove('page-loading')
	}, 1000) // 给一个短暂的延迟,确保页面内容已经渲染
})

export default router
