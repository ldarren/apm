inherit('~/panel')
const Vec = require('~/vec')
const Value = require('~/value')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function Spec(host, name, opt = {}, values = {}){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.values = []
	this.add(values)
}

Spec.prototype = {
	add(values){
		const keys = Object.keys(values)
		this.expand(keys.length)
		keys.reduce((ctx, name, i) => {
			const host = ctx.inner
			const o = ctx.opt
			const p = new Value(host, '@.' + name, values[name], {x: 0, y: (i * o.height), width: o.width, height: o.height})
			ctx.values.push(p)

			return ctx
		}, this)
	},
	save(){
		return {
			spec: this.values.reduce((obj, p, i) => {
				const arr = p.save()
				obj[arr[0]] = arr[1]
				return obj
			}, {})
		}
	}
}

return Spec
