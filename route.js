inherit('~/panel')
const pObj = require('pico/obj')
const Vec = require('~/vec')
const MW = require('~/mw')
const Partial = require('~/partial')
const Params = require('~/params')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function currying(arr, mods){
	if (!Array.isArray(arr)) return new Partial(arr)
	const name = arr[0]
	const meta = pObj.dot(mods, name.split('.'))
	const keys = meta[0]
	return new Partial(name, keys, arr.slice(1))
}

function draw(ctx, arr, i){
	const o = ctx.opt
	const host = ctx.inner
	const mws = ctx.mws
	const key = arr[0]
	const partial = currying(arr[0], ctx.mods)
	let meta = pObj.dot(ctx.mods, partial.name.split('.'))
	meta = partial.keys ? meta[1] : meta

	const mw  = new MW(host, partial, meta, arr.slice(1), {x: 0, y: (i * o.height), width: o.width, height: o.height})
	if (!i) mws.unshift(mw)
	else if (i >= mws.length) mws.push(mw)
	else mws.splice(i, 0, mw)

	return ctx
}

function Route(host, name, opt, mods, names){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.ele.addEventListener('open', evt => Params.show(this.name, this.getData()))
	this.ele.addEventListener('close', evt => Params.close(this.name))

	this.mods = mods // hold a copy of editor's mods
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
		if (!found) return this
		const idx = this.mws.indexOf(found)
		this.mws.splice(idx, 1)

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').rm().out
		this.reflow()

		return new MW(root, found.partial, found.argNames(), found.values(), {x, y, width: o.width, height: o.height})
	},
	onDrop(target, item){
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
		draw(this, [item.partial.save(), ...item.values()], idx)
		target.ownerSVGElement.removeChild(target)
		this.reflow()
	},
	getData(){
		const set = this.mws.reduce((set, mw) => {
			mw.getData().forEach(set.add, set)
			return set
		}, new Set)
		return [...set]
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
