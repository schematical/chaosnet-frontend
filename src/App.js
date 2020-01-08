import React, { Component } from 'react';
import Router  from 'react-router-component';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import SignupPage from './pages/SignupPage.js';
import TrainingRoomListPage from './pages/chaosnet/TrainingRoomListPage.js';
import TrainingRoomDetailPage from './pages/chaosnet/TrainingRoomDetailPage.js';
import logo from './logo.svg';
import './App.css';
import ChaosPixelSlicerPage from "./pages/ChaosPixelSlicerPage";
import {useCookies} from "react-cookie";
import ChaosPixelListTrainingDatasPage from "./pages/ChaosPixelListTrainingDatasPage";
import AuthService from "./services/AuthService";
import {Cookies, withCookies} from "react-cookie";
import {instanceOf} from "prop-types";
class App extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const {cookies} = props;
        this.cookies = cookies;
        console.log("   this.cookies: ",    this.cookies);
        let userDataString = this.cookies.get('jwt');
        console.log("userDataString: ", userDataString);
        if(userDataString){
            AuthService.setUserData(userDataString);
            AuthService.setAccessToken(this.cookies.get('access_token'));
        }
    }
  render() {

    return (
        <Router.Locations>
            <Router.Location path="/" handler={HomePage} />
            <Router.Location path="/login" handler={LoginPage} />
            <Router.Location path="/signup" handler={SignupPage} />
            <Router.Location path="/:username/trainingrooms" handler={TrainingRoomListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace" handler={TrainingRoomDetailPage} />
            <Router.Location path="/chaospixel" handler={ChaosPixelListTrainingDatasPage} />
            <Router.Location path="/chaospixel/slicer" handler={ChaosPixelSlicerPage} />
            <Router.NotFound handler={HomePage} />
        </Router.Locations>
    );
  }
}

export default withCookies(App);
