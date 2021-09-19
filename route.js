inherit('~/panel')
const Vec = require('~/vec')
const MW = require('~/mw')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function draw(ctx, name, i){
	const o = ctx.opt
	const host = ctx.inner
	const mws = ctx.mws

	const mw  = new MW(host, name, {x: 0, y: (i * o.height), width: o.width, height: o.height})
	if (!i) mws.unshift(mw)
	else if (i >= mws.length) mws.push(mw)
	else mws.splice(i, 0, mw)

	return ctx
}

function Route(host, name, opt, names){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)

	this.mws = []
	names.reduce(draw, this)
	this.reflow()
}

Route.prototype = {
	reflow(){
		const o = this.opt
		const mws = this.mws

		this.expand(mws.length)

		mws.forEach((mw, i) => {
			Vec(mw.ele).addAttr({x: 0, y: o.height * i})
		})
	},
	onDrag(target){
		const found = this.mws.find(mw => mw.ele == target)
		if (!found) return target
		const idx = this.mws.indexOf(found)
		this.mws.splice(idx, 1)

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').rm().out
		this.reflow()

		const mw = new MW(root, found.name, {x, y, width: o.width, height: o.height})
		return mw.ele
	},
	onDrop(target){
		const mws = this.mws
		const {y: ty} = Vec(target).attr(parseInt)('y').out
		const {y: iy} = Vec(this.inner).pos('root').out
		const oy = ty - iy
		let idx = 0
		const yes = mws.some((mw, i) => {
			const {y} = Vec(mw.ele).attr(parseInt)('y').out
			idx = i
			return (oy - y) < 0
		})
		if (!yes) idx = mws.length

		const text = target.getElementsByTagName('text')[0]
		draw(this, text.textContent, idx)
		target.ownerSVGElement.removeChild(target)
		this.reflow()
	},
	save(){
		return {
			routes: {
				[this.name]: this.mws.reduce((arr, mw, i) => {
					arr.push(mw.save())
					return arr
				}, [])
			}
		}
	}
}

return Route
