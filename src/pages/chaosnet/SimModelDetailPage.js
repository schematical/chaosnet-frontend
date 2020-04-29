import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";
import RawEditComponent from "../../components/chaosnet/RawEditComponent";
import LoadingComponent from "../../components/LoadingComponent";
import ConfirmComponent from "../../components/chaosnet/ConfirmComponent";
import jsonlint from 'codemirror';
import CodeMirror from 'codemirror';
//import lint from 'codemirror';
//import javascript from 'codemirror';

import '../../../node_modules/codemirror/addon/lint/lint.css';
import SimModelListComponent from "../../components/chaosnet/SimModelListComponent";
const axios = require('axios');
//const CodeMirror = require('codemirror');
const javascript = require('../../../node_modules/codemirror/mode/javascript/javascript');
//const lint = require('../../../node_modules/codemirror/addon/lint/lint');

//const jsonlint = require('../../../node_modules/codemirror/addon/lint/json-lint');
class SimModelDetailPage extends Component {
    constructor(props) {
        super(props);
        window.javascript = javascript;
        window.jsonLint = jsonlint;
        this.state = {
            simModel:null,
            isNew: this.props.simModelNamespace == 'new',
        }
        this.startEditMode = this.startEditMode.bind(this);
        this.createNewTag = this.createNewTag.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isOwner = this.isOwner.bind(this);
        this.onRawUpdate = this.onRawUpdate.bind(this);

        this.promptDelete = this.promptDelete.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        if(this.state.isNew){
            this.state.simModel = {
                owner_username: AuthService.userData.username,
            }
            this.state.loaded = true;

        }else {
            HTTPService.get('/' + this.props.username + '/simmodels/' + this.props.simModelNamespace)
                .then((response) => {
                    let state = {};
                    state.simModel = response.data;
                    state.loaded = true;
                    state.canEdit = AuthService.userData && (
                        AuthService.isAdmin() ||
                        AuthService.userData.username == state.trainingroom.owner_username
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
    }
    startEditMode(event){
        event.preventDefault();
        let state = {
            editMode: true
        }
        this.setState(state);
    }
    handleTagChange(event){
        let state = {
            tag: event.target.value
        }
        this.setState(state);
    }
    createNewTag(event){
        event.preventDefault();
        return HTTPService.post(
            '/' + this.props.username + '/simmodels/' + this.state.simModel.namespace + '/tags',
            {
                tag: this.state.tag
            },
            {

            }
        )
            .then((response) => {
                let state = {};
                state.simModel = response.data;

                this.setState(state);
            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })
    }
    promptDelete(event){
        event.preventDefault();
        this.refs.confirmComponent.show();
    }
    onConfirmDelete(){

        return HTTPService.delete('/' + this.props.username + '/simmodels/' + this.props.simModelNamespace,
            this.state.simModel,
            {

            }
        )
            .then((response) => {
                let state = {};
                state.simModel = response.data;
                document.location.href = '/' + this.props.username + '/simmodels?delete=success';
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
            simModel: this.state.simModel
        }


        this.setState(state);

    }
    handleChange(event) {
        let state = {
            simModel: this.state.simModel
        };

        switch(event.target.name){
            case('namespace'):
                if(this.state.isNew) {
                    state.simModel.namespace = event.target.value.toLowerCase().replace(/[^0-9a-z]/g, '');
                }
                break;
            case('name'):
                state.simModel.name = event.target.value;
                if(this.state.isNew) {
                    state.simModel.namespace = state.simModel.name.toLowerCase().replace(/[^0-9a-z]/g, '');
                }
                break;
            default:
                if(event.target.type == 'checkbox'){
                    state.simModel[event.target.name] = event.target.checked;
                }else {
                    state.simModel[event.target.name] = event.target.value;
                }

        }

        this.setState(state);
    }
    handleSubmit(event) {

        event.preventDefault();
        let uri ='/simmodels';
        let method = 'post'
        if(!this.state.isNew){
            uri = '/' + this.props.username + '/simmodels/' + this.state.simModel.namespace;
            method = 'put';
        }
        return HTTPService[method](
            uri,
            this.state.simModel,
            {

            }
        )
            .then((response) => {
                let state = {};
                state.simModel = response.data;
                if(this.state.isNew){
                    document.location.href = '/' + this.props.username + '/simmodels/' + this.state.simModel.namespace;
                }
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
                                            /<a href={"/" + this.props.username + "/simmodels"}>simmodels</a>
                                            /<a
                                            href={"/" + this.props.username + "/simmodels/" + this.props.simModelNamespace}>{this.props.simModelNamespace}</a>
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
                                            {
                                                this.state.loaded &&
                                                <div className="card shadow mb-4">
                                                    <div className="btn-group" role="group" aria-label="Basic example">

                                                        <a className="btn btn-primary btn-sm"
                                                           href={"/" + this.state.simModel.owner_username + "/simmodels/" + this.state.simModel.namespace + "/tags/dev/payload"}>
                                                            Payload
                                                        </a>



                                                        <div className="btn-group" role="group">
                                                            <button id="btnGroupDrop1" type="button"
                                                                    className="btn btn-secondary dropdown-toggle"
                                                                    data-toggle="dropdown" aria-haspopup="true"
                                                                    aria-expanded="false">
                                                                Options
                                                            </button>
                                                            <div className="dropdown-menu"
                                                                 aria-labelledby="btnGroupDrop1">
                                                                {
                                                                    this.state.canEdit &&
                                                                    <a className="dropdown-item" href={"/" + this.state.simModel.owner_username + "/simmodels/" + this.state.simModel.namespace + "/edit"} onClick={this.startEditMode}>
                                                                        Edit
                                                                    </a>
                                                                }

                                                                {
                                                                    this.state.canEdit &&
                                                                    <a className="dropdown-item" href={"/" + this.state.simModel.owner_username + "/simmodels/" + this.state.simModel.namespace + "/delete"} onClick={this.promptDelete}>
                                                                        Delete
                                                                    </a>
                                                                }


                                                            </div>
                                                        </div>


                                                    </div>


                                                </div>
                                            }

                                            {
                                                this.state.loaded &&
                                                <div className="container-fluid">

                                                    <div className="row">

                                                        {
                                                            (this.state.isNew || this.state.editMode) &&
                                                            <div className="col-xl-6 col-md-12 mb-6">
                                                                <div className="card shadow mb-4">
                                                                    <div className="card-header py-3">
                                                                        <h1 className="h3 mb-0 text-gray-800">Info</h1>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <form className="user"
                                                                              onSubmit={this.handleSubmit}>
                                                                            <div className="form-group">
                                                                                <label>
                                                                                    Name
                                                                                </label>
                                                                                <input
                                                                                    className="form-control form-control-user"
                                                                                    readOnly={!this.isOwner()}
                                                                                    id="name"
                                                                                    name="name"
                                                                                    type="text"
                                                                                    aria-describedby="name"
                                                                                    placeholder="Name"
                                                                                    value={this.state.simModel.name}
                                                                                    onChange={this.handleChange}
                                                                                />
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label>
                                                                                    Namespace
                                                                                </label>
                                                                                <input
                                                                                    className="form-control form-control-user"
                                                                                    readOnly={!this.isOwner() || !this.state.isNew}
                                                                                    id="namespace"
                                                                                    name="namespace"
                                                                                    type="text"
                                                                                    aria-describedby="namespace"
                                                                                    placeholder="Namespace"
                                                                                    value={this.state.simModel.namespace}
                                                                                    onChange={this.handleChange}
                                                                                />
                                                                            </div>
                                                                            {
                                                                                AuthService.userData && AuthService.userData._isAdmin &&

                                                                                <div className="form-group">
                                                                                    <label>
                                                                                        Featured
                                                                                    </label>
                                                                                    <input
                                                                                        className="form-control form-control-user"
                                                                                        id="featured"
                                                                                        name="featured"
                                                                                        type="checkbox"
                                                                                        aria-describedby="featured"
                                                                                        placeholder="Featured"
                                                                                        checked={this.state.simModel.featured}
                                                                                        value={!this.state.simModel.featured}
                                                                                        onChange={this.handleChange}
                                                                                    />
                                                                                </div>
                                                                            }
                                                                            <div className="form-group">
                                                                                <label>
                                                                                    Description
                                                                                </label>
                                                                                <textarea
                                                                                    className="form-control form-control-user"
                                                                                    readOnly={!this.isOwner()}
                                                                                    id="desc"
                                                                                    name="desc"
                                                                                    aria-describedby="description"
                                                                                    placeholder="description"
                                                                                    value={this.state.simModel.desc}
                                                                                    onChange={this.handleChange}
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
                                                        }








                                                        {
                                                            !this.state.isNew &&
                                                            <div className="col-xl-12 col-lg-12">
                                                                <div className="card shadow mb-4">

                                                                    <div className="card-body">
                                                                        {/*{
                                                                                this.state.error &&
                                                                                <div className="card mb-4 py-3  bg-danger text-white shadow">
                                                                                    <div className="card-body">
                                                                                        Error {this.state.error.status}
                                                                                        <div className="text-white-50 small">
                                                                                            {this.state.error.message}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            }*/}
                                                                            <table className="table">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th scope="col">Count: {this.state.simModel.versionTags.length }</th>
                                                                                    </tr>
                                                                                </thead>
                                                                            <tbody>
                                                                            {
                                                                                this.state.simModel.versionTags.map((tag) => {
                                                                                    return <tr
                                                                                        key={tag}>
                                                                                        <td>
                                                                                            <a href={"/" + this.state.simModel.owner_username + "/simmodels/" + this.state.simModel.namespace + "/tags/" + tag + "/payload"}>
                                                                                                {tag}
                                                                                                {
                                                                                                    this.state.simModel.latestSimModelTag == tag &&
                                                                                                        <span>  (LATEST)</span>
                                                                                                }
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                })
                                                                            }

                                                                            </tbody>
                                                                        </table>

                                                                            {
                                                                                this.isOwner() &&
                                                                                <form>
                                                                                    <div className="form-row">
                                                                                        <div className="col">
                                                                                            <input
                                                                                                id='tag'
                                                                                                name='tag'
                                                                                                type="text"
                                                                                               className="form-control"
                                                                                               placeholder="Tag Name"
                                                                                               value={this.state.tag}
                                                                                               onChange={this.handleTagChange}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col">
                                                                                            <a href={"/" + this.props.username + "/simmodels/new"}
                                                                                               className="btn btn-danger btn-sm"
                                                                                                onClick={this.createNewTag}>Create New</a>
                                                                                        </div>
                                                                                    </div>
                                                                                </form>

                                                                            }
                                                                    </div>
                                                                </div>
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
                    <ConfirmComponent ref="confirmComponent" id={this.props.trainingroom + "_confirmComponent"} title={"Confirm Delete"} body={"Are you sure you want to delete this training room? This will delete all Species, Sessions, Roles, Organisms for everyone that ever trained on this room so think it over carefully."} onConfirm={this.onConfirmDelete} />

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

export default SimModelDetailPage;