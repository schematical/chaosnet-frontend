import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
const axios = require('axios');
class TrainingRoomNewPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trainingRoomName:"",
            trainingRoomNamespace:"",
            simModelNamespace:"chaoscraft",
            loaded: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {

        let state = {};
        state[event.target.name] = event.target.value;
        switch(event.target.name){
            case('trainingRoomName'):
                state.trainingRoomNamespace = state.trainingRoomName.toLowerCase().replace(/[^0-9a-z]/g, '');
            break;
        }
        this.setState(state);
    }
    handleSubmit(event) {


        event.preventDefault();
        return axios.post('https://chaosnet.schematical.com/v0/trainingrooms' ,
            {
                namespace: this.state.trainingRoomNamespace,
                name: this.state.trainingRoomName,
                simModelNamespace: this.state.simModelNamespace
            },
            {
                headers: {
                    "Authorization": AuthService.accessToken
                }
            }
        )
            .then((response) => {

                this.state.trainingroom = response.data;

                this.setState(this.state);
                document.location.href = ("/" + this.state.trainingroom.owner_username + "/trainingrooms/" + this.state.trainingroom.namespace);
            })
            .catch((err) => {
                this.state.error = err;
                this.setState(this.state);
                console.error("Error: ", err.message);
            })
    }
    render() {

        /*if(!this.state.loaded) {
            setTimeout(() => {
                return axios.get('https://chaosnet.schematical.com/v0/' + this.props.username+ '/trainingrooms' + this.props.trainingRoomNamespace , {
                    headers: {
                        "Authorization": AuthService.accessToken
                    },
                    body:{
                        namespace: this.state.trainingRoomNamespace,
                        name: this.state.trainingRoomName,
                        simModelNamespace: this.state.simModelNamespace
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
                        console.error("Error: ", err.message);
                    })
            }, 1000);
        }*/
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

                                    <div className="row">

                                        <div className="col-xl-12 col-lg-12">
                                            <div className="card shadow mb-4">
                                                <h2 className="h3 mb-0 text-gray-800">
                                                  New Training Room
                                                </h2>
                                                {/* Card Body */}
                                                <div className="card-body">
                                                    <form className="user" onSubmit={this.handleSubmit}>
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
                                                        <div className="form-group">
                                                            <input type="text" className="form-control form-control-user"
                                                                   id="trainingRoomName" name="trainingRoomName" aria-describedby="trainingRoomName"
                                                                   placeholder="Training Room Name..."  value={this.state.trainingRoomName} onChange={this.handleChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control form-control-user"
                                                                   readOnly={true}
                                                                   id="trainingRoomNamespace" name="trainingRoomNamespace" aria-describedby="trainingRoomNamespace"
                                                                   placeholder="Training Room Namespace..."  value={this.state.trainingRoomNamespace} onChange={this.handleChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control form-control-user"
                                                                   id="simModelNamespace" name="simModelNamespace" aria-describedby="simModelNamespace"
                                                                   readOnly={true}
                                                                   placeholder="Sim Model Namespace..."  value={this.state.simModelNamespace} onChange={this.handleChange}
                                                            />
                                                        </div>

                                                        <button className="btn btn-primary btn-user btn-block">
                                                            Save
                                                        </button>
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

export default TrainingRoomNewPage;