const Vec = require('~/vec')

function Button(host, name, opt){
	this.host = host
	this.name = name
	this.opt = opt
	this.hdls = {}

	this.hit = Vec(host).draw('svg', {x:opt.x, y:opt.y, width: opt.width, height: opt.height})
	.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#999', stroke:'#000'})
	.host().draw('title').text(name)
	.host().draw('text', {'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family':'monospace', x: '50%', y: '50%'}).style({fill:'#999', stroke:'#000'}).text(name)
	.host().ele
}

function hdl(ctx, func){
	return evt => func.call(ctx, evt)
}

Button.prototype = {
	on(key, func, ctx){
		this.hdls[key] = hdl(ctx, func)
		this.hit.addEventListener(key, this.hdls[key])
	},
	off(key, func){
		this.hit.removeEventListener(key, this.hdls[key])
		delete this.hdls[key]
	}
}

return Button
