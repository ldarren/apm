/**
<svg width="100%" height="90%">
    <rect id="rect1" x="10" y="10" width="80" height="50" style="stroke:#000; fill:#999;" draggable="true" />
    <rect id="rect2" class="droppable" x="500" y="10" width="80" height="50" style="stroke:#000; fill:#2db7f5;" />
	<use xlink:href="#rect1"/>
</svg>
 */
const Vec = require('~/vec')

let data = {}
let r1
let ox = 0
let oy = 0
let svg

function onStart(ev){
	const x = r1.getAttribute("x")
	const y = r1.getAttribute("y")
	ox = x - ev.x
	oy = y - ev.y
	r1.addEventListener('mouseup', onEnd)
	window.addEventListener('mousemove', onDrag)
}
function onEnd(ev){
	r1.removeEventListener('mouseup', onEnd)
	window.removeEventListener('mousemove', onDrag)

	const belows = document.elementsFromPoint(ev.clientX, ev.clientY)
	const below = belows.find(el => el.classList.contains('droppable'))
	if (!below) return
	const droppable = below.closest('.droppable')
	if (!droppable) return

	const x = parseInt(droppable.getAttribute('x')) || 0
	const y = parseInt(droppable.getAttribute('y')) || 0
	const h = parseInt(droppable.getAttribute('height')) || 0
	r1.setAttribute('x', x)
	r1.setAttribute('y', y + h)
}
function onDrag(ev){
	r1.setAttribute("x", ev.x + ox)
	r1.setAttribute("y", ev.y + oy)
}
function changeDimensions() {
	let stroke = parseInt(r1.style.strokeWidth) || 0
	stroke = (stroke + 1) % 5
	r1.style.strokeWidth = stroke
	const width = r1.getAttribute('width')
	r1.setAttribute("width", (parseInt(width) || 0) + 10)
}

function drawTool(panel, name, i, list){
	const rect = new Vec().rect(0, 60 * i, 80, 50).color('#999', '#000').addTo(panel).ele
	rect.addEventListener('mousedown', onStart)
	return panel
}

function drawToolbar(board, mod){
	if (!mod) return
	const keys = Object.keys(mod)
	keys.reduce(drawTool, board)
}

function drawBox(panel, name, i, list){
	const rect = new Vec().rect(0, 60 * i, 80, 50).color('#a00', '#baa').addTo(panel).ele
	rect.addEventListener('mousedown', onStart)
	return panel
}

function drawRoutes(board, x, y, routes = {}){
	const keys = Object.keys(routes)
	const panel = new Vec().svg(x, y, 100, 10 + (60 * keys.length)).addTo(board).ele
	new Vec().rect(0, 0, '100%', '100%').color('#999', '#000').addTo(panel)
	const inner = new Vec().svg(10, 10, 80, (60 * keys.length) - 10).addTo(panel).ele
	keys.reduce(drawBox, inner)
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
