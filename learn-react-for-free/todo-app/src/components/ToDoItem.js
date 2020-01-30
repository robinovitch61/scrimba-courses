import React from "react";

export default class TodoItem extends React.Component {
  render() {
    const handleToDoChange = () => {
      this.props.handleChange(this.props.todo.id);
    }

    const todoTextClass = this.props.todo.completed ? "completed" : "todo";

    return (      
      <div className="todo-item">
        <input
          type="checkbox"
          checked={this.props.todo.completed}
          onChange={handleToDoChange}
        />
        <p className={todoTextClass + "-text"}>{this.props.todo.text}</p>
      </div>
    )
  }
}