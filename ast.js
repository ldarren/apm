const NEXT = [['call', [0]],['member', ['this', 'next']]]
const FUNCS = ['FunctionExpression', 'ArrowFunctionExpression']
const RETURNS = ['ReturnStatement', 'ArrowFunctionExpression']

const MAP_DOWN = {
	ArrayExpression: 'elements',
	ObjectExpression: 'properties',
	FunctionExpression: 'body',
	ArrowFunctionExpression: 'body',
	ClassExpression: 'body',
	ClassBody: 'body',
	MethodDefinition: 'value',
	MemberExpression: 'property',
	CallExpression: 'arguments',
	NewExpression: 'arguments',
	ExpressionStatement: 'expression',
	AssignmentExpression: 'right',
	Property: 'value',
	ReturnStatement: 'argument',
	BlockStatement: 'body',
	Program: 'body',
	IfStatement: 'consequent',
	TryStatement: 'block',
	FunctionDeclaration: 'body',
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

function getArg(param){
	switch(param.type){
	case 'Literal':
		return param.value
	case 'Identifier':
		return param.name
	case 'RestElement':
		return '...' + getArg(param.argument)
	case 'AssignmentPattern':
		return getArg(param.left) + ',' + JSON.stringify(getArg(param.right))
	case 'ObjectExpression':
		return {}
	}
}

function findPartial(arr, i = 0){
	if (arr.length <= i) return	
	const pt = arr[i]
	if (!RETURNS.includes(pt.type)) return findPartial(arr, i+1)
	if (FUNCS.includes(arr[i+1].type)) return arr[i+1].params.map(getArg)
	return findPartial(arr, i+1)
}

function findProperties(arr, i = 0){
	if (arr.length <= i) return	
	const pt = arr[i]
	if ('ObjectExpression' !== pt.type) return findProperties(arr, i+1)
	return i+1
}

return {
	walk,
	find,
	convert(fname, ast){
		const paths = []
		const found = find(ast, NEXT, paths)
		if (!found) {
			console.error(`no module methods found in ${fname}`)
			return {}
		}

		const idx = findProperties(paths)
		const arrs = Array.isArray(paths[idx]) ? paths[idx] : [paths.slice(idx)]
		const mod = arrs.reduce((acc, arr) => {
			const name = arr[0].key.name
			const params = arr[1].params.map(getArg)
			const partial = findPartial(arr.slice(1))
			acc[name] = partial ? [params, partial] : params
			return acc
		}, {})

		const name = fname.split('.')[0]
		return {[name]: mod}
	}
}
