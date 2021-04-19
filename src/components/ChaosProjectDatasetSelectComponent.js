import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import {instanceOf} from "prop-types";
import {Cookies, withCookies} from "react-cookie";
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import HTTPService from "../services/HTTPService";
import axios from "axios";
class ChaosProjectDatasetSelectComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: props.chaosProject,
            type: props.type,
            onDatasetLoad: props.onDatasetLoad,
            tags: []
        }
        this.onDatasetLoadClick = this.onDatasetLoadClick.bind(this);
        this.loadTags();
    }
    loadTags(){
        HTTPService.get('/' + this.state.project.owner_username + '/projects/' + this.state.project.namespace + '/data/' + this.state.type + '/tags',
            {

            }
        )
        .then((response) => {
            let state = {};
            state.tags = response.data;
            this.setState(state);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }
    onDatasetLoadClick(event, tag) {
        event.preventDefault();
        this.setState({
            tag: tag
        });
        return HTTPService.get('/' + this.project.owner_username + '/projects/' + this.props.project.namespace + '/data/' + this.state.type + '/tags/' + tag,
            this.state.chaosproject,
            {

            }
        )
        .then((response) => {
            return axios.get(response.data.url);
        })
        .then((response) => {
            this.state.onDatasetLoad(response.data, tag);
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })
    }

    render() {
        return (
            <div className="dropdown">
                <button
                    className="btn btn-sm  btn-secondary dropdown-toggle"
                    type="button" id="dropdownMenuButton"
                    data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    Tags
                </button>
                <div className="dropdown-menu"
                     aria-labelledby="dropdownMenuButton">
                    {
                        this.state.tags.map((tag) => {
                            return <a className="dropdown-item" href="#"
                                      onClick={(e) => {
                                          this.onDatasetLoadClick(e, tag);
                                      }}>{tag}</a>
                        })
                    }

                {/*    <hr className="dropdown-divider" />
                    <a className="dropdown-item" href="#">Separated link</a>*/}
                </div>
            </div>
        );
    }
}

export default ChaosProjectDatasetSelectComponent;
