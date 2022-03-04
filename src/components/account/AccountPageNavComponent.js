import React, {Component} from "react";
export class AccountPageNavComponent extends Component {
    render() {
        return <div className="card shadow mb-4">
            <div className="btn-group" role="group" aria-label="Basic example">

                <a className="btn btn-primary btn-sm"
                   href={this.props.accountUrlBase}>
                    Account
                </a>
                <a className="btn btn-primary btn-sm"
                   href={this.props.accountUrlBase + '/subscriptions'}>
                    Subscriptions
                </a>
                <a className="btn btn-primary btn-sm"
                   href={this.props.accountUrlBase + '/paymentmethods'}>
                    Payment Methods
                </a>
            </div>
        </div>
    }
}