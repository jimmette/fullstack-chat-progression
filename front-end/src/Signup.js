import React, { Component } from "react";
import { connect } from "react-redux";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
  }
  handleUsernameChange = event => {
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };
  doLogin = bodyStringify => {
    console.log("doLogin");

    fetch("http://localhost:4000/login", {
      method: "POST",
      body: bodyStringify,
      credentials: "include"
    })
      .then(res => {
        return res.json();
      })
      .then(responseBody => {
        if (responseBody.success === true) {
          this.props.dispatch({
            type: "login",
            username: responseBody.username,
            color: responseBody.color
          });
        } else {
          this.setState({ username: "", password: "" });
          alert("Pwd or user does not match");
        }
      });
  };
  doSignup = body => {
    console.log("doSignup");
    let color = ["#ff0000", "#0000ff", "#00cc00", "#cc00ff", "#ff9900"];
    let dice = Math.floor(Math.random() * 5);
    body.color = color[dice];
    let bodyStringify = JSON.stringify(body);
    fetch("http://localhost:4000/signup", {
      method: "POST",
      body: bodyStringify,
      credentials: "include"
    })
      .then(res => {
        return res.json();
      })
      .then(responseBody => {
        this.doLogin(bodyStringify);
      });
  };
  handleSignupSubmit = event => {
    event.preventDefault();
    let body = {
      username: this.state.username,
      password: this.state.password,
      color: ""
    };

    let bodyStringify = JSON.stringify(body);

    console.log("does user exist");
    fetch("http://localhost:4000/doesuserexist", {
      method: "POST",
      body: bodyStringify,
      credentials: "include"
    })
      .then(res => {
        return res.json();
      })
      .then(responseBody => {
        console.log(responseBody);
        if (responseBody.success === true) {
          this.doLogin(bodyStringify);
        } else {
          this.doSignup(body);
        }
      });
  };
  render() {
    return (
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center" }}>Signup/Login</h1>
        <form onSubmit={this.handleSignupSubmit}>
          <div style={{ padding: "5px" }}>
            Username{" "}
            <input
              type="text"
              onChange={this.handleUsernameChange}
              value={this.state.username}
            />
          </div>
          <div style={{ padding: "5px" }}>
            Password{" "}
            <input
              type="text"
              onChange={this.handlePasswordChange}
              value={this.state.password}
            />
          </div>
          <div style={{ padding: "5px" }}>
            <input type="submit" />
          </div>
        </form>
      </div>
    );
  }
}

let connectSignup = connect(function(state) {
  return { messages: state.msgs, username: state.username, color: state.color };
})(Signup);

export default connectSignup;
