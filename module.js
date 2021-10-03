inherit('~/panel')
const Vec = require('~/vec')
const MW = require('~/mw')
const Partial = require('~/partial')

const DEF_OPT = {width: 100, height: 60, border: 10, header: 20}

function currying(name, meta){
	if (!meta || !Array.isArray(meta[0])) return new Partial(name)
	return new Partial(name, meta[0], [])
}

function Module(host, name, opt = {}, mods = {}){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.mods = {} // a copy of editor mods
	this.mws = []
	this.add(mods)
}

Module.prototype = {
	add(mods){
		const m = Object.assign(this.mods, mods)
		const keys = Object.keys(m)
		const host = this.inner
		const o = this.opt
		this.expand(keys.length)

		keys.reduce((ctx, name, i) => {
			let meta = m[name]
			const partial = currying(name, meta)
			meta = partial.keys ? meta[1] : meta
			const mw = new MW(host, partial, meta, [], {x: 0, y: (i * o.height), width: o.width, height: o.height})
			ctx.mws.push(mw)

			return ctx
		}, this)
	},
	onDrag(target){
		const found = this.mws.find(mw => mw.ele == target)
		if (!found) return this

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').out
		const fp = found.partial
		const partial = new Partial(this.name + '.' + fp.name, fp.keys, fp.values)
		return new MW(root, partial, found.argNames(), found.values(), {x, y, width: o.width, height: o.height})
	},
	save(){
		return {
			mod: {
				[this.name]: this.mws.reduce((obj, mod, i) => {
					const arr = mod.save('name')
					let key, value
					if (Array.isArray(arr[0])){
						key = arr[0][0]
						value = [arr[0].slice(1), arr.slice(1)]
					}else{
						key = arr[0]
						value = arr.slice(1)
					}
					obj[key] = value
					return obj
				}, {})
			}
		}
	}
}

return Module
