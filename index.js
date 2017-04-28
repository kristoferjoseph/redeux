module.exports = function redeux () {
  var state = {}
  var listeners = []
  var name = ''
  var queue = []
  var raf = 'undefined' === typeof window ?
    setTimeout :
    window.requestAnimationFrame
  var initialState
  var reducers

  ('object' === typeof arguments[arguments.length - 1]) &&
  (initialState = Array.prototype.pop.call(arguments))

  reducers = Array.prototype.map.call(
    arguments,
    function (r) {
      if (r) {
        name = r.name
        return initialState ?
          (initialState.hasOwnProperty(name) ||
          console.warn('initialState.' + name + ' is missing.'),
          state[name] = r(initialState[name])) :
          state[name] = r(), r
      }
    }
  )

  function store (func) {
    return func ? func(state) : state
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
    action &&
    'string' !== typeof action.type &&
    console.error('action.type must be a "string"')
    reducers.forEach(function (r) {
      name = r.name
      state[name] = r(state[name], action)
    })
    queue.length ? raf(dispatch) : notify()
  }

  function notify () {
    var update = store()
    listeners.forEach(function (l) {
      l(update)
    })
  }

  function prequeue (action) {
    queue.push(action)
    raf(dispatch)
  }

  store.subscribe = subscribe
  store.dispatch = prequeue
  return store
}
