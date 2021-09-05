const passthrough = x => x

function Vec(...args){
	if (!(this instanceof Vec)){
		return new Vec(...args)
	}
	if(args.length) this.draw(...args)
	return this
}

Vec.prototype = {
	draw(type, attr){
		const ele = type.charAt ? document.createElementNS("http://www.w3.org/2000/svg", type) : type
		if (this.ele){
			const host = this.ele
			host.appendChild(ele)
		}
		this.ele = ele
		this.addAttr(attr)
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
	addAttr(attr = {}){
		Object.keys(attr).reduce((e, key) => {
			e.setAttribute(key, attr[key])
			return e
		}, this.ele)
		return this
	},
	remAttr(...attr){
		const e = this.ele
		attr.forEach(key => e.removeAttribute(key))
		return this
	},
	attr(filter = passthrough){
		return (...attr) => {
			const e = this.ele
			const out = this.out || {}

			if (attr.length){
				attr.reduce((acc, key) => {
					acc[key] = filter(e.getAttribute(key))
					return acc
				}, out)
			}else{
				const as = e.attributes
				for (let i = 0, l = as.length, a; i < l; i++){
					a = as[i]
					out[a.name] = a.value
				}
			}
			this.out = out

			return this
		}
	},
	remEvt(...args){
		this.ele.removeEventListener(name, func)
		return this
	},
	addCl(...args){
		this.ele.classList.add(...args)
		return this
	},
	remCl(...args){
		this.ele.classList.remove(...args)
		return this
	},
	addEvt(name, func){
		this.ele.addEventListener(name, func)
		return this
	},
	remEvt(...args){
		this.ele.removeEventListener(name, func)
		return this
	},
	text(str){
		this.ele.appendChild(document.createTextNode(str))
		return this
	},
	host(){
		this.ele = this.ele.ownerSVGElement
		return this
	},
	pos(cl){
		let e = this.ele
		let x = 0
		let y = 0

		while(e){
			x += parseInt(e.getAttribute('x'))
			y += parseInt(e.getAttribute('y'))
			e = e.ownerSVGElement
			if (e.classList.contains(cl)) break
		}
		this.out = {x, y, ele: e}
		return this
	},
	toTop(){
		const r = this.ele
		const host = r.ownerSVGElement
		host.appendChild(r)
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
