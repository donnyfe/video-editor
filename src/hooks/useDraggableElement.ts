interface ElementInfo {
	x: number
	y: number
	width: number
	height: number
	scale: number
	rotation: number
}

export class DraggableElement {
	private element: HTMLElement
	private handles: HTMLElement[] = []
	private info: ElementInfo
	private isDragging = false
	private isResizing = false
	private isRotating = false
	private startX = 0
	private startY = 0
	private startAngle = 0
	private startScale = 1

	constructor(element: HTMLElement) {
		this.element = element
		this.info = {
			x: 0,
			y: 0,
			width: element.offsetWidth,
			height: element.offsetHeight,
			scale: 1,
			rotation: 0,
		}
		this.init()
	}

	private init(): void {
		this.createHandles()
		this.attachEventListeners()
		this.updateElementStyle()
	}

	private createHandles(): void {
		const handlePositions = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se', 'rotate']
		handlePositions.forEach(position => {
			const handle = document.createElement('div')
			handle.className = `handle handle-${position}`
			handle.style.display = 'none'
			this.element.appendChild(handle)
			this.handles.push(handle)
		})
	}

	private attachEventListeners(): void {
		this.element.addEventListener('mousedown', this.onMouseDown)
		document.addEventListener('mousemove', this.onMouseMove)
		document.addEventListener('mouseup', this.onMouseUp)
		this.element.addEventListener('click', this.onClick)
	}

	private onMouseDown = (e: MouseEvent): void => {
		if ((e.target as HTMLElement).classList.contains('handle')) {
			const handleType = (e.target as HTMLElement).className.split(' ')[1]
			if (handleType === 'handle-rotate') {
				this.startRotating(e)
			} else {
				this.startResizing(e)
			}
		} else {
			this.startDragging(e)
		}
	}

	private onMouseMove = (e: MouseEvent): void => {
		if (this.isDragging) {
			this.drag(e)
		} else if (this.isResizing) {
			this.resize(e)
		} else if (this.isRotating) {
			this.rotate(e)
		}
	}

	private onMouseUp = (): void => {
		this.isDragging = false
		this.isResizing = false
		this.isRotating = false
		console.log('Element info:', this.info)
	}

	private onClick = (): void => {
		this.toggleHandles()
	}

	private startDragging(e: MouseEvent): void {
		this.isDragging = true
		this.startX = e.clientX - this.info.x
		this.startY = e.clientY - this.info.y
	}

	private drag(e: MouseEvent): void {
		this.info.x = e.clientX - this.startX
		this.info.y = e.clientY - this.startY
		this.updateElementStyle()
	}

	private startResizing(e: MouseEvent): void {
		this.isResizing = true
		this.startX = e.clientX
		this.startY = e.clientY
	}

	private resize(e: MouseEvent): void {
		const dx = e.clientX - this.startX
		const dy = e.clientY - this.startY
		this.info.width += dx
		this.info.height += dy
		this.startX = e.clientX
		this.startY = e.clientY
		this.updateElementStyle()
	}

	private startRotating(e: MouseEvent): void {
		this.isRotating = true
		const rect = this.element.getBoundingClientRect()
		const centerX = rect.left + rect.width / 2
		const centerY = rect.top + rect.height / 2
		this.startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
	}

	private rotate(e: MouseEvent): void {
		const rect = this.element.getBoundingClientRect()
		const centerX = rect.left + rect.width / 2
		const centerY = rect.top + rect.height / 2
		const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
		this.info.rotation += angle - this.startAngle
		this.startAngle = angle
		this.updateElementStyle()
	}

	private updateElementStyle(): void {
		this.element.style.transform = `
      translate(${this.info.x}px, ${this.info.y}px)
      rotate(${this.info.rotation}rad)
      scale(${this.info.scale})
    `
		this.element.style.width = `${this.info.width}px`
		this.element.style.height = `${this.info.height}px`
	}

	private toggleHandles(): void {
		this.handles.forEach(handle => {
			handle.style.display = handle.style.display === 'none' ? 'block' : 'none'
		})
	}

	public updateInfo(newInfo: Partial<ElementInfo>): void {
		Object.assign(this.info, newInfo)
		this.updateElementStyle()
	}

	public getInfo(): ElementInfo {
		return { ...this.info }
	}
}
