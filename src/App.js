import React, { Component } from 'react';

import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Router  from 'react-router-component';

import logo from './logo.svg';
import './App.css';
import '../node_modules/codemirror/lib/codemirror.css'

import AuthService from "./services/AuthService";
import {Cookies, withCookies} from "react-cookie";
import {instanceOf} from "prop-types";
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import SignupPage from './pages/SignupPage.js';
import TrainingRoomListPage from './pages/chaosnet/TrainingRoomListPage.js';
import TrainingRoomDetailPage from './pages/chaosnet/TrainingRoomDetailPage.js';
import TrainingRoomNewPage from "./pages/chaosnet/TrainingRoomNewPage";
import TrainingRoomFitnessRuleListPage from "./pages/chaosnet/TrainingRoomFitnessRuleListPage";
import TrainingRoomOrgListPage from "./pages/chaosnet/TrainingRoomOrgListPage";
import TrainingRoomTRanksListPage from "./pages/chaosnet/TrainingRoomTRanksListPage";
import TrainingRoomSessionsListPage from "./pages/chaosnet/TrainingRoomSessionsListPage";
import TrainingRoomTRanksDetailPage from "./pages/chaosnet/TrainingRoomTRanksDetailPage";
import TrainingRoomTRanksChildrenListPage from "./pages/chaosnet/TrainingRoomTRanksChildrenListPage";
import TrainingRoomSessionDetailPage from "./pages/chaosnet/TrainingRoomSessionDetailPage";
import TrainingRoomOrgDetailPage from "./pages/chaosnet/TrainingRoomOrgDetailPage";
import TrainingRoomOrgNNetDetailPage from "./pages/chaosnet/TrainingRoomOrgNNetDetailPage";
import TrainingRoomTRanksOrgsListPage from "./pages/chaosnet/TrainingRoomTRanksOrgsListPage";
import TrainingRoomPresetNeuronListPage from "./pages/chaosnet/TrainingRoomPresetNeuronListPage";
import TrainingRoomTRanksImportPage from "./pages/chaosnet/TrainingRoomTRanksImportPage";
import ConfigService from "./services/ConfigService";
import TrainingRoomRolesListPage from "./pages/chaosnet/TrainingRoomRolesListPage";
import TrainingRoomRoleDetailPage from "./pages/chaosnet/TrainingRoomRoleDetailPage";
import SimModelListPage from "./pages/chaosnet/SimModelListPage";
import SimModelDetailPage from "./pages/chaosnet/SimModelDetailPage";
import SimModelPayloadEditPage from "./pages/chaosnet/SimModelPayloadEditPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChaosPixelBoxerPage from "./pages/chaospixel/ChaosPixelBoxerPage";

import ChaosProjectListPage from "./pages/chaosnet/ChaosProjectListPage";
import ChaosProjectNewPage from "./pages/chaosnet/ChaosProjectNewPage";
import ChaosProjectDetailPage from "./pages/chaosnet/ChaosProjectDetailPage";
import PersonalAccessTokenListPage from "./pages/chaosnet/PersonalAccessTokenListPage";
import ChaosProjectFeaturedListPage from "./pages/chaosnet/ChaosProjectFeaturedListPage";
import AccountPage from "./pages/account/AccountPage";
import SubscriptionsPage from "./pages/account/SubscriptionsPage";
import PaymentMethodsPage from "./pages/account/PaymentMethodsPage";
class App extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
     constructor(props) {
        super(props);
        const {cookies} = props;
        this.cookies = cookies;
        ConfigService.init();
        AuthService.init(cookies);

    }
  render() {

    return (
        <Router.Locations>
            <Router.Location path="/" handler={HomePage} />
            <Router.Location path="/login" handler={LoginPage} />
            <Router.Location path="/signup" handler={SignupPage} />
            <Router.Location path="/account" handler={AccountPage} />
            <Router.Location path="/:username/account" handler={AccountPage} />
            <Router.Location path="/:username/account/subscriptions" handler={SubscriptionsPage} />
            <Router.Location path="/:username/account/paymentmethods" handler={PaymentMethodsPage} />
            <Router.Location path="/forgot_password" handler={ForgotPasswordPage} />
            <Router.Location path="/admin" handler={AdminHomePage} />
            <Router.Location path="/:username/tokens" handler={PersonalAccessTokenListPage} />
            <Router.Location path="/simmodels" handler={SimModelListPage} />
            <Router.Location path="/simmodels/:simModelId" handler={SimModelDetailPage} />
            <Router.Location path="/projects" handler={ChaosProjectFeaturedListPage} />
            <Router.Location path="/:username/simmodels" handler={SimModelListPage} />
            <Router.Location path="/:username/simmodels/:simModelNamespace" handler={SimModelDetailPage} />
            <Router.Location path="/:username/simmodels/:simModelNamespace/tags/:simModelTag/payload" handler={SimModelPayloadEditPage} />
            <Router.Location path="/:username/projects" handler={ChaosProjectListPage} />
            <Router.Location path="/:username/projects/new" handler={ChaosProjectNewPage} />
            <Router.Location path="/:username/projects/:chaosproject" handler={ChaosProjectDetailPage} />
            <Router.Location path="/:username/projects/:chaosproject/chaospixel" handler={ChaosPixelBoxerPage} />
            <Router.Location path="/:username/projects/:chaosproject/chaospixel/:mode" handler={ChaosPixelBoxerPage} />
            <Router.Location path="/:username/trainingrooms" handler={TrainingRoomListPage} />
            <Router.Location path="/:username/trainingrooms/new" handler={TrainingRoomNewPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace" handler={TrainingRoomDetailPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/fitnessrules" handler={TrainingRoomFitnessRuleListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/presetneurons" handler={TrainingRoomPresetNeuronListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/organisms" handler={TrainingRoomOrgListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/organisms/:organism" handler={TrainingRoomOrgDetailPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/organisms/:organism/nnet" handler={TrainingRoomOrgNNetDetailPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/organisms/:organism/nnet/neurons/:neuron" handler={TrainingRoomOrgNNetDetailPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/roles" handler={TrainingRoomRolesListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/roles/:role" handler={TrainingRoomRoleDetailPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/roles/:role/fitnessrules" handler={TrainingRoomFitnessRuleListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/roles/:role/presetneurons" handler={TrainingRoomPresetNeuronListPage} />

            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/tranks" handler={TrainingRoomTRanksListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/tranks/import" handler={TrainingRoomTRanksImportPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/tranks/:trank" handler={TrainingRoomTRanksDetailPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/tranks/:trank/children" handler={TrainingRoomTRanksChildrenListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/tranks/:trank/organisms" handler={TrainingRoomTRanksOrgsListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/tranks/:trank/organisms/:selector" handler={TrainingRoomTRanksOrgsListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/sessions" handler={TrainingRoomSessionsListPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/sessions/:session" handler={TrainingRoomSessionDetailPage} />
            <Router.Location path="/:username/trainingrooms/:trainingRoomNamespace/sessions/:session/species" handler={TrainingRoomTRanksListPage} />
{/*            <Router.Location path="/chaospixel" handler={ChaosPixelListTrainingDatasPage} />
            <Router.Location path="/chaospixel/slicer" handler={ChaosPixelSlicerPage} />
            <Router.Location path="/chaospixel/boxer" handler={ChaosPixelBoxerPage} />
            <Router.Location path="/chaospixel/train" handler={ChaosPixelTrainPage} />*/}
            <Router.NotFound handler={HomePage} />
        </Router.Locations>
    );
  }
}

export default withCookies(App);
