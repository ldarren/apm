/**
<svg width="100%" height="90%">
    <rect id="rect1" x="10" y="10" width="80" height="50" style="stroke:#000; fill:#999;" draggable="true" />
    <rect id="rect2" class="droppable" x="500" y="10" width="80" height="50" style="stroke:#000; fill:#2db7f5;" />
	<use xlink:href="#rect1"/>
</svg>
 */
const Vec = require('~/vec')
const Route = require('~/route')
const Toolbar = require('~/toolbar')
const dnd = require('~/dnd')

let svg
const panels = []
let toolbar

let data = {}
let saved = {
	toolbar: {
		x: 10,
		y: 10
	},
}

function drawToolbar(board, name, mod, opt){
	if (toolbar){
		toolbar.addTools(mod)
		return
	}
	const panel = Vec(board).draw('svg', opt).addCl('draggable').addEvt('mousedown', dnd.onStart).ele
	toolbar = new Toolbar(panel, name, mod, {width: 100, height: 30, border: 10})
}

function drawRoutes(board, routes = {}, {x = 0, y = 0} = {}){
	const keys = Object.keys(routes)
	keys.forEach((key, i) => {
		const panel = Vec(board).draw('svg', {x: x + (i * 10), y: y + (i * 10)}).addCl('draggable').addEvt('mousedown', dnd.onStart).ele
		panels.push(new Route(panel, key, routes[key]))
	})
}

return {
	load(container, d){
		data = d || {}
		svg = Vec(container).draw('svg', {x:0, y:0, width:'100%', height:'100%'}).ele
		this.reload(data)
	},
	reload(d){
		data = d || {}
		drawToolbar(svg, 'Toolbar', data.mod, saved.toolbar)
		drawRoutes(svg, data.routes, {x: 500, y: 50})
	},
	save(){
		return data
	}
}
