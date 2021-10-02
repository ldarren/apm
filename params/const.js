inherit('~/panel')
const Vec = require('~/vec')
const Clip = require('~/clip')
const Value2 = require('~/value2')

const DEF_OPT = {width: 100, height: 30, border: 10, header: 20}

function click(evt){
	const name = this.name
	let val
	switch(name){
	default:
	case 'Undefined': break
	case 'Null':
		val = null;
		break
	case 'Number':
		val = parseFloat(window.prompt(`Enter a ${name}`, 0) || '0')
		break
	case 'String':
		val = window.prompt(`Enter a ${name}`, '') || ''
		break
	case 'Object':
		val = JSON.parse(window.prompt(`Enter a ${name}`, '[]') || '[]')
		break
	}
	Clip.src(val)
}

function Const(host, name, opt = {}){
	const o = Object.assign({}, DEF_OPT, opt || {})
	this.constructor.call(this, host, name, o)
	this.values = []

	this.add([
		'Undefined',
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
			const p = new Value2(host, name, click, {x: 0, y: (i * o.height), width: o.width, height: o.height})
			ctx.values.push(p)

			return ctx
		}, this)
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
