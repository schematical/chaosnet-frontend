import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
class LoginPage extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };


    constructor(props) {
        super(props);
        const { cookies } = props;
        this.cookies = cookies;
        this.state = {
            username: "",
            password:""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        //console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }
    handleSubmit(event) {
        let cookieOptions = {
            path: '/'
        };

        event.preventDefault();
        AuthService.login(this.state.username, this.state.password)
            .then((response)=>{

                //const { cookies } = this.props;
                //cookieOptions.expires = new Date(response.data.expiration);
                this.cookies.set("access_token", response.data.accessToken,
                   cookieOptions
                );
                this.cookies.set("refresh_token", response.data.refreshToken,
                    cookieOptions
                );
                return AuthService.whoami(response.data.accessToken);

            })
            .then((response)=>{
                console.log("response: ", response);
                this.cookies.set("jwt", JSON.stringify(response.data), cookieOptions);
                this.cookies.set("username", response.data.username, cookieOptions);
                document.location = "/";
            })
            .catch((err)=>{

               let error = err.response && err.response.data && err.response.data.error && err.response.data.error || err;
               error.status = err.response && err.response.status;
               this.setState({
                   error: error
               })

            })
    }
    login(event){
    }
    render() {
        return (
            <div className="container">


                <div className="row justify-content-center">

                    <div className="col-xl-10 col-lg-12 col-md-9">

                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">

                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                            </div>
                                            <form className="user" onSubmit={this.handleSubmit}>
                                                {
                                                    this.state.error &&
                                                    <div className="card mb-4 py-3  bg-danger text-white shadow">
                                                        <div className="card-body">
                                                            Error   {this.state.error.status}
                                                            <div className="text-white-50 small">
                                                                {this.state.error.message}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="form-group">
                                                    <input type="text" className="form-control form-control-user"
                                                           id="username" name="username" aria-describedby="emailHelp"
                                                           placeholder="Enter Username..."  value={this.state.username} onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input type="password" className="form-control form-control-user"
                                                           id="password" name="password"  placeholder="Password" value={this.state.password}  onChange={this.handleChange}/>
                                                </div>
                                                <div className="form-group">
                                                    <div className="custom-control custom-checkbox small">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="customCheck" />
                                                            <label className="custom-control-label"
                                                                   htmlFor="customCheck">Remember Me</label>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-primary btn-user btn-block"

                                                >
                                                    Login
                                                </button>
                                             {/*   <hr />
                                                    <a href="index.html" className="btn btn-google btn-user btn-block">
                                                        <i className="fab fa-google fa-fw"></i> Login with Google
                                                    </a>
                                                    <a href="index.html"
                                                       className="btn btn-facebook btn-user btn-block">
                                                        <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                                    </a>*/}
                                            </form>
                                            <hr />
                                                {/*<div className="text-center">
                                                    <a className="small" href="forgot-password.html">Forgot
                                                        Password?</a>
                                                </div>*/}
                                                <div className="text-center">
                                                    <a className="small" href="/signup">Create an Account!</a>
                                                </div>
                                        </div>
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
export default withCookies(LoginPage);