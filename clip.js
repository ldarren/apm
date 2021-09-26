let dest 

return {
	dest(target){
		if (dest) dest.rect.classList.remove('dst')	
		if (target) target.rect.classList.add('dst')
		dest = target
	},
	hasDest(){
		return void 0 !== dest
	},
	src(target){
		if (!dest) return
		dest.addValue(target)
		this.dest()
	}
}
