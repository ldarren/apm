inherit('~/panel')
const Vec = require('~/vec')
const MW = require('~/mw')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function drawMW(ctx, name, i){
	const o = ctx.opt
	const host = ctx.inner

	const mw  = new MW(host, name, {x: 0, y: (i * o.height), width: o.width, height: o.height})
	ctx.mws.push(mw)

	return ctx
}

function Route(host, name, opt, names){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)

	this.mws = []
	names.reduce(drawMW, this)
	this.reflow()
}

Route.prototype = {
	reflow(){
		const o = this.opt
		const host = this.inner
		const mws = this.mws
		const len = this.mws.length

		host.setAttribute('width', o.width)
		host.setAttribute('height', len * o.height)
		const hhost = host.ownerSVGElement
		hhost.setAttribute('height', (o.border * 3) + o.header + (len * o.height))
		hhost.setAttribute('width', (o.border * 2) + o.width)

		mws.forEach((mw, i) => {
			Vec(mw.ele).addAttr({x: 0, y: o.height * i})
		})
	},
	onDrag(target){
		const found = this.mws.find(mw => mw.ele == target)
		if (!found) return target
		const idx = this.mws.indexOf(found)
		this.mws.splice(idx, 1)

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').rm().out
		this.reflow()

		const mw = new MW(root, found.name, {x, y, width: o.width, height: o.height})
		return mw.ele
	},
	onDrop(target){
		const name = target.textContent
		drawMW(this, name, this.mws.length)
		target.ownerSVGElement.removeChild(target)
		this.reflow()
	},
}

return Route
