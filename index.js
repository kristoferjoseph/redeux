module.exports = function redeux () {
  var state = {}
  var listeners = []
  var name = ''
  var initialState
  var reducers

  'object' === typeof arguments[arguments.length - 1] &&
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

  function store () {
    return Object.assign({}, state)
  }

  store.subscribe = function subscribe (listener) {
    listeners.push(listener)
    return unsubscribe
  }

  function unsubscribe (listener) {
    return listeners.splice(listeners.indexOf(listener), 1)
  }

  store.dispatch = function dispatch (action) {
    action &&
      'string' !== typeof action.type &&
        console.error('action.type must be a "string"')
    reducers.forEach(function (r) {
      name = r.name
      state[name] = r(state[name], action)
    })
    listeners.forEach(function (l) {
      l(state)
    })
  }

  return store
}
