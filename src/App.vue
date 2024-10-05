<template>
	<div class="w-full h-full flex flex-col">
		<ElConfigProvider
			:size="state.size"
			:z-index="state.zIndex">
			<RouterView />
		</ElConfigProvider>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
// import { useDark, useToggle } from '@vueuse/core'

// const isDark = useDark()
// useToggle(isDark)


const state = reactive({
	zIndex: 3000,
	size: 'small'
})
</script>
