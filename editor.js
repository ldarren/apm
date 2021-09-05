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

const TOOLBAR = 'tb'
const ROUTE = 'r'

let svg
let data = {}
const saved = {
	toolbar: {
		x: 10,
		y: 10
	},
}
const mapped = {}

function drawToolbar(board, name, mod, opt){
	if (mapped[TOOLBAR]){
		mapped[TOOLBAR].addTools(mod)
		return
	}
	const id = TOOLBAR
	const panel = Vec(board).draw('svg', opt).addAttr({id}).addCl('draggable', 'droppable').ele
	mapped[id] = new Toolbar(panel, name, mod, {width: 100, height: 30, border: 10})
}

function drawRoutes(board, routes = {}, {x = 0, y = 0} = {}){
	const keys = Object.keys(routes)
	let id
	keys.forEach((key, i) => {
		id = ROUTE + '_' + i
		const panel = Vec(board).draw('svg', {x: x + (i * 10), y: y + (i * 10), id}).addCl('draggable', 'droppable').ele
		mapped[id] = new Route(panel, key, routes[key])
	})
}

function onDrop(target, droppable){
	if (!droppable) return
	const panel = mapped[droppable.id]
	panel.onDrop(target)
}

return {
	load(container, d){
		data = d || {}
		svg = Vec(container).draw('svg', {x:0, y:0, width:'100%', height:'100%'}).addEvt('mousedown', dnd.onStart).ele
		dnd.onEnd(onDrop)
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
