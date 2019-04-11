import React, {Component} from 'react';
import AuthService from '../services/AuthService';
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password:""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }
    handleSubmit(event) {
       console.log("SUBMITT: ", this.state);
        event.preventDefault();
        AuthService.login(this.state.username, this.state.password)
            .then((response)=>{
                console.log("SUCCESS:", response);
            })
            .catch((err)=>{
               console.log("Error: ", err.message, err.response.status);
               this.setState({
                   error: err
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
                                                            Error
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
export default HomePage;