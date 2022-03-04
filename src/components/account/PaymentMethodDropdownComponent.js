import React, {Component} from "react";
import HTTPService from "../../services/HTTPService";

class PaymentMethodDropdownComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onSelect = this.onSelect.bind(this);
        this.addPaymentMethod = this.addPaymentMethod.bind(this);
        this.loadPaymentMethods();
        if (!this.props.accountUrlBase) {
            throw new Error('`PaymentMethodDropdownComponent`  is missing `accountUrlBase` property');
        }
        if (!this.props.onSelect) {
            throw new Error('`PaymentMethodDropdownComponent`  is missing `onSelect` event property');
        }
    }
    getSelectedPaymentMethod() {
        return this.state.selectedPaymentMethod || null;
    }
    addPaymentMethod($event) {
        $event.preventDefault();
        const redirect = escape(this.props.accountUrlBase + '/subscriptions');
        const url = this.props.accountUrlBase + '/paymentmethods?redirect=' + redirect;
        document.location.href = url;


    }
    loadPaymentMethods() {
        return HTTPService.get('/' + this.props.username + '/stripe/paymentmethods',
            {

            }
        )
        .then((response) => {
            let state = {};
            state.paymentmethods = response.data;
            if (this.props.paymentMethodId) {
                state.paymentmethods.forEach((paymentMethod) => {
                    if (paymentMethod.id === this.props.paymentMethodId) {
                        state.selectedPaymentMethod = paymentMethod;
                    }
                })
                if (!state.selectedPaymentMethod) {
                    throw new Error("Cannot find `paymentMethod` matching `props.paymentMethodId`: " + this.props.paymentMethodId);
                }
            }
            this.setState(state);
        });
    }
    onSelect(paymentmethod) {
        this.setState({
            selectedPaymentMethod: paymentmethod
        });
        this.props.onSelect(paymentmethod);
    }
    getTitle() {
        if (this.state.selectedPaymentMethod) {
            return this.state.selectedPaymentMethod.card.brand + ' - ' +
                this.state.selectedPaymentMethod.card.last4;
        }
        return 'Select Payment Method';
    }

    render() {
        return <div className="dropdown show">
            <a className="btn btn-secondary dropdown-toggle"
               href="#" role="button"
               id="dropdownMenuLink"
               data-toggle="dropdown"
               aria-haspopup="true"
               aria-expanded="false">
                { this.getTitle() }
            </a>

            <div className="dropdown-menu"
                 aria-labelledby="dropdownMenuLink">
                {
                    this.state.paymentmethods &&
                    this.state.paymentmethods.map((paymentmethod) => {
                        return <a className="dropdown-item"  href="#" onClick={($event) => { $event.preventDefault(); this.onSelect(paymentmethod); }}>
                            {paymentmethod.card.brand} - {paymentmethod.card.last4}
                        </a>
                    })
                }
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#" onClick={this.addPaymentMethod}>Add Payment Method</a>
            </div>
        </div>
    }
}
export default PaymentMethodDropdownComponent;