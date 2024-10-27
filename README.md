# Video Editor

一个基于 Vue3 + TypeScript + Element Plus + Unocss 纯前端实现的视频编辑器项目，支持多轨道编辑，包括视频、音频、图像和文本轨道。


## 预览

![preview](./preview.png)

## 特性

- 使用Vue 3和TypeScript开发,采用组合式API。
- 使用Pinia进行状态管理。
- 使用Canvas API进行绘图和渲染。
- 使用Web Audio API处理音频。
- 使用WebAV库(@webav/av-cliper)进行视频处理和合成。
- 采用面向对象的方式设计轨道类(BaseTrack, VideoTrack, AudioTrack, ImageTrack, TextTrack等)。
- 使用OffscreenCanvas进行离屏渲染,提高性能。
- 实现了响应式的播放器尺寸调整。
- 使用Promise和异步函数处理资源加载和渲染。
- 使用Web Worker对文件内容进行MD5计算。
- 使用帧缓存机制优化音视频解码。


## 功能

- 支持对素材进行基本的编辑操作,如放大缩小、拖拽等。
- 提供了时间轴和播放器基本功能。
- 支持多轨道编辑、轨道拖拽辅助线。
- 支持合成和导出最终视频。


## 待办

- 素材选中状态、拖拽优化、素材旋转支持
- 音频属性编辑支持
- 撤销、回退操作支持

## 安装

```sh
pnpm install
```

### 运行

```sh
pnpm dev
```
