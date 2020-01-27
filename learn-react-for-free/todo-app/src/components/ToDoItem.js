import React from "react";

export default function ToDo(props) {
  return (
    <div className="todo-item">
      <input type="checkbox" checked={props.todo.completed}/>
      <p>{props.todo.text}</p>
    </div>
  )
}