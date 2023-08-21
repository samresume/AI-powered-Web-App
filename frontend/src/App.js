import "./App.css";
import videoBg from "./videoBg.mp4";
import logo from "./logo.svg";
import usulogo from "./usulogo.png";
import React from "react";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

function App(props) {
  const [value, setValue] = React.useState(0);

  return (
    <div className="App">
      <video src={videoBg} autoPlay loop muted />

      <div className="overlay"></div>
      <div className="content-center">
        <img className="logo" src={logo}></img>
        <h1 className="main-h1">Solar Flare Prediction</h1>
        <h3 className="main-h3">by Machine Learning on MVTS Data</h3>
        <img className="usulogo" src={usulogo}></img>
      </div>

      <div className="content">
        <button
          className="atag"
          onClick={(event) => {
            if (cookies.get("user-token")) {
              window.location.href = "/dashboard";
            } else {
              window.location.href = "/login";
            }
          }}
        >
          Log In
        </button>
        <button
          className="atag"
          onClick={(event) => {
            window.location.href = "/signup";
          }}
        >
          Sign Up
        </button>
        <button
          className="atag"
          onClick={(event) => {
            window.location.href = "/help";
          }}
        >
          Help
        </button>
        <button
          className="atag"
          onClick={(event) => {
            window.location.href = "/contact";
          }}
        >
          Contact
        </button>
        <button
          className="atag"
          onClick={(event) => {
            window.location.href = "/about";
          }}
        >
          About
        </button>
      </div>
    </div>
  );
}

export default App;
