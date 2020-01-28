import React from "react";
import ToDoItem from "./components/ToDoItem";
import todosData from "./todosData";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: todosData
    }
  }

  handleChange = id => {
    this.setState(prevState => {

      const newtodosData = prevState.todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed
          }
        }
        return todo
      })

      return {
        todos: newtodosData}
    })
  }

  render() {
    const todosComponents = this.state.todos.map(todo => {
      return (
        <ToDoItem
          key={todo.id}
          todo={todo}
          handleChange={this.handleChange}
        />
      )
    })

    return (
      <div className="todo-list">
        {todosComponents}
      </div>
    )
  }
}

export default App;