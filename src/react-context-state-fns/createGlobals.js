import createReduceProvider from './createReducedProvider'
import createReducedState from './createReducedState'

const createGlobals = (providers, useStates, selector) => [
  createReduceProvider(providers),
  createReducedState(useStates),
  
]