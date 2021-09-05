inherit('~/Panel')
const Vec = require('~/vec')
const MW = require('~/mw')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function drawTool(ctx, name, i){
	const host = ctx.inner
	const o = ctx.opt
	const mw  = new MW(host, name, {x: 0, y: (i * o.height), width: o.width, height: o.height})
	ctx.tools.push(mw)

	return ctx
}

function Toolbar(host, name, opt = {}, mod = {}){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.tools = []
	this.addTools(mod)
}

Toolbar.prototype = {
	addTools(mod){
		const keys = Object.keys(mod)
		const o = this.opt
		const host = this.inner

		host.setAttribute('width', o.width)
		host.setAttribute('height', keys.length * o.height)
		const hhost = host.ownerSVGElement
		hhost.setAttribute('height', (o.border * 3) + o.header + (keys.length * o.height))
		hhost.setAttribute('width', (o.border * 2) + o.width)

		keys.reduce(drawTool, this)
	},
	onDrag(target){
		const found = this.tools.find(mw => mw.ele == target)
		if (!found) return target

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').out

		const mw = new MW(root, found.name, {x, y, width: o.width, height: o.height})
		return mw.ele
	},
}

return Toolbar
