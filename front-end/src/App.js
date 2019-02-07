import React, { Component } from "react";
import Signup from "./Signup";
import Chat from "./Chat";
import Logout from "./Logout";
import { connect } from "react-redux";

class App extends Component {
  renderSignupLogin = () => {
    return (
      <div>
        <Signup />
      </div>
    );
  };
  renderChat = () => {
    return (
      <div>
        <Logout />
        <Chat />
      </div>
    );
  };
  render() {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {this.props.isLogin ? this.renderChat() : this.renderSignupLogin()}
      </div>
    );
  }
}

let connectApp = connect(state => {
  return { isLogin: state.isLogin };
})(App);

export default connectApp;
