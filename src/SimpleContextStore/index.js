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