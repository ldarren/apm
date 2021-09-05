const Vec = require('~/vec')
const MW = require('~/mw')

const tools = []
const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function drawTool(ctx, name, i, list){
	const host = ctx.inner
	const o = ctx.opt
	const mw  = new MW(host, name, {x: 0, y: (i * o.height), width: o.width, height: o.height})
	tools.push(mw)

	return ctx
}

function Toolbar(host, name, mod = {}, opt = {}){
	const o = Object.assign({}, DEF_OPT, opt)
	this.opt = o

	Vec(host).addAttr({width: (o.border * 2) + o.width, height: (o.border * 3) + o.header})
	.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#999', stroke:'#000'}).
	host().draw('text', {x:o.border, y:o.border + o.header/2}).style({fill:'#999', stroke:'#000'}).text(name)

	this.host = host
	this.inner = Vec(host).draw('svg', {x:o.border, y:o.header + (2 * o.border)}).addCl('inner').ele

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
		const found = tools.find(mw => mw.ele == target)
		if (!found) return target

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').out

		const mw = new MW(root, found.name, {x, y, width: o.width, height: o.height})
		return mw.ele
	},
	onDrop(target){
		target.ownerSVGElement.removeChild(target)
	},
}

return Toolbar
