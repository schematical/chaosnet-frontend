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
            trainingroom:null
        }
        this.handleConfigChange = this.handleConfigChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isOwner = this.isOwner.bind(this);
    }
    handleConfigChange(event) {
        console.log("TARGET:" , event.target.name, event.target.value, event.target);
        //let state = {};
        this.state.trainingroom.config[event.target.name] = event.target.value;

        this.setState( this.state);
    }
    handleSubmit(event) {
        /*this.state.trainingroom.config.presetNeurons = [];
        [
            "minecraft:lava",
            "minecraft:stone"
        ].forEach((strAttr)=>{
            for(let i = 0; i < 7; i++){
                this.state.trainingroom.config.presetNeurons.push({

                    "$TYPE":"IsLookingAtInput",
                    "attributeId":"BLOCK_ID",
                    "attributeValue": strAttr,
                    "eye":"Eye_" + i,
                    "_base_type":"input"

                })
            }
        })*/
        event.preventDefault();
        return axios.put('https://chaosnet.schematical.com/v0/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace,
            this.state.trainingroom,
            {
                headers: {
                    "Authorization": AuthService.accessToken
                }
            }
        )
            .then((response) => {
                console.log("Loaded: ", response.data);
                this.state.trainingroom = response.data;

                this.setState(this.state);
            })
            .catch((err) => {
                this.state.error = err;
                this.setState(this.state);
                console.error("Error: ", err.message);
            })
    }
    isOwner(){
        if(!AuthService.userData){
            return false;
        }
        return this.props.username == AuthService.userData.username;
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
                                            href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace}>{this.props.trainingRoomNamespace}</a>
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
                                                    <form className="user" onSubmit={this.handleSubmit}>

                                                        <div className="form-group">
                                                            <label>
                                                                Top TRank
                                                            </label>
                                                            <input type="text" className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="topTRank" name="topTRank" aria-describedby="trainingRoomName"
                                                                   placeholder="Top TRank"  value={this.state.trainingroom.config.topTRank} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>
                                                                Min Species Count
                                                            </label>
                                                            <input type="number" className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="minSpeciesCount" name="minSpeciesCount" aria-describedby="trainingRoomName"
                                                                   placeholder="Min Species Count"  value={this.state.trainingroom.config.minSpeciesCount} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>
                                                                Max Surviving Species Per Generation
                                                            </label>
                                                            <input type="number" className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="maxSurvivngSpeciesPerGeneration" name="maxSurvivngSpeciesPerGeneration" aria-describedby="trainingRoomName"
                                                                   placeholder="Max Surviving Species Per Generation"  value={this.state.trainingroom.config.maxSurvivngSpeciesPerGeneration} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>
                                                                Min Organisms Per Species Per Generation
                                                            </label>
                                                            <input type="number" className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="minOrganisimsPerSpeciesPerGeneration" name="minOrganisimsPerSpeciesPerGeneration" aria-describedby="trainingRoomName"
                                                                   placeholder="Min Organisms Per Species Per Generation"  value={this.state.trainingroom.config.minOrganisimsPerSpeciesPerGeneration} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>
                                                                Max Surviving Organisms Per Species Per Generation
                                                            </label>
                                                            <input type="number" className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="maxSurvivingOrganisimsPerSpeciesPerGeneration" name="maxSurvivingOrganisimsPerSpeciesPerGeneration" aria-describedby="trainingRoomName"
                                                                   placeholder="Max Surviving Organisms Per Species Per Generation"  value={this.state.trainingroom.config.maxSurvivingOrganisimsPerSpeciesPerGeneration} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>
                                                                Species Gens To Stabilize
                                                            </label>
                                                            <input type="number" className="form-control form-control-user"
                                                                   id="speciesGensToStabilize" name="speciesGensToStabilize" aria-describedby="speciesGensToStabilize"
                                                                   placeholder="Species Gens To Stabilize"  value={this.state.trainingroom.config.speciesGensToStabilize} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>
                                                                Species Gen To Improve
                                                            </label>
                                                            <input type="number" className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="speciesGenToImprove" name="speciesGenToImprove" aria-describedby="speciesGenToImprove"
                                                                   placeholder="Species Gen To Improve"  value={this.state.trainingroom.config.speciesGenToImprove} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>
                                                                Batch Size
                                                            </label>
                                                            <input type="number" className="form-control form-control-user"
                                                                   id="batchSize" name="batchSize" aria-describedby="batchSize"
                                                                   placeholder="Batch Size"  value={this.state.trainingroom.config.batchSize} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>
                                                                Preset Observed Attributes
                                                            </label>
                                                            <input type="text" className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="presetObservedAttributes" name="presetObservedAttributes" aria-describedby="presetObservedAttributes"
                                                                   placeholder="Preset Observed Attributes"  value={this.state.trainingroom.config.presetObservedAttributes} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>
                                                                Accelerate Mutation As Species Gets Stale Rate
                                                            </label>
                                                            <input type="number" className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="accellerateMutationAsSpeciesGetsStaleRate" name="accellerateMutationAsSpeciesGetsStaleRate" aria-describedby="accellerateMutationAsSpeciesGetsStaleRate"
                                                                   placeholder="accellerateMutationAsSpeciesGetsStaleRate"  value={this.state.trainingroom.config.accellerateMutationAsSpeciesGetsStaleRate} onChange={this.handleConfigChange}
                                                            />
                                                        </div>

                                                        <div className="form-group">
                                                            <label>
                                                               NEATO
                                                            </label>
                                                            <input type="checkbox"
                                                                   className="form-control form-control-user"
                                                                   id="useBinaryNeuronOutput" name="useBinaryNeuronOutput" aria-describedby="neato"
                                                                   placeholder="useBinaryNeuronOutput"  checked={this.state.trainingroom.config.useBinaryNeuronOutput} onChange={this.handleConfigChange}
                                                            />
                                                        </div>

                                                        <div className="form-group">
                                                            <label>
                                                                Use Binary Neuron Output
                                                            </label>
                                                            <input type="checkbox"
                                                                   className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="useBinaryNeuronOutput" name="useBinaryNeuronOutput" aria-describedby="useBinaryNeuronOutput"
                                                                   placeholder="useBinaryNeuronOutput"  checked={this.state.trainingroom.config.useBinaryNeuronOutput} onChange={this.handleConfigChange}
                                                            />
                                                        </div>

                                                        <div className="form-group">
                                                            <label>
                                                                Use Binary Neuron Input
                                                            </label>
                                                            <input type="checkbox"
                                                                   className="form-control form-control-user"
                                                                   id="useBinaryNeuronInput" name="useBinaryNeuronInput" aria-describedby="useBinaryNeuronInput"
                                                                   placeholder="useBinaryNeuronInput"  checked={this.state.trainingroom.config.useBinaryNeuronInput} onChange={this.handleConfigChange}
                                                            />
                                                        </div>

                                                        <div className="form-group">
                                                            <label>
                                                                Fire Only Top Neuron
                                                            </label>
                                                            <input type="checkbox"
                                                                   className="form-control form-control-user" readOnly={this.isOwner()}
                                                                   id="fireOnlyTopNeuron" name="fireOnlyTopNeuron" aria-describedby="fireOnlyTopNeuron"
                                                                   placeholder="fireOnlyTopNeuron"  checked={this.state.trainingroom.config.fireOnlyTopNeuron} onChange={this.handleConfigChange}
                                                            />
                                                        </div>
                                                        {
                                                            this.isOwner() &&
                                                            <button className="btn btn-primary btn-user btn-block">
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