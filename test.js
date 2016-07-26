var assert = require('assert')
var redeux = require('./')

function fail(msg) {
  console.error('  ✘ ' + msg)
}

function pass(msg) {
  console.info('  ✔︎ ' + msg)
}

function test(label, func) {
  var f = false
  console.info(label || '')
  try {
    msg = func()
  }
  catch(e) {
    f = e.message
    fail(f)
  }
  finally {
    if (!f) {
      pass('passed')
    }
  }
}

module.exports = function() {

  test('redeux', function() {
    assert(redeux, 'redeux doesn\'t exist')
  })

  test('should be the combination of many reducers', function() {
    function app() {
      return {}
    }
    function tasks() {
      return []
    }

    assert.deepEqual(
      redeux(tasks, app).getState(),
      {app:{},tasks:[]}
    )
  })

  test('should populate with initial state', function() {
    function app() {
      return {}
    }
    function tasks() {
      return []
    }

    assert.deepEqual(
      redeux(tasks, app, {tasks:[1,2,3],app:{}}).getState(),
      {app:{},tasks:[1,2,3]}
    )
  })

  test('should error when initial state and reduced state do not match', function() {
    function app() {
      return {}
    }
    function tasks() {
      return []
    }

    assert.throws(
      function() {
        redeux(
          tasks,
          app,
          {
            things: {},
            tasks:[1,2,3],
            app:{}
          }
        )
      }
      , Error)
  })

  test('redeux.subscribe', function() {
    assert.ok(redeux(function(action, state){}).subscribe, 'subscribe doesn\'t exist')
  })

  test('should subscribe listener', function() {
    var a = function a() {}
    var listeners = []
    redeux(function(action, state){}).subscribe(a, listeners)
    assert.equal(listeners[0], a)
  })

  test('should unsubscribe listener', function() {
    var b = function b() {}
    var listeners = []
    var unsubscribe = redeux(function(action, state){}).subscribe(b, listeners)
    unsubscribe(b)
    assert(listeners.length === 0)
  })

  test('redeux.dispatch', function() {
    assert(redeux(function(action, state){}).dispatch)
  })

  test('should call reducers', function() {
    function tasks(action, state) {
      if (action === 'YOLO') {
        assert(true, action)
      }
      return [1,2,3]
    }

    var action = {
      type: 'YOLO'
    }

    var store = redeux(tasks)
    store.dispatch(action, store.getState())
    assert.deepEqual(store.getState(), {tasks:[1,2,3]})
  })

  test('should call listeners', function(){
    function ear(state) {
      assert.deepEqual(state, {tasks:[1,2,3,4]})
    }

    function tasks(action, state) {
      var type = action && action.type || ''
      var data = action && action.data
      if (type === 'ADD') {
        state.push(data)
        return state
      }
      else {
        return [1,2,3]
      }
    }

    var action = {
      type: 'ADD',
      data: 4
    }

    var store = redeux(tasks)
    store.subscribe(ear)
    store.dispatch(action)
    assert.deepEqual(
      {tasks:[1,2,3,4]},
      store.getState()
    )
  })

}()
