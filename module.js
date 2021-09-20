inherit('~/panel')
const Vec = require('~/vec')
const MW = require('~/mw')

const DEF_OPT = {width: 100, height: 60, border: 10, header: 20}

function Module(host, name, opt = {}, mods = {}){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.mods = []
	this.add(mods)
}

Module.prototype = {
	add(mods){
		const keys = Object.keys(mods)
		const host = this.inner
		const o = this.opt
		this.expand(keys.length)
		keys.reduce((ctx, name, i) => {
			const mw = new MW(host, name, mods[name], {x: 0, y: (i * o.height), width: o.width, height: o.height})
			ctx.mods.push(mw)

			return ctx
		}, this)
	},
	onDrag(target){
		const found = this.mods.find(mw => mw.ele == target)
		if (!found) return this

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').out
		return new MW(root, this.name + '.' + found.name, found.raws, {x, y, width: o.width, height: o.height})
	},
	save(){
		return {
			mod: {
				[this.name]: this.mods.reduce((obj, mod, i) => {
					const arr = mod.save()
					obj[arr[0]] = arr.slice(1)
					return obj
				}, {})
			}
		}
	}
}

return Module
