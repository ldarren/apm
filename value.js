const Vec = require('~/vec')
const Clip = require('~/clip')

const TYPE_PREFIX = {
	'@.': 'spec',
	'$.': 'ctx',
	'_.': 'data'
}
const DEF_OPT = {width: 80, height: 50}

function enter(evt){
	if (!Clip.compare()) this.rect.classList.add('hl')
}

function leave(evt){
	this.rect.classList.remove('hl')
}

function click(evt){
	Clip.src(this.name)
}

function Value(host, name, value, opt){
	const o = Object.assign({}, DEF_OPT, opt)

	this.host = host
	this.name = name
	this.value = value
	this.type = TYPE_PREFIX[name.slice(0, 2)] || 'const'
	this.ele = Vec(host).draw('svg', o).addCl('fix', 'val', this.type)
		.addEvt('mouseenter', enter, this)
		.addEvt('mouseleave', leave, this)
		.addEvt('mousedown', click, this).ele
	this.rect = Vec(this.ele).draw('rect', {x:0, y:0, width:'100%', height:'100%'})
		.host().draw('title').text(JSON.stringify(value, null, '\t'))
		.host().draw('text', {'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family':'monospace', x: '50%', y: '50%'}).text(name)
		.host().ele
}

Value.prototype = {
	save(){
		return [this.name.slice(2), this.value]
	}
}

return Value
