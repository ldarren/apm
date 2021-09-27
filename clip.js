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
	src(value){
		if (!dest) return
		dest.addValue(value)
		this.dest()
	}
}
