let curr 

return {
	dest(target){
		if (curr) curr.rect.classList.remove('sel')	
		target.rect.classList.add('sel')
		curr = target
	},
	getDest(){
	},
	source(){
	}
}
