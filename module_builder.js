const AST = require('~/ast')

const NEXT = [['call', [0]],['member', ['this', 'next']]]
const FUNCS = ['FunctionExpression', 'ArrowFunctionExpression']

function getArg(param){
	switch(param.type){
	case 'Literal':
		return param.value
	case 'Identifier':
		return param.name
	case 'RestElement':
		return '...' + getArg(param.argument)
	case 'AssignmentPattern':
		return getArg(param.left) + ',' + getArg(param.right)
	}
}

function findPartial(arr, i = 0){
	if (arr.length <= i) return	
	const pt = arr[i]
	if ('ReturnStatement' !== pt.type) return findPartial(arr, i+1)
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
	add(mods, fname, ast){
		console.log('[[ast]]', ast)
		const paths = []
		const found = AST.find(ast, NEXT, paths)
		if (!found) return console.error(`no module methods found in ${fname}`)
		console.log('[[paths]]', paths)

		const idx = findProperties(paths)
		const arrs = Array.isArray(paths[idx]) ? paths[idx] : [paths.slice(idx)]
		console.log('[[arrs]]', arrs)
		const mod = arrs.reduce((acc, arr) => {
			const name = arr[0].key.name
			const params = arr[1].params.map(getArg)
			const partial = findPartial(arr.slice(1))
			acc[name] = partial ? [params, partial] : params
			return acc
		}, {})

		const name = fname.split('.')[0]
		Object.assign(mods, {[name]: mod})
		return mods
	}
}
