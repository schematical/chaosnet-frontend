import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";
import RawEditComponent from "../../components/chaosnet/RawEditComponent";
import LoadingComponent from "../../components/LoadingComponent";
const axios = require('axios');
class TrainingRoomDetailPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trainingroom:null
        }
        this.handleConfigChange = this.handleConfigChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isOwner = this.isOwner.bind(this);
        this.onRawUpdate = this.onRawUpdate.bind(this);
        this.showRawEdit = this.showRawEdit.bind(this);

    }
    showRawEdit(event){
        event.preventDefault();
        this.refs.rawEditComponent.show(this.state.trainingroom.config);
    }
    onRawUpdate(config){
        let state = {
            trainingroom: this.state.trainingroom
        }

        state.trainingroom.config = config;
        this.setState(state);

    }
    handleConfigChange(event) {
        //let state = {};
        this.state.trainingroom.config[event.target.name] = event.target.value;

        this.setState( this.state);
    }
    handleSubmit(event) {

        event.preventDefault();
        return HTTPService.put('/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace,
            this.state.trainingroom,
            {

            }
        )
            .then((response) => {
                let state = {};
                state.trainingroom = response.data;

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

        if(!this.state.loaded) {
            setTimeout(() => {
                return HTTPService.get('/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace )
                    .then((response) => {
                        let state = {};
                        state.trainingroom = response.data;
                        state.loaded = true;
                        state.fitnessRules = JSON.stringify(state.trainingroom.fitnessRules, 0, 3);
                        state.config = JSON.stringify(state.trainingroom.config, 0, 3);
                        this.setState(state);
                    })
                    .catch((err) => {
                        let state = {};
                        state.error = err;
                        this.setState(state);
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
                                <div className="container-fluid">
                                    {/* Page Heading */}
                                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                        <h1 className="h3 mb-0 text-gray-800">
                                            /<a href={"/" + this.props.username}>{this.props.username}</a>
                                            /<a href={"/" + this.props.username + "/trainingrooms"}>trainingrooms</a>
                                            /<a
                                            href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace}>{this.props.trainingRoomNamespace}</a>
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
                                                           href={"/" + this.state.trainingroom.owner_username + "/trainingrooms/" + this.state.trainingroom.namespace + "/tranks"}>
                                                            Taxonomic Ranks
                                                        </a>
                                                        <a className="btn btn-primary btn-sm"
                                                           href={"/" + this.state.trainingroom.owner_username + "/trainingrooms/" + this.state.trainingroom.namespace + "/sessions"}>
                                                            Sessions
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
                                                                <a className="dropdown-item" href={"/" + this.state.trainingroom.owner_username + "/trainingrooms/" + this.state.trainingroom.namespace + "/presetneurons"}>
                                                                    Preset Neurons
                                                                </a>
                                                                <a className="dropdown-item" href={"/" + this.state.trainingroom.owner_username + "/trainingrooms/" + this.state.trainingroom.namespace + "/fitnessrules"}>
                                                                    Fitness Rules
                                                                </a>
                                                            </div>
                                                        </div>


                                                    </div>


                                                </div>
                                            }
                                            {
                                                this.state.loaded &&
                                                <div className="container-fluid">

                                                    <div className="row">


                                                        <div className="col-xl-6 col-md-12 mb-6">
                                                            <div className="card shadow mb-4">
                                                                <div className="card-header py-3">
                                                                    <h1 className="h3 mb-0 text-gray-800">Config</h1>
                                                                </div>
                                                                <div className="card-body">
                                                                    <form className="user" onSubmit={this.handleSubmit}>

                                                                        <div className="form-group">
                                                                            <label>
                                                                                Top TRank
                                                                            </label>
                                                                            <input type="text"
                                                                                   className="form-control form-control-user"
                                                                                   readOnly={!this.isOwner()}
                                                                                   id="topTRank" name="topTRank"
                                                                                   aria-describedby="trainingRoomName"
                                                                                   placeholder="Top TRank"
                                                                                   value={this.state.trainingroom.config.topTRank}
                                                                                   onChange={this.handleConfigChange}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Min Species Count
                                                                            </label>
                                                                            <input type="number"
                                                                                   className="form-control form-control-user"
                                                                                   readOnly={!this.isOwner()}
                                                                                   id="minSpeciesCount"
                                                                                   name="minSpeciesCount"
                                                                                   aria-describedby="trainingRoomName"
                                                                                   placeholder="Min Species Count"
                                                                                   value={this.state.trainingroom.config.minSpeciesCount}
                                                                                   onChange={this.handleConfigChange}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Max Surviving Species Per Generation
                                                                            </label>
                                                                            <input type="number"
                                                                                   className="form-control form-control-user"
                                                                                   readOnly={!this.isOwner()}
                                                                                   id="maxSurvivngSpeciesPerGeneration"
                                                                                   name="maxSurvivngSpeciesPerGeneration"
                                                                                   aria-describedby="trainingRoomName"
                                                                                   placeholder="Max Surviving Species Per Generation"
                                                                                   value={this.state.trainingroom.config.maxSurvivngSpeciesPerGeneration}
                                                                                   onChange={this.handleConfigChange}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Min Organisms Per Species Per Generation
                                                                            </label>
                                                                            <input type="number"
                                                                                   className="form-control form-control-user"
                                                                                   readOnly={!this.isOwner()}
                                                                                   id="minOrganisimsPerSpeciesPerGeneration"
                                                                                   name="minOrganisimsPerSpeciesPerGeneration"
                                                                                   aria-describedby="trainingRoomName"
                                                                                   placeholder="Min Organisms Per Species Per Generation"
                                                                                   value={this.state.trainingroom.config.minOrganisimsPerSpeciesPerGeneration}
                                                                                   onChange={this.handleConfigChange}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Max Surviving Organisms Per Species Per
                                                                                Generation
                                                                            </label>
                                                                            <input type="number"
                                                                                   className="form-control form-control-user"
                                                                                   readOnly={!this.isOwner()}
                                                                                   id="maxSurvivingOrganisimsPerSpeciesPerGeneration"
                                                                                   name="maxSurvivingOrganisimsPerSpeciesPerGeneration"
                                                                                   aria-describedby="trainingRoomName"
                                                                                   placeholder="Max Surviving Organisms Per Species Per Generation"
                                                                                   value={this.state.trainingroom.config.maxSurvivingOrganisimsPerSpeciesPerGeneration}
                                                                                   onChange={this.handleConfigChange}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Species Gens To Stabilize
                                                                            </label>
                                                                            <input type="number"
                                                                                   className="form-control form-control-user"
                                                                                   id="speciesGensToStabilize"
                                                                                   name="speciesGensToStabilize"
                                                                                   aria-describedby="speciesGensToStabilize"
                                                                                   placeholder="Species Gens To Stabilize"
                                                                                   value={this.state.trainingroom.config.speciesGensToStabilize}
                                                                                   onChange={this.handleConfigChange}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Species Gen To Improve
                                                                            </label>
                                                                            <input type="number"
                                                                                   className="form-control form-control-user"
                                                                                   readOnly={!this.isOwner()}
                                                                                   id="speciesGenToImprove"
                                                                                   name="speciesGenToImprove"
                                                                                   aria-describedby="speciesGenToImprove"
                                                                                   placeholder="Species Gen To Improve"
                                                                                   value={this.state.trainingroom.config.speciesGenToImprove}
                                                                                   onChange={this.handleConfigChange}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Batch Size
                                                                            </label>
                                                                            <input type="number"
                                                                                   className="form-control form-control-user"
                                                                                   id="batchSize" name="batchSize"
                                                                                   aria-describedby="batchSize"
                                                                                   placeholder="Batch Size"
                                                                                   value={this.state.trainingroom.config.batchSize}
                                                                                   onChange={this.handleConfigChange}
                                                                            />
                                                                        </div>
                                                                        {/* <div className="form-group">
                                                                            <label>
                                                                                Preset Observed Attributes
                                                                            </label>
                                                                            <input type="text" className="form-control form-control-user" readOnly={!this.isOwner()}
                                                                                   id="presetObservedAttributes" name="presetObservedAttributes" aria-describedby="presetObservedAttributes"
                                                                                   placeholder="Preset Observed Attributes"  value={this.state.trainingroom.config.presetObservedAttributes} onChange={this.handleConfigChange}
                                                                            />
                                                                        </div>*/}
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Accelerate Mutation As Species Gets
                                                                                Stale Rate
                                                                            </label>
                                                                            <input type="number"
                                                                                   className="form-control form-control-user"
                                                                                   readOnly={!this.isOwner()}
                                                                                   id="accellerateMutationAsSpeciesGetsStaleRate"
                                                                                   name="accellerateMutationAsSpeciesGetsStaleRate"
                                                                                   aria-describedby="accellerateMutationAsSpeciesGetsStaleRate"
                                                                                   placeholder="accellerateMutationAsSpeciesGetsStaleRate"
                                                                                   value={this.state.trainingroom.config.accellerateMutationAsSpeciesGetsStaleRate}
                                                                                   onChange={this.handleConfigChange}
                                                                            />
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