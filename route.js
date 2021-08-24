const Vec = require('~/vec')

function Route(host, mws, {x = 0, y = 0, border = 0} = {}){
	new Vec().rect(0, 0, '100%', '100%').color('#999', '#000').addTo(host)
	const inner = new Vec().svg(10, 10, 80, (60 * mws.length) - 10).addTo(host).cl('droppable').ele
	mws.reduce(this.drawMW, inner)
}

Route.prototype = {
	drawMW(host, name, i, list){
		const rect = new Vec().rect(0, 60 * i, 80, 50).color('#a00', '#baa').addTo(host).cl('route', 'draggable').ele
		rect.addEventListener('mousedown', () => {})
		const y = parseInt(host.getAttribute('y'))
		const h = parseInt(host.getAttribute('height'))
		host.setAttribute('width', 100)
		host.setAttribute('height', y + h + 50)
		host.ownerSVGElement.setAttribute('height', y + h + 20 + 50)
		host.ownerSVGElement.setAttribute('width', 120)
		return host
	}
}

return Route
