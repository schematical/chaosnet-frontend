import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
const axios = require('axios');
class TrainingRoomDetailPage extends Component {
    constructor(props) {
        super(props);
        console.log("Username: ", props.username, props);
        this.state = {
            trainingrooms:[]
        }
    }
    render() {

        if(!this.state.loaded) {
            setTimeout(() => {
                return axios.get('https://chaosnet.schematical.com/v0/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace , {
                    headers: {
                        "Authorization": AuthService.accessToken
                    }
                })
                    .then((response) => {
                        console.log("Loaded: ", response.data);
                        this.state.trainingroom = response.data;
                        this.state.loaded = true;
                        this.state.fitnessRules = JSON.stringify(this.state.trainingroom.fitnessRules, 0, 3);
                        this.state.config = JSON.stringify(this.state.trainingroom.config, 0, 3);
                        this.setState(this.state);
                    })
                    .catch((err) => {
                        this.state.error = err;
                        this.setState(this.state);
                        console.error("Error: ", err.message);
                    });
            }, 1000);
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
                                {
                                    this.state.loaded && <div className="container-fluid">
                                    {/* Page Heading */}
                                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                        <h1 className="h3 mb-0 text-gray-800">
                                            /<a href={"/" + this.props.username}>{this.props.username}</a>
                                            /<a href={"/" + this.props.username + "/trainingrooms"}>trainingrooms</a>
                                            /<a
                                            href={"/" + this.props.username + "/trainingrooms/" + this.state.trainingroom.namespace}>{this.state.trainingroom.namespace}</a>
                                        </h1>

                                    </div>
                                    <div className="row">

                                        <div className="col-xl-12 col-lg-12">
                                            <div className="card shadow mb-4">

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
                                                <a class="btn btn-primary btn-sm"  href={"/" + this.state.trainingroom.partitionNamespace +  "/trainingrooms/" + this.state.trainingroom.namespace + "/fitnessrules"}>Fitness Rules</a>
                                                <a className="btn btn-primary btn-sm" href={"/" + this.state.trainingroom.partitionNamespace + "/trainingrooms/" + this.state.trainingroom.namespace + "/organisms"}>
                                                    Organisms
                                                </a>
                                                <a className="btn btn-primary btn-sm" href={"/" + this.state.trainingroom.partitionNamespace + "/trainingrooms/" + this.state.trainingroom.namespace + "/tranks"}>
                                                    Taxonomic Ranks
                                                </a>
                                                <a className="btn btn-primary btn-sm" href={"/" + this.state.trainingroom.partitionNamespace + "/trainingrooms/" + this.state.trainingroom.namespace + "/sessions"}>
                                                    Sessions
                                                </a>

                                            </div>

                                            <div className="card shadow mb-4">
                                                <h2 className="h3 mb-0 text-gray-800">
                                                    Config
                                                </h2>
                                                {/* Card Body */}
                                                <div className="card-body">
                                                    <textarea className="form-control" id="exampleFormControlTextarea1"
                                                              rows="3">
                                                        {this.state.config}
                                                    </textarea>
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

export default TrainingRoomDetailPage;