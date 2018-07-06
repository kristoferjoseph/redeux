/* global window */
export default function Redeux (initialState) {
  var state = initialState || {}
  var reducers = []
  var listeners = []
  var actions = []
  var timeout

  function register () {
    let args = arguments
    let l = args.length
    let i = 0
    let r
    let key
    for (i; i < l; i++) {
      r = args[i]
      key = r.key || r.name
      if (typeof r === 'function') {
        state[key] = r(state[key])
        reducers.push(r)
      }
    }
    return reducers.length
  }

  function subscribe (listener) {
    return typeof listener === 'function' &&
      listeners.push(listener)
  }

  function unsubscribe (listener) {
    return listeners.splice(listeners.indexOf(listener), 1)
  }

  function dispatch () {
    reduce(actions.pop())
    if (actions.length) {
      window.cancelAnimationFrame(timeout)
      timeout = window.requestAnimationFrame(dispatch)
    } else {
      notify()
    }
  }

  function notify () {
    let i = 0
    let l = listeners.length
    for (i; i < l; i++) {
      listeners[i](state)
    }
  }

  function queue (action) {
    actions.push(action)
    timeout = window.requestAnimationFrame(dispatch)
  }

  function reduce (action) {
    let i = 0
    let l = reducers.length
    let r
    let key
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
