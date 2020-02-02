import { useCallback } from "react"

/**
 * Handles updating the store with loading and error states 
 * @param {Hook} useUpdateStore - the second element in the returned array of createStore
 * @param {Object} - an object whose properties are the keys of the loading and error states
 * @returns {Function} - returns a hook and there are a lot of functions involved
 */
function createAsyncUpdater(useUpdateStore, { loadingKey = 'isLoading', errorKey = 'error' }) {
  function useAsyncUpdate(factoryPromise) {
    const updater = useUpdateStore()
    return useCallback((...args) => (async function() {
      try {
        updater(state => ({...state, [loadingKey]: true, [errorKey]: null}))
        await factoryPromise(updater, ...args)
        // this call likely results in two renders because the calling function
        // is likely also updating the state
        updater(state => ({...state, [loadingKey]: false}))
      } catch (e) {
        updater(state => ({...state, [loadingKey]: false, [errorKey]: e.message}))
      }
    }()), [updater, factoryPromise])
  }
  return useAsyncUpdate
}

export default createAsyncUpdater