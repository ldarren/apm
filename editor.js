const pObj = require('pico/obj')
const Vec = require('~/vec')
const Route = require('~/route')
const Module = require('~/module')
const Spec = require('~/spec')
const Button = require('~/button')
const dnd = require('~/dnd')
const saved = require('~/default.json')

const SPEC = '@'
const MOD = 'm'
const ROUTE = 'r'
const MOD_OPT = {x: 5, y: 5, state: 0}

let svg
const mods = {}
const mapped = {}

function drawSpec(board, spec, opt = {}){
	if (!spec) return
	let global = mapped[SPEC]
	if (global){
		global.add(spec)
	}else{
		const panel = Vec(board).draw('svg', opt).addAttr({id: SPEC, x: opt.x, y: opt.y}).addCl('draggable', 'droppable').ele
		mapped[SPEC] = new Spec(panel, 'Spec', {width: 200, height: 30, border: 10}, spec)
	}
}

function drawMod(board, name, mod, opt){
	const id = MOD + '_' + name
	if (mapped[id]) return
	const panel = Vec(board).draw('svg', opt).addAttr({id, x: opt.x, y: opt.y}).addCl('draggable', 'droppable').ele
	mapped[id] = new Module(panel, name, {width: 200, height: 60, border: 10}, mod)
}

function drawMods(board, mods, opts){
	if (!mods) return
	Object.keys(mods).forEach(key => {
		drawMod(board, key, mods[key], opts[key] || MOD_OPT)
	})
}

function drawRoute(board, name, {id, x = 0, y = 0} = {}, route = []){
	if (mapped[id]) return
	const panel = Vec(board).draw('svg', {id, x, y}).addCl('draggable', 'droppable').ele
	mapped[id] = new Route(panel, name, {width: 200, height: 60}, mods, route)
}

function drawRoutes(board, routes = {}, {x = 0, y = 0} = {}){
	const keys = Object.keys(routes)
	keys.forEach((key, i) => drawRoute(board, key, {id: ROUTE + '_' + key, x: x + (i * 10), y: y + (i * 10)}, routes[key]))
}

function addRoute(){
	const name = window.prompt('New route name', '/')
	if (!name) return
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

function onDrop(draggable, droppable, dragged){
	if (draggable === droppable) return
	if (!droppable) return destroy(draggable)
	const panel = mapped[droppable.id]
	if (!panel) return destroy(draggable)
	return panel.onDrop(draggable, dragged)
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
		Object.assign(mods, data.mod)
		drawMods(svg, mods, saved.mods)
		drawSpec(svg, data.spec, saved.spec)
		drawRoutes(svg, data.routes, {x: 300, y: 50})
	},
	save(){
		return Object.keys(mapped).reduce((data, key) => {
			return pObj.extend(data, mapped[key].save(), {mergeArr: 0})
		}, {})
	}
}
