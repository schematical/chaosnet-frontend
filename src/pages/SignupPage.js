import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import $ from 'jquery';
class SignupPage extends Component {



    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password:"",
            email: this.props._query.email || "",
            signupKey: this.props._query.signupKey || "",
            showSignup: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.addToList = this.addToList.bind(this);
        this.signup = this.signup.bind(this);
        this.showSignup = this.showSignup.bind(this);

    }
    showSignup(event){
        event.preventDefault();
        let state = {
            showSignup: true
        }
        this.setState(state);
    }
    addToList(event){
        event.preventDefault();
        let state = {
            showSignup: false
        }
        this.setState(state);
    }
    handleChange(event) {

        let state = {};
        if(event.target.name == 'signupKey'){
            state[event.target.name] = event.target.value;
        }else {
            state[event.target.name.toLowerCase()] = event.target.value;
        }
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

                if(err.response && err.response.status == 426){
                    this.setState({
                        showSignup: false
                    });
                    return;
                }

                this.setState({
                    error: err.response && err.response.data && err.response.data.error || err
                })
            })
    }
    x(){
        //(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='NAME';ftypes[1]='text';fnames[2]='GIT';ftypes[2]='text';fnames[3]='CHAOSNET_A';ftypes[3]='text';}($));
        //var $mcj = jQuery.noConflict(true)
    }
    render() {
        return (
            <div className="container">

                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">

                        <div className="row">
                            <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
                            <div className="col-lg-7">
                                {
                                    this.state.showSignup &&

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
                                            {/* <hr />
                                                <a href="index.html" className="btn btn-google btn-user btn-block">
                                                    <i className="fab fa-google fa-fw"></i> Register with Google
                                                </a>
                                                <a href="index.html" className="btn btn-facebook btn-user btn-block">
                                                    <i className="fab fa-facebook-f fa-fw"></i> Register with Facebook
                                                </a>*/}
                                        </div>
                                        <hr/>
                                        {/*     <div className="text-center">
                                                <a className="small" href="forgot-password.html">Forgot Password?</a>
                                            </div>*/}
                                        <div className="text-center">
                                            <a className="small" href="/login">Already have an account? Login!</a>
                                        </div>
                                    </div>
                                }
                                {
                                    !this.state.showSignup &&
                                    <div className="p-5" id="mc_embed_signup">


                                        <form action="https://schematical.us6.list-manage.com/subscribe/post?u=3565b8df39d26f84645b27784&amp;id=d8d9a8f9ab" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form"  target="_blank" noValidate className="validate">
                                            <div id="mc_embed_signup_scroll">

                                                <div className="text-center">
                                                    <h1 className="h4 text-gray-900 mb-4">Get on the list</h1>
                                                </div>
                                                <p>
                                                    Due to a growing interest in ChaosNet/ChaosCraft and an increase in the number of people training neural networks on the platform combined with rising server costs we have decided to control signups by releasing signup keys when we feel we can support the additional traffic.
                                                </p>
                                                <p>
                                                    Don’t worry, you will get your chance. Just signup to get on the list here and we will send out a signup key when they become available. If you are in a rush to get on signup as an Iron Golem or Wither on our <a href="https://www.patreon.com/schematical">Patreon</a>(Limited availability).
                                                </p>
                                                <div className="form-group">
                                                    <input type="email" value="" placeholder="Email" name="EMAIL" className="form-control form-control-user required email" id="mce-EMAIL" value={this.state.email}  onChange={this.handleChange}/>
                                                </div>
                                                <div className="form-group">

                                                    <input type="text" value="" placeholder="Name" name="NAME" className="" className="form-control form-control-user" id="mce-NAME" value={this.state.name}  onChange={this.handleChange}/>
                                                </div>



                                                <div id="mce-responses" className="clear">
                                                    <div className="response" id="mce-error-response" style={{display:"none"}}></div>
                                                    <div className="response" id="mce-success-response" style={{display:"none"}}></div>
                                                </div>
                                                <div style={{position: "absolute", left: -5000 + "px", 'ariaHidden':true}}>
                                                    <input type="text" name="b_3565b8df39d26f84645b27784_d8d9a8f9ab" tabIndex={-1} value="" onChange={this.handleChange}/>
                                                    <input type="hidden" value="" name="GIT" className=""
                                                               id="mce-GIT"  onChange={this.handleChange}  tabIndex={-1}/>

                                                    <input type="hidden" value="true" name="CHAOSNET_A"
                                                                   className="" id="mce-CHAOSNET_A"  onChange={this.handleChange}  tabIndex={-1}/>
                                                </div>

                                                <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe"  className="btn btn-primary btn-user btn-block" />
                                                <div className="text-center">
                                                    <a className="small" href="/login" onClick={this.showSignup}>Have a key already? Go a head and sign up!</a>
                                                </div>
                                            </div>
                                        </form>

                                        <script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script>


                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
export default SignupPage;