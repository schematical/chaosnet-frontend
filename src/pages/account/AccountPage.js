import React, {Component} from 'react';
import {CardElement, Elements, ElementsConsumer, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import HTTPService from "../../services/HTTPService";
import ConfigService from "../../services/ConfigService";
import AuthService from "../../services/AuthService";
import {AccountPageNavComponent} from "../../components/account/AccountPageNavComponent";
import SidebarComponent from "../../components/SidebarComponent";
import TopbarComponent from "../../components/TopbarComponent";
import LoadingComponent from "../../components/LoadingComponent";
import PersonalAccessTokenListComponent from "../../components/chaosnet/PersonalAccessTokenListComponent";
import FooterComponent from "../../components/FooterComponent";


class AccountPage extends Component {


    constructor(props) {
        super(props);
        if(this.constructor.name === 'AccountPage') {
            this.checkUrl('');
            this.state = this.state || {};

        }
    }
    checkUrl(afterUsernameUri) {
        console.log("checkUrl: ", afterUsernameUri, AuthService.userData);
        if (!AuthService.userData) {
            document.location.href = '/login';
            return;
        }
        let accountUrlBase = '/' + AuthService.userData.username + '/account';
        let accountUrl = accountUrlBase + afterUsernameUri;
        if (!this.props.username) {
            console.log("No username. Redirecting to: ", accountUrl);
            document.location.href = accountUrl;
            return;
        }
        if (
            this.props.username !== AuthService.userData.username &&
            !AuthService.hasScope("admin")
        ) {
            document.location.href = accountUrl;
            return;
        } else {
            accountUrlBase = '/' + this.props.username + '/account';
            accountUrl = accountUrlBase + afterUsernameUri
        }

        this.state = {
            loaded: true,
            accountUrlBase: accountUrlBase,
            accountUrl: accountUrl
        }
    }


    render() {
        return (
            <div>
                <div>
                    {/* Page Wrapper */}
                    <div id="wrapper">
                        <SidebarComponent></SidebarComponent>
                        {/* Content Wrapper */}
                        <div id="content-wrapper" className="d-flex flex-column">
                            {/* Main Content */}
                            <div id="content">
                                {/* Topbar */}
                                <TopbarComponent></TopbarComponent>
                                {/* End of Topbar */}
                                {/* Begin Page Content */}
                                <div className="container-fluid">
                                    {/* Page Heading */}
                                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                        <h1 className="h3 mb-0 text-gray-800">ChaosNet</h1>
                                        {/*<a href="#"
                                           className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                            className="fas fa-download fa-sm text-white-50"/> Generate Report</a>*/}
                                    </div>
                                    <div className="row">




                                        <div className="col-xl-12 col-lg-12">

                                            { !this.state.loaded && <LoadingComponent /> }
                                            {
                                                this.state.loaded &&
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">
                                                        {
                                                            this.state.error &&
                                                            <div className="card mb-4 py-3  bg-danger text-white shadow">
                                                                <div className="card-body">
                                                                    Error {this.state.error.status}
                                                                    <div className="text-white-50 small">
                                                                        {this.state.error.message}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        <AccountPageNavComponent accountUrlBase={this.state.accountUrlBase} />
                                                        {
                                                            !AuthService.isPremium() &&
                                                            <div className="card mb-4 py-3 text-white shadow">
                                                                <div className="card-body">
                                                                    <h1 className="h3 mb-0 text-gray-800">Setup ChaosNet Alpha Premium Today!</h1>
                                                                    <div className="text-black-50">
                                                                       Interested in training your own Neural Networks using ChaosNet or
                                                                        just supporting our various projects?

                                                                    </div>
                                                                    <a href={this.state.accountUrlBase + '/subscriptions'} className="btn btn-primary">
                                                                        Sign up for <b>ChaosNet Alpha Premium</b> here
                                                                    </a>
                                                                </div>
                                                            </div>

                                                        }
                                                        {
                                                            AuthService.isPremium() &&
                                                            <div className="card mb-4 py-3 text-white shadow">
                                                                <div className="card-body">
                                                                    <h1 className="h3 mb-0 text-gray-800">
                                                                        Need help?
                                                                    </h1>
                                                                    <div className="text-black-50">
                                                                        Hop on Discord and either @schematical or one of the members of the community can help

                                                                    </div>
                                                                    <a href='https://discord.gg/eJWT8mftv4' className="btn btn-primary">
                                                                        Get support in the #chaosnet-support channel on Discord
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        }

                                                    </div>
                                                </div>

                                            }
                                        </div>


                                    </div>

                                </div>
                                {/* /.container-fluid */}
                            </div>
                            {/* End of Main Content */}
                            {/* Footer */}
                            <FooterComponent />
                            {/* End of Footer */}
                        </div>
                        {/* End of Content Wrapper */}
                    </div>
                    {/* End of Page Wrapper */}
                    {/* Scroll to Top Button*/}
                    <a className="scroll-to-top rounded" href="#page-top">
                        <i className="fas fa-angle-up"/>
                    </a>
                </div>

            </div>
        );
    }
}
export default AccountPage;