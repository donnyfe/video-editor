import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('globalStore', () => {
	// 页面标题
	const pageTitle = ref('VideoEditor')
	// 主题
	const isDark = ref(Boolean(localStorage.theme) || true)
	// 菜单面板
	const showMenuPanel = ref(true)

	watchEffect(() => {
		localStorage.theme = isDark.value ? 'true' : 'false'
		localStorage.showMenuPanel = showMenuPanel.value ? 'true' : 'false'
		document.documentElement.classList[isDark.value ? 'add' : 'remove']('dark')
	})

	// 面板宽高
	const propsPanelWidth = ref(+localStorage.propsPanelWidth || 320)
	const controlsPanelHeight = ref(+localStorage.controlsPanelHeight || 380)

	watchEffect(() => {
		localStorage.propsPanelWidth = propsPanelWidth.value
		localStorage.controlsPanelHeight = controlsPanelHeight.value
	})

	return {
		pageTitle,
		isDark,
		propsPanelWidth,
		controlsPanelHeight,
		showMenuPanel,
	}
})
