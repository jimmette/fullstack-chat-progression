import React, { Component } from "react";
import { connect } from "react-redux";

class ActiveUsers extends Component {
  constructor(props) {
    super(props);
    this.state = { activeUsers: [] };
  }
  componentDidUpdate = () => {
    fetch("http://localhost:4000/activeusers", {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        return res.text();
      })
      .then(responseBody => {
        let response = JSON.parse(responseBody);
        this.setState({ activeUsers: response.activeUsers });
      });
  };

  render() {
    console.log("render", this.state.activeUsers);
    return (
      <div>
        {this.state.activeUsers.map(element => {
          return <div>{element}</div>;
        })}
      </div>
    );
  }
}

export default ActiveUsers;
