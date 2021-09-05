const Vec = require('~/vec')

function Panel(host, name, opt = {}){
	this.host = host
	this.name = name
	this.opt = opt

	Vec(host).addAttr({width: (opt.border * 2) + opt.width, height: (opt.border * 3) + opt.header})
	.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#999', stroke:'#000'}).
	host().draw('text', {x:opt.border, y:opt.border + opt.header/2}).style({fill:'#999', stroke:'#000'}).text(name)
	this.inner = Vec(host).draw('svg', {x:opt.border, y:opt.header + (2 * opt.border)}).addCl('inner').ele
}

Panel.prototype = {
	onDrag(target){
		return target
	},
	onDrop(target){
		target.ownerSVGElement.removeChild(target)
	},
}

return Panel
