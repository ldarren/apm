const Vec = require('~/vec')
const MW = require('~/mw')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function drawTool(ctx, name, i, list){
	const host = ctx.inner
	const o = ctx.opt
	const mw  = new MW(host, name, {x: 0, y: (i * o.height), width: o.width, height: o.height})
	const [y, h] = mw.intAttr('y', 'height')

	return ctx
}

function Toolbar(host, name, mod = {}, opt = {}){
	const o = Object.assign({}, DEF_OPT, opt)
	this.opt = o

	Vec(host).addAttr({width: (o.border * 2) + o.width, height: (o.border * 3) + o.header})
	.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#999', stroke:'#000'}).
	host().draw('text', {x:o.border, y:o.border + o.header/2}).style({fill:'#999', stroke:'#000'}).text(name)
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
	onDrop(target){
		const inner = this.inner
		inner.appendChild(target)

		const y = parseInt(inner.getAttribute('y')) || 0
		const h = parseInt(inner.getAttribute('height')) || 0
		target.setAttribute('x', 0)
		target.setAttribute('y', y + h)
		inner.setAttribute('height', y + h + 50)
		inner.ownerSVGElement.setAttribute('height', y + h + 20 + 50)
	}
}

return Toolbar
