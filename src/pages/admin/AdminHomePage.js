import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";

import LoadingComponent from "../../components/LoadingComponent";
import AuthService from "../../services/AuthService";
class AdminHomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded:false,
            keyPayload:{
                count: 5,
                notes: ""
            }
        }
        this.handelKeyChange = this.handelKeyChange.bind(this);
        this.handleKeySubmit = this.handleKeySubmit.bind(this);
        if(!AuthService.hasScope("moderator")){
            this.state.error = new Error("Nooopppppeeee....:" + JSON.stringify(AuthService.userData));
            return;
        }
        HTTPService.get('/admin/home', {})
            .then((response) => {
                let state = {};
                state.stats = response.data;
                this.setState(state);
                return HTTPService.get('/admin/keys', {})

            })
            .then((response) => {
                let state = {};
                state.loaded = true;
                state.keys = response.data;
                this.setState(state);
            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            });

    }
    handelKeyChange(event){
        let state = {
            keyPayload: this.state.keyPayload
        }
        state.keyPayload[event.target.name] = event.target.value;
        this.setState(state);
    }
    handleKeySubmit(event){
        event.preventDefault();
        HTTPService.post(
            '/admin/keys',
            this.state.keyPayload
        )
        .then((response) => {
            let state = {};
            state.keys = response.data;
            this.setState(state);

        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        });

    }
    render() {

        return (
            <div>
                <div>
                    {/* Page Wrapper */}
                    <div id="wrapper">
                        <SidebarComponent></SidebarComponent>
                        {/* Content Wrapper */}
                        <div id="content-wrapper" className="d-flex flex-column">
                            {/* Main Content */}
                            <div id="content">
                                {/* Topbar */}
                                <TopbarComponent></TopbarComponent>
                                {/* End of Topbar */}
                                {/* Begin Page Content */}
                                <div className="container-fluid">

                                    <div className="row">

                                        {
                                            this.state.error &&
                                            <div className="alert alert-danger">
                                                {this.state.error.message}
                                            </div>
                                        }
                                        {
                                            !this.state.loaded &&
                                            <LoadingComponent />
                                        }
                                        {
                                            this.state.loaded &&
                                            <div className="col-xl-6 col-md-12 mb-6">
                                                <div className="card shadow mb-4">
                                                    <div className="card-header py-3">
                                                        <h1 className="h3 mb-0 text-gray-800">Admin</h1>
                                                    </div>
                                                    <div className="card-body">
                                                        <table className="table">
                                                            <tbody>
                                                                {
                                                                    Object.keys(this.state.stats).map((key)=>{
                                                                        return <tr key={key}>
                                                                            <td>{key}</td>
                                                                            <td>{this.state.stats[key]}</td>
                                                                        </tr>
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>

                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            this.state.loaded &&
                                            AuthService.hasScope("moderator") &&
                                            <div className="col-xl-6 col-md-12 mb-6">
                                                <div className="card shadow mb-4">
                                                    <div className="card-header py-3">
                                                        <h1 className="h3 mb-0 text-gray-800">Keys</h1>
                                                    </div>
                                                    <div className="card-body">

                                                        <table className="table">
                                                            <tbody>
                                                            {
                                                               this.state.keys.map((signupKey)=>{
                                                                    return <tr key={signupKey._id}>
                                                                        <td>{signupKey.namespace}</td>
                                                                        <td>{signupKey.notes}</td>
                                                                    </tr>
                                                                })
                                                            }
                                                            </tbody>
                                                        </table>
                                                        <form className="user" onSubmit={this.handleKeySubmit}>

                                                            <div className="form-group">
                                                                <label>
                                                                    Count
                                                                </label>
                                                                <input
                                                                    className="form-control form-control-user"

                                                                    id="count"
                                                                    name="count"
                                                                    type="number"
                                                                    aria-describedby="count"
                                                                    placeholder="count"
                                                                    value={this.state.keyPayload.count}
                                                                    onChange={this.handelKeyChange}
                                                                ></input>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>
                                                                    Count
                                                                </label>
                                                                <textarea
                                                                    className="form-control form-control-user"

                                                                    id="notes"
                                                                    name="notes"
                                                                    aria-describedby="notes"
                                                                    placeholder="notes"
                                                                    onChange={this.handelKeyChange}
                                                                    value={this.state.keyPayload.notes}
                                                                ></textarea>
                                                            </div>

                                                            {
                                                                <button
                                                                    className="btn btn-primary btn-user btn-block">
                                                                    Save
                                                                </button>
                                                            }
                                                        </form>


                                                    </div>
                                                </div>
                                            </div>
                                        }


                                    </div>
                                </div>
                                {/* /.container-fluid */}
                            </div>
                            {/* End of Main Content */}
                            {/* Footer */}
                            <FooterComponent />
                            {/* End of Footer */}
                        </div>
                        {/* End of Content Wrapper */}
                    </div>
                    {/* End of Page Wrapper */}
                    {/* Scroll to Top Button*/}

                </div>

            </div>
        );
    }
}

export default AdminHomePage;
