function showCTX(ctx, opt){
	if (!ctx) return
	const panel = Vec(this.host).draw('svg', opt).addAttr({id: SPEC, x: opt.x, y: opt.y}).addCl('draggable', 'droppable').ele
	mapped[SPEC] = new Spec(panel, 'Spec', {width: 200, height: 30, border: 10}, spec)
}

function showData(){
}

function showConst(){
}

return {
	init(saved){
	},
	show(route, data, consts){
	},
	close(route){
	},
	save(){
	}
}
