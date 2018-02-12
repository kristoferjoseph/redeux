var inWindow = typeof window !== 'undefined'
var set = inWindow
  ? window.requestAnimationFrame
  : setTimeout
var cancel = inWindow
  ? window.cancelAnimationFrame
  : clearTimeout
var timeout

module.exports = function Redeux (initialState) {
  var state = initialState || {}
  var reducers = []
  var listeners = []
  var actions = []

  function register () {
    var args = arguments
    var l = args.length
    var i = 0
    var r
    for (i; i < l; i++) {
      r = args[i]
      typeof r === 'function' &&
        reducers.push(r)
    }
  }

  function subscribe (listener) {
    return typeof listener === 'function' &&
      listeners.push(listener)
  }

  function unsubscribe (listener) {
    return listeners.splice(listeners.indexOf(listener), 1)
  }

  function dispatch () {
    var action = actions.pop()
    reduce(action)
    if (actions.length) {
      cancel(timeout)
      timeout = set(dispatch)
    } else {
      notify()
    }
  }

  function notify () {
    var i = 0
    var l = listeners.length
    for (i; i < l; i++) {
      listeners[i](state)
    }
  }

  function queue (action) {
    actions.push(action)
    timeout = set(dispatch)
  }

  function reduce (action) {
    var i = 0
    var l = reducers.length
    var r
    var key
    for (i; i < l; i++) {
      r = reducers[i]
      key = r.key || r.name
      state[key] = r(state[key], action)
    }
    return state
  }

  function store (fn) {
    return fn
      ? fn(reduce())
      : reduce()
  }

  store.subscribe = subscribe
  store.unsubscribe = unsubscribe
  store.register = register
  store.dispatch = queue
  return store
}
