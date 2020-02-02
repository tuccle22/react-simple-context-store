/**
 * Creates a hook that returns the combined state of the useState hooks return value
 * Note: any component using this hook will render to all state changes
 * @param {Object} useStates - { useState }
 * @returns {Hook}
 */
const createReducedState = ({...useStates}) => () => (
  Object.entries(useStates).reduce((acc, [key, useStoreState]) => {
    function useCurrentState() {
      const storeState = useStoreState()
      return ({...acc, [key]: storeState})
    }
    return useCurrentState()
  }, {})
)

export default createReducedState