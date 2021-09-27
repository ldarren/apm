const Vec = require('~/vec')
const Clip = require('~/clip')

const TYPE_PREFIX = {
	'@': 'spec',
	'$': 'ctx',
	'_': 'data'
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

function Arg(host, name, value, opt){
	const o = Object.assign({}, DEF_OPT, opt)

	this.host = host
	this.name = name
	this.value = value

	const [type, tooltip, display] = this.type()
	this.ele = Vec(host).draw('svg', o).addCl('fix', 'arg', type)
		.addEvt('mouseenter', enter, this)
		.addEvt('mouseleave', leave, this)
		.addEvt('mousedown', click, this).ele
	this.rect = Vec(this.ele).draw('rect', {x:0, y:0, width:'100%', height:'100%'})
		.host().draw('title').text(tooltip)
		.host().draw('text', {'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family':'monospace', x: '50%', y: '50%'}).text(display)
		.host().ele
}

Arg.prototype = {
	type(){
		const v = this.value
		if (undefined === v) return ['empty', this.name, this.name]
		if (!v.charAt) return ['const', JSON.stringify(v), 'C']
		const arr = v.split('.')
		return [TYPE_PREFIX[arr[0]] || 'const', v, arr[arr.length-1]]
	},
	isEmpty(){
		return void 0 === this.value
	},
	save(){
		return [this.value]
	},
	addValue(val){
		const [oldType] = this.type()
		this.value = val
		const [type, tooltip, display] = this.type()
		Vec(this.ele).remCl(oldType).addCl(type).clear()
		this.rect = Vec(this.ele).draw('rect', {x:0, y:0, width:'100%', height:'100%'})
			.host().draw('title').text(tooltip)
			.host().draw('text', {'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family':'monospace', x: '50%', y: '50%'}).text(display)
			.host().ele
	},
}

return Arg
