const Vec = require('~/vec')

function drawTool(host, name, i, list){
	const tool = Vec(host).draw('svg', {x:0, y:60 * i, width:80, height:50}).ele
	Vec(tool).draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#a00', stroke:'#baa'}).addCl('route', 'draggable').addEvt('mousedown', () => {})
	Vec(tool).draw('text', {x: 10, y:20}).style({fill:'#999', stroke:'#000'}).text(name)
	const y = parseInt(host.getAttribute('y'))
	const h = parseInt(host.getAttribute('height'))
	host.setAttribute('width', 100)
	host.setAttribute('height', y + h + 50)
	const hhost = host.ownerSVGElement
	hhost.setAttribute('height', y + h + 40 + 50)
	hhost.setAttribute('width', 100)
	return host
}

function Toolbar(host, name, mod = {}, {x = 0, y = 0, width = 80, height = 60, border = 0} = {}){
	Vec(host).draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#999', stroke:'#000'})
	Vec(host).draw('text', {x: 10, y:20}).style({fill:'#999', stroke:'#000'}).text(name)
	this.inner = Vec(host).draw('svg', {x:10, y:30, width:'100%', height:'100%'}).addCl('droppable').ele
	this.addTools(mod)
}

Toolbar.prototype = {
	addTools(mod){
		const keys = Object.keys(mod)
		keys.reduce(drawTool, this.inner)
	}
}

return Toolbar
