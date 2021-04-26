import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";
const axios = require('axios');
class ChaosProjectNewPage extends Component {
    constructor(props) {
        super(props);
        console.log('this.props', props);
        this.state = {
            chaosProject:{
                owner_username: AuthService.userData.username,
                type: 'chaospixel'
            },
            loaded: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {

        let state = {};
        let parts = event.target.name.split("_");
        if(parts.length < 2){
            throw new Error("This should not happen")
            return;
        }

        let entity = parts[0];
        let field = parts[1];
        if(!this.state[entity]){
            throw new Error("Missing Entity: " + entity + " keys:" + Object.keys(this.state).join(","));
            return;
        }
        state[entity] = this.state[entity];

        state[entity][field] = event.target.value;
        switch (field) {
            case('name'):
                state[entity].namespace = state[entity].name.toLowerCase().replace(/[^0-9a-z]/g, '');
                break;

        }

        this.setState(state);
    }
    
    handleSubmit(event) {


        event.preventDefault();
        return HTTPService.post( '/' + this.state.chaosProject.owner_username +'/projects' ,
            this.state.chaosProject,
            {
            }
        )
          
            .then((response) => {

                this.state.chaosProject = response.data;

                this.setState(this.state);
                document.location.href = ("/" + this.state.chaosProject.owner_username + "/projects/" + this.state.chaosProject.namespace);
            })
            .catch((err) => {
                let state = {}
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })
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
                                {
                                    this.state.loaded && <div className="container-fluid">
                                    {/* Page Heading */}

                                    <div className="row">

                                        <div className="col-xl-12 col-lg-12">
                                            <div className="card shadow mb-4">
                                                <h2 className="h3 mb-0 text-gray-800">
                                                  New ChaosProject
                                                </h2>
                                                {/* Card Body */}
                                                <div className="card-body">
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
                                                            <label className="mr-sm-2"
                                                                   htmlFor="inlineFormCustomSelect">Project Name</label>
                                                            <input type="text" className="form-control form-control-user"
                                                                   id="chaosProject_name" name="chaosProject_name" aria-describedby="chaosProject_name"
                                                                   placeholder="Chaos Project Name..."  value={this.state.chaosProject.name} onChange={this.handleChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="mr-sm-2"
                                                                   htmlFor="inlineFormCustomSelect">Project Namespace</label>
                                                            <input type="text" className="form-control form-control-user"
                                                                   readOnly={true}
                                                                   id="chaosProject_namespace" name="chaosProject_namespace" aria-describedby="chaosProject_namespace"
                                                                   placeholder="Chaos Project Namespace..."  value={this.state.chaosProject.namespace} onChange={this.handleChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="mr-sm-2"
                                                                   htmlFor="inlineFormCustomSelect">Project Type</label>
                                                            <div className="input-group mb-3">


                                                                <input type="text" className="form-control form-control-user"
                                                                       id="chaosProject_simModelNamespace" name="chaosProject_type" aria-describedby="chaosProject_type"
                                                                       readOnly={true}
                                                                       placeholder="Chaos Project Type"  value={this.state.chaosProject.type} onChange={this.handleChange} value='chaospixel'
                                                                />
                                                                    {/*<div className="input-group-append">
                                                                        <a className="btn btn-primary btn-user btn-block"
                                                                           href={"/simmodels"}
                                                                                >
                                                                            Change
                                                                        </a>
                                                                    </div>*/}
                                                            </div>

                                                        </div>



                                                        <button className="btn btn-primary btn-user btn-block">
                                                            Save
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                </div>
                                }
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

export default ChaosProjectNewPage;
