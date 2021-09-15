pico.run({
	ajax: __.ajax,
	paths: {
		'~': './',
	}
}, function(){
	const main = require('~/main')

	return function(){
		main(document.getElementsByTagName('main')[0])
	}
})
