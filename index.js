function store(/*things, stuff, ..., initialState*/) {
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
      state[r.name] = r()
      return r
    }
  )

  if (initialState) {
    state = Object.assign({}, state, initialState)
  }

  function subscribe(listener) {
    //NOTE: for testing
    if (arguments.length > 1) {
      listeners = arguments[1]
    }

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
    if (action && typeof action.type === 'string') {
      var currentState = getState()
      reducers.forEach(function(r) {
        state[r.name] = r(action, currentState[r.name])
      })

      listeners.forEach(function(l) {
        l(state)
      })
    }
    else {
      throw Error('action has the required singature: {type:"string"}')
    }
  }

  function getState() {
    if (Array.isArray(state)) {
      return state.slice()
    }
    else if (typeof state === 'object') {
      return Object.assign({}, state)
    }
    else {
      return state
    }
  }

  return {
    subscribe: subscribe,
    dispatch: dispatch,
    getState: getState
  }
}

module.exports = {
  store: store
}
