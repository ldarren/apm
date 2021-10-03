const Vec = require('~/vec')
const Arg = require('~/arg')

const DEF_OPT = {width: 80, height: 100}

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
		keys.reduce((ctx, key, i) => {
			const arg = new Arg(host, key, values[i], {x:(i * 30), y:0, width: 30, height: 20})
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
			if (v && '_' === v.charAt(0)) set.add(v)
			return set
		}, new Set)
		return set
	},
	save(key = 'value'){
		return [this.partial.save(key), ...this.args.map(arg => arg[key])]
	}
}

return MW
