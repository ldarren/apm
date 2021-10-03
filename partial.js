const Vec = require('~/vec')
const Arg = require('~/arg')

function Partial(name, keys, values){
	this.name = name
	this.keys = keys
	this.values = values

	this.args = []
}

Partial.prototype = {
	draw(host){
		const name = this.name
		Vec(host).draw('title').text(name)
		.host().draw('text', {x: 5, y:15}).style({fill:'#999', stroke:'#000'}).text(name)

		const keys = this.keys
		if (!keys) return
		const values = this.values
		keys.reduce((ctx, key, i) => {
			const arg = new Arg(host, key, values[i], {x:(i * 30), y:20, width: 30, height: 20})
			ctx.args.push(arg)

			return ctx
		}, this)
	},
	save(key = 'value'){
		const args = this.args
		if (args.length) return [this.name, ...this.args.map(arg => arg[key])]
		return this.name
	}
}

return Partial
