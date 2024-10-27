<template>
	<div
		class="loading absolute top-0 left-0 right-0 bottom-0 bg-gray-600 flex flex-row justify-start items-center"
	>
		<span />
		<span />
		<span />
		<span />
		<span />
	</div>
</template>

<style lang="scss" scoped>
	.loading span {
		@apply inline-block w-2 h-full rounded opacity-70;
		animation: load 1s ease infinite;
		-webkit-animation: load 1s ease infinite;
	}

	@keyframes load {
		0%,
		100% {
			height: 12px;
			background: #fef3c7;
		}

		50% {
			height: 30px;
			margin: -15px 0;
			background: #fcd34d;
		}

		100% {
			height: 16px;
			background: #f59e0b;
		}
	}

	.loading span:nth-child(2) {
		-webkit-animation-delay: 0.2s;
		animation-delay: 0.2s;
	}

	.loading span:nth-child(3) {
		-webkit-animation-delay: 0.4s;
		animation-delay: 0.4s;
	}

	.loading span:nth-child(4) {
		-webkit-animation-delay: 0.6s;
		animation-delay: 0.6s;
	}

	.loading span:nth-child(5) {
		-webkit-animation-delay: 0.8s;
		animation-delay: 0.8s;
	}
</style>
