var test = require('tape')
var Store = require('./')

test('Store', t => {
  test('should exits', t => {
    t.ok(Store, 'exists')
    t.end()
  })
  test('store', t => {
    var store = Store()
    t.test('should exist', t => {
      t.ok(store, 'exists')
      t.end()
    })
    t.test('api', t => {
      t.test('should expose subscribe', t => {
        t.ok(store.subscribe, 'has subscribe')
        t.end()
      })
      t.test('should expose unsubscribe', t => {
        t.ok(store.unsubscribe, 'has unsubscribe')
        t.end()
      })
      t.test('should expose register', t => {
        t.ok(store.register, 'has register')
        t.end()
      })
      t.test('should expose dispatch', t => {
        t.ok(store.dispatch, 'has dispatch')
        t.end()
      })
      t.test('should be a function', t => {
        t.ok(typeof store === 'function', 'can be called for state')
        t.end()
      })
    })
    t.test('usage', t => {
      t.test('should subscribe listener', t => {
        function a () {}
        t.ok(store.subscribe(a), 'can subscribe')
        t.end()
      })
      t.test('should unsubscribe listener', t => {
        function a () {}
        store.subscribe(a)
        t.ok(store.unsubscribe(a), 'can unsubscribe')
        t.end()
      })
      t.test('should register reducer', t => {
        function a (state, action) {
          t.ok(true, 'registered a reducer')
          t.end()
        }
        a.key = 'a'
        store.register(a)
      })
      t.test('should register multiple reducers', t => {
        t.plan(3)
        var store = Store()
        function d (state, action) {
          console.log('REDUCER 1')
          t.ok(true, 'called')
        }
        d.key = 'd'
        function e (state, action) {
          console.log('REDUCER 2')
          t.ok(true, 'called')
        }
        e.key = 'e'
        function f (state, action) {
          console.log('REDUCER 3')
          t.ok(true, 'called')
        }
        f.key = 'f'
        store.register(d, e, f)
      })
      t.test('should be able to dispatch action', t => {
        var store = Store({
          a: 1,
          b: 2
        })
        console.log('STORE', store())
        function l (state) {
          console.log('NOTIFIED', state)
          t.ok(true, 'called')
          t.deepEqual({a: 1, b: 4}, state, 'all working')
        }
        function b (state, action) {
          if (action === 'NOTIFY') {
            return 4
          }
        }
        b.key = 'b'
        store.register(b)
        store.subscribe(l)
        store.dispatch('NOTIFY')
        t.end()
      })
      t.test('should return default state', t => {
        var store = Store()
        function a (state, action) {
          return 1
        }
        a.key = 'a'
        function b (state, action) {
          return 2
        }
        b.key = 'b'
        store.register(a, b)
        t.deepEqual(store(), {a: 1, b: 2}, 'returns default state')
        t.end()
      })
      t.test('should accept initialState', t => {
        var store = Store({
          a: {
            active: [1, 2, 3]
          },
          b: {
            cursor: {
              id: 'yolo'
            }
          }
        })
        function a (state, action) {
          state = state || { active: [] }
          return state
        }
        a.key = 'a'
        function b (state, action) {
          state = state || { cursor: {} }
          return state
        }
        b.key = 'b'
        store.register(a, b)
        t.deepEqual(store(), {
          a: {
            active: [1, 2, 3]
          },
          b: {
            cursor: {
              id: 'yolo'
            }
          } }, 'Populated with initialState')
        t.end()
      })
    })
  })
  t.end()
})
