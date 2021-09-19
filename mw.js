const Vec = require('~/vec')

const DEF_OPT = {width: 80, height: 50}

function MW(host, name, opt){
	const o = Object.assign({}, DEF_OPT, opt)
	const tool = Vec(host).draw('svg', o).addCl('draggable').ele
	Vec(tool).draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#a00', stroke:'#baa'}).addCl('route')
	.host().draw('title').text(name)
	.host().draw('text', {x: 10, y:20}).style({fill:'#999', stroke:'#000'}).text(name)

	this.host = host
	this.name = name
	this.ele = tool
}

MW.prototype = {
	save(){
		return [this.name]
	}
}

return MW
