import React, { Component } from "react";
import { connect } from "react-redux";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "", color: "" };
  }

  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };

  handleMessageSubmit = event => {
    event.preventDefault();
    let body = JSON.stringify({
      msg: this.state.message,
      color: this.state.color
    });
    this.setState({ message: "" });
    fetch("http://localhost:4000/newmessage", {
      method: "POST",
      body: body,
      credentials: "include"
    })
      .then(res => {
        return res.text();
      })
      .then(responseBody => {});
  };

  componentDidMount = () => {
    let color = ["#ff0000", "#0000ff", "#00cc00", "#cc00ff", "#ff9900"];
    let dice = Math.floor(Math.random() * 5);
    this.setState({ color: color[dice] });
    let updater = () => {
      fetch("http://localhost:4000/messages", { credentials: "include" })
        .then(function(res) {
          return res.text();
        })
        .then(responseBody => {
          let parsed = JSON.parse(responseBody);
          this.props.dispatch({
            type: "set-messages",
            messages: parsed.messages
          });
        });
    };
    setInterval(updater, 1000);
  };

  render() {
    return (
      <div>
        <div>
          <form onSubmit={this.handleMessageSubmit}>
            <h1>Chat box of {this.props.username}</h1>
            <input
              type="text"
              onChange={this.handleMessageChange}
              value={this.state.message}
            />
            <input
              type="submit"
              onSubmit={this.handleMessageSubmit}
              value="send"
            />
          </form>
        </div>
        <div>
          {this.props.messages.map(element => {
            return (
              <p
                style={{
                  margin: 0,
                  marginTop: "5px",
                  color: element.color
                }}
              >
                {element.time +
                  ": " +
                  element.username +
                  " : " +
                  element.message}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

let connectChat = connect(function(state) {
  return { messages: state.msgs, username: state.username };
})(Chat);

export default connectChat;
