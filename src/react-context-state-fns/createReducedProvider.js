import React from 'react'
/**
 * Creates a single Provider by nesting individual Providers
 * @param {Object} providers - { Provider }
 * @returns {ReactElement}
 */
function createReducedProvider({...providers}) {
  return function RootProvider({children}) {
    return Object.entries(providers).reduce((tree, [name, Provider]) => {
      Provider.displayName = name
      return <Provider displayName={name}>{tree}</Provider>
    }, children)
  }
}
export default createReducedProvider