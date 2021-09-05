inherit('~/Panel')
const Vec = require('~/vec')
const MW = require('~/mw')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function drawMW(ctx, name, i){
	const o = ctx.opt
	const host = ctx.inner

	const mw  = new MW(host, name, {x: 0, y: (i * o.height), width: o.width, height: o.height})
	ctx.mws.push(mw)
	const {y, height: h} = Vec(mw.ele).attr(parseInt)('y', 'height').out

	host.setAttribute('width', o.width)
	host.setAttribute('height', ctx.mws.length * o.height)
	const hhost = host.ownerSVGElement
	hhost.setAttribute('height', (o.border * 3) + o.header + (ctx.mws.length * o.height))
	hhost.setAttribute('width', (o.border * 2) + o.width)

	return ctx
}

function Route(host, name, opt, names){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)

	this.mws = []
	names.reduce(drawMW, this)
}

Route.prototype = {
	onDrag(target){
		const found = this.mws.find(mw => mw.ele == target)
		if (!found) return target
		const idx = this.mws.indexOf(found)
		this.mws.splice(idx, 1)

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').rm().out

		const mw = new MW(root, found.name, {x, y, width: o.width, height: o.height})
		return mw.ele
	},
	onDrop(target){
		const name = target.textContent
		drawMW(this, name, this.mws.length)
		target.ownerSVGElement.removeChild(target)
	},
}

return Route
