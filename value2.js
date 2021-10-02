const Vec = require('~/vec')
const Clip = require('~/clip')

const DEF_OPT = {width: 80, height: 50}

function enter(evt){
	if (!Clip.compare()) this.rect.classList.add('hl')
}

function leave(evt){
	this.rect.classList.remove('hl')
}

function Value2(host, name, onClick, opt){
	const o = Object.assign({}, DEF_OPT, opt)

	this.host = host
	this.name = name
	this.ele = Vec(host).draw('svg', o).addCl('fix', 'val', 'const')
		.addEvt('mouseenter', enter, this)
		.addEvt('mouseleave', leave, this)
		.addEvt('mousedown', onClick, this).ele
	this.rect = Vec(this.ele).draw('rect', {x:0, y:0, width:'100%', height:'100%'})
		.host().draw('title').text(name)
		.host().draw('text', {'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family':'monospace', x: '50%', y: '50%'}).text(name)
		.host().ele
}

Value2.prototype = {
	save(){
		return []
	}
}

return Value2
