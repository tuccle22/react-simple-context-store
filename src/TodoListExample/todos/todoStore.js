import { useCallback } from 'react'
import { createStore } from '../../react-simple-context-store'

const [
  TodosProvider, 
  useTodoState, 
  useUpdateTodoState
] = createStore([])

let todoId = 0
const getNextId = () => todoId++

function useAddTodo() {
  const updateTodos = useUpdateTodoState()
  return useCallback(text =>
    updateTodos(todos => { 
      todos.push({ id: getNextId(), text, completed: false }) 
    }), [updateTodos])
}

function useToggleTodo() {
  const toggleTodo = useUpdateTodoState()
  return useCallback((id) => 
    toggleTodo(todos => {
      const todo = todos.find(todo => todo.id === id)
      if (todo) todo.completed = !todo.completed
  }), [toggleTodo])
} 

export {
  useAddTodo,
  useToggleTodo,
  useTodoState,
  useUpdateTodoState,
  TodosProvider as default
}