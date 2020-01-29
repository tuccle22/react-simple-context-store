import { createGlobalStoreProvider } from '../../SimpleContextStore'
import TodoStore from '../features/todos/todoStore'
import FilterStore from '../features/filters/filterStore'

export default createGlobalStoreProvider([
  TodoStore,
  FilterStore
])