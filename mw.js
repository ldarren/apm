const Vec = require('~/vec')

const DEF_OPT = {width: 80, height: 50}

function MW(host, name, opt){
	const o = Object.assign({}, DEF_OPT, opt)
	const tool = Vec(host).draw('svg', o).addCl('draggable').ele
	Vec(tool).draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#a00', stroke:'#baa'}).addCl('route')
	.host().draw('text', {x: 10, y:20}).style({fill:'#999', stroke:'#000'}).text(name)

	this.ele = tool
}

MW.prototype = {
	attr(...args){
		return Vec(this.ele).attr()(...args).out
	},
	intAttr(...args){
		return Vec(this.ele).attr(parseInt)(...args).out
	}
}

return MW
