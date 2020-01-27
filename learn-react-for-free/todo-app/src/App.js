import React from "react";
import ToDoItem from "./components/ToDoItem";

export default function App() {
  return (
    <div className="todo-list">
      <ToDoItem />
      <ToDoItem />
      <ToDoItem />
    </div>
  )
}