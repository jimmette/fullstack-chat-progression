import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { createStore } from "redux";

let reducer = function(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isLogin: true,
        username: action.username,
        color: action.color
      };
    case "set-messages":
      return { ...state, msgs: action.messages || [] };
    case "logout":
      return { ...state, isLogin: false };

    default:
      break;
  }
  return state;
};

const myStore = createStore(
  reducer,
  { isLogin: false, msgs: [], username: "", color: "" },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={myStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);
