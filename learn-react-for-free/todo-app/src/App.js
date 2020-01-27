import React from "react";
import ToDoItem from "./components/ToDoItem";
import todosData from "./todosData";

export default function App() {
  const todosComponents = todosData.map(todo => {
    return <ToDoItem key={todo.id} todo={todo} />
  })
  
  return (
    <div className="todo-list">
      {todosComponents}
    </div>
  )
}