var i = 10000
var store = require('../')({todos: ['initial state']})
var todos = require('./todos')
store.register(todos)
store.subscribe(update)
console.log('START', store())

function update (state) {
  console.log(state)
}

console.time('update')
while (i > 1) {
  i--
  store.dispatch({type: 'UPDATE', data: i})
}

store.unsubscribe(update)
console.log('END', store())
console.timeEnd('update')
