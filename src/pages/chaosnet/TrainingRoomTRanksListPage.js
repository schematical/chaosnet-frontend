import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import TrainingRoomListComponent from "../../components/chaosnet/TrainingRoomListComponent";
import FooterComponent from "../../components/FooterComponent";
import OrgListComponent from "../../components/chaosnet/OrgListComponent";
import TRankListComponent from "../../components/chaosnet/TRankListComponent";
import HTTPService from "../../services/HTTPService";
const axios = require('axios');
class TrainingRoomTRanksListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tranks:[],
            _lifeState: "Active"
        }
        this.handleChange = this.handleChange.bind(this);
        let qs = "state=" +this.state._lifeState;
        let url = '/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace + '/tranks?' + qs;
        if(this.props.session){
            url = '/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace + '/sessions/' + this.props.session + '/species?' + qs;
        }
        HTTPService.get(url, {

        })
        .then((response) => {
            let state = {};
            state.tranks = response.data;
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
    handleChange(event) {
        let state = {};
        state[event.target.name] = event.target.value;
        this.state.loaded = false;
        this.state.tranks = [];
        this.setState(state);
    }
    render() {

        if(!this.state.loaded) {
           return "<span>Loading...</span>";
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
                                        <h1 className="h3 mb-0 text-gray-800">ChaosNet</h1>
                                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                            <h1 className="h3 mb-0 text-gray-800">
                                                /<a href={"/" + this.props.username}>{this.props.username}</a>
                                                /<a href={"/" + this.props.username + "/trainingrooms"}>trainingrooms</a>
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace}>{this.props.trainingRoomNamespace}</a>
                                                /tranks
                                            </h1>

                                        </div>
                                    </div>
                                    <div className="row">




                                        <div className="col-xl-12 col-lg-12">

                                            <div className="card shadow mb-4">

                                                <div className="card-body">
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
                                                    <select id="_lifeState" name="_lifeState" value={this.state._lifeState} onChange={this.handleChange}>
                                                        <option value="Active">Active</option>
                                                        <option value="StalledOut">StalledOut</option>
                                                        <option value="MarkedForColdStorage">MarkedForColdStorage</option>
                                                    </select>
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th scope="col">Count {this.state.tranks.length}</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Age</th>
                                                            <th scope="col">Current Score</th>
                                                            <th scope="col">High Score</th>

                                                            <th scope="col">Life State</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.tranks.map((trank)=>{
                                                                return <TRankListComponent trank={trank} page={this}/>
                                                            })
                                                        }

                                                        </tbody>
                                                    </table>
                                                    {/*<a  href={"/" + this.props.username + "/trainingrooms/new"} className="btn btn-danger btn-lg" onClick={this.createNewTrainingRoom}>Create New</a>*/}
                                                </div>
                                            </div>
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

export default TrainingRoomTRanksListPage;