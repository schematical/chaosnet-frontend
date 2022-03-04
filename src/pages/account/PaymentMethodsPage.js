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
class PaymentMethodAddForm extends Component {
    constructor(props) {
        super(props);


        //this.stripe = useStripe();

        this.state = {

        }
    }
    handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        const {stripe, elements} = this.props;

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);
        return stripe.createPaymentMethod({
            type: 'card',
            card,
        })
        .then(({error, paymentMethod}) => {

            if (error) {
                if (this.props.onSave) {
                    this.props.onSave(error);
                    return;
                }
                let state = {};
                state.error = error;
                this.setState(state);
                console.error("Error: ", error.message);
                return;
            }
            return HTTPService.post('/' + this.props.username + '/stripe/paymentmethods',
                { paymentMethodId: paymentMethod.id }
            );

        })
        .then((paymentMethod) => {
            if (this.props.onSave) {
                this.props.onSave(null, paymentMethod.data);
                return;
            }
            console.log("Success but no callback");
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        });


    };

    render() {
        // const {stripe} = this.props;
        return (
            <form className="user" onSubmit={this.handleSubmit}>
                {
                    this.state.error &&
                    <div className="alert alert-danger">{this.state.error.message}</div>
                }
                <div className="card mb-4 py-3 ext-white shadow">
                    <div className="card-body">
                        <CardElement />
                    </div>
                </div>
                <button className="btn btn-primary btn-user btn-block">Submit</button>
            </form>
        );
    }
}

class PaymentMethodsPage extends AccountPage {


    constructor(props) {
        super(props);
        this.checkUrl('/paymentmethods');


        this.addPaymentMethod = this.addPaymentMethod.bind(this);
        this.onSave = this.onSave.bind(this);

        this.loadPaymentMethods();


    }

    loadPaymentMethods() {
        return HTTPService.get('/' + this.props.username + '/stripe/paymentmethods',
            {

            }
        )
        .then((response) => {
            let state = {};
            state.paymentmethods = response.data;
            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        });
    }
    deletePaymentMethod(paymentmethod) {
        return HTTPService.delete('/' + this.props.username + '/stripe/paymentmethods/' + paymentmethod.id,
            {

            }
        )
        .then((response) => {
           return this.loadPaymentMethods();
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        });
    }
    async addPaymentMethod($event) {
        $event.preventDefault();
        return HTTPService.post('/' + this.props.username +'/stripe/paymentmethods/add/1',
            {

            }
        )
        .then((response) => {
            let state = {};
            state.stripeOptions = {
                // passing the client secret obtained from the server
                clientSecret: response.data.client_secret,
            };
            state.stripe = loadStripe(ConfigService.config.stripe.pk);
            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }
    async onSave(err, paymentmethod) {
        if(err) {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
            return;
        }
        let state = {};
        state.stripeOptions = null;
        this.setState(state);
        if (this.props._query.redirect) {
            const url = this.props._query.redirect + '?paymentmethod=' + paymentmethod.id;
            console.log('[paymentmethod]', paymentmethod);
            return document.location.href = url;
        }
        return this.loadPaymentMethods();
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

                                                        <a href={"#"}
                                                           className="btn btn-info btn-lg"
                                                           onClick={this.addPaymentMethod}
                                                        >Add Payment Method</a>
                                                        {
                                                            this.state.stripeOptions &&
                                                            <Elements stripe={this.state.stripe} options={this.state.stripeOptions}>
                                                                <ElementsConsumer>
                                                                    {({elements, stripe}) => (
                                                                        <PaymentMethodAddForm elements={elements} stripe={stripe} onSave={this.onSave}  />
                                                                    )}
                                                                </ElementsConsumer>
                                                            </Elements>
                                                        }

                                                        <table className='table'>
                                                            <tbody>
                                                                {
                                                                    this.state.paymentmethods &&
                                                                    this.state.paymentmethods.map((paymentmethod) => {
                                                                        return <PaymentMethodDetailComponent paymentmethod={paymentmethod} parent={this}/>
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
export default PaymentMethodsPage;
export class PaymentMethodDetailComponent extends Component{
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
    }
    delete($event) {
        $event.preventDefault();
        this.props.parent.deletePaymentMethod(this.props.paymentmethod);
    }
    render() {
        return <tr>
            <th scope="row">
               {this.props.paymentmethod.card.brand} - Ending in {this.props.paymentmethod.card.last4}
            </th>

            <td>
                <div className="dropdown">
                    <a className="btn btn-sm btn-secondary nav-link collapsed" href="#" data-toggle="collapse"
                       data-target={"#spriteGroup_" + this.props.paymentmethod.id} aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fas fa-fw fa-cog"/>
                        <span>Options</span>
                    </a>
                    <div id={"spriteGroup_" + this.props.paymentmethod.id} className="collapse" aria-labelledby="headingTwo"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Options: </h6>
                            <a className="collapse-item btn btn-sm btn-danger" href="/chaospixel" onClick={this.delete}>Delete</a>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    }
}
