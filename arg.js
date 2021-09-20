const Vec = require('~/vec')

const TYPE_PREFIX = {
	spec: '@',
	ctx: '$',
	data: '_',
}
const DEF_OPT = {width: 80, height: 50}

function Arg(host, name, opt){
	const o = Object.assign({}, DEF_OPT, opt)

	this.host = host
	this.name = name
	this.ele = Vec(host).draw('svg', o).addCl('draggable', 'param', opt.type)
		.draw('rect', {x:0, y:0, width:'100%', height:'100%'})
		.host().draw('title').text(TYPE_PREFIX[opt.type]+'.'+name)
		.host().draw('text', {x: 10, y:20}).text(name)
		.host().ele
}

Arg.prototype = {
	save(){
		return [this.name]
	}
}

return Arg
