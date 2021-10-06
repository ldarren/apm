const AST = require('~/ast')

return {
	add(mods, fname, ast){
		const name = fname.split('.')[0]
		const mod = {}

		const pt = AST(ast).bfind('exp', AST.find('assign', ['module', 'exports']))
		console.log(pt)

		Object.assign(mods, {[name]: mod})
		return mods
	}
}
