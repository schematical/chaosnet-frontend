import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import TrainingRoomListComponent from "../../components/chaosnet/TrainingRoomListComponent";
import FooterComponent from "../../components/FooterComponent";
import OrgListComponent from "../../components/chaosnet/OrgListComponent";
import TRankListComponent from "../../components/chaosnet/TRankListComponent";
import HTTPService from "../../services/HTTPService";
import LoadingComponent from "../../components/LoadingComponent";
const _ = require('underscore');
class TrainingRoomTRanksDetailPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trank:{},
            uri:  '/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace + '/tranks/' + this.props.trank
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handelDelete = this.handelDelete.bind(this);




        HTTPService.get(this.state.uri, {

        })
            .then((response) => {
                let state = {};
                state.trank = response.data;
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
    handleChange(event){
        let state = {
            trank: this.state.trank
        }
        state.trank[event.target.name] = event.target.value;
        this.setState(state);
    }
    handleSubmit(event){
        event.preventDefault();
        let url = '/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace + '/tranks/' + this.props.trank;
        let payload = _.clone(this.state.trank);
        delete(payload.namespace);
        delete(payload.owner_username);
        return HTTPService.put(
            url,
            payload,
    {}
        )
        .then((response) => {
            let state = {};
            state.trank = response.data;
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
    handelDelete(event){
        event.preventDefault();
        if(!this.state.confirmDelete){
            this.setState({
                confirmDelete: true
            })
            return;
        }


        return HTTPService.delete(
            this.state.uri,
            {},
            {}
        )
        .then((response) => {
            this.setState({
                confirmDelete: false
            })
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
                                            { !this.state.error && !this.state.loaded && <LoadingComponent /> }
                                            {
                                                this.state.error &&
                                                <div
                                                    className="card mb-4 py-3  bg-danger text-white shadow">
                                                    <div className="card-body">
                                                        Error {this.state.error.status}
                                                        <div className="text-white-50 small">
                                                            {this.state.error.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                this.state.loaded &&
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">

                                                        <h1>
                                                            {this.state.trank.namespace}
                                                        </h1>
                                                        <h3>
                                                            State: {this.state.trank.lifeState}
                                                        </h3>
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
                                                            Children Spawned This
                                                            Gen: {this.state.trank.childrenSpawnedThisGen}
                                                        </h3>
                                                        <h3>
                                                            Children Reported This
                                                            Gen: {this.state.trank.childrenReportedThisGen}
                                                        </h3>
                                                        <h3>
                                                            Gens Since Last
                                                            Improvement: {this.state.trank.gensSinceLastImprovement}
                                                        </h3>
                                                        <h3>
                                                            Complexity: {this.state.trank.complexityScore}
                                                        </h3>
                                                        <div className="btn-group">
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
                                                            <a className="btn btn-primary btn-sm"
                                                               href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks/" + this.state.trank.namespace + "/children"}>
                                                                Children
                                                            </a>

                                                            <a className="btn btn-primary btn-sm"
                                                               href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks/" + this.state.trank.namespace + "/organisms"}>
                                                                Organisms
                                                            </a>
                                                            <a className="btn btn-primary btn-sm"
                                                               href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks/" + this.state.trank.namespace + "/organisms/top"}>
                                                                Top Organisms
                                                            </a>
                                                        </div>
                                                        <form className="user col-lg-4" onSubmit={this.handleSubmit}>
                                                            <div className="form-group">
                                                                <label>
                                                                    Life State
                                                                </label>
                                                                <select id="lifeState" name="lifeState"
                                                                        className="form-control form-control-user"
                                                                        value={this.state.trank.lifeState}
                                                                        onChange={this.handleChange}>
                                                                    <option value="Active">Active</option>
                                                                    <option value="StalledOut">StalledOut</option>
                                                                    <option
                                                                        value="MarkedForColdStorage">MarkedForColdStorage
                                                                    </option>
                                                                </select>

                                                            </div>
                                                            <div className="form-group">
                                                                <label>
                                                                    Evolve State
                                                                </label>
                                                                <select id="evolveState" name="evolveState"
                                                                        className="form-control form-control-user"
                                                                        value={this.state.trank.evolveState}
                                                                        onChange={this.handleChange}>
                                                                    <option value="Add">Add</option>
                                                                    <option value="Subtract">Subtract</option>
                                                                </select>

                                                            </div>
                                                            <div class="btn-group">
                                                                <button className="btn btn-primary btn-sm">
                                                                    Update
                                                                </button>
                                                                {
                                                                    !this.state.confirmDelete &&
                                                                    <button className="btn btn-info btn-sm" onClick={this.handelDelete}>
                                                                        Delete
                                                                    </button>
                                                                }
                                                                {
                                                                    this.state.confirmDelete &&
                                                                    <button className="btn btn-danger btn-sm" onClick={this.handelDelete}>
                                                                        Confirm Delete
                                                                    </button>
                                                                }
                                                                </div>
                                                        </form>

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

                                                        <h3>Brain Maker Config Data</h3>
                                                        <div>
                                                            <table>
                                                                {
                                                                    Object.keys(this.state.trank.brainMakerConfigData || {}).map((key) => {
                                                                        if (!_.isObject(this.state.trank.brainMakerConfigData[key])) {
                                                                            return <tr>
                                                                                <td>
                                                                                    {key} {this.state.trank.brainMakerConfigData[key]}
                                                                                </td>
                                                                            </tr>
                                                                        } else {
                                                                            return <tr>
                                                                                <td>
                                                                                    {key}
                                                                                    <ul>
                                                                                        {
                                                                                            Object.keys(this.state.trank.brainMakerConfigData[key]).map((key2) => {
                                                                                                return <li>
                                                                                                    {key2}: {this.state.trank.brainMakerConfigData[key][key2]}
                                                                                                </li>
                                                                                            })

                                                                                        }
                                                                                    </ul>
                                                                                </td>
                                                                            </tr>


                                                                        }


                                                                    })
                                                                }

                                                            </table>
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