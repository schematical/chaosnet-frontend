import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";
const axios = require('axios');
class TrainingRoomNewPage extends Component {
    constructor(props) {
        super(props);
        console.log('this.props', props);
        this.state = {


            trainingRoom:{
                simModelUsername: this.props._query.simModelUsername || "schematical",
                simModelNamespace: this.props._query.simModelNamespace || "chaoscraftdiscovery",
                simModelTag: this.props._query.simModelTag,
            },
            trainingRoomRole:{
                name: "Default",
                namespace:"default",

            },
            loaded: true
        }
        this.loadSimModel();
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
            case('simModelNamespace'):
                this.loadSimModel(event.target.value)
        }

        this.setState(state);
    }
    loadSimModel(){

        return HTTPService.get('/' + this.state.trainingRoom.simModelUsername+ '/simmodels/' + this.state.trainingRoom.simModelNamespace,
            {
            }
        )
            .then((response)=>{
                let state = {
                    simModel: response.data
                }

                this.setState(state);
                if(!this.state.trainingRoom.simModelTag){
                    this.state.trainingRoom.simModelTag = state.simModel.latestSimModelTag;
                }
            })
            .catch((err) => {
                let state = {}
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })

    }
    handleSubmit(event) {


        event.preventDefault();
        return HTTPService.post('/trainingrooms' ,
            this.state.trainingRoom,
            {
            }
        )
            .then((response) => {

                this.state.trainingRoom = response.data;

                this.setState(this.state);
                return HTTPService.post('/' + this.state.trainingRoom.owner_username + '/trainingrooms/' + this.state.trainingRoom.namespace + '/roles' ,
                    this.state.trainingRoomRole,
                    {
                    }
                );
            })
            .then((response) => {

                this.state.trainingRoomRole = response.data;

                this.setState(this.state);
                document.location.href = ("/" + this.state.trainingRoom.owner_username + "/trainingrooms/" + this.state.trainingRoom.namespace + '/roles/' + this.state.trainingRoomRole.namespace + '/fitnessrules?wizzard=true');
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
                                                  New Training Room
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
                                                            <input type="text" className="form-control form-control-user"
                                                                   id="trainingRoom_name" name="trainingRoom_name" aria-describedby="trainingRoom_name"
                                                                   placeholder="Training Room Name..."  value={this.state.trainingRoom.name} onChange={this.handleChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control form-control-user"
                                                                   readOnly={true}
                                                                   id="trainingRoom_namespace" name="trainingRoom_namespace" aria-describedby="trainingRoom_namespace"
                                                                   placeholder="Training Room Namespace..."  value={this.state.trainingRoom.namespace} onChange={this.handleChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="input-group mb-3">
                                                                <input type="text" className="form-control form-control-user"
                                                                       id="trainingRoom_simModelNamespace" name="trainingRoom_simModelNamespace" aria-describedby="trainingRoom_simModelNamespace"
                                                                       readOnly={true}
                                                                       placeholder="Sim Model Namespace..."  value={this.state.trainingRoom.simModelNamespace} onChange={this.handleChange}
                                                                />
                                                                    <div className="input-group-append">
                                                                        <a className="btn btn-primary btn-user btn-block"
                                                                           href={"/simmodels"}
                                                                                >
                                                                            Change
                                                                        </a>
                                                                    </div>
                                                            </div>

                                                        </div>

                                                        {
                                                            this.state.simModel &&
                                                            <div className="form-group">

                                                                <select
                                                                    id="trainingRoom_simModelTag"
                                                                    name="trainingRoom_simModelTag"
                                                                    className="form-control"
                                                                    value={this.state.trainingRoom.simModelTag}
                                                                    onChange={this.handleChange}
                                                                >
                                                                    {
                                                                        this.state.simModel.versionTags.map((tag) => {
                                                                            return <option
                                                                                key={tag}
                                                                                value={tag}>{tag}
                                                                            </option>

                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        }
                                                        <div className="form-group">
                                                            <input type="text" className="form-control form-control-user"
                                                                   id="trainingRoomRole_name" name="trainingRoomRole_name" aria-describedby="trainingRoomRole_name"
                                                                   placeholder="Training Room Role..."  value={this.state.trainingRoomRole.name} onChange={this.handleChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control form-control-user"
                                                                   readOnly={true}
                                                                   id="trainingRoomRole_namespace" name="trainingRoomRole_namespace" aria-describedby="trainingRoomRole_namespace"
                                                                   placeholder="Training Room Role Namespace..."  value={this.state.trainingRoomRole.namespace} onChange={this.handleChange}
                                                            />
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

export default TrainingRoomNewPage;