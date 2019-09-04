import React, { Component } from 'react';
import Router  from 'react-router-component';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import SignupPage from './pages/SignupPage.js';
import logo from './logo.svg';
import './App.css';
import ChaosPixelHomePage from "./pages/ChaosPixelHomePage";

class App extends Component {
  render() {
    return (
        <Router.Locations>
            <Router.Location path="/" handler={HomePage} />
            <Router.Location path="/login" handler={LoginPage} />
            <Router.Location path="/signup" handler={SignupPage} />
            <Router.Location path="/chaospixel" handler={ChaosPixelHomePage} />
            <Router.NotFound handler={HomePage} />
        </Router.Locations>
    );
  }
}

export default App;
