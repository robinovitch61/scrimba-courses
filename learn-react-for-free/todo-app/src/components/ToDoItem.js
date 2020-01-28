import React from "react";

export default class TodoItem extends React.Component {
  render () {

    const handleToDoChange = () => {
      this.props.handleChange(this.props.todo.id);
    }

    return (
      <div className="todo-item">
        <input
          type="checkbox"
          checked={this.props.todo.completed}
          onChange={handleToDoChange}
        />
        <p>{this.props.todo.text}</p>
      </div>
    )
  }
}