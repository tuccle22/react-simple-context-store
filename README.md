## React Simple Context Store

This is an example of using react's context to manage a global state.
This implementation has limitations, in part due to the limitations of
react context, but also probably due to how it's implemented.

### Contents

This repository was bootstrapped with create-react-app, so start the
development server with `yarn start` or `npm start`.

#### TodoListExample

This repository contains a TodoListExample app which is a copy
of this https://codesandbox.io/s/rtk-convert-todos-example-uqqy3?from-embed
todo list app, using react-simple-context-store instead of redux to manage state. The linked app isn't using the hooks in react-redux, so it is a little more verbose than it could be.

#### React-Simple-Context-Store

```js
import { createStore, createGlobaStoreProvider } from 'react-simple-context-store'
```


#### #1 `createStore(initialState)`
pass in an initial state and this function returns an array containing a `Provider` component, `useStoreState` hook to access the store's state, and `useUpdateStore` hook that returns a function, which takes a state update function.

```js
import { createStore } from 'react-simple-context-store
const [
  ListProvider, useStoreState, useUpdateStoreState
] = createStore({
  id: { text: 'item #1' },
  id: { text: 'item #2' },
  id: { text: 'item #3' }
})
const Sidebar = () => (
  <ListProvider> // a non global store
    <SomeList>
  </ListProvider>
)
const SomeList = () => {
  const listItems = useStoreState()
  // usually you wouldn't use updateStoreState
  // in a component directly
  const updateState = useUpdateStoreState()
  return (
    <ul>
      {Object.entries(listItems).map(([id, { text }])) => 
        <li key={id}
          // because the state uses immer, we only need to mutate
          // the state for immer to return a copy of mutated state
          onClick={() => updateState(state => {state[id].text = '-------')}>
          {item}
        </li>
      }
    </ul>
  )
}
```

#### #2 `createGlobalStoreProvider([...providers])` 
pass in an array of the first array result from the `createStore` returned array. (You can pass any components that take a children prop and pass it through here)   

```js
import { createStore,  createGlobalStoreProvider } from 'react-simple-context-store

const [ListProvider,] = createStore([])
const [TodoProvider,] = createStore({hello: { world: '!'}})
const [ThemeProvider,] = createStore('NIGHT')

const GlobalStoreProvider = createGlobalStoreProvider([
  ListProvider,
  TodoProvider,
  ThemeProvider,
  ...etc
])
. . . 
render(
  <GlobalStoreProvider>
    <App>
  </GlobalStoreProvider>,
  document.getElementeBy('root')
)
```
#### Complete library code (55 lines):

```js
import React, { createContext, useContext, useState, useCallback } from 'react';
import nextImmutableState from 'immer';
/**
 * Creates a store that returns a Provider, a hook to get the state,
 * and a hook that returns an update function
 * @param {any} initialState
 * @returns {Array} [
 *    <Provider>{children}<Provider - Provider component,
 *    useStoreState(): any - get the state of the store
 *    useUpdateStore(): Function - hook that returns a state updater
 * ]
 * Note: This has immer built in for immutable state updates.
 * With immer you MUST either return new state OR mutate the state
 * without returning anything.
 */
function createStore(initialState) {
  const StateContext = createContext()
  const SetStateContext = createContext()

  const useStoreState = () => useContext(StateContext)
  const useUpdateStore = () => useContext(SetStateContext)

  function CombinedProvider({children}) {
    const [state, updateState] = useState(initialState)
    const updateStateImmutably = useCallback(cb => {
      updateState(state => nextImmutableState(state, cb))
    }, [])
    return ( 
      // Having the updateState function and the state in different
      // contexts prevents unnecessary renders of components
      // using the updater but not using state, which would be the 
      // case if actions and state were in one context
      <SetStateContext.Provider value={updateStateImmutably}>
        <StateContext.Provider value={state}>
          {children}
        </StateContext.Provider>
      </SetStateContext.Provider>
    )
  }
  return [ CombinedProvider, useStoreState, useUpdateStore ]
}
/**
 * Creates a Global Provider by nesting the individual providers
 * @param {Array} stores 
 * @returns {React.Element}
 */
const createGlobalStoreProvider = (providers) => {
  return function RootProvider({children}) {
    return providers.reduce((tree, Provider) => {
      return <Provider>{tree}</Provider>
    }, children)
  }
}

export { createGlobalStoreProvider, createStore }
```