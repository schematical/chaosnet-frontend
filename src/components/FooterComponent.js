import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import {instanceOf} from "prop-types";
import {Cookies, withCookies} from "react-cookie";
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';
class FooterComponent extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const {cookies} = props;
        this.cookies = cookies;
        this.logout = this.logout.bind(this);

    }
    logout(e){
        AuthService.logout();
        $('#logoutModal').modal('hide');
    }
    render() {
        return (

            <footer className="sticky-footer bg-white">

                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright © Schematical.com 2020</span>
                    </div>
                </div>

                <div className="modal fade" id="logoutModal" tabIndex={-1} role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">Select "Logout" below if you are ready to end your current
                                session.
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel
                                </button>
                                <button className="btn btn-primary" onClick={this.logout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default withCookies(FooterComponent);