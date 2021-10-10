const editor = require('~/editor')
const builder = require('~/module_builder')
const mods = {}

async function onJSOpen(ev) {
	const fl = ev.target.files

	for (let i = 0, l = fl.length, f, js; i < l; i++){
		f = fl.item(i)	
		console.log(`Name[${f.name}] len[${f.size}] type[${f.type}] lastModified[${(new Date(f.lastModified))}]`)
		js = await f.text()
		try {
			builder.add(mods, f.name, acorn.parse(js, {
				locations: false,
				directSourceFile: false,
				ranges: false,
				ecmaVersion: 2021
			}))
			console.log(mods)
			editor.reload({mod:mods})
		} catch (ex) {
			console.error(ex)
		}
	}
	return mods
}
async function onPicoOpen(ev) {
	let data
	const fl = ev.target.files

	for (let i = 0, l = fl.length, f, json; i < l; i++){
		f = fl.item(i)	
		console.log(`Name[${f.name}] len[${f.size}] type[${f.type}] lastModified[${(new Date(f.lastModified))}]`)
		json = await f.text()
		try {
			data = JSON.parse(json)
			console.log(data)
		} catch (ex) {
			console.error(ex)
		}
	}
	editor.reload(data)
	return data
}
async function onOpen(ev) {
	let data
	const fl = ev.target.files

	for (let i = 0, l = fl.length, f, json; i < l; i++){
		f = fl.item(i)	
		console.log(`Name[${f.name}] len[${f.size}] type[${f.type}] lastModified[${(new Date(f.lastModified))}]`)
		json = await f.text()
		try {
			data = JSON.parse(json)
			console.log(data)
		} catch (ex) {
			console.error(ex)
		}
	}
	editor.reload(data)
	return data
}

function onSave(){
	const data = editor.save()
	download(JSON.stringify(data), 'new.json', 'application/json')
}

// Function to download data to a file
function download(data, filename, type) {
	var file = new Blob([data], {type: type})
	if (window.navigator.msSaveOrOpenBlob) {// IE10+
		window.navigator.msSaveOrOpenBlob(file, filename)
	} else { // Others
		var a = document.createElement("a"),
		url = URL.createObjectURL(file)
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		setTimeout(function() {
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)  
		}, 0) 
	}
}

return function(container){
	const jsOpen = document.getElementById('jsOpen')
	const picoOpen = document.getElementById('picoOpen')
	const fileOpen = document.getElementById('fileOpen')
	const fileSave = document.getElementById('fileSave')

	editor.load(container, {})

	jsOpen.addEventListener('change', onJSOpen)
	picoOpen.addEventListener('change', onPicoOpen)
	fileOpen.addEventListener('change', onOpen)
	fileSave.addEventListener('click', onSave)
}
