const MAP_DOWN = {
	ArrayExpression: 'elements',
	ObjectExpression: 'properties',
	FunctionExpression: 'body',
	ArrowFunctionExpression: 'body',
	ClassExpression: 'body',
	ClassBody: 'body',
	MethodDefinition: 'value',
	MemberExpression: 'property',
	CallExpression: 'callee',
	NewExpression: 'callee',
	ExpressionStatement: 'expression',
	AssignmentExpression: 'right',
	Property: 'value',
	ReturnStatement: 'argument',
	BlockStatement: 'body',
	Program: 'body',
}

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

function walk(pt, steps, idx = 0){
	if (steps.length <= idx || !pt) return pt
	const [type, cmp] = steps[idx]

	const pts = Array.isArray(pt) ? pt: [pt]
	for (let i=0, pt, found; pt = pts[i]; i++){
		found = walk(MAP_CMP[type](pt, cmp), steps, idx+1)
		if (found) return found
	}
}

function find(pt, pattern, paths = []){
	const pts = Array.isArray(pt) ? pt : [pt]
	const branches = []

	for (let i = 0, p, d, path; (p = pts[i]); i++){
		if (walk(p, pattern)){
			branches.push(p)
		} else {
			d = MAP_DOWN[p.type]	
			path = []
			if (d && find(p[d], pattern, path)){
				path.unshift(p)
				branches.push(path)	
			}
		}
	}

	switch(branches.length){
	case 0: break
	case 1:
		if (Array.isArray(branches[0])) paths.push(...branches[0])
		else paths.push(branches[0])
		break
	default:
		paths.push(branches)
		break
	}
	return branches.length
}

return {
	walk,
	find,
}
