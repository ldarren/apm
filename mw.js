const Vec = require('~/vec')
const Arg = require('~/arg')
const VarArg = require('~/vararg')

const DEF_OPT = {width: 80, height: 100}
const VARARG = '...'

function MW(host, partial, keys, kvalues, opt){
	const o = Object.assign({}, DEF_OPT, opt)

	this.host = host
	this.partial = partial
	this.args = []
	this.ele = Vec(host).draw('svg', o).addCl('draggable')
		.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#a00', stroke:'#baa'}).addCl('mw')
		.host().ele
	partial.draw(this.ele)
	this.inner = Vec(this.ele).draw('svg', {x:0, y:'40', width:'100%', height:'50%'}).addCl('inner').ele

	this.add(keys, kvalues)
}

MW.prototype = {
	add(keys, values){
		const host = this.inner
		let arg
		keys.reduce((ctx, key, i) => {
			if (key.includes(VARARG)){
				arg = new VarArg(this, host, key, values[i], {x:(i * 30), y:0, width: 30, height: 20})
			}else{
				arg = new Arg(host, key, values[i], {x:(i * 30), y:0, width: 30, height: 20})
			}
			ctx.args.push(arg)

			return ctx
		}, this)
	},
	argNames(){
		return this.args.map(arg => arg.name)
	},
	values(){
		return this.args.map(arg => arg.value)
	},
	getData(){
		const set = this.args.reduce((set, arg) => {
			const v = arg.value
			if (v && v.charAt && '_' === v.charAt(0)) set.add(v)
			return set
		}, new Set)
		return set
	},
	addArg(arg){
		const a = new VarArg(this, this.inner, arg.name, void 0, {x:(this.args.length  * 30), y:0, width: 30, height: 20})
		this.args.push(a)
	},
	removeArg(arg){
		const args = this.args
		if (1 >= args.length) return
		const idx = args.indexOf(arg)
		if (-1 === idx) return
		args.splice(idx, 1)
		arg.ele.ownerSVGElement.removeChild(arg.ele)
		args.forEach((arg, i) => arg.move(i * 30, 0))
	},
	save(key = 'value'){
		return [this.partial.save(key), ...this.args.map(arg => arg[key])]
	}
}

return MW
