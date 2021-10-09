const AST = require('~/ast')

const NEXT = [['member', ['this', 'next']]]
return {
	add(mods, fname, ast){
		const paths = []
		const found = AST.find(ast, NEXT, paths)
		console.log('*', found)
		console.log('**', paths)
	/*
		const pts = AST.walk(ast.body, [
			['exp'],
			['=', ['module', 'exports']],
			['obj'],
		])
*/
		const mod = {}
		/*
		for(let i=0, pt, fbody, callee; pt = pts[i]; i++){
			fbody = AST.walk(pt, [
				['prop'],
				['func'],
			])
			callee = AST.walk(fbody, [
				['ret'],
				['call', [0]],
			])
			if (AST.walk(callee, NEXT)){
				mod[pt.key.name] = pt.value.params.map(p => p.name)
			}
		}
		*/

		const name = fname.split('.')[0]
		Object.assign(mods, {[name]: mod})
		return mods
	}
}
