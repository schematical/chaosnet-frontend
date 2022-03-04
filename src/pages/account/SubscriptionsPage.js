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
import PaymentMethodDropdownComponent from "../../components/account/PaymentMethodDropdownComponent";


class SubscriptionsPage extends AccountPage {


    constructor(props) {
        super(props)
        this.checkUrl('/subscriptions');

        this.startAddSubscription = this.startAddSubscription.bind(this);
        this.onPaymentMethodSelected = this.onPaymentMethodSelected.bind(this);
        this.addSubscription = this.addSubscription.bind(this);
        this.deleteSubscription = this.deleteSubscription.bind(this);
        this.loadSubscriptions();
        if (this.props._query.paymentmethod) {
            this.state.paymentMethodId = this.props._query.paymentmethod;
        }
        this.paymentMethodDropdownComponent = React.createRef();

    }
    addSubscription($event) {
        $event.preventDefault();
        const selectedPaymentMethod = this.paymentMethodDropdownComponent.current.getSelectedPaymentMethod();
        if (!selectedPaymentMethod) {
            this.setState({
                error: {
                    message: "Please select a payment method first"
                }
            });
            return;
        }
        return HTTPService.post('/' + this.props.username + '/stripe/subscriptions',
            {
                stripePaymentMethodId: selectedPaymentMethod.id
            }
        )
        .then((response) => {
           /* let state = {};
            state.subscriptins = response.data;
            this.setState(state);*/
            return this.loadSubscriptions();
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })

    }
    loadSubscriptions() {
        return HTTPService.get('/' + this.props.username + '/stripe/subscriptions',
            {

            }
        )
        .then((response) => {
            let state = {};
            state.subscriptions = response.data;
            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }
    deleteSubscription(subscription) {
        return HTTPService.delete('/' + this.props.username + '/stripe/subscriptions/' + subscription.id,
            {

            }
        )
        .then((response) => {
            return this.loadSubscriptions();
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }
    startAddSubscription($event) {
        $event.preventDefault();
        let state = {};
        state.showAddSubscription = true;
        this.setState(state);

    }
    onPaymentMethodSelected(paymentMethod) {

        let state = {};
        state.paymentMethod = paymentMethod;
        console.log('onPaymentMethodSelected ', state);
        this.setState(state);
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
                                                            this.state.subscriptions &&
                                                            this.state.subscriptions.length === 0 &&
                                                            <a href={"#"}
                                                               className="btn btn-info btn-lg"
                                                               onClick={this.startAddSubscription}
                                                            >Add Subscription</a>
                                                        }
                                                        {
                                                            this.state.showAddSubscription &&
                                                            <form lass="form-inline"
                                                                  onSubmit={this.addSubscription}>
                                                                <div className="card mb-4 py-3 ext-white shadow">
                                                                    <div className="card-body">
                                                                        <div className="form-group">
                                                                            <label htmlFor="exampleFormControlSelect1">Payment Method</label>
                                                                            {/*<select className="form-control">
                                                                                {
                                                                                    this.state.paymentmethods.map((paymentmethod) => {
                                                                                        return <option>
                                                                                            {paymentmethod.card.brand} - {paymentmethod.card.last4}
                                                                                        </option>
                                                                                    })
                                                                                }
                                                                            </select>*/}
                                                                            <PaymentMethodDropdownComponent
                                                                                onSelect={this.onPaymentMethodSelected}
                                                                                accountUrlBase={this.state.accountUrlBase}
                                                                                paymentMethodId={this.state.paymentMethodId}
                                                                                ref={this.paymentMethodDropdownComponent}
                                                                            />

                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="exampleFormControlSelect1">Subscription</label>
                                                                            <select className="form-control">
                                                                                <option>ChaosNet Alpha Paid</option>
                                                                            </select>
                                                                        </div>
                                                                        <button type="submit" className="btn btn-primary mb-2">
                                                                            Add Subscription
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        }
                                                        <table className='table'>
                                                            <tbody>
                                                                {
                                                                    this.state.subscriptions &&
                                                                    this.state.subscriptions.map((subscription) => {
                                                                        return <SubscriptionDetailComponent
                                                                            subscription={subscription}
                                                                            parent={this}
                                                                        />
                                                                    })
                                                                }
                                                            </tbody>
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
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
    }
    delete($event) {
        $event.preventDefault();
        this.props.parent.deleteSubscription(this.props.subscription);
    }
    render() {
        return <tr>
            <th scope="row">
                    {this.props.subscription.id}
            </th>

            <td>
                <div className="dropdown">
                    <a className="btn btn-sm btn-secondary nav-link collapsed" href="#" data-toggle="collapse"
                       data-target={"#subscription_" + this.props.subscription.id} aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fas fa-fw fa-cog"/>
                        <span>Options</span>
                    </a>
                    <div id={"subscription_" + this.props.subscription.id} className="collapse" aria-labelledby="headingTwo"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Options:</h6>
                            <a className="collapse-item btn btn-sm btn-danger" href="/chaospixel" onClick={this.delete}>Delete</a>
                        </div>
                    </div>
                </div>
            </td>

        </tr>
    }
}