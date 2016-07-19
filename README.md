# ✨redeux✨
Minimal unidirectional data flow utility library.

- Written in plain ol JavaScript so **no transpile needed**.⚡️
- Under 1k minified💥
- Legible source code, for humans, so you can read it, with your eyes 👀.
- Simple api of three methods:
      - store :returns:
          - subscribe :returns:
              - unsubscribe
          - dispatch
          - getState

## Install

`npm i redeux --save`

## Usage

#### Simplest working example

```js
var createStore = require('redeux').store
var store = createStore(todos)

function todos() {
  return []
}

console.log(store.getState()) //{ todos: [] }
```

#### Subscribing to updates

```js
var createStore = require('redeux').store
var counter = 0
var initialState = {todos: [counter]}
var store = createStore(todos, initialState)
var unsubscribe = store.subscribe(update)
store.dispatch({type:'add'})
unsubscribe(update)

function todos(action, state) {
  var type = action && action.type
  if (type === 'add') {
    state.push(counter + 1)
  }

  return state
}

function update(state) {
  console.log(store.getState()) //{todos[0,1]}
}
```

_btw redeux works really well with [hash-switch](https://github.com/kristoferjoseph/hash-switch)_

More examples to come...
