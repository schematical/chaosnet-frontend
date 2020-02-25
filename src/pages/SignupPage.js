import React, {Component} from 'react';
import AuthService from '../services/AuthService';

class SignupPage extends Component {



    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password:"",
            email:""
        }
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);

    }
    handleChange(event) {

        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }
    signup(){
        AuthService.signup(  this.state)
            .then((response)=>{

                this.setState({
                    message: response.data.message
                })
            })
            .catch((err, response)=>{


                this.setState({
                    error: err.response && err.response.data && err.response.data.error || err
                })
            })
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
                                        <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                                    </div>
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
                                    <div className="user">
                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-user"
                                                   id="email"  name="email"  placeholder="Email Address"  value={this.state.email} onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-sm-6">
                                                <input type="text" className="form-control form-control-user"
                                                       id="username" name="username"  placeholder="Username"  value={this.state.username} onChange={this.handleChange} />
                                            </div>
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <input type="password" className="form-control form-control-user"
                                                       id="password" name="password"  placeholder="Password"  value={this.state.password} onChange={this.handleChange} />
                                            </div>

                                        </div>
                                        <button
                                            className="btn btn-primary btn-user btn-block"
                                            onClick={() => this.signup() }
                                        >
                                            Register Account
                                        </button>
                                       {/* <hr />
                                            <a href="index.html" className="btn btn-google btn-user btn-block">
                                                <i className="fab fa-google fa-fw"></i> Register with Google
                                            </a>
                                            <a href="index.html" className="btn btn-facebook btn-user btn-block">
                                                <i className="fab fa-facebook-f fa-fw"></i> Register with Facebook
                                            </a>*/}
                                    </div>
                                    <hr />
                                   {/*     <div className="text-center">
                                            <a className="small" href="forgot-password.html">Forgot Password?</a>
                                        </div>*/}
                                        <div className="text-center">
                                            <a className="small" href="/login">Already have an account? Login!</a>
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
export default SignupPage;