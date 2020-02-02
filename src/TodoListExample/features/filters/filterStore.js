import { createStore } from '../../../react-context-state-fns'

const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

const [
  FilterProvider, useFilterState, useSetFilter
] = createStore(VisibilityFilters.SHOW_ALL)

export { useFilterState, useSetFilter, VisibilityFilters }
export default FilterProvider
