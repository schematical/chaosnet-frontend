import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import FitnessRuleComponent from "../../components/chaosnet/FitnessRuleComponent";
import PresetNeuronComponent from "../../components/chaosnet/PresetNeuronComponent";
import HTTPService from "../../services/HTTPService";
const axios = require('axios');
const _ = require('underscore');
class TrainingRoomPresetNeuronListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
        this.createNew = this.createNew.bind(this);

    }
    hack(){

        /*[
            "minecraft:lava",
            "minecraft:stone"
        ].forEach((strAttr)=>{
            for(let i = 0; i < 10; i++){
                this.state.trainingroom.config.presetNeurons.push({

                    "$TYPE":"IsLookingAtInput",
                    "attributeId":"BLOCK_ID",
                    "attributeValue": strAttr,
                    "eye":"Eye_" + i,
                    "_base_type":"input"

                })
            }
        })
        for(let i = 0; i < 10; i++){
            this.state.trainingroom.config.presetNeurons.push({
                "$TYPE":"IsLookingAtInput",
                "attributeId":"BLOCK_TOUCH_STATE",
                "attributeValue": "HAS_TOUCHED_BLOCK",
                "eye":"Eye_" + i,
                "_base_type":"input"
            })
        }*/
        this.state.trainingroom.config.presetNeurons.push({
            "$TYPE":"TargetYawInput",
            "attributeId":"ENTITY_ID",
            "attributeValue":"minecraft:bee",
            "_base_type":"input"
        })
        this.state.trainingroom.config.presetNeurons.push({
            "$TYPE":"TargetPitchInput",
            "attributeId":"ENTITY_ID",
            "attributeValue":"minecraft:bee",
            "_base_type":"input"
        })
        this.state.trainingroom.config.presetNeurons.push({
            "$TYPE":"TargetDistanceInput",
            "attributeId":"ENTITY_ID",
            "attributeValue":"minecraft:bee",
            "_base_type":"input"
        })
    }
    createNew(){
        this.state.trainingroom.config.presetNeurons.push({
            id: "new-" + Math.round(Math.random() * 99999),
            _isNew: true
        })
        this.setState(this.state);
    }
    removeRule(component){

        let presetNeuron  = component.state.presetNeuron;
        this.state.trainingroom.config.presetNeurons = _.reject(this.state.trainingroom.config.presetNeurons,
            function(_presetNeuron){
            if(component.state.isNew && _presetNeuron.isNew){
                return true;
            }else if(presetNeuron.id == _presetNeuron.id){
                return true;
            }
        });

        this.setState(this.state);
    }
    save(presetNeuron, ele){

        this.state.trainingroom.config.presetNeurons.forEach((_presetNeuron, i)=>{
            if(ele.state.isNew && _presetNeuron._isNew){
                presetNeuron._isNew = false;
                this.state.trainingroom.config.presetNeurons[i] = presetNeuron;
            }else if(presetNeuron.id == _presetNeuron.id){
                this.state.trainingroom.config.presetNeurons[i] = presetNeuron;
            }
        })
        return HTTPService.put('/' + this.state.trainingroom.owner_username + '/trainingrooms/' + this.state.trainingroom.namespace,
            this.state.trainingroom,
            {

            }
        )
            .then((response) => {
                ele.markClean();

            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })
    }
    render() {

        if(!this.state.loaded) {
            setTimeout(() => {
                return HTTPService.get('/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace , {

                })
                    .then((response) => {
                        let state = {};
                        state.trainingroom = response.data;

                        state.trainingroom.config = state.trainingroom.config ||{};
                        state.trainingroom.config.presetNeurons = state.trainingroom.config.presetNeurons || [];
                        this.setState(state);

                        return HTTPService.get('/simmodels/' + this.state.trainingroom.simModelNamespace , {

                        })
                    })
                    .then((response) => {
                        let state = {};
                        state.simModel = response.data;
                        state.simModel._neuronCache = {};
                        state.simModel.outputNeurons.forEach((neuron)=>{
                            neuron._base_type = "output";
                            state.simModel._neuronCache[neuron["$TYPE"]] = neuron;
                        })
                        state.simModel.inputNeurons.forEach((neuron)=>{
                            neuron._base_type = "input";
                            state.simModel._neuronCache[neuron["$TYPE"]] = neuron;
                        })
                        state.loaded = true;

                        this.setState(this.state);

                    })
                    .catch((err) => {
                        let state = {};
                        state.error = err;
                        this.setState(state);
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
                                {
                                    this.state.loaded &&
                                    <div className="container-fluid">
                                        {/* Page Heading */}
                                        <div className="d-sm-flex align-items-center justify-content-between mb-3">
                                            <h1 className="h3 m-3 text-gray-800">
                                                /<a href={"/" + this.props.username}>{this.props.username}</a>
                                                /<a href={"/" + this.props.username + "/trainingrooms"}>trainingrooms</a>
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.state.trainingroom.namespace}>{this.state.trainingroom.namespace}</a>
                                                /fitnessrules
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
                                                    <h2 className="h3 m-3 text-gray-800">
                                                        Preset Neurons
                                                    </h2>


                                                    <table className="table">
                                                        <thead>
                                                        <tr>

                                                            <th>
                                                                Id:

                                                            </th>

                                                            <th>
                                                                Score Effect:

                                                            </th>



                                                            <th>
                                                                Life Effect:

                                                            </th>
                                                            <th className="form-group">
                                                                Max Occurrences:

                                                            </th>

                                                            <th>
                                                                Event Type:

                                                            </th>

                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.trainingroom.config.presetNeurons.map((presetNeuron)=>{
                                                                return <PresetNeuronComponent key={presetNeuron.id} presetNeuron={presetNeuron} simModel={this.state.simModel} trainingRoom={this.state.trainingRoom} page={this}/>
                                                            })
                                                        }

                                                        </tbody>
                                                    </table>

                                                    <button className="btn btn-danger btn-m" onClick={this.createNew}>
                                                        New Neuron
                                                    </button>
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
                    {/* Logout Modal*/}
                    <div className="modal fade" id="logoutModal" tabIndex={-1} role="dialog"
                         aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                                    <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body">Select "Logout" below if you are ready to end your current
                                    session.
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel
                                    </button>
                                    <a className="btn btn-primary" href="login.html">Logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default TrainingRoomPresetNeuronListPage;