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
}

return Vec
