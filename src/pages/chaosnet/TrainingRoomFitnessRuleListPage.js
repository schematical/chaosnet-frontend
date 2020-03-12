import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import FitnessRuleComponent from "../../components/chaosnet/FitnessRuleComponent";
import HTTPService from "../../services/HTTPService";
const axios = require('axios');
const _ = require('underscore');
class TrainingRoomFitnessRuleListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            canEdit: false,
            uri: '/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace +'/roles/' + this.props.role
        }
        this.createNewRule = this.createNewRule.bind(this);

        HTTPService.get('/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace , {

        })
        .then((response) => {
            let state = {};
            state.trainingroom = response.data;

            state.canEdit = AuthService.userData && (
                AuthService.isAdmin() ||
                AuthService.userData.username == state.trainingroom.owner_username
            );
            this.setState(state);

            return HTTPService.get( this.state.uri + '/fitnessrules', {

            })
        })
        .then((response) => {
            let state = {};
            state.fitnessRules = response.data.fitnessRules;


            this.setState(state);

            return HTTPService.get('/simmodels/' + this.state.trainingroom.simModelNamespace , {

            })
        })
        .then((response) => {

            this.state.simModel = response.data;
            this.state.simModel._fitnessCache = {};
            this.state.simModel.fitness.forEach((fitnessModel)=>{
                this.state.simModel._fitnessCache[fitnessModel.eventType] = this.state.simModel._fitnessCache[fitnessModel.eventType] || [];
                fitnessModel.eventTypeIndex = this.state.simModel._fitnessCache[fitnessModel.eventType].length;
                this.state.simModel._fitnessCache[fitnessModel.eventType].push(fitnessModel);

            })
            this.state.loaded = true;

            this.setState(this.state);

        })
        .catch((err) => {
            this.state.error = err;
            this.setState(this.state);
            console.error("Error: ", err.message);
        })

    }

    createNewRule(){
        this.state.fitnessRules.push({
            id: "new-" + Math.round(Math.random() * 99999),
            _isNew: true
        })
        this.setState(this.state);
    }
    removeRule(component){

        let fitnessRule  = component.state.fitnessRule
        this.state.fitnessRules = _.reject(this.state.fitnessRules,
            function(_fitnessRule){
            if(component.state.isNew && _fitnessRule.isNew){
                return true;
            }else if(fitnessRule.id == _fitnessRule.id){
                return true;
            }
        });

        this.setState(this.state);
        return this.save();
    }
    updateRule(fitnessRule, ele) {
        this.state.fitnessRules.forEach((_fitnessRule, i)=>{
            if(ele.state.isNew && _fitnessRule._isNew){
                fitnessRule._isNew = false;
                this.state.fitnessRules[i] = fitnessRule;
            }else if(fitnessRule.id == _fitnessRule.id){
                this.state.fitnessRules[i] = fitnessRule;
            }
        })
        return this.save()
            .then((response) => {
                ele.markClean();

            })

    }
   save(){
        return HTTPService.put(this.state.uri + '/fitnessrules',
            this.state.fitnessRules,
            {
            }
        )
        .catch((err) => {
            this.state.error = err;
            this.setState(this.state);
            console.error("Error: ", err.message);
        })
    }
    render() {

        if(!this.state.loaded) {
            return <span>Loading...</span>
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
                                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                            <h1 className="h3 mb-0 text-gray-800">
                                                /<a href={"/" + this.props.username}>{this.props.username}</a>
                                                /<a href={"/" + this.props.username + "/trainingrooms"}>trainingrooms</a>
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace}>{this.props.trainingRoomNamespace}</a>
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/roles"}>roles</a>
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/roles/" + this.props.role}>{ this.props.role}</a>
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
                                                    <h2 className="h3 mb-0 text-gray-800">
                                                        Fitness Rules
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
                                                            this.state.fitnessRules.map((fitnessRule)=>{
                                                                return <FitnessRuleComponent key={fitnessRule.id} fitnessRule={fitnessRule} simModel={this.state.simModel} trainingRoom={this.state.trainingRoom} page={this}/>
                                                            })
                                                        }

                                                        </tbody>
                                                    </table>
                                                    {
                                                        this.state.canEdit &&
                                                        <button className="btn btn-danger btn-sm"
                                                                onClick={this.createNewRule}>
                                                            New Rule
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

export default TrainingRoomFitnessRuleListPage;