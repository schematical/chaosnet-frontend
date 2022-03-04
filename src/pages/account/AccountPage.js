import React, {Component} from 'react';
import {CardElement, Elements, ElementsConsumer, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import HTTPService from "../../services/HTTPService";
import ConfigService from "../../services/ConfigService";
import AuthService from "../../services/AuthService";
class CheckoutForm extends Component {
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
                let state = {};
                state.error = error;
                this.setState(state);
                console.error("Error: ", error.message);
            } else {
                console.log('[PaymentMethod]', paymentMethod);
            }
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        });


    };

    render() {
        const {stripe} = this.props;
        return (
            <form  onSubmit={this.handleSubmit}>
                {
                    this.state.error &&
                    <div className="alert alert-danger">{this.state.error.message}</div>
                }
                <CardElement />
                <button className="btn btn-primary btn-user btn-block">Submit</button>
            </form>
        );
    }
}

class AccountPage extends Component {


    constructor(props) {
        super(props);
        if (!AuthService.userData) {
            document.location.href = '/login';
            return;
        }
        const accountUrl = '/' + AuthService.userData.username + '/account';
        if (!this.props.username) {
            document.location.href = accountUrl;
            return;
        }
        if (
            this.props.username !== AuthService.userData.username &&
            !AuthService.hasScope("admin")
        ) {
            document.location.href = '/' + AuthService.userData.username + '/account';
            return;
        }

        //this.stripe = useStripe();

       this.state = {
            username: "",
            password: "",
            email: this.props._query.email || "",
            signupKey: this.props._query.signupKey || "",
            showSignup: true,
            accountUrlBase: accountUrl
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        HTTPService.post('/stripe/setup/1',
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
    async handleSubmit(event) {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        this.elements = useElements();
      /*  if (!this.stripe || !this.elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }*/

        const result = await this.state.stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements: this.elements,
            confirmParams: {
                return_url: "https://my-site.com/order/123/complete",
            },
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    render() {
        return (
            <div className="container">

                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">

                        <div className="row">

                            <div className="card shadow mb-4">
                                <div className="btn-group" role="group" aria-label="Basic example">

                                    <a className="btn btn-primary btn-sm"
                                       href={this.state.accountUrlBase}>
                                        Account
                                    </a>
                                    <a className="btn btn-primary btn-sm"
                                       href={this.state.accountUrlBase + '/subscriptions'}>
                                        Subscriptions
                                    </a>
                                    <a className="btn btn-primary btn-sm"
                                       href={this.state.accountUrlBase + '/paymentmethods'}>
                                        Payment Methods
                                    </a>
                                </div>
                            </div>



                            <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
                            <div className="col-lg-7">

                                    <div className="p-5">
                                       {/* <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                                        </div>*/}
                                        {
                                            this.state.error &&
                                            <div className="alert alert-danger">{this.state.error.message}</div>
                                        }
                                        {
                                            this.state.message &&
                                            <div className="alert alert-info">
                                                {this.state.message} then <a href="/login"> Login</a>
                                            </div>
                                        }
                                        {
                                            !this.state.stripeOptions &&
                                            <div className="alert alert-info">
                                               Loading...
                                            </div>
                                        }
                                        {
                                            this.state.stripeOptions &&
                                            <Elements stripe={this.state.stripe} options={this.state.stripeOptions}>
                                                <ElementsConsumer>
                                                    {({elements, stripe}) => (
                                                        <CheckoutForm elements={elements} stripe={stripe} />
                                                    )}
                                                </ElementsConsumer>
                                            </Elements>
                                        }





                                        {/*<div className="user">
                                            <div className="form-group">
                                                <input type="email" className="form-control form-control-user"
                                                       id="email" name="email" placeholder="Email Address"
                                                       value={this.state.email} onChange={this.handleChange}/>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-6">
                                                    <input type="text" className="form-control form-control-user"
                                                           id="username" name="username" placeholder="Username"
                                                           value={this.state.username} onChange={this.handleChange}/>
                                                </div>
                                                <div className="col-sm-6 mb-3 mb-sm-0">
                                                    <input type="password" className="form-control form-control-user"
                                                           id="password" name="password" placeholder="Password"
                                                           value={this.state.password} onChange={this.handleChange}/>
                                                </div>

                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control form-control-user"
                                                       id="signupKey" name="signupKey" placeholder="Signup Key"
                                                       value={this.state.signupKey} onChange={this.handleChange}/>
                                            </div>
                                            <div className="text-center">
                                                <a className="small" href="/login" onClick={this.addToList}>Don't have a
                                                    signup key? Click here to get on the list</a>
                                            </div>
                                            <button
                                                className="btn btn-primary btn-user btn-block"
                                                onClick={() => this.signup()}
                                            >
                                                Register Account
                                            </button>

                                        </div>
                                        <hr/>

                                        <div className="text-center">
                                            <a className="small" href="/login">Already have an account? Login!</a>
                                        </div>*/}
                                    </div>


                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
export default AccountPage;