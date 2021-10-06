const MAP = {
	exp: 'ExpressionStatement',
	func: 'FunctionDeclaration',
	assign: 'AssignmentExpression',
}

function find(type, cmp){
	const pts = this.pt
	const ltype = MAP[type]A
	const isCmp = Array.isArray(cmp)

	this.pt = pts.find(pt => {
		if (pt.type === ltype) {
			if (isCmp){
			}else{
			}
		}
		return false
	})

	return this
}

function AST(pt){
	if (!(this instanceof AST)){
		return new AST(pt)
	}
	this.pt = pt
	return this
}

AST.find = find

AST.prototype = {
	find,
	reverse(){
		this.pt = this.pt.reverse()
		return this
	}
}

return AST
