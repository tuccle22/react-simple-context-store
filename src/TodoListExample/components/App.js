import React from 'react';
import AddTodo from '../features/todos/AddTodo';
import Footer from '../features/filters/Footer';
import VisibilityTodoList from '../features/todos/VisibleTodoList';

const App = () => (
  <div>
    <AddTodo />
    <VisibilityTodoList />
    <Footer />
  </div>
)

export default App;
