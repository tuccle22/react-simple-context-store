import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import nextImmutableState from 'immer';
/**
 * Creates a context store that returns a Provider, a hook that returns the state,
 * and a hook that returns an update function
 * @param {any} initialState - initial store state
 * @returns {Array} [
 *    Provider: ReactElement - Provider component that takes children,
 *    useStoreState(): any - get the state of the store
 *    useUpdateStore(): Function - hook that returns a state updater
 * ]
 * Note: This has immer built in for immutable state updates.
 * With immer you MUST either return new state OR mutate the state
 * without returning anything.
 */
function createStore(initialState) {
  const ReadStateContext = createContext()
  const MutateStateContext = createContext()

  function CombinedProvider({children, displayName = ''}) {
    const [state, updateState] = useState(initialState)
    const updateStateImmutably = useCallback(cb => {
      updateState(state => nextImmutableState(state, cb))
    }, [])
    // for debugging purposes
    useEffect(() => {
      ReadStateContext.displayName = displayName + 'State'
      MutateStateContext.displayName = displayName + 'Mutator'
    }, [displayName])

    return ( 
      // Having the updateState function and the state in different
      // contexts prevents unnecessary renders of components
      // using the updater but not using state, which would be the 
      // case if actions and state were in one context
      <MutateStateContext.Provider value={updateStateImmutably}>
        <ReadStateContext.Provider value={state}>
          {children}
        </ReadStateContext.Provider>
      </MutateStateContext.Provider>
    )
  }
  // hook that returns the state
  const useReadState = () => useContext(ReadStateContext)
  // hook that returns a function for mutating the state
  const useMutateState = () => useContext(MutateStateContext)

  return [ CombinedProvider, useReadState, useMutateState ]
}

export default createStore