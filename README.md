## React Simple Context Store

This is a proof of concept of using react's context and hooks to manage the access and mutation of state, globally (and/or locally).
This implementation is inferior to redux in many ways.

### Contents

This repository was bootstrapped with create-react-app, so start the
development server with `yarn start` or `npm start` to see the example app.

#### TodoListExample

The TodoListExample app is a copy
of this https://codesandbox.io/s/rtk-convert-todos-example-uqqy3?from-embed
todo list app, using react-simple-context-store (this non existant library) instead of redux to manage state. The linked app isn't using react-redux hooks, so it is more verbose than it could be.

#### React-Simple-Context-Store

```js
import { createStore, createGlobaStoreProvider } from 'react-simple-context-store'
```


#### #1 `createStore(initialState)`
pass in an initial state and this function returns an array containing a `Provider` component, `useStoreState` hook to access the store's state, and `useUpdateStore` hook that returns a function, which takes a state update function.

```js
import { createStore } from 'react-simple-context-store'
const [
  ListProvider, useStoreState, useUpdateStoreState
] = createStore({
  '1': { text: 'item #1' },
  '2': { text: 'item #2' },
  '3': { text: 'item #3' }
})
const Sidebar = () => (
  <ListProvider> {/** a local context store  */ }
    <SomeList />
  </ListProvider>
)
const SomeList = () => {
  const listItems = useStoreState()
  // usually you wouldn't use updateStoreState
  // in a component directly
  const updateState = useUpdateStoreState()
  return (
    <ul>
      { Object.entries(listItems).map(([id, { text }]) => 
        <li key={id}
          // because the state uses immer, we only need to mutate
          // the state for immer to return a copy of mutated state
          onClick={() => updateState(state => {
            state[id].text = '-------'
          })}>
          {text}
        </li>
      )}
    </ul>
  )
}
```

#### #2 `createGlobalStoreProvider([...providers])` 
Pass in an array of the first array result from the `createStore` funtion result. This function just reduces any number of react components into a single nested hierarchy (you can pass any components that take a children prop and passes it through, such as a component with a hook that listens for server side changes).

```js
import { createStore,  createGlobalStoreProvider } from 'react-simple-context-store'

const [ListProvider,] = createStore([])
const [TodoProvider,] = createStore({hello: { world: '!'}})
const [ThemeProvider,] = createStore('NIGHT')

const GlobalStoreProvider = createGlobalStoreProvider([
  ListProvider,
  TodoProvider,
  ThemeProvider,
])

render(
  <GlobalStoreProvider>
    <App />
  </GlobalStoreProvider>,
  /**
   * Three global stores create the hierarchy below. Because
   * of this deeply nested structure it would be wise to limit
   * the number of glabl stores added.
   * 
   * This is the component hierarchy the above produces.
   * <GlobalStoreProvider>
   *   <ListProvider>
   *     <ListProviderActions.Provider>
   *       <ListProviderState.Provider>
   *         <TodoProvider>
   *           <TodoProviderActions.Provider>
   *             <TodoProviderState.Provider>
   *               <ThemeProvider>
   *                 <ThemeProviderActions.Provider>
   *                   <ThemeProviderState.Provider>
   *                     <App />
   *                   </ThemeProviderState.Provider>
   *                 </ThemeProviderActions.Provider>
   *               </ThemeProvider>
   *             <TodoProviderState.Provider>
   *           <TodoProviderActions.Provider>
   *         </TodoProvider>
   *       </ListProviderState.Provider>
   *     </ListProviderActions.Provider>
   *   </ListProvider>
   * </GlobalStoreProvider>
   */
  document.getElementeBy('root')
)
```
#### Complete library code:

```js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
  const MutateStateContext = createContext()

  const useStoreState = () => useContext(StateContext)
  const useUpdateStore = () => useContext(MutateStateContext)

  function CombinedProvider({children, displayName}) {
    const [state, updateState] = useState(initialState)
    const updateStateImmutably = useCallback(cb => {
      updateState(state => nextImmutableState(state, cb))
    }, [])
    // for debugging purposes
    useEffect(() => {
      StateContext.displayName = displayName + 'State'
      MutateStateContext.displayName = displayName + 'Actions'
    }, [displayName])
    return ( 
      // Having the updateState function and the state in different
      // contexts prevents unnecessary renders of components
      // using the updater but not using state, which would be the 
      // case if actions and state were in one context
      <MutateStateContext.Provider value={updateStateImmutably}>
        <StateContext.Provider value={state}>
          {children}
        </StateContext.Provider>
      </MutateStateContext.Provider>
    )
  }
  return [ CombinedProvider, useStoreState, useUpdateStore ]
}
/**
 * Creates a Global Provider by nesting the individual providers
 * @param {Array} stores 
 * @returns {React.Element}
 */
const createGlobalStoreProvider = ({...providers}) => {
  return function RootProvider({children}) {
    return Object.entries(providers).reduce((tree, [name, Provider]) => {
      Provider.displayName = name
      return <Provider displayName={name}>{tree}</Provider>
    }, children)
  }
}

export { createGlobalStoreProvider, createStore }
```