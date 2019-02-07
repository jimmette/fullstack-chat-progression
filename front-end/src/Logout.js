import React, { Component } from "react";
import { connect } from "react-redux";

class Logout extends Component {
  handleLogoutOnClick = event => {
    this.props.dispatch({
      type: "logout"
    });
    fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include"
    })
      .then(res => {
        return res.text();
      })
      .then(responseBody => {
        let body = JSON.parse(responseBody);
        console.log("logout", body);
      });
  };
  render() {
    return (
      <div>
        <input
          type="button"
          onClick={this.handleLogoutOnClick}
          value="logout"
        />
      </div>
    );
  }
}
let connectLogout = connect()(Logout);
export default connectLogout;
