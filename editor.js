const pObj = require('pico/obj')
const Vec = require('~/vec')
const Route = require('~/route')
const Toolbar = require('~/toolbar')
const Button = require('~/button')
const dnd = require('~/dnd')

const MOD = 'm'
const ROUTE = 'r'
const MOD_OPT = {x: 5, y: 5, state: 0}

let svg
const saved = {
	mods: {
		qiqi: {
			x: 10,
			y: 10,
			state: 0
		},
		util: {
			x: 20,
			y: 20,
			state: 0
		},
		session: {
			x: 30,
			y: 30,
			state: 0
		}
	},
	addRouteBtn: {
		x: 400,
		y: 10,
		width: 150,
		height: 30
	},
}
const mapped = {}

function drawMod(board, name, mod, opt){
	const id = MOD + '_' + name
	const panel = Vec(board).draw('svg', opt).addAttr({id}).addCl('draggable', 'droppable').ele
	mapped[id] = new Toolbar(panel, name, {width: 200, height: 30, border: 10}, mod)
}

function drawMods(board, mods, opts){
	if (!mods) return
	Object.keys(mods).forEach(key => {
		drawMod(board, key, mods[key], opts[key] || MOD_OPT)
	})
}

function drawRoute(board, name, {id, x = 0, y = 0} = {}, route = []){
	const panel = Vec(board).draw('svg', {id, x, y}).addCl('draggable', 'droppable').ele
	mapped[id] = new Route(panel, name, {width: 200, height: 30}, route)
}

function drawRoutes(board, routes = {}, {x = 0, y = 0} = {}){
	const keys = Object.keys(routes)
	let id
	keys.forEach((key, i) => drawRoute(board, key, {id: ROUTE + '_' + key, x: x + (i * 10), y: y + (i * 10)}, routes[key]))
}

function addRoute(){
	const name = window.prompt('New route name', '/')
	if (!name) return
	drawRoute(svg, name, {id: ROUTE + '_' + name, x: 100, y: 100}, [])
}

function addRoute(){
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
	load(container, data){
		svg = Vec(container).draw('svg', {x:0, y:0, width:'100%', height:'100%'}).addCl('root').addEvt('mousedown', dnd.onStart).ele
		dnd.callbacks(onDrag, onDrop)
		this.reload(data)
	},
	reload(data){
		data = data || {}
		const btn = new Button(svg, 'New Route', saved.addRouteBtn)
		btn.on('click', addRoute, this)
		drawMods(svg, data.mod, saved.mods)
		drawRoutes(svg, data.routes, {x: 300, y: 50})
	},
	save(){
		return Object.keys(mapped).reduce((data, key) => {
			return pObj.extend(data, mapped[key].save(), {mergeArr: 0})
		}, {})
	}
}
