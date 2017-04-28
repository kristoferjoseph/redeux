(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var records = Array(10000).fill('yolo', 0, 10000)
var store = require('../')(todos, {todos:records})
var i = 10000
var unsubscribe = store.subscribe(update)
var UPDATE = 'update'

function todos (state, action) {
  state = state || []
  action = action || {}
  var type = action.type || ''
  var data = action.data
  var l = state.length
  var newState
  if (type === 'UPDATE') {
    newState = state.slice()
    newState[Math.floor(Math.random() * l)] = 'holla'
    return newState
  }
  return state
}

function update (state) {
  console.log(':::  STATE :::\n', store())
  unsubscribe(update)
  console.timeEnd('update')
}

console.time('update')

while (i > 1) {
  i--
  store.dispatch({type: 'UPDATE'})
}

},{"../":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);
