var records = Array(10000).fill('yolo', 0, 10000)
var store = require('../')(todos, {todos:records})
var i = 10000
var unsubscribe = store.subscribe(update)
var UPDATE = 'update'

function todos (state, action) {
  state = state || []
  action = action || {}
  var type = action.type || ''
  var data = action.data
  var l = state.length
  var newState
  if (type === 'UPDATE') {
    newState = state.slice()
    newState[Math.floor(Math.random() * l)] = 'holla'
    return newState
  }
  return state
}

function update (state) {
  console.log(':::  STATE :::\n', store())
  unsubscribe(update)
  console.timeEnd('update')
}

console.time('update')

while (i > 1) {
  i--
  store.dispatch({type: 'UPDATE'})
}
