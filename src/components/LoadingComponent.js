import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import {instanceOf} from "prop-types";
import {Cookies, withCookies} from "react-cookie";
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';
class LoadingComponent extends Component {

    constructor(props) {
        super(props);


    }

    render() {
        return (
            <div className="alert alert-secondary" role="alert">
                <i className="fas fa-circle-notch fa-spin"></i> Loading...
            </div>
        );
    }
}

export default LoadingComponent;