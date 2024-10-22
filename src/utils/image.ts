/**
 * 图像技术方案：
 * - ImageProcessing.js是一个纯JavaScript实现的图像处理库,提供了多种常见的图像处理算法:
		亮度/对比度调整
		高斯、中值、拉普拉斯等滤波器
		二值化方法
		傅里叶变换
	- image-processing-algorithms.js, 图像处理算法集合
	- glfx.js, 图像滤镜效果, glfx.js提供了多种滤镜效果,如亮度/对比度调整、色相/饱和度、锐化等来源.
 */
/**
 * 获取所有图片
 * @returns
 */
export function getAllImages() {
	return document.images
}

/**
 * 检查图片是否加载完成
 * @param img
 * @returns
 */
export function isImageLoaded(img: HTMLImageElement) {
	return img.complete && img.naturalHeight !== 0
}

/**
 * 从URL获取图片
 * @param item
 * @returns
 */
export async function getImageFromUrl(item: { id: string; src: string }) {
	const response = await fetch(item.src)
	const blob = await response.blob()
	return new File([blob], `${item.id}.png`, { type: blob.type })
}
