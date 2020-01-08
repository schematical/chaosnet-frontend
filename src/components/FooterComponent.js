import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import SearchbarComponent from './SearchbarComponent';
import {instanceOf} from "prop-types";
import {Cookies, withCookies} from "react-cookie";

class FooterComponent extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const {cookies} = props;
        this.cookies = cookies;

        let userDataString = this.cookies.get('jwt');
        console.log("userDataString: ", userDataString);
        if(userDataString){
            AuthService.setUserData(userDataString);
            AuthService.setAccessToken(this.cookies.get('access_token'));
        }
    }
    render() {
        return (

            <footer className="sticky-footer bg-white">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright © Schematical.com 2020</span>
                    </div>
                </div>
            </footer>
        );
    }
}

export default withCookies(FooterComponent);