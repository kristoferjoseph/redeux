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

console.log(store()) // { todos: [] }
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
  console.log(state) // {todos[0,1]}
}
```

#### Immutable work flow

The following is the recommended way to write reducers for redeux.
Every time you mutate or *change* the state passed to a reducer make a copy first. This allows your code to check for changes by doing an equality check on the reducer's state value.

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
  var newState
  if (type === 'add') {
    // Make a copy of the array then mutate
    newState = state.slice()
    newState.push(counter + 1)
    return newState
  }

  return state
}

function update(state) {
  console.log(state) // {todos[0,1]}
}
```
#### Development time coding techniques

Optionally `store`  takes a function that can be used to return a modified state object.
This allows you to return a copied, frozen, whatever version for use during testing or debugging.

##### Copy

This approach is useful when wanting to make sure that no consuming code can mutate the shared state.
This approach does accrue a small performance hit since each read will create a copy so use it wisely.

```js
var createStore = require('redeux')
var store = createStore(function todos (state, action) {return state})
function copy (state) {
  // Makes a copy of the state object to guard against mutations
  return Object.assign(state)
}
// Mutable version
var state = store()
// Immutable version
var immutableState = store(copy)
console.log(state === immutableState) // false
```

##### Freeze

This approach is useful when trying to track down if any consuming code is accidentally mutating the shared state.
When using this approach any accidental mutations will throw an error.
This should only be done in development because it accrues a large performance hit and is only really useful for debugging.

```js
var createStore = require('redeux')
var store = createStore(function todos (state, action) {return state})
var freeze = require('deep-freeze')
function froze (state)
  // Deep freezes the state object to guard against mutations
  return freeze(state)
}
var frozenState = store(froze)
frozenState.todos = [] // Throws an error
```
_btw redeux works really well with [hash-switch](https://github.com/kristoferjoseph/hash-switch)_

