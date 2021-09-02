const Vec = require('~/vec')

let ox = 0
let oy = 0

function startDrag(r, ex, ey){
	if (!r) return 0
	const [x, y] = Vec(r).toTop().addCl('sel').addEvt('mouseup', onEnd).attr(parseInt)('x', 'y').out
	ox = x - ex
	oy = y - ey
	window.addEventListener('mousemove', onDrag)
	return 1
}

function startClone(r, ex, ey){
	if (!r) return 0
	const [x, y] = Vec(r).attr(parseInt)('x', 'y').out
	const r1 = Vec(svg).draw('rect', {x, y, width:80, height:50}).style({fill:'#999', stroke:'#000'}).addCl('draggable').addEvt('mousedown', onStart).ele

	return startDrag(r1, ex, ey)
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

return {
	onStart(ev){
		const r = ev.target
		startDrag(r.closest('.draggable'), ev.x, ev.y) || startClone(r.closest('.clonable'), ev.x, ev.y)
	},
}
