function Vec(...args){
	switch(args.length){
	case 0:
		return this
	case 1:
		this.ele = args[0]
		return this
	}
}

Vec.prototype = {
	svg(x, y, w, h){
		const e = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
		e.setAttribute('x', x)
		e.setAttribute('y', y)
		e.setAttribute('width', w)
		e.setAttribute('height', h)
		this.ele = e
		return this
	},
	rect(x, y, w, h){
		const e = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
		e.setAttribute('x', x)
		e.setAttribute('y', y)
		e.setAttribute('width', w)
		e.setAttribute('height', h)
		this.ele = e
		return this
	},
	color(fill, stroke){
		this.ele.setAttribute('style', `stroke:${stroke}; fill:${fill};`)
		return this
	},
	addTo(host){
		host.appendChild(this.ele)
		return this
	},
	toTop(){
		const r = this.ele
		const host = r.ownerSVGElement
		host.appendChild(r)
		return this
	},
	cl(...args){
		this.ele.classList.add(...args)
		return this
	},
}

return Vec

function changeDimensions() {
	let stroke = parseInt(r1.style.strokeWidth) || 0
	stroke = (stroke + 1) % 5
	r1.style.strokeWidth = stroke
	const width = r1.getAttribute('width')
	r1.setAttribute("width", (parseInt(width) || 0) + 10)
}
