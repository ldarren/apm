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

let svg
const panels = []
let toolbar

let data = {}
let ox = 0
let oy = 0

function startDrag(r, ex, ey){
	if (!r) return 0
	const [x, y] = Vec(r).toTop().addCl('sel').addEvt('mouseup', onEnd).getAttr('x', 'y').out
	ox = x - ex
	oy = y - ey
	window.addEventListener('mousemove', onDrag)
	return 1
}

function startClone(r, ex, ey){
	if (!r) return 0
	const [x, y] = Vec(r).getAttr('x', 'y').out
	const r1 = Vec(svg).draw('rect', {x, y, width:80, height:50}).style({fill:'#999', stroke:'#000'}).addCl('draggable').addEvt('mousedown', onStart).ele

	return startDrag(r1, ex, ey)
}

function onStart(ev){
	const r = ev.target
	startDrag(r.closest('.draggable'), ev.x, ev.y) || startClone(r.closest('.clonable'), ev.x, ev.y)
}
function onEnd(ev){
	window.removeEventListener('mousemove', onDrag)
	const sels = document.querySelectorAll('.sel')
	sels.forEach(sel => {
		sel.classList.remove('sel')
		sel.removeEventListener('mouseup', onEnd)
	})
	const r = ev.target

	const belows = document.elementsFromPoint(ev.clientX, ev.clientY)
	let droppable
	for (let el, i = 0; el = belows[i]; i++){
		droppable = el.closest('.droppable')
		if (droppable) break
	}
	if (!droppable) return

	droppable.appendChild(r)

	const y = parseInt(droppable.getAttribute('y')) || 0
	const h = parseInt(droppable.getAttribute('height')) || 0
	r.setAttribute('x', 0)
	r.setAttribute('y', y + h)
	droppable.setAttribute('height', y + h + 50)
	droppable.ownerSVGElement.setAttribute('height', y + h + 20 + 50)
}
function onDrag(ev){
	const r = document.querySelector('.sel')
	r.setAttribute('x', ev.x + ox)
	r.setAttribute('y', ev.y + oy)
}

function drawTool(panel, name, i, list){
	Vec(panel).draw('rect', {x:0, y:60 * i, width:80, height:50}).style({fill:'#999', stroke:'#000'}).addCl('tool', 'clonable').addEvt('mousedown', onStart)
	return panel
}

function drawToolbar2(board, mod){
	if (!mod) return
	const keys = Object.keys(mod)
	keys.reduce(drawTool, board)
}

function drawToolbar(board, name, mod, opt = {x: 0, y: 0, width: 100, height: 80}){
	if (toolbar){
		toolbar.addTools(mod)
		return
	}
	const panel = Vec(board).draw('svg', opt).addCl('draggable').addEvt('mousedown', onStart).ele
	toolbar = new Toolbar(panel, name, mod)
}

function drawRoutes(board, routes = {}, {x = 0, y = 0} = {}){
	const keys = Object.keys(routes)
	keys.forEach((key, i) => {
		const panel = Vec(board).draw('svg', {x: x + (i * 10), y: y + (i * 10)}).addCl('draggable').addEvt('mousedown', onStart).ele
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
		drawToolbar(svg, 'Toolbar', data.mod, {x: 10, y: 10, width: 100, height: 80})
		drawRoutes(svg, data.routes, {x: 500, y: 50})
	},
	save(){
		return data
	}
}
