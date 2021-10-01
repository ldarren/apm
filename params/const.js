inherit('~/panel')
const Vec = require('~/vec')
const Value2 = require('~/value2')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function Const(host, name, opt = {}){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.values = []

	this.add([
		'Null',
		'Number',
		'String',
		'Object'
	])
}

Const.prototype = {
	add(keys){
		this.expand(keys.length)
		keys.reduce((ctx, name, i) => {
			const host = ctx.inner
			const o = ctx.opt
			const p = new Value2(host, name, {x: 0, y: (i * o.height), width: o.width, height: o.height})
			ctx.values.push(p)

			return ctx
		}, this)
	},
	onDrag(target){
		const found = this.values.find(p => p.ele == target)
		if (!found) return this

		const {x, y, ele: root} = Vec(found.ele).pos('root').out
		const o = Vec(found.ele).attr()('width', 'height').out

		const p = new Value2(root, found.name, {x, y, width: o.width, height: o.height})
		return p.ele
	},
	save(){
		return {
			mod: {
				[this.name]: this.values.reduce((obj, p, i) => {
					const arr = p.save()
					obj[arr[0]] = arr[1]
					return obj
				}, {})
			}
		}
	}
}

return Const
