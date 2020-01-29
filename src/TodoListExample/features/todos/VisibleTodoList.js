import React from 'react'
import TodoList from './TodoList'
import { useTodoState, useToggleTodo } from './todoStore'
import { useFilterState, VisibilityFilters } from '../filters//filterStore'

function useGetFilteredList() {
  const filter = useFilterState()
  const todos = useTodoState()
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(t => t.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

function VisibilityTodoList() {
  const filteredTodos = useGetFilteredList()
  const toggleTodo = useToggleTodo()
  return (
    <TodoList todos={filteredTodos} toggleTodo={toggleTodo} />
  )
}

export default VisibilityTodoList