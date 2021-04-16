import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";
import RawEditComponent from "../../components/chaosnet/RawEditComponent";
import LoadingComponent from "../../components/LoadingComponent";
import ConfirmComponent from "../../components/chaosnet/ConfirmComponent";
import $ from "jquery";
const axios = require('axios');
class ChaosProjectDetailPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project:null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isOwner = this.isOwner.bind(this);
        this.onRawUpdate = this.onRawUpdate.bind(this);
        this.showRawEdit = this.showRawEdit.bind(this);
        this.promptDelete = this.promptDelete.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);

        HTTPService.get('/' + this.props.username + '/projects/' + this.props.chaosproject )
            .then((response) => {
                let state = {};
                state.project = response.data;

                state.loaded = true;
                state.canEdit = AuthService.userData && (
                    AuthService.isAdmin() ||
                    AuthService.userData.username == state.chaosproject.owner_username
                );

                this.setState(state);
            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            });
    }
    handleChange(event) {
        let state = {
            project: this.state.project
        };
        /*switch(event.target.name){
            case("observedAttributes"):

                break;
            default:*/
                state.project[event.target.name] = event.target.value;
        //}


        this.setState(state);
    }
    showRawEdit(event){
        event.preventDefault();
        this.refs.rawEditComponent.show(this.state.project);
    }
    promptDelete(event){
        event.preventDefault();
        this.refs.confirmComponent.show();
    }

    onConfirmDelete(){

        return HTTPService.delete('/' + this.props.username + '/projects/' + this.props.trainingRoomNamespace,
            this.state.chaosproject,
            {

            }
        )
        .then((response) => {
            let state = {};
            state.chaosproject = response.data;
            document.location.href = '/' + this.props.username + '/projects?delete=success';
            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }
    onRawUpdate(config){
        let state = {
            project: this.state.project
        }


        this.setState( state);
    }
    handleSubmit(event) {
        event.preventDefault();
        let state = {
            project: this.state.project
        };


        $('#editSimModel').modal('hide');
        return HTTPService.put('/' + this.props.username + '/project/' + this.props.chaosProject,
            this.state.project,
            {

            }
        )
        .then((response) => {

            state.project = response.data;

            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }
    isOwner(){

        if(!AuthService.userData){
            return false;
        }
        return this.props.username === AuthService.userData.username;
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
                                        <h1 className="h3 mb-0 text-gray-800">
                                            /<a href={"/" + this.props.username}>{this.props.username}</a>
                                            /<a href={"/" + this.props.username + "/projects"}>projects</a>
                                            /<a
                                            href={"/" + this.props.username + "/projects/" + this.props.chaosproject}>{this.props.chaosproject}</a>
                                        </h1>

                                    </div>
                                    <div className="row">

                                        <div className="col-xl-12 col-lg-12">
                                            { !this.state.error && !this.state.loaded && <LoadingComponent /> }
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
                                            {/*{
                                                this.state.loaded &&
                                                <div className="card shadow mb-4">
                                                    <div className="btn-group" role="group" aria-label="Basic example">

                                                        <a className="btn btn-primary btn-sm"
                                                           href={"/" + this.state.chaosproject.owner_username + "/projects/" + this.state.chaosproject.namespace + "/tranks"}>
                                                            Taxonomic Ranks
                                                        </a>
                                                        <a className="btn btn-primary btn-sm"
                                                           href={"/" + this.state.chaosproject.owner_username + "/chaosprojects/" + this.state.chaosproject.namespace + "/sessions"}>
                                                            Sessions
                                                        </a>
                                                        <a className="btn btn-primary btn-sm"
                                                           href={"/simmodels/" + this.state.chaosproject.simModelId }>
                                                            Sim Model
                                                        </a>
                                                        <div className="btn-group" role="group">
                                                            <button id="btnGroupDrop1" type="button"
                                                                    className="btn btn-secondary dropdown-toggle"
                                                                    data-toggle="dropdown" aria-haspopup="true"
                                                                    aria-expanded="false">
                                                                Edit
                                                            </button>
                                                            <div className="dropdown-menu"
                                                                 aria-labelledby="btnGroupDrop1">
                                                                <a className="dropdown-item" href={"/" + this.state.chaosproject.owner_username + "/chaosprojects/" + this.state.chaosproject.namespace + "/presetneurons"}>
                                                                    Preset Neurons
                                                                </a>
                                                                <a className="dropdown-item" href={"/" + this.state.chaosproject.owner_username + "/chaosprojects/" + this.state.chaosproject.namespace + "/fitnessrules"}>
                                                                    Fitness Rules
                                                                </a>
                                                                <a className="dropdown-item" href={"/" + this.state.chaosproject.owner_username + "/chaosprojects/" + this.state.chaosproject.namespace + "/roles"}>
                                                                    Roles
                                                                </a>
                                                                {
                                                                    this.state.canEdit &&
                                                                    <a className="dropdown-item" href={"/" + this.state.chaosproject.owner_username + "/chaosprojects/" + this.state.chaosproject.namespace + "/delete"} onClick={this.promptEditSimModel}>
                                                                        Sim Model Tag
                                                                    </a>
                                                                }
                                                                {
                                                                    this.state.canEdit &&
                                                                    <a className="dropdown-item" href={"/" + this.state.chaosproject.owner_username + "/chaosprojects/" + this.state.chaosproject.namespace + "/delete"} onClick={this.promptDelete}>
                                                                        Delete
                                                                    </a>
                                                                }


                                                            </div>
                                                        </div>


                                                    </div>


                                                </div>
                                            }*/}

                                            {
                                                this.state.loaded &&
                                                <div className="container-fluid">

                                                    <div className="row">


                                                        <div className="col-xl-6 col-md-12 mb-6">
                                                            <div className="card shadow mb-4">
                                                                <div className="card-header py-3">
                                                                    <h1 className="h3 mb-0 text-gray-800">{this.state.project.name}</h1>
                                                                </div>
                                                                <div className="card-body">
                                                                    <form className="user" onSubmit={this.handleSubmit}>

                                                                        <div className="form-group">
                                                                            <label>
                                                                                Description
                                                                            </label>
                                                                            <textarea
                                                                                   className="form-control"
                                                                                   readOnly={!this.isOwner()}
                                                                                   id="desc"
                                                                                   name="desc"
                                                                                   aria-describedby="description"
                                                                                   placeholder="description"
                                                                                   value={this.state.project.desc}
                                                                                   onChange={this.handleConfigChange}
                                                                            ></textarea>
                                                                        </div>



                                                                        {
                                                                            this.isOwner() &&
                                                                            <button
                                                                                className="btn btn-primary btn-user btn-block">
                                                                                Save
                                                                            </button>
                                                                        }
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
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
                    <ConfirmComponent ref="confirmComponent" id={this.props.chaosproject + "_confirmComponent"} title={"Confirm Delete"} body={"Are you sure you want to delete this training room? This will delete all Species, Sessions, Roles, Organisms for everyone that ever trained on this room so think it over carefully."} onConfirm={this.onConfirmDelete} />
                    {
                        this.state.chaosproject &&

                        <div className="modal fade" id="editSimModel" tabIndex={-1} role="dialog"
                             aria-labelledby="editSimModel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editSimModel">Edit Sim Model</h5>
                                        <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {this.state.error &&
                                        <div className="alert alert-danger">{this.state.error.message}</div>
                                        }
                                        Are you sure you want to edit the sim model?
                                        There is about a 99% chance your organisms wont work anymore and you will have
                                        to do a hard reset. You have been warned.
                                        {
                                            this.state.simModel &&
                                            <select id="simModelTag" name="simModelTag" className="form-control"
                                                    value={this.state.chaosproject.simModelTag}
                                                    onChange={this.handleChange}>
                                                {
                                                    this.state.simModel.versionTags.map((tag) => {

                                                        return <option key={tag} value={tag}>{tag}</option>

                                                    })
                                                }
                                            </select>
                                        }
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" type="button" data-dismiss="modal">
                                            Cancel
                                        </button>
                                        <button className="btn btn-secondary btn-danger" type="button"
                                                onClick={this.handleSubmit}>
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
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

export default ChaosProjectDetailPage;
