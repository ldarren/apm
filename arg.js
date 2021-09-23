const Vec = require('~/vec')
const Clip = require('~/clip')

const TYPE_PREFIX = {
	spec: '@',
	ctx: '$',
	data: '_',
}
const DEF_OPT = {width: 80, height: 50}

function enter(evt){
	this.rect.classList.add('hl')
}

function leave(evt){
	this.rect.classList.remove('hl')
}

function click(evt){
	Clip.dest(this)
}

function Arg(host, name, opt){
	const o = Object.assign({}, DEF_OPT, opt)

	this.host = host
	this.name = name
	this.ele = Vec(host).draw('svg', o).addCl('fix', 'arg', opt.type)
		.addEvt('mouseenter', enter, this)
		.addEvt('mouseleave', leave, this)
		.addEvt('mousedown', click, this).ele
	this.rect = Vec(this.ele).draw('rect', {x:0, y:0, width:'100%', height:'100%'})
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
