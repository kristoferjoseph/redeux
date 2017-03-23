# ✨redeux✨
Minimal unidirectional data flow utility library.

- Written in plain 'ol JavaScript so **no transpile needed**⚡️
- Tiny💥
    - [1k UMD'd](https://github.com/kristoferjoseph/redeux/blob/master/redeux.umd.js)
    - [1k gzipped](https://closure-compiler.appspot.com/home#code%3D%252F%252F%2520%253D%253DClosureCompiler%253D%253D%250A%252F%252F%2520%2540compilation_level%2520ADVANCED_OPTIMIZATIONS%250A%252F%252F%2520%2540output_file_name%2520default.js%250A%252F%252F%2520%2540code_url%2520https%253A%252F%252Fraw.githubusercontent.com%252Fkristoferjoseph%252Fredeux%252Fmaster%252Findex.js%250A%252F%252F%2520%253D%253D%252FClosureCompiler%253D%253D%250A%250A)
- Legible source code, for humans, so you can read it, with your eyes 👀
- Simple api of three methods:
    - subscribe/unsubscribe
    - dispatch
    - getState

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

console.log(store.getState()) //{ todos: [] }
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

More examples to come...
