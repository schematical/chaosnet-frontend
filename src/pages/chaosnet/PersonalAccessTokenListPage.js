import React, {Component} from 'react';
import Link  from 'react-router-component';
import AuthService from "../../services/AuthService";
import HTTPService from "../../services/HTTPService";
import SidebarComponent from "../../components/SidebarComponent";
import TopbarComponent from "../../components/TopbarComponent";
import LoadingComponent from "../../components/LoadingComponent";
import ChaosProjectListComponent from "../../components/chaosnet/ChaosProjectListComponent";
import FooterComponent from "../../components/FooterComponent";
import PersonalAccessTokenListComponent from "../../components/chaosnet/PersonalAccessTokenListComponent";

class PersonalAccessTokenListPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: this.props.username,
            scopes: 'worker'
        }
        if(! AuthService.isAdmin()){
            if(this.state.username !== AuthService.userData.username){
                throw new Error("Are you trying to snipe someone else personal access tokens?");
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.onCreateNewClick = this.onCreateNewClick.bind(this);
        this.onSaveNewClick = this.onSaveNewClick.bind(this);
        HTTPService.get( "/" + this.props.username+ '/tokens', {

        })
        .then((response) => {
            let state = {};
            state.tokens = response.data;
            state.loaded = true;
            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }
    onCreateNewClick(event){
        event.preventDefault();
        this.setState({
            createNew: true
        })
    }
    onSaveNewClick(event){
        console.log("Saving...");
        event.preventDefault();
        HTTPService.post(
            "/" + this.props.username+ '/tokens',
            {
                name: this.state.name,
                scopes: this.state.scopes.split(',')
            }
        )
        .then((response) => {
            let state = {};
            state.newToken = response.data;
            state.createNew = false;
            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }
    handleChange(event) {
        console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
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
                                    {/* Page Heading */}
                                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                        <h1 className="h3 mb-0 text-gray-800">ChaosNet</h1>
                                        {/*<a href="#"
                                           className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                            className="fas fa-download fa-sm text-white-50"/> Generate Report</a>*/}
                                    </div>
                                    <div className="row">




                                        <div className="col-xl-12 col-lg-12">

                                            { !this.state.loaded && <LoadingComponent /> }
                                            {
                                                this.state.loaded &&
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">
                                                        {
                                                            this.state.error &&
                                                            <div className="card mb-4 py-3  bg-danger text-white shadow">
                                                                <div className="card-body">
                                                                    Error {this.state.error.status}
                                                                    <div className="text-white-50 small">
                                                                        {this.state.error.message}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        <table className="table">
                                                            <thead>
                                                            <tr>
                                                                <th scope="col">#</th>

                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.tokens.map((token) => {
                                                                    return <PersonalAccessTokenListComponent
                                                                        key={token._id}
                                                                        token={token} page={this}/>
                                                                })
                                                            }

                                                            </tbody>
                                                        </table>
                                                        {
                                                            !this.state.createNew &&
                                                            <a href='#' onClick={this.onCreateNewClick}
                                                               className="btn btn-danger btn-lg"
                                                            >Create New</a>
                                                        }
                                                        {
                                                            this.state.createNew &&
                                                            <div>
                                                                <div className="form-group">
                                                                    <label htmlFor="name">Name</label>
                                                                    <input type="text" id="name" name="name"  className="form-control"
                                                                           onChange={this.handleChange}/>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="scopes">Scope</label>
                                                                    <input type="text" id="scopes" name="scopes" value={this.state.scopes}  className="form-control"
                                                                           onChange={this.handleChange}/>
                                                                </div>
                                                                <a href='#' onClick={this.onSaveNewClick}
                                                                   className="btn btn-danger btn-lg"
                                                                >Save</a>
                                                            </div>
                                                        }
                                                        {
                                                            this.state.newToken &&
                                                            <div className="alert alert-primary" role="alert">
                                                                Your new Persona Access Token has been created. The secret key for it is `{this.state.newToken.secretKey}`.
                                                                This will be the only time you can retrieve your token so store it somewhere safe.
                                                                You can access certain parts of ChaosNet by using <a href='https://en.wikipedia.org/wiki/Basic_access_authentication'>HTTP Basic Authentication(Base64 encoded)</a>.
                                                                <br />
                                                                <h3>Example: </h3>
                                                                <b>Username: </b> {this.props.username} <br />
                                                                <b>Password: </b> {this.state.newToken.secretKey} <br />

                                                            </div>
                                                        }
                                                    </div>
                                                </div>

                                            }
                                        </div>


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
                    <a className="scroll-to-top rounded" href="#page-top">
                        <i className="fas fa-angle-up"/>
                    </a>
                </div>

            </div>

        );
    }
}

export default PersonalAccessTokenListPage;
