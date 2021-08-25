function Vec(...args){
	if (!(this instanceof Vec)){
		return new Vec(...args)
	}
	if(args.length) this.draw(...args)
	return this
}

Vec.prototype = {
	draw(type, attr){
		let ele
		if (type.charAt){
			ele = document.createElementNS("http://www.w3.org/2000/svg", type)
			Object.keys(attr).reduce((e, key) => {
				e.setAttribute(key, attr[key])
				return e
			}, ele)
		} else {
			ele = type
		}
		if (this.ele){
			const host = this.ele
			host.appendChild(ele)
		}
		this.ele = ele
		return this
	},
	style(css){
		this.ele.setAttribute('style', 
			Object.keys(css).reduce((acc, key) => {
				acc += `${key}:${css[key]};`
				return acc
			}, '')
		)
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
	text(str){
		this.ele.appendChild(document.createTextNode(str))
		return this
	}
}

return Vec

function changeDimensions() {
	let stroke = parseInt(r1.style.strokeWidth) || 0
	stroke = (stroke + 1) % 5
	r1.style.strokeWidth = stroke
	const width = r1.getAttribute('width')
	r1.setAttribute("width", (parseInt(width) || 0) + 10)
}
