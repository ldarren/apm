const Vec = require('~/vec')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function Route(host, name, mws, opt){
	const o = Object.assign({}, DEF_OPT, opt)
	Vec(host).addAttr({width: (o.border * 2) + o.width, height: (o.border * 2) + o.header}).
	draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#999', stroke:'#000'}).
	host().draw('text', {x:o.border, y:o.header/2}).style({fill:'#999', stroke:'#000'}).text(name)
	const inner = Vec(host).draw('svg', {x:o.border, y:o.header + o.border}).addCl('inner').ele
	mws.reduce(this.drawMW, inner)
}

Route.prototype = {
	drawMW(host, name, i, list){
		const [y, h] = Vec(host).draw('rect', {x:0, y:60 * i, width:80, height:50}).style({fill:'#a00', stroke:'#baa'}).addCl('route', 'draggable').attr(parseInt)('y', 'height').out
		host.setAttribute('width', 100)
		host.setAttribute('height', y + h + 50)
		const hhost = host.ownerSVGElement
		hhost.setAttribute('height', y + h + 40 + 50)
		hhost.setAttribute('width', 100)
		return host
	},
	onDrop(mw){
	}
}

return Route
