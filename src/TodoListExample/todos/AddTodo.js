import React, { useState } from 'react'
import { useAddTodo } from './todoStore'

const AddTodo = () => {
  const addTodo = useAddTodo()
  const [todoText, setTodoText] = useState('')
  
  const onChange = e => setTodoText(e.target.value)

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!todoText.trim()) {
            return
          }
          addTodo(todoText)
          setTodoText('')
        }}
      >
        <input value={todoText} onChange={onChange} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  )
}

export default AddTodo
