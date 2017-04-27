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

  test('  should be the combination of many reducers', function() {
    function app() {
      return {}
    }
    function tasks() {
      return []
    }

    assert.deepEqual(
      redeux(tasks, app)(),
      {app:{},tasks:[]}
    )
  })

  test('  should populate with initial state', function() {
    function app(state, action) {
      return state || {}
    }
    function tasks(state, action) {
      return state || []
    }

    assert.deepEqual(
      redeux(tasks, app, {tasks:[1,2,3],app:{}})(),
      {app:{},tasks:[1,2,3]}
    )
  })

  test('  should handle undefined reducers/initial state gracefully', function() {
    assert.ok(redeux(undefined))
  })

  test('redeux.subscribe', function() {
    assert.ok(redeux(function(state, action){}).subscribe, 'subscribe doesn\'t exist')
  })

  test('  should return unsubscribe', function () {
    assert.equal(
      redeux(function () {})
        .subscribe(function () {}).name, 'unsubscribe')
  })

  test('redeux.dispatch', function() {
    assert(redeux(function(state, action){}).dispatch)
  })

  test('  should call reducers', function() {
    function tasks(state, action) {
      if (action === 'YOLO') {
        assert(true, action)
      }
      return [1,2,3]
    }

    var action = {
      type: 'YOLO'
    }

    var store = redeux(tasks)
    store.dispatch(action)
    store.subscribe(function (data) {
      assert.deepEqual(data, {tasks:[1,2,3]})
    })
  })

  test('  should call listeners', function(){
    function ear(state) {
      assert.deepEqual(state, {tasks:[1,2,3,4]})
    }

    function tasks(state, action) {
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
  })

  test('  should not mutate by default', function () {
    function tasks (state, action) {
      return state
    }

    var store = redeux(tasks)
    var state = store()
    store.dispatch({type:'mutated?'})
    assert.strictEqual(state, store())
    assert.strictEqual(store().tasks, tasks())
  })

  test('  should enable immutable state', function () {
    function tasks (state, action) {
      return state
    }

    var store = redeux(tasks)
    var state = store(function (s) { return Object.assign({}, s)})
    assert.notEqual(state, store())
  })

  test('  should enable shouldUpdate', function () {
    function tasks (state, action) {
      var type = action && action.type || ''
      var data = action && action.data
      var newState
      if (type === 'ADD') {
        newState = state.slice()
        newState.push(data)
        return newState
      }

      return state
    }

    var store = redeux(tasks, {tasks:[1,2,3]})
    var state = store()
    store.dispatch({type:'ADD', data:4})
    assert.strictEqual(state, store())
    assert.notStrictEqual(store().tasks, tasks())
    store.subscribe(function (data) {
      assert.deepEqual(data.tasks, [1,2,3,4])
    })
  })

}()
