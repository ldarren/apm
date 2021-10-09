const AST = require('~/ast')

const NEXT = [['call', [0]],['member', ['this', 'next']]]
const FUNCS = ['FunctionExpressio', 'ArrowFunctionExpression']

function findPartial(arr, i = 0){
	if (arr.length <= i) return	
	const pt = arr[i]
	if ('ReturnStatement' !== pt.type) return findPartial(arr, i+1)
	if (FUNCS.includes(arr[i+1].type)) return arr[i+1].params.map(p => p.name)
	return findPartial(arr, i+1)
}

return {
	add(mods, fname, ast){
		const paths = []
		const found = AST.find(ast, NEXT, paths)
		console.log('**', paths)

		const arrs = paths.find(p => Array.isArray(p))
		const mod = arrs.reduce((acc, arr) => {
			const name = arr[0].key.name
			const params = arr[1].params.map(p => p.name)
			const partial = findPartial(arr.slice(1))
			acc[name] = partial ? [params, partial] : params
			return acc
		}, {})

		const name = fname.split('.')[0]
		Object.assign(mods, {[name]: mod})
		return mods
	}
}
