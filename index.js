module.exports = function store () {
  var state = {}
  var listeners = []
  var initialState
  var reducers

  if (typeof arguments[arguments.length - 1] === 'object') {
    initialState = Array.prototype.pop.call(arguments)
  }

  reducers = Array.prototype.map.call(
    arguments,
    function (r) {
      if (!r) {
        return
      }
      if (initialState) {
        if (!initialState.hasOwnProperty(r.name)) {
          console.warn('initialState.' + r.name + ' is missing.')
        }
        state[r.name] = r(initialState[r.name])
      } else {
        state[r.name] = r()
      }
      return r
    }
  )

  function subscribe (listener) {
    listeners.push(listener)
    return unsubscribe
  }

  function unsubscribe (listener) {
    return listeners.splice(listeners.indexOf(listener), 1)
  }

  function dispatch (action) {
    if (action && typeof action.type !== 'string') {
      console.error('action.type must be a "string"')
    }
    var currentState = getState()
    reducers.forEach(function (r) {
      state[r.name] = r(currentState[r.name], action)
    })
    listeners.forEach(function (l) {
      l(state)
    })
  }

  function getState () {
    return state
  }

  return {
    subscribe: subscribe,
    dispatch: dispatch,
    getState: getState
  }
}
