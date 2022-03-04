import React, {Component} from 'react';
import {CardElement, Elements, ElementsConsumer, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import HTTPService from "../../services/HTTPService";
import ConfigService from "../../services/ConfigService";
import AuthService from "../../services/AuthService";
import {AccountPageNavComponent} from "../../components/account/AccountPageNavComponent";
import AccountPage from "./AccountPage";
import SidebarComponent from "../../components/SidebarComponent";
import TopbarComponent from "../../components/TopbarComponent";
import LoadingComponent from "../../components/LoadingComponent";
import FooterComponent from "../../components/FooterComponent";


class SubscriptionsPage extends AccountPage {


    constructor(props) {
        super(props)
        this.checkUrl('/subscriptions');



        // this.handleSubmit = this.handleSubmit.bind(this);

        this.loadSubscriptions();


    }
    loadSubscriptions() {
        HTTPService.get('/' + this.props.username + '/stripe/subscriptions',
            {

            }
        )
        .then((response) => {
            let state = {};
            state.subscriptins = response.data;
            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
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


                                        <AccountPageNavComponent accountUrlBase={this.state.accountUrlBase} />


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

                                                        {
                                                            this.state.subscriptins &&
                                                            this.state.subscriptins.length === 0 &&
                                                            <div className="card mb-4 py-3  bg-info text-white shadow">
                                                                <div className="card-body">
                                                                    You have no subscriptions. Add one here TODO!!!!!
                                                                </div>
                                                            </div>
                                                        }
                                                        <table className='table'>
                                                            {
                                                                this.state.subscriptins &&
                                                                this.state.subscriptins.map((subscription) => {
                                                                    return <SubscriptionDetailComponent subscription={subscription} />
                                                                })
                                                            }
                                                        </table>

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
export default SubscriptionsPage;
export class SubscriptionDetailComponent extends Component{
    render() {
        return <tr>
            <th scope="row">
                    X? {this.props.subscription.name}
            </th>

            {/*<td>
                    <div className="dropdown">
                        <a className="btn btn-sm btn-secondary nav-link collapsed" href="#" data-toggle="collapse"
                           data-target={"#spriteGroup_" + this.props.trainingRoom.namespace} aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-cog"/>
                            <span>Options</span>
                        </a>
                        <div id={"spriteGroup_" + this.props.trainingRoom.namespace} className="collapse" aria-labelledby="headingTwo"
                             data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">ChaosPixel:</h6>
                                <a className="collapse-item" href="/chaospixel">Slicer</a>
                            </div>
                        </div>
                    </div>
                </td>*/}

        </tr>
    }
}