inherit('~/panel')
const pObj = require('pico/obj')
const Vec = require('~/vec')
const MW = require('~/mw')
const Params = require('~/params')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function draw(ctx, arr, i){
	const o = ctx.opt
	const host = ctx.inner
	const mws = ctx.mws
	const key = arr[0]
	const mw  = new MW(host, key, pObj.dot(ctx.mods, key.split('.')), arr.slice(1), {x: 0, y: (i * o.height), width: o.width, height: o.height})
	if (!i) mws.unshift(mw)
	else if (i >= mws.length) mws.push(mw)
	else mws.splice(i, 0, mw)

	return ctx
}

function Route(host, name, opt, mods, names){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.ele.addEventListener('open', evt => Params.show({name: this.name}, {data: 'foo'}, ['const']))
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

		return new MW(root, found.name, pObj.dot(this.mods, found.name.split('.')), found.values(), {x, y, width: o.width, height: o.height})
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
		draw(this, [text.textContent, ...item.values()], idx)
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
