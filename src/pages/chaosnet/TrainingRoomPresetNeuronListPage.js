import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import FitnessRuleComponent from "../../components/chaosnet/FitnessRuleComponent";
import PresetNeuronComponent from "../../components/chaosnet/PresetNeuronComponent";
import HTTPService from "../../services/HTTPService";
const _ = require('underscore');
class TrainingRoomPresetNeuronListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            canEdit: false,
            uri: '/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace +'/roles/' + this.props.role
        }
        this.createNew = this.createNew.bind(this);

        HTTPService.get( '/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace, {

        })
        .then((response) => {
            let state = {};
            state.trainingroom = response.data;


            state.canEdit = AuthService.userData && (
                AuthService.isAdmin() ||
                AuthService.userData.username == state.trainingroom.owner_username
            );
            console.log("Can Edit: ", state.canEdit);
            this.setState(state);
            return HTTPService.get( this.state.uri + '/presetneurons', {

            })
        })
        .then((response)=>{
            let state = {};
            state.presetNeurons = response.data.presetNeurons;



            this.setState(state);
            return HTTPService.get('/simmodels/' + this.state.trainingroom.simModelNamespace , {

            })
        })
        .then((response) => {
            let state = {};
            state.neuronOptions = [];
            state.simModel = response.data;
            state.simModel._neuronCache = {};
            state.simModel.outputNeurons.forEach((neuron)=>{
                neuron._base_type = "output";
                state.simModel._neuronCache[neuron["$TYPE"]] = state.simModel._neuronCache[neuron["$TYPE"]] || [];
                state.simModel._neuronCache[neuron["$TYPE"]].push(neuron);

                let neuronOptionId = neuron["$TYPE"];
                if(state.simModel._neuronCache[neuron["$TYPE"]].length > 1){
                    neuronOptionId += "-" + state.simModel._neuronCache[neuron["$TYPE"]].length;
                }
                state.neuronOptions.push({
                    id:neuronOptionId,
                    neuron: neuron,
                })


            })
            state.simModel.inputNeurons.forEach((neuron)=>{
                neuron._base_type = "input";
                state.simModel._neuronCache[neuron["$TYPE"]] = state.simModel._neuronCache[neuron["$TYPE"]] || []
                state.simModel._neuronCache[neuron["$TYPE"]].push(neuron);
                let neuronOptionId = neuron["$TYPE"];
                if(state.simModel._neuronCache[neuron["$TYPE"]].length > 1){
                    neuronOptionId += "-" + state.simModel._neuronCache[neuron["$TYPE"]].length;
                }
                state.neuronOptions.push({
                    id:neuronOptionId,
                    neuron: neuron,
                })
            })
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

    addAll(baseNeuron, neuronType, key, biology){
        let state = {
            presetNeurons:this.state.presetNeurons
        }
        for(let i = 1; i < biology["$COUNT"]; i++){

            let newNeuron = _.clone(baseNeuron);
            newNeuron.id = neuronType["$TYPE"].toLowerCase() + "-" + i;
            newNeuron[key] = biology['$TYPE'] + "_" + i;

            state.presetNeurons.push(newNeuron);
        }
        this.setState(state);
    }
    createNew(){
        this.state.presetNeurons.push({
            id: "new-" + Math.round(Math.random() * 99999),
            "$TYPE": Object.keys(this.state.simModel._neuronCache)[0],
            _isNew: true
        })
        this.setState(this.state);
    }
    removeRule(component){

        let presetNeuron  = component.state.presetNeuron;
        this.state.presetNeurons = _.reject(this.state.presetNeurons,
            function(_presetNeuron){
            if(component.state.isNew && _presetNeuron.isNew){
                return true;
            }else if(presetNeuron.id == _presetNeuron.id){
                return true;
            }
        });

        this.setState(this.state);
        this.save()
    }
    updateNeuron(presetNeuron, ele) {

        this.state.presetNeurons.forEach((_presetNeuron, i) => {
            if (ele.state.isNew && _presetNeuron._isNew) {
                presetNeuron._isNew = false;
                this.state.presetNeurons[i] = presetNeuron;
            } else if (presetNeuron.id == _presetNeuron.id) {
                this.state.presetNeurons[i] = presetNeuron;
            }
        })
        return this.save()
            .then((response) => {
                ele.markClean();

            })
    }
    save() {
        return HTTPService.put(this.state.uri + '/presetneurons',
            this.state.presetNeurons,
            {

            }
        )

            .catch((err) => {
                let state = {};
                state.error = err.response && err.response.data && err.response.data.error || err;
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
                                {
                                    this.state.loaded &&
                                    <div className="container-fluid">
                                        {/* Page Heading */}
                                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                            <h1 className="h3 mb-0 text-gray-800">
                                                /<a href={"/" + this.props.username}>{this.props.username}</a>
                                                /<a href={"/" + this.props.username + "/trainingrooms"}>trainingrooms</a>
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace}>{this.props.trainingRoomNamespace}</a>
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/roles"}>roles</a>
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace+ "/roles/" + this.props.role}>{this.props.role}</a>
                                                /presetneurons
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
                                                    <h2 className="h3 mb-0 text-gray-800">
                                                        Preset Neurons
                                                    </h2>


                                                    <table className="table">
                                                        <thead>
                                                        <tr>

                                                            <th>
                                                                Id:

                                                            </th>

                                                            <th>
                                                                Type

                                                            </th>




                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.presetNeurons.map((presetNeuron)=>{
                                                                return <PresetNeuronComponent key={presetNeuron.id} presetNeuron={presetNeuron} simModel={this.state.simModel} trainingRoom={this.state.trainingRoom} page={this}/>
                                                            })
                                                        }

                                                        </tbody>
                                                    </table>
                                                    {
                                                        this.state.canEdit &&
                                                        <button className="btn btn-danger btn-sm"
                                                                onClick={this.createNew}>
                                                            New Neuron
                                                        </button>
                                                    }
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

export default TrainingRoomPresetNeuronListPage;