var records = Array(10000).fill('yolo', 0, 10000)
var store = require('./')(todos, {todos:records})
var i = 10000
var unsubscribe

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
  // Switch wich read is commented out
  //  and run `node benchmark.js` again to see the difference in performance
  //var data = store()
  var data = store(function (s) { return Object.assign(s)})
}

unsubscribe = store.subscribe(update)

console.time('update')

while (i > 1) {
  i--
  store.dispatch({type: 'UPDATE'})
}

console.log(':::  STATE :::\n', store())

unsubscribe(update)

console.timeEnd('update')
