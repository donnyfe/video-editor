<script setup lang="ts">
import { ref } from 'vue'
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { formattedDuration } from '@/utils/time'

const currentAudioIndex = ref(0)
const audioList = ref([
	{
		title: '极速电流',
		coverUrl:
			'https://p26.douyinpic.com/aweme/100x100/tos-cn-v-2774c002/cc768f316eb0488681cc0cc959e3d503.jpeg',
		duration: 22,
	},
	{
		title: '舞动旋律',
		coverUrl:
			'https://p3.douyinpic.com/aweme/100x100/tos-cn-v-2774c002/fdaebf8c103d4c0faa08f338c79a4768.jpeg',
		duration: 45,
	},
	{
		title: 'Country Melody',
		coverUrl:
			'https://p3.douyinpic.com/aweme/100x100/tos-cn-v-2774c002/bc864a3f36fa4c08bf6b9faf6709e201.jpeg',
		duration: 67,
	},
	{
		title: '乡村旋律',
		coverUrl:
			'https://p3.douyinpic.com/aweme/100x100/tos-cn-v-2774c002/4ffd87447d404a3caa141ea887b71c1d.jpeg',
		duration: 67,
	},
	{
		title: 'DTDTDT',
		coverUrl:
			'https://p3.douyinpic.com/aweme/100x100/tos-cn-v-2774c002/32aecfb9aca34a96809bd7b0cd397c68.jpeg',
		duration: 50,
	},
	{
		title: 'Celebration video Music',
		coverUrl:
			'https://p26.douyinpic.com/aweme/100x100/tos-cn-v-2774c002/03d302d373cc47f191279f7874ab4fc1.jpeg',
		duration: 17,
	},
])

const selectAudio = (index: number) => {
	currentAudioIndex.value = index
}
</script>

<template>
	<div class="audio-playlist">
		<ul class="audio-playlist__list">
			<li
				v-for="(track, index) in audioList"
				:key="index"
				@click="selectAudio(index)"
				:class="[
					'audio-playlist__item',
					{ 'audio-playlist__item--active': currentAudioIndex === index },
				]"
			>
				<img
					:src="track.coverUrl"
					:alt="track.title"
					class="audio-playlist__cover"
				/>
				<div class="audio-playlist__info">
					<span class="audio-playlist__title">{{ track.title }}</span>
					<span class="audio-playlist__duration">{{ formattedDuration(track.duration) }}</span>
				</div>
				<button class="audio-playlist__play-btn">
					<VideoPlay
						v-if="currentAudioIndex !== index"
						size="8"
						color="#ffffff"
					/>
					<VideoPause
						v-else
						size="8"
						color="#ffffff"
					/>
				</button>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.audio-playlist {
	&__list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	&__item {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		// background-color: #2c2c2c;
		border-radius: 8px;
		margin-bottom: 8px;
		cursor: pointer;
		transition: background-color 0.3s ease;

		&:hover {
			// background-color: #3a3a3a;
			background-color: #2c2c2c;
		}

		&--active {
			// background-color: #4a4a4a;
			background-color: #2c2c2c;
		}
	}

	&__cover {
		width: 48px;
		height: 48px;
		border-radius: 4px;
		margin-right: 16px;
	}

	&__info {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	&__title {
		font-size: 16px;
		font-weight: 500;
		color: #ffffff;
		margin-bottom: 4px;
	}

	&__duration {
		font-size: 14px;
		color: #b3b3b3;
	}

	&__play-btn {
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: 8px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.3s ease;

		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
		}
	}
}
</style>
