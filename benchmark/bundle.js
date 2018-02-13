(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var i = 10000
var store = require('../')({todos: ['initial state']})
var todos = require('./todos')
store.register(todos)
store.subscribe(update)
console.log('START', store())

function update (state) {
  console.log(state)
}

console.time('update')
while (i > 1) {
  i--
  store.dispatch({type: 'UPDATE', data: i})
}

store.unsubscribe(update)
console.log('END', store())
console.timeEnd('update')

},{"../":3,"./todos":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}]},{},[1]);
