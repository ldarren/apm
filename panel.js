const Vec = require('~/vec')

function Panel(host, name, opt = {}){
	this.host = host
	this.name = name
	this.opt = opt

	this.ele = Vec(host).addAttr({width: (opt.border * 2) + opt.width, height: (opt.border * 3) + opt.header})
	.draw('rect', {x:0, y:0, width:'100%', height:'100%'}).style({fill:'#999', stroke:'#000'})
	.host().draw('title').text(name)
	.host().draw('text', {x:opt.border, y:opt.border + opt.header/2}).style({fill:'#999', stroke:'#000'}).text(name)
	.host().ele
	this.inner = Vec(host).draw('svg', {x:opt.border, y:opt.header + (2 * opt.border)}).addCl('inner').ele
}

Panel.prototype = {
	expand(count){
		const o = this.opt
		const host = this.inner

		host.setAttribute('width', o.width)
		host.setAttribute('height', count * o.height)
		const hhost = host.ownerSVGElement
		hhost.setAttribute('height', (o.border * 3) + o.header + (count * o.height))
		hhost.setAttribute('width', (o.border * 2) + o.width)
	},
	onDrag(target){
		return this
	},
	onDrop(target){
		target.ownerSVGElement.removeChild(target)
	},
	save(){
		return {
			unknown: {
				[this.name]: []
			}
		}
	}
}

return Panel
