const Vec = require('~/vec')
const Ctx = require('~/params/ctx')
const Data = require('~/params/Data')
const Const = require('~/params/Const')

let saved
let host
let panelCtx
let panelData
let panelConst

const CTX = '$'
const DATA = '_'
const CONST = '-'

function draw(func, id, name, obj, opt){
	let ele = Vec(host).draw('svg', opt).addAttr({id}).addCl('draggable', 'droppable').ele
	return new func(ele, name, {width: 200, height: 30, border: 10}, obj)
}

function remove(ele){
	ele.ownerSVGElement.removeChild(ele)		
}

return {
	init(h, s){
		host = h
		saved = s
	},
	show(route, data, consts){
		panelCtx = draw(Ctx, CTX, 'CTX', route, saved.ctx)
		panelData = draw(Data, DATA, 'DATA', data, saved.data)
		panelConst = draw(Const, CONST, 'CONST', consts, saved.const)
	},
	close(route){
		remove(panelCtx.ele)
		remove(panelData.ele)
		remove(panelConst.ele)
		panelCtx = panelData = panelConst = void 0
	},
	save(){
	}
}
