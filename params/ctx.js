inherit('~/panel')
const pStr = require('pico/str')
const Vec = require('~/vec')
const Value = require('~/value')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}
const PREFIX = ['$', 'params']

function Ctx(host, name, opt = {}, route){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.values = []

	this.add(route)
}

Ctx.prototype = {
	add(route){
		const tokens = pStr.tokenizer({}, route)
		const keys = tokens.filter(token => '/' !== token.charAt()).map(token => PREFIX.concat([token.slice(1)]).join('.'))
		keys.unshift(PREFIX.join('.'))
		this.expand(keys.length)
		keys.reduce((ctx, name, i) => {
			const host = ctx.inner
			const o = ctx.opt
			const p = new Value(host, name, name, {x: 0, y: (i * o.height), width: o.width, height: o.height})
			ctx.values.push(p)

			return ctx
		}, this)
	},
	save(){
		return []
	}
}

return Ctx
