var inWindow = require('in-window')
module.exports = function redeux () {
  var state = {}
  var listeners = []
  var name = ''
  var queue = []
  var raf = inWindow ?
    window.requestAnimationFrame :
    setTimeout
  var caf = inWindow ?
    window.cancelAnimationFrame :
    clearTimeout
  var tID
  var initialState
  var reducers

  ('function' !== typeof arguments[arguments.length - 1]) &&
  (initialState = Array.prototype.pop.call(arguments))

  reducers = Array.prototype.map.call(
    arguments,
    function (r) {
      if (r) {
        name = r.name
        state[name] = r(initialState && initialState[name])
        return r
      }
    }
  )

  function store (fn) {
    return fn ? fn(state) : state
  }

  function subscribe (listener) {
    return 'function' === typeof listener ?
      (listeners.push(listener), unsubscribe) :
      console.error('listener must be a function')
  }

  function unsubscribe (listener) {
    return listeners.splice(listeners.indexOf(listener), 1)
  }

  function dispatch () {
    var action = queue.pop()
    reducers.forEach(function (r) {
      name = r.name
      state[name] = r(state[name], action)
    })
    queue.length ?
    (caf(tID), tID = raf(dispatch)) :
    notify()
  }

  function notify () {
    var update = store()
    listeners.forEach(function (l) {
      l(update)
    })
  }

  function prequeue (action) {
    queue.push(action)
    tID = raf(dispatch)
  }

  store.subscribe = subscribe
  store.dispatch = prequeue
  return store
}
