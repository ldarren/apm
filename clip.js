let dest 

return {
	dest(target){
		if (dest) dest.rect.classList.remove('dst')	
		if (target && target !== dest) {
			target.rect.classList.add('dst')
			dest = target
		}else{
			dest = void 0
		}
	},
	compare(target){
		return target === dest
	},
	src(value){
		if (!dest) return
		dest.addValue(value)
		this.dest()
	}
}
