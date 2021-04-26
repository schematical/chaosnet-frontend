import React, {Component} from 'react';
import AuthService from '../../services/AuthService';
import SearchbarComponent from '../SearchbarComponent';
import {instanceOf} from "prop-types";
import {Cookies, withCookies} from "react-cookie";
import HTTPService from "../../services/HTTPService";

class ChaosPixelProjectComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: props.chaosProject
        }
        this.loadProjectDataAndTags();

    }
    loadProjectDataAndTags(){
        HTTPService.get('/' + this.state.project.owner_username + '/projects/' + this.state.project.namespace + '/data',
            {

            }
        )
        .then((response) => {
            let state = {};
            state.projectData = response.data;
            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }
    render() {
        console.log("this.state: ", this.state);
        return (
            <div className="col-xl-6 col-md-12 mb-6">
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h1 className="h3 mb-0 text-gray-800">
                            Chaos Pixel
                        </h1>
                    </div>
                    <div className="card-body">

                        <div className="btn-group" role="group" aria-label="Basic example">

                            {/*<a className="btn btn-primary btn-sm"
                               href={"/" + this.state.project.owner_username + "/projects/" + this.state.project.namespace + "/chaospixel"}>
                                Dataset
                            </a>*/}
                            <div className="btn-group" role="group">
                                <button id="btnGroupDrop1" type="button"
                                        className="btn btn-secondary dropdown-toggle"
                                        data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                    Dataset
                                </button>
                                <div className="dropdown-menu"
                                     aria-labelledby="btnGroupDrop1">
                                    {
                                        this.state.projectData &&
                                        this.state.projectData.images &&
                                        this.state.projectData.images.map((tag) => {
                                            return <a className="dropdown-item" key={tag}
                                               href={"/" + this.state.project.owner_username + "/projects/" + this.state.project.namespace + "/chaospixel/dataset?tag=" + tag}>
                                                {tag}
                                            </a>
                                        })
                                    }
                                    <hr className="dropdown-divider" />
                                    <a className="dropdown-item" href={"/" + this.state.project.owner_username + "/projects/" + this.state.project.namespace + "/chaospixel/predict?tag=new"}>
                                        New
                                    </a>
                                </div>
                            </div>



                            <div className="btn-group" role="group">
                                <button id="btnGroupDrop1" type="button"
                                        className="btn btn-secondary dropdown-toggle"
                                        data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                    Models
                                </button>
                                <div className="dropdown-menu"
                                     aria-labelledby="btnGroupDrop1">
                                    {
                                        this.state.projectData &&
                                        this.state.projectData.models &&
                                        this.state.projectData.models.length > 0 &&
                                        this.state.projectData.models.map((model) => {
                                            return <a className="dropdown-item" key={model}
                                                      href={"/" + this.state.project.owner_username + "/projects/" + this.state.project.namespace + "/chaospixel/predict?model=" + model}>
                                                {model}
                                            </a>
                                        }) ||
                                        <a className="dropdown-item">
                                            None
                                        </a>
                                    }


                                </div>
                            </div>
                            <div className="btn-group" role="group">
                                <button id="btnGroupDrop1" type="button"
                                        className="btn btn-secondary dropdown-toggle"
                                        data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                    Jobs
                                </button>
                                <div className="dropdown-menu"
                                     aria-labelledby="btnGroupDrop1">
                                    <a className="dropdown-item"
                                       href='https://www.patreon.com/bePatron?u=12320615'>
                                        Coming Soon...
                                    </a>
                                   {/* <a className="dropdown-item"
                                       href={"/" + this.state.project.owner_username + "/projects/" + this.state.project.namespace + "/fitnessrules"}>
                                        Fitness Rules
                                    </a>
                                    <a className="dropdown-item"
                                       href={"/" + this.state.project.owner_username + "/projects/" + this.state.project.namespace + "/roles"}>
                                        Roles
                                    </a>
                                    {
                                        this.state.canEdit &&
                                        <a className="dropdown-item"
                                           href={"/" + this.state.project.owner_username + "/projects/" + this.state.project.namespace + "/delete"}
                                           onClick={this.promptEditSimModel}>
                                            Sim Model Tag
                                        </a>
                                    }
                                    {
                                        this.state.canEdit &&
                                        <a className="dropdown-item"
                                           href={"/" + this.state.project.owner_username + "/projects/" + this.state.project.namespace + "/delete"}
                                           onClick={this.promptDelete}>
                                            Delete
                                        </a>
                                    }*/}


                                </div>
                            </div>


                        </div>


                    </div>
                </div>
            </div>

        );
    }
}

export default ChaosPixelProjectComponent;
