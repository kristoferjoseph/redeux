module.exports = function store(/*things, stuff, ..., initialState*/) {
  if (!arguments.length) {
    throw Error('store requires at least one reducer with the signature: function(action, state) {} and can optionally be passed an initial state object as the last argument')
  }
  var state = {}
  var listeners = []
  var initialState
  var reducers

  if (typeof arguments[arguments.length - 1] === 'object') {
    initialState = Array.prototype.pop.call(arguments)
  }

  reducers = Array.prototype.map.call(
    arguments,
    function(r) {
      if (!r) { return }
      state[r.name] = r()
      return r
    }
  )

  if (initialState) {
    Object.keys(initialState)
      .forEach(
        function(k) {
          if (!state.hasOwnProperty(k)) {
            throw Error('initialState keys do not match reduced state keys.')
          }
        }
      )
    state = Object.assign({}, state, initialState)
  }

  function subscribe(listener) {
    if (typeof listener === 'function') {
      listeners.push(listener)
      return unsubscribe
    }
    else {
      throw TypeError('subscribe requires a listener function with the signature: function(state) {}')
    }
  }

  function unsubscribe(listener) {
    if (typeof listener === 'function') {
      return listeners.splice(listeners.indexOf(listener), 1)
    }
    else {
      throw TypeError('unsubscribe requires a listener function with the signature: function(state) {}')
    }
  }

  function dispatch(action) {
    var currentState
    var newState
    if (action && typeof action.type === 'string') {
      currentState = getState()
      reducers.forEach(function(r) {
        state[r.name] = r(action, currentState[r.name])
      })

      newState = getState()
      listeners.forEach(function(l) {
        l(newState)
      })
    }
    else {
      throw Error('action has the required signature: {type:"string"}')
    }
  }

  function getState() {
    return Object.assign({}, state)
  }

  return {
    subscribe: subscribe,
    dispatch: dispatch,
    getState: getState
  }
}
