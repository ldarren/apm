/**
<svg width="100%" height="90%">
    <rect id="rect1" x="10" y="10" width="80" height="50" style="stroke:#000; fill:#999;" draggable="true" />
    <rect id="rect2" class="droppable" x="500" y="10" width="80" height="50" style="stroke:#000; fill:#2db7f5;" />
	<use xlink:href="#rect1"/>
</svg>
 */
const Vec = require('~/vec')
const Route = require('~/route')
const panels = []

let data = {}
let ox = 0
let oy = 0
let svg

function startDrag(r, ex, ey){
	if (!r) return 0
	new Vec(r).toTop()
	r.classList.add('sel')
	const x = r.getAttribute("x")
	const y = r.getAttribute("y")
	ox = x - ex
	oy = y - ey
	r.addEventListener('mouseup', onEnd)
	window.addEventListener('mousemove', onDrag)
	return 1
}

function startClone(r, ex, ey){
	if (!r) return 0
	const x = r.getAttribute("x")
	const y = r.getAttribute("y")
	const r1 = new Vec().rect(x, y, 80, 50).color('#999', '#000').addTo(svg).cl('draggable').ele
	r1.addEventListener('mousedown', onStart)

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
	r.setAttribute("x", ev.x + ox)
	r.setAttribute("y", ev.y + oy)
}

function drawTool(panel, name, i, list){
	const rect = new Vec().rect(0, 60 * i, 80, 50).color('#999', '#000').addTo(panel).ele
	rect.classList.add('tool', 'clonable')
	rect.addEventListener('mousedown', onStart)
	return panel
}

function drawToolbar(board, mod){
	if (!mod) return
	const keys = Object.keys(mod)
	keys.reduce(drawTool, board)
}

function drawRoutes(board, x, y, routes = {}){
	const keys = Object.keys(routes)

	keys.forEach((key, i) => {
		const panel = new Vec().svg(x + (i * 10), y + (i * 10)).addTo(board).cl('draggable').ele
		panel.addEventListener('mousedown', onStart)
		panels.push(new Route(panel, routes[key]))
	})
}

return {
	load(container, d){
		data = d || {}
		svg = new Vec().svg(0, 0, '100%', '100%').addTo(container).ele
		this.reload(data)
	},
	reload(d){
		data = d || {}
		drawToolbar(svg, data.mod)
		drawRoutes(svg, 500, 50, data.routes)
	},
	save(){
		return data
	}
}
