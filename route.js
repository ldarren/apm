const Vec = require('~/vec')

function Route(host, name, mws, {x = 0, y = 0, border = 0} = {}){
	Vec(host).draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#999', stroke:'#000'})
	Vec(host).draw('text', {x: 10, y:20}).style({fill:'#999', stroke:'#000'}).text(name)
	const inner = Vec(host).draw('svg', {x:10, y:30, width:80, height:(60 * mws.length) - 10}).cl('droppable').ele
	mws.reduce(this.drawMW, inner)
}

Route.prototype = {
	drawMW(host, name, i, list){
		const rect = Vec(host).draw('rect', {x:0, y:60 * i, width:80, height:50}).style({fill:'#a00', stroke:'#baa'}).cl('route', 'draggable').ele
		rect.addEventListener('mousedown', () => {})
		const y = parseInt(host.getAttribute('y'))
		const h = parseInt(host.getAttribute('height'))
		host.setAttribute('width', 100)
		host.setAttribute('height', y + h + 50)
		host.ownerSVGElement.setAttribute('height', y + h + 40 + 50)
		host.ownerSVGElement.setAttribute('width', 100)
		return host
	}
}

return Route
