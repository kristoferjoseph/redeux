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
          - unsubscribe a function from state updates
        - **store.dispatch**
          - dispatch an action

## Install

##### node

`npm i redeux --save`

##### script

[`<script src="redeux.umd.js"></script>`](https://github.com/kristoferjoseph/redeux/blob/master/example.html)

##### es module

`import Redeux from 'https://unpkg.com/redeux?module'`

## Usage

#### reducer

this is what a reducer looks like

```js
// Default state
var initialState = []

// By defualt the reducer function's name property
//  will be used as the key for the data atom
//  NOTE: You can also add the `key` property to your reducer function
//  i.e.: `todos.key = todos` useful for when you want to use uglify and mangle is changing function names.
module.exports = function todos (state, action) {
  // Guard against undefined action
  action = action || {}

  // You can use whatever keys you like in your actions,
  //  but i find a type and data works best for me
  var type = action.type
  var data = action.data

  // Guard against undefined state
  //  by initializing with initial state
  state = state || initialState

  switch (type) {
    case 'ADD':
      return add(state, data)
      break;
    default:
      return state;
  }
}

// The add function will get passed the current state and the action data
function add (state, data) {
  // Make a copy of the array
  var newState = state.concat()

  // Change the copy
  newState.push(data)

  // Return the changed copy
  return newState
}

console.log(store()) // { todos: [] }
```

#### Registering a reducer

```js
var todos = require('./reducers/todos')
var initialState = {todos: [1,2,3]}
var store = require('redeux')(initialState)
// You can pass as many reducers as you want to register
store.register(todos)
```

#### Dispatching an action

```js
var store = require('redeux')()
store.dispatch({type: 'ADD', data: '1'})
```

#### Subscribing a listener

```js
var initialState = {todos: [0]}
var store = require('redeux')(initialState)
var todos = require('./reducers/todos')
store.register(todos)
store.subscribe(update)
store.dispatch({type:'ADD', data: 1})
store.unsubscribe(update)

function update(state, action) {
  console.log(state) // {todos[0, 1]}
}
```

_btw redeux works really well with [hash-switch](https://github.com/kristoferjoseph/hash-switch)_

