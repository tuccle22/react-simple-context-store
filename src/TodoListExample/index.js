import React from 'react';
import App from './components/App';
import Providers from './reducers'

const TodoListExample = () => (
  <Providers>
    <App />
  </Providers>
)

export default TodoListExample
