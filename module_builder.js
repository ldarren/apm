const AST = require('~/ast')

const NEXT = [['member', ['this', 'next']]]
return {
	add(mods, fname, ast){
		const pts = AST.find.call(ast.body, [
			['exp'],
			['=', ['module', 'exports']],
			['obj'],
		])
		console.log(pts)

		const mod = {}
		for(let i=0, pt, fbody, callee; pt = pts[i]; i++){
			fbody = AST.find.call(pt, [
				['prop'],
				['func'],
			])
			console.log('*', i, fbody)
			callee = AST.find.call(fbody, [
				['ret'],
				['call', [0]],
			])
			console.log('**', i, callee)
			if (AST.find.call(callee, NEXT)){
				mod[pt.key.name] = pt.value.params.map(p => p.name)
			}
		}

		const name = fname.split('.')[0]
		Object.assign(mods, {[name]: mod})
		return mods
	}
}
