import React from "react"
import Header from "./components/Header.js"
import MemeGenerator from "./components/MemeGenerator.js"

export default class App extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        <Header />
        <MemeGenerator />
      </div>
    )
  }
}