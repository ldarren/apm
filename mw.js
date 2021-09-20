const Vec = require('~/vec')
const Arg = require('~/arg')

const DEF_OPT = {width: 80, height: 100}

function MW(host, name, raws, opt){
	const o = Object.assign({}, DEF_OPT, opt)

	this.host = host
	this.name = name
	this.raws = []
	this.args = []
	this.ele = Vec(host).draw('svg', o).addCl('draggable')
		.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#a00', stroke:'#baa'}).addCl('mw')
		.host().draw('title').text(name)
		.host().draw('text', {x: 10, y:20}).style({fill:'#999', stroke:'#000'}).text(name)
		.host().ele
	this.inner = Vec(this.ele).draw('svg', {x:0, y:'50%', width:'100%', height:'50%'}).addCl('inner').ele
	this.add(raws)
}

MW.prototype = {
	add(raws){
		this.raws.push(...raws)
		const host = this.inner
		const o = this.opt
		raws.reduce((ctx, name, i) => {
			const arg = new Arg(host, name, {x:(i * 30), y:0, width: 30, height: 30})
			ctx.args.push(arg)

			return ctx
		}, this)
	},
	save(){
		return [this.name, ...this.args]
	}
}

return MW
