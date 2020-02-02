import createStore from './createStore'
import createReducedProvider from './createReducedProvider'
import createReducedState from './createReducedState'
import createSelectContext from './createSelectContext'
import createAsyncUpdater from './createAsyncUpdater'
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
export { createStore }

/**
 * Creates a single Provider by nesting individual Providers
 * @param {Object} providers - { Provider }
 * @returns {ReactElement}
 */
export { createReducedProvider }

/**
 * Creates a hook that returns the combined state of the useState hooks return value
 * Note: any component using this hook will render to all state changes
 * @param {Object} useStates - { useState }
 * @returns {Hook}
 */
export { createReducedState }

/**
 * 
 * @param {*} useUpdateStore 
 * @param {*} param1 
 */
export { createSelectContext }

/* * */
export { createAsyncUpdater } /**
 * Handles updating the store with loading and error states 
 * @param {Hook} useUpdateStore - the second element in the returned array of createStore
 * @param {Object} - an object whose properties are the keys of the loading and error states
 * @returns {Function} - returns a hook and there are a lot of functions involved
 */