const Vec = require('~/vec')

const DEF_OPT = {width: 80, height: 50}

function MW(host, name, params, opt){
	const o = Object.assign({}, DEF_OPT, opt)

	this.host = host
	this.name = name
	this.params = params
	this.ele = Vec(host).draw('svg', o).addCl('draggable')
		.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#a00', stroke:'#baa'}).addCl('mw')
		.host().draw('title').text(name)
		.host().draw('text', {x: 10, y:20}).style({fill:'#999', stroke:'#000'}).text(name)
		.host().ele
}

MW.prototype = {
	save(){
		return [this.name, ...this.params]
	}
}

return MW
