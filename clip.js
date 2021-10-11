let dest 

return {
	dest(target){
		if (dest) {
			dest.rect.classList.remove('dst')
			const evt =__.createEvent('close', {hello: 1}, true, true)
			dest.ele.dispatchEvent(evt)
		}
		if (target && target !== dest) {
			target.rect.classList.add('dst')
			dest = target
			const evt =__.createEvent('open', {hello: 2}, true, true)
			dest.ele.dispatchEvent(evt)
		}else{
			dest = void 0
		}
	},
	compare(target){
		return target === dest
	},
	src(value){
		if (!dest) return
		const d = dest
		this.dest()
		d.addValue(value)
	}
}
