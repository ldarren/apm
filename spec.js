inherit('~/panel')
const Vec = require('~/vec')
const Param = require('~/param')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function Spec(host, name, opt = {}, params = {}){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.params = []
	this.add(params)
}

Spec.prototype = {
	add(params){
		const keys = Object.keys(params)
		this.expand(keys.length)
		keys.reduce((ctx, name, i) => {
			const host = ctx.inner
			const o = ctx.opt
			const p = new Param(host, name, params[name], {x: 0, y: (i * o.height), width: o.width, height: o.height})
			ctx.params.push(p)

			return ctx
		}, this)
	},
	onDrag(target){
		const found = this.params.find(p => p.ele == target)
		if (!found) return target

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').out

		const p = new Param(root, '@.' + found.name, found.value, {x, y, width: o.width, height: o.height})
		return p.ele
	},
	save(){
		return {
			mod: {
				[this.name]: this.params.reduce((obj, p, i) => {
					const arr = p.save()
					obj[arr[0]] = arr[1]
					return obj
				}, {})
			}
		}
	}
}

return Spec
