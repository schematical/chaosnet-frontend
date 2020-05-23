import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import $ from 'jquery';
import HTTPService from "../services/HTTPService";
class ForgotPasswordPage extends Component {



    constructor(props) {
        super(props);

        this.state = {
            username:  this.props._query.username  ||"",
            newPassword:"",
            verificationCode:  this.props._query.verificationCode || "",
            displayPasswordInput: false
        }
        this.handleChange = this.handleChange.bind(this);

        this.resetPassword = this.resetPassword.bind(this);
        this.requestCode = this.requestCode.bind(this);
        this.displayPasswordInput = this.displayPasswordInput.bind(this);

    }

    handleChange(event) {

        let state = {};

        state[event.target.name] = event.target.value;

        this.setState(state);
    }
    requestCode(){
        return HTTPService.post('/auth/forgot_password', this.state)
            .then((response)=>{

                this.setState({
                    displayPasswordInput: true,
                    requestCodeResponse: response.data.message,
                    message:"Check the email you signed up with for the reset code"
                })
            })
            .catch((err, response)=>{


                this.setState({
                    error: err.response && err.response.data && err.response.data.error || err
                })
            })
    }
    resetPassword(){
        return HTTPService.post('/auth/reset_password', this.state)
            .then((response)=>{

                document.location.href = "/login?username=" + this.state.username;
            })
            .catch((err, response)=>{


                this.setState({
                    error: err.response && err.response.data && err.response.data.error || err
                })
            })
    }
    displayPasswordInput(event){
        event.preventDefault();
        this.setState({
            displayPasswordInput: true
        });
    }

    render() {
        return (
            <div className="container">

                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">

                        <div className="row">
                            <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
                            <div className="col-lg-7">


                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Forgot your password?</h1>
                                        </div>
                                        {
                                            this.state.error &&
                                            <div className="alert alert-danger">{this.state.error.message}</div>
                                        }
                                        {
                                            this.state.message &&
                                            <div className="alert alert-info">
                                                {this.state.message}
                                            </div>
                                        }
                                        <div className="user">
                                            <div className="form-group">
                                                <input type="text" className="form-control form-control-user"
                                                       id="username" name="username" placeholder="Username"
                                                       value={this.state.username} onChange={this.handleChange}/>
                                            </div>


                                            {
                                                !this.state.displayPasswordInput &&
                                                <div>
                                                    <div className="text-center">
                                                        <a className="small" href="/forgot_password" onClick={this.displayPasswordInput}>Already have the password reset code?</a>
                                                    </div>
                                                    <button
                                                        className="btn btn-primary btn-user btn-block"
                                                        onClick={() => this.requestCode()}
                                                    >
                                                        Request Code
                                                    </button>
                                                </div>
                                            }

                                            {
                                                this.state.displayPasswordInput &&
                                                <div>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control form-control-user"
                                                               id="verificationCode" name="verificationCode" placeholder="Reset Code"
                                                               value={this.state.verificationCode} onChange={this.handleChange}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="password" className="form-control form-control-user"
                                                               id="newPassword" name="newPassword" placeholder="Password"
                                                               value={this.state.newPassword} onChange={this.handleChange}/>
                                                    </div>
                                                    <button
                                                        className="btn btn-primary btn-user btn-block"
                                                        onClick={() => this.resetPassword()}
                                                    >
                                                        Change Password
                                                    </button>
                                                </div>
                                            }

                                        </div>

                                    </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
export default ForgotPasswordPage;