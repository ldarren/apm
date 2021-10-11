const Arg = inherit('~/arg')

function VarArg(ctrl, host, name, value, opt){
	this.ctrl = ctrl
	this.constructor.call(this, host, name, value, opt)
}

VarArg.prototype = {
	addValue(val){
		Arg.prototype.addValue.call(this, val)
		if (void 0 === val){
			this.ctrl.removeArg(this)
		}else{
			this.ctrl.addArg(this)
		}
	},
}

return VarArg
