let curr 

return {
	dest(target){
		if (curr) curr.rect.classList.remove('dst')	
		target.rect.classList.add('dst')
		curr = target
	},
	getDest(){
	},
	source(){
	}
}
