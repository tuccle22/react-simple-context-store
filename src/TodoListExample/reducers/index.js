import { createReducedProvider } from '../../react-context-state-fns'
import TodoStore from '../features/todos/todoStore'
import FilterStore from '../features/filters/filterStore'

export default createReducedProvider([
  TodoStore,
  FilterStore
])