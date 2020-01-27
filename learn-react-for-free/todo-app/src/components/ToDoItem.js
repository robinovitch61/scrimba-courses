import React from "react";

export default class ToDo extends React.Component {
  render () {
    return (
      <div className="todo-item">
        <input type="checkbox" checked={this.props.todo.completed}/>
        <p>{this.props.todo.text}</p>
      </div>
    )
  }
}