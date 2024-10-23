export function generateRandomColor(): string {
	return (
		'#' +
		Math.floor(Math.random() * 16777215)
			.toString(16)
			.padStart(6, '0')
	)
}

export function generateRandomHSLColor(): string {
	const h = Math.random() * 360
	const s = Math.random() * 60 + 40 // 40-100%
	const l = Math.random() * 60 + 20 // 20-80%
	return `hsl(${h}, ${s}%, ${l}%)`
}

export function generateRandomRGBColor(): string {
	const r = Math.random() * 256
	const g = Math.random() * 256
	const b = Math.random() * 256
	return `rgb(${r}, ${g}, ${b})`
}
