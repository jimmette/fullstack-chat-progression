import React, { Component } from "react";
import { connect } from "react-redux";
import Socket from "./Socket";

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
  doLogin = bodyLogin => {
    console.log("doLogin");
    fetch("http://localhost:4000/login", {
      method: "POST",
      body: bodyLogin,
      credentials: "include"
    })
      .then(res => {
        return res.json();
      })
      .then(responseBody => {
        if (responseBody.success === true) {
          Socket.emit("login");
          this.props.dispatch({
            type: "login",
            username: responseBody.username
          });
        } else {
          this.setState({ username: "", password: "" });
          alert("Pwd or user does not match");
        }
      });
  };
  doSignup = bodyLogin => {
    console.log("doSignup");
    fetch("http://localhost:4000/signup", {
      method: "POST",
      body: bodyLogin,
      credentials: "include"
    })
      .then(res => {
        return res.json();
      })
      .then(responseBody => {
        this.doLogin(bodyLogin);
      });
  };
  handleSignupSubmit = event => {
    event.preventDefault();
    let bodyLogin = JSON.stringify({
      username: this.state.username,
      password: this.state.password
    });

    console.log("does user exist");
    fetch("http://localhost:4000/doesuserexist", {
      method: "POST",
      body: bodyLogin,
      credentials: "include"
    })
      .then(res => {
        return res.json();
      })
      .then(responseBody => {
        console.log(responseBody);
        if (responseBody.success === true) {
          this.doLogin(bodyLogin);
        } else {
          this.doSignup(bodyLogin);
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

let connectSignup = connect()(Signup);

export default connectSignup;
