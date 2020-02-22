import React, {Component} from 'react';
import * as _ from 'underscore';
import SidebarComponent from '../components/SidebarComponent';
import TopbarComponent from '../components/TopbarComponent';
import AuthService from '../services/AuthService';
import TrainingDataComponent from "../components/TrainingDataComponent";
import TagTextComponent from "../components/TagTextComponent";
import HTTPService from "../services/HTTPService";


class ChaosPixelListTrainingDatasPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            trainingdatas:[]
        }

        this.handleChange = this.handleChange.bind(this);
        this.onTagAdd = this.onTagAdd.bind(this);

    }
    onTagAdd(trainingDatas, tag){
        this.setState({
            trainingdatas: trainingDatas
        })
    }


    handleChange(event) {
        //console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        switch(event.target.name){
            case("scale"):
                state[event.target.name] = parseFloat(event.target.value);
                break;
            default:
                state[event.target.name] = event.target.value;
        }

        this.setState(state);
    }


    render() {
        if(!this.state.loaded) {
            setTimeout(() => {
                return HTTPService.get('/' + AuthService.userData.username + '/trainingdatas', )
                    .then((response) => {
                        let state = {};
                        state.trainingdatas = response.data;
                        state.loaded = true;
                        this.setState(state);
                    })
                    .catch((err) => {
                        console.error("Error: ", err.message);
                        let state = {
                            error: err
                        }
                        this.setState(state);
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

                                    </div>
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
                                    {/* Content Row */}
                                    <div className="row">




                                        <div className="col-xl-12 col-lg-12">

                                            <div className="card shadow mb-4">

                                                <div className="card-body">
                                                    <TagTextComponent taggedObjects={this.state.trainingdatas} onTagAdd={this.onTagAdd}/>
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th scope="col">#</th>

                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.trainingdatas.map((trainingData)=>{
                                                                return <TrainingDataComponent trainingData={trainingData} page={this}/>
                                                            })
                                                        }

                                                        </tbody>
                                                    </table>
                                                    <input type="button" className="btn btn-danger btn-lg" onClick={this.saveTrainingData} value="Save" />
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                                {/* /.container-fluid */}
                            </div>
                            {/* End of Main Content */}
                            {/* Footer */}
                            <footer className="sticky-footer bg-white">
                                <div className="container my-auto">
                                    <div className="copyright text-center my-auto">
                                        <span>Copyright © Schematical Platform LLC</span>
                                    </div>
                                </div>
                            </footer>
                            {/* End of Footer */}
                        </div>
                        {/* End of Content Wrapper */}
                    </div>
                    {/* End of Page Wrapper */}


                </div>

            </div>
        );
    }
}
export default ChaosPixelListTrainingDatasPage;