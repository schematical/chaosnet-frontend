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
const axios = require('axios');
const json = require('comment-json');
//const CodeMirror = require('codemirror');
const javascript = require('../../../node_modules/codemirror/mode/javascript/javascript');
//const lint = require('../../../node_modules/codemirror/addon/lint/lint');

//const jsonlint = require('../../../node_modules/codemirror/addon/lint/json-lint');
class SimModelPayloadEditPage extends Component {
    constructor(props) {
        super(props);
        window.javascript = javascript;
        window.jsonLint = jsonlint;
        this.state = {
            simModel:null,
            rendered: false,
            isDev: this.props.simModelTag == 'dev'

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isOwner = this.isOwner.bind(this);
        this.promptDelete = this.promptDelete.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
        let uri = '/' + this.props.username + '/simmodels/' + this.props.simModelNamespace + '/tags/' + this.props.simModelTag + '/payload';
        if(this.state.isDev){
           uri = '/' + this.props.username + '/simmodels/' + this.props.simModelNamespace + '/payload'
        }
        HTTPService.get(uri)
            .then((response) => {
                let state = {};
                state.simModel = response.data.simModel;
                state.payload = response.data.payload;
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
    showRawEdit(event){
        event.preventDefault();
        this.refs.rawEditComponent.show(this.state.trainingroom.config);
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
        };
        state[event.target.name] = event.target.value;

        this.setState( state);
    }
    jumpToLine(i) {
        var t = this.editor.charCoords({line: i, ch: 0}, "local").top;
        var middleHeight = this.editor.getScrollerElement().offsetHeight / 2;
        this.editor.scrollTo(null, t - middleHeight - 5);
    }
    handleSubmit(event) {

        event.preventDefault();
        let payload = this.editor.getValue();
        try{
            json.parse(payload);
        }catch(err){
            err.message += "Line: " +  err.line + ":" + err.column;
            let state = {
                error: err
            };
            this.jumpToLine(err.line);//err.column,
            console.error(state);
            this.setState(state);
            return;
        }
        return HTTPService.post('/' + this.props.username + '/simmodels/' + this.state.simModel.namespace + "/payload",
            {
                payload: payload//this.state.payload
            },
            {

            }
        )
            .then((response) => {
                let state = {};
                state.message = "Success";

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
        if(
            this.state.loaded &&
            !this.state.rendered
        ) {
            setTimeout(() => {
                this.editor = CodeMirror.fromTextArea(document.getElementById("payload"), {
                    lineNumbers: true,
                    matchBrackets: true,
                    mode: "application/json",
                    gutters: ["CodeMirror-lint-markers"],
                    lint: true,
                    readOnly:(!this.isOwner() || !this.state.isDev)
                });
                let state = {
                    rendered: true
                };
                this.setState(state);
               /* this.editor.on('change', (codeMirror, changeObj)=>{
                    console.log(changeObj);
                    let state = {
                        payload: this.editor.getValue()
                    };
                    this.setState(state);
                })*/
            }, 100);
        }
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
                                            /tags
                                            /{this.props.simModelTag}
                                            /payload
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
                                                this.state.message &&
                                                <div className="card mb-4 py-3  bg-info text-white shadow">
                                                    <div className="card-body">
                                                         {this.state.message}
                                                       {/* <div className="text-white-50 small">
                                                            {this.state.message}
                                                        </div>*/}
                                                    </div>
                                                </div>
                                            }
                                            {
                                                this.state.loaded &&
                                                <div className="card shadow mb-4">
                                                    {/*<div className="btn-group" role="group" aria-label="Basic example">

                                                        <a className="btn btn-primary btn-sm"
                                                           href={"/" + this.state.simModel.owner_username + "/simmodels/" + this.state.simModel.namespace + "/tags"}>
                                                            Tags
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
                                                                    <a className="dropdown-item" href={"/" + this.state.simModel.owner_username + "/simmodels/" + this.state.simModel.namespace + "/edit"}>
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


                                                    </div>*/}


                                                </div>
                                            }

                                            {
                                                this.state.loaded &&
                                                <div className="container-fluid">

                                                    <div className="row">


                                                        <div className="col-xl-12 col-md-12 mb-6">
                                                            <div className="card shadow mb-4">
                                                                <div className="card-header py-3">
                                                                    <h1 className="h3 mb-0 text-gray-800">Info</h1>
                                                                </div>
                                                                <div className="card-body">
                                                                    <form className="user" onSubmit={this.handleSubmit}>

                                                                        <div className="form-group">
                                                                            <label>
                                                                                Description
                                                                            </label>
                                                                            <textarea
                                                                                   className="form-control form-control-user"
                                                                                   readOnly={!this.isOwner() || !this.state.isDev}
                                                                                   id="payload"
                                                                                   name="payload"
                                                                                   aria-describedby="payload"
                                                                                   placeholder="payload"
                                                                                   value={this.state.payload}
                                                                                   onChange={this.handleChange}
                                                                            ></textarea>



                                                                        </div>
                                                                        <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                                                                        {
                                                                            this.isOwner() &&
                                                                            this.state.isDev &&
                                                                            <button
                                                                                className="btn btn-primary  btn-sm">
                                                                                Save
                                                                            </button>
                                                                        }
                                                                        {
                                                                            this.isOwner() &&
                                                                            !this.state.isDev &&
                                                                            <a
                                                                                className="btn btn-primary  btn-sm"
                                                                                href={"/" + this.state.simModel.owner_username + "/simmodels/" + this.state.simModel.namespace + "/tags/dev/payload"}
                                                                            >
                                                                                View Dev
                                                                            </a>
                                                                        }
                                                                            {
                                                                                AuthService.userData &&
                                                                                <a
                                                                                    className="btn btn-info   btn-sm"
                                                                                    href={"/" + this.state.simModel.owner_username + "/trainingrooms/new?simModelUsername=" + this.state.simModel.owner_username + "&simModelNamespace=" + this.state.simModel.namespace +"&simModelTag=" + this.props.simModelTag}
                                                                                >
                                                                                    Create Training Room
                                                                                </a>
                                                                            }
                                                                        </div>
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

export default SimModelPayloadEditPage;