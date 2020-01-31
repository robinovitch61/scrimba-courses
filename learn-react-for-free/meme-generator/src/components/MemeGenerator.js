import React from "react"

export default class MemeGenerator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      topText: "",
      bottomText: "",
      randomImg: "http://i.imgflip.com/1bij.jpg",
      allMemeImgs: [],
    }
  }

  componentDidMount() {
    fetch("https://api.imgflip.com/get_memes")
      .then(response => response.json())
      .then(response => this.setState({allMemeImgs: response.data.memes}))
  }
  
  handleChange = event => {
    const {name, value, type} = event.target
    if (type !== "checkbox") {
      this.setState({[name]: value})
    } else {
      throw Error()
    }
  }

  getRandomImageURL() {
    const randIdx = Math.floor(Math.random() * this.state.allMemeImgs.length)
    return this.state.allMemeImgs[randIdx].url
  }

  handleSubmit = event => {
    event.preventDefault()
    this.setState({randomImg: this.getRandomImageURL()})
  }

  render() {
    return (
      <div>
        <form className="meme-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Top Text"
            name="topText"
            value={this.state.topText}
            onChange={this.handleChange}
          />

          <input
            type="text"
            placeholder="Bottom Text"
            name="bottomText"
            value={this.state.bottomText}
            onChange={this.handleChange}
          />

          <button>Gen</button>
        </form>

        <div className="meme">
          <img src={this.state.randomImg} alt="" />
          <h2 className="top">{this.state.topText}</h2>
          <h2 className="bottom">{this.state.bottomText}</h2>
        </div>
      </div>
    )
  }
}