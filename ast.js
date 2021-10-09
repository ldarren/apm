const MAP_CMP = {
	exp(pt){
		if ('ExpressionStatement' === pt.type) return pt.expression
	},
	'=': function(pt, cmp){
		if ('AssignmentExpression' !== pt.type || '=' !== pt.operator) return
		let left = pt.left
		if (!MAP_CMP['member'](left, cmp)) return
		return pt.right
	},
	obj(pt){
		if ('ObjectExpression' === pt.type) return pt.properties
	},
	prop(pt, cmp){
		if ('Property' !== pt.type) return
		if (Array.isArray(cmp) && pt.key.name !== cmp[0]) return
		return pt.value
	},
	func(pt, cmp){
		if ('FunctionExpression' !== pt.type) return
		if (Array.isArray(cmp) && pt.id !== cmp[0]) return
		return pt.body.body
	},
	ret(pt){
		if ('ReturnStatement' !== pt.type) return
		return pt.argument
	},
	call(pt, cmp){
		if ('CallExpression' !== pt.type) return
		if (Array.isArray(cmp) && cmp[0] !== pt.arguments.length) return
		return pt.callee
	},
	member(pt, cmp){
		if ('MemberExpression' !== pt.type) return false
		if (!Array.isArray(cmp) || 2 !== cmp.length) return true
		if ('this' === cmp[0]){
			return 'ThisExpression' === pt.object.type
		}else{
			return cmp[0] === pt.object.name
		}
		return cmp[1] !== pt.property.name
	}
}

function find(steps, idx = 0){
	if (steps.length <= idx || !this) return this
	const [type, cmp] = steps[idx]

	const pts = Array.isArray(this) ? this: [this]
	for (let i=0, pt, found; pt = pts[i]; i++){
		found = find.call(MAP_CMP[type](pt, cmp), steps, idx+1)
		if (found) return found
	}
}

return {
	find,
}
