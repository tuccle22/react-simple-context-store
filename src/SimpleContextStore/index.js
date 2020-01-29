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