# redeux
Minimal unidirectional data flow utility library.

- Written in plain 'ol JavaScript so **no transpile needed**⚡️
- Tiny💥
    - [~1k](https://github.com/kristoferjoseph/redeux/blob/master/index.js)
- Simple api:
    - **store**
      - returns the current state
        - **store.register**
          - register any number of reducers
        - **store.subscribe**
          - subscribe a function to receive state updates
        - **store.unsubscribe**
          - unsubscribe a function from state updated
        - **store.dispatch**
          - dispatch an action

## Example

✅ [Obligatory todo app example](https://kristoferjoseph.com/redeux-todos/)

[source code](https://github.com/kristoferjoseph/redeux-todos)

## Install

`npm i redeux --save`

##### OR

[`<script src="redeux.umd.js"></script>`](https://github.com/kristoferjoseph/redeux/blob/master/example.html)

## Usage

#### Simplest working example

```js
var createStore = require('redeux')
var store = createStore()
store.register(todos)

function todos(state, action) {
  state = state || []
  return state.concat()
}

console.log(store()) // { todos: [] }
```

#### Subscribing to updates

```js
var createStore = require('redeux')
var initialState = {todos: [0]}
var store = createStore(initialState)
store.register(todos)
store.subscribe(update)
store.dispatch({type:'add'})
store.unsubscribe(update)

function todos(state, action) {
  state = state || [0]
  action = action || {}
  var type = action.type
  if (type === 'add') {
    state = state.concat()
    state.push(state[state.length-1] + 1)
  }

  return state
}

function update(state) {
  console.log(state) // {todos[0,1]}
}
```

_btw redeux works really well with [hash-switch](https://github.com/kristoferjoseph/hash-switch)_

