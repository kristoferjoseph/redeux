var initialState = []
module.exports = function todos (state, action) {
  state = state || initialState
  action = action || {}
  var type = action.type
  var data = action.data
  switch (type) {
    case 'UPDATE':
      var newState = state.concat()
      newState.push(data)
      return newState
    default:
      return state
  }
}
