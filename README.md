# ✨redeux✨
Minimal unidirectional data flow utility library.

- Written in plain 'ol JavaScript so **no transpile needed**⚡️
- Tiny💥
    - [~1k](https://github.com/kristoferjoseph/redeux/blob/master/index.js)
- Simple api of three methods:
    - subscribe/unsubscribe
    - dispatch

## Install

`npm i redeux --save`

##### OR

[`<script src="redeux.umd.js"></script>`](https://github.com/kristoferjoseph/redeux/blob/master/example.html)

## Usage

#### Simplest working example

```js
var createStore = require('redeux')
var store = createStore(todos)

function todos() {
  return []
}

console.log(store()) //{ todos: [] }
```

#### Subscribing to updates

```js
var createStore = require('redeux')
var counter = 0
var initialState = {todos: [counter]}
var store = createStore(todos, initialState)
var unsubscribe = store.subscribe(update)

store.dispatch({type:'add'})
unsubscribe(update)

function todos(state, action) {
  var type = action && action.type
  if (type === 'add') {
    state.push(counter + 1)
  }

  return state
}

function update(state) {
  console.log(state) //{todos[0,1]}
}
```

_btw redeux works really well with [hash-switch](https://github.com/kristoferjoseph/hash-switch)_

