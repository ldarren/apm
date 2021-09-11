const Vec = require('~/vec')

function Button(host, name, opt){
	this.host = host
	this.name = name
	this.opt = opt

	const btn = Vec(host).draw('svg', {x:opt.x, y:opt.y, width: opt.width, height: opt.height})
	.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#999', stroke:'#000'}).host()

	btn.draw('title').text(name)
	.host().draw('text', {y:opt.height/2}).style({fill:'#999', stroke:'#000'}).text(name)
}

Button.prototype = {
	on(key, func){
	}
}

return Button
