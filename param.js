const Vec = require('~/vec')

const DEF_OPT = {width: 80, height: 50}

function Param(host, name, value, opt){
	const o = Object.assign({}, DEF_OPT, opt)

	this.host = host
	this.name = name
	this.value = value
	this.ele = Vec(host).draw('svg', o).addCl('draggable')
		.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#0aa', stroke:'#aab'}).addCl('param')
		.host().draw('title').text('@.'+name)
		.host().draw('text', {x: 10, y:20}).style({fill:'#999', stroke:'#000'}).text(name)
		.host().ele
}

Param.prototype = {
	save(){
		return [this.name, this.value]
	}
}

return Param
