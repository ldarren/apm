const Vec = require('~/vec')
const Route = require('~/route')
const Toolbar = require('~/toolbar')
const Button = require('~/button')
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
	addRouteBtn: {
		x: 400,
		y: 10,
		width: 150,
		height: 30
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
	mapped[id] = new Toolbar(panel, name, {width: 200, height: 30, border: 10}, mod)
}

function drawRoute(board, name, {id, x = 0, y = 0} = {}, route = []){
	const panel = Vec(board).draw('svg', {id, x, y}).addCl('draggable', 'droppable').ele
	mapped[id] = new Route(panel, name, {width: 200, height: 30}, route)
}

function drawRoutes(board, routes = {}, {x = 0, y = 0} = {}){
	const keys = Object.keys(routes)
	let id
	keys.forEach((key, i) => drawRoute(board, key, {id: ROUTE + '_' + i, x: x + (i * 10), y: y + (i * 10)}, routes[key]))
}

function addRoute(){
	const name = window.prompt('New route name', '/')
	drawRoute(svg, name, {id: ROUTE + '_' + name, x: 100, y: 100}, [])
}

function destroy(target){
	if (!target || target.classList.contains('droppable')) return
	target.ownerSVGElement.removeChild(target)
}

function onDrag(draggable, droppable){
	if (!droppable) return destroy(draggable)
	const panel = mapped[droppable.id]
	if (!panel) return destroy(draggable)
	return panel.onDrag(draggable)
}

function onDrop(draggable, droppable){
	if (draggable === droppable) return
	if (!droppable) return destroy(draggable)
	const panel = mapped[droppable.id]
	if (!panel) return destroy(draggable)
	return panel.onDrop(draggable)
}

return {
	load(container, d){
		data = d || {}
		svg = Vec(container).draw('svg', {x:0, y:0, width:'100%', height:'100%'}).addCl('root').addEvt('mousedown', dnd.onStart).ele
		dnd.callbacks(onDrag, onDrop)
		this.reload(data)
	},
	reload(d){
		data = d || {}
		const btn = new Button(svg, 'New Route', saved.addRouteBtn)
		btn.on('click', addRoute, this)
		drawToolbar(svg, 'Toolbar', data.mod, saved.toolbar)
		drawRoutes(svg, data.routes, {x: 300, y: 50})
	},
	save(){
		return data
	}
}
