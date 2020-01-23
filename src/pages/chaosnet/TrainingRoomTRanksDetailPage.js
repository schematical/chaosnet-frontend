import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import TrainingRoomListComponent from "../../components/chaosnet/TrainingRoomListComponent";
import FooterComponent from "../../components/FooterComponent";
import OrgListComponent from "../../components/chaosnet/OrgListComponent";
import TRankListComponent from "../../components/chaosnet/TRankListComponent";
const axios = require('axios');
class TrainingRoomTRanksDetailPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trank:{}
        }

    }
    render() {

        if(!this.state.loaded) {
            setTimeout(() => {
                let url = 'https://chaosnet.schematical.com/v0/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace + '/tranks/' + this.props.trank;
               console.log(this.props);
                return axios.get(url, {
                    headers: {
                        "Authorization": AuthService.accessToken
                    }
                })
                    .then((response) => {
                        console.log("Loaded: ", response.data);
                        this.state.trank = response.data;
                        this.state.loaded = true;
                        this.setState(this.state);
                    })
                    .catch((err) => {
                        this.state.error = err;
                        this.setState(this.state);
                        console.error("Error: ", err.message);
                    })
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
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks" }>tranks</a>
                                                /<a
                                                    href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks/"+ this.props.trank}>{this.props.trank}</a>

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
                                                    <h1>
                                                        {this.state.trank.namespace}
                                                    </h1>
                                                    <h3>
                                                        Children: {this.state.trank.children}
                                                    </h3>
                                                    <h3>
                                                        Class: {this.state.trank.trankClass}
                                                    </h3>
                                                    <h3>
                                                        Age: {this.state.trank.age}
                                                    </h3>
                                                    <h3>
                                                        Current Score: {this.state.trank.currentScore}
                                                    </h3>
                                                    <h3>
                                                        High Score: {this.state.trank.highScore}
                                                    </h3>
                                                    <h3>
                                                        Children Spawned This Gen: {this.state.trank.childrenSpawnedThisGen}
                                                    </h3>
                                                    <h3>
                                                        Children Reported This Gen: {this.state.trank.childrenReportedThisGen}
                                                    </h3>
                                                    <h3>
                                                        Gens Since Last Improvement: {this.state.trank.gensSinceLastImprovement}
                                                    </h3>
                                                    {
                                                        this.state.trank.parentNamespace &&
                                                        <h3>
                                                            Parent Namespace:
                                                            <a className="btn btn-primary btn-sm"
                                                               href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks/" + this.state.trank.parentNamespace}>
                                                                {this.state.trank.parentNamespace}
                                                            </a>
                                                        </h3>
                                                    }
                                                    <a className="btn btn-primary btn-sm" href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks/" + this.state.trank.namespace + "/children"}>
                                                        Children
                                                    </a>

                                                    <a className="btn btn-primary btn-sm" href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks/" + this.state.trank.namespace + "/organisms"}>
                                                        Organisms
                                                    </a>

                                                    {this.state.trank.historicalScores &&
                                                        <div>
                                                        <h2>Historical Scores: </h2>
                                                        <table>
                                                            <tr>
                                                                <th>
                                                                    Top Avg:
                                                                </th>
                                                                <th>
                                                                    Top Max:
                                                                </th>
                                                                <th>
                                                                    Gen Avg:
                                                                </th>
                                                                <th>
                                                                    Parent Age:
                                                                </th>
                                                            </tr>
                                                            {
                                                                this.state.trank.historicalScores.map((scoreData) => {
                                                                    return <tr>
                                                                        <td>
                                                                            {scoreData.topAvg}
                                                                        </td>
                                                                        <td>
                                                                            {scoreData.topMax}
                                                                        </td>
                                                                        <td>
                                                                            {scoreData.genAvg}
                                                                        </td>
                                                                        <td>
                                                                            {scoreData.parentAge}
                                                                        </td>
                                                                    </tr>
                                                                })
                                                            }
                                                        </table>
                                                        </div>
                                                        }
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

export default TrainingRoomTRanksDetailPage;