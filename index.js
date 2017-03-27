module.exports = function store () {
  var state = {}
  var listeners = []
  var initialState
  var reducers

  'object' === typeof arguments[arguments.length - 1] &&
    (initialState = Array.prototype.pop.call(arguments))

  reducers = Array.prototype.map.call(
    arguments,
    function (r) {
      if (r) {
        return initialState ?
          (initialState.hasOwnProperty(r.name) ||
            console.warn('initialState.' + r.name + ' is missing.'),
            state[r.name] = r(initialState[r.name])) :
            state[r.name] = r(), r
      }
    }
  )

  function unsubscribe (listener) {
    return listeners.splice(listeners.indexOf(listener), 1)
  }

  return {
    subscribe: function subscribe (listener) {
      listeners.push(listener)
      return unsubscribe
    },
    dispatch: function dispatch (action) {
      action &&
        'string' !== typeof action.type &&
        console.error('action.type must be a "string"')
      reducers.forEach(function (r) {
        state[r.name] = r(state[r.name], action)
      })
      listeners.forEach(function (l) {
        l(state)
      })
    },
    getState: function getState () {
      return Object.assign({}, state)
    }
  }
}
