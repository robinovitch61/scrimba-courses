import React from "react";
import ToDoItem from "./components/ToDoItem";
import todosData from "./todosData";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: todosData
    }
  }

  render() {
    const todosComponents = this.state.todos.map(todo => {
      return <ToDoItem key={todo.id} todo={todo} />
    })

    return (
      <div className="todo-list">
        {todosComponents}
      </div>
    )
  }
}