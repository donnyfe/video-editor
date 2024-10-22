import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

export const useGlobalStore = defineStore('globalStore', () => {
	// 页面标题
	const pageTitle = ref('VideoEditor')

	const isDark = useDark()
	// 初始化暗黑模式
	isDark.value = localStorage.isDark === undefined ? true : JSON.parse(localStorage.isDark)

	// 激活的资源类型
	const activeResourceType = ref(localStorage.activeResourceType || 'video')
	// 显示菜单面板
	const showMenuPanel = ref(JSON.parse(localStorage.showMenuPanel || true))
	// 属性面板款度
	const propsPanelWidth = ref(parseInt(localStorage.propsPanelWidth || 320))
	// 控制面板高度
	const controlsPanelHeight = ref(parseInt(localStorage.controlsPanelHeight || 380))

	watchEffect(() => {
		localStorage.isDark = isDark.value
		localStorage.showMenuPanel = showMenuPanel.value
		localStorage.propsPanelWidth = propsPanelWidth.value
		localStorage.controlsPanelHeight = controlsPanelHeight.value
	})

	return {
		isDark,
		pageTitle,
		propsPanelWidth,
		controlsPanelHeight,
		showMenuPanel,
		activeResourceType,
	}
})
