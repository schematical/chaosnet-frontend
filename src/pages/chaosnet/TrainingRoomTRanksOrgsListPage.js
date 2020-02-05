import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import TrainingRoomListComponent from "../../components/chaosnet/TrainingRoomListComponent";
import FooterComponent from "../../components/FooterComponent";
import OrgListComponent from "../../components/chaosnet/OrgListComponent";
const axios = require('axios');
class TrainingRoomTRanksOrgsListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organisms:[],
            loaded: false
        }

    }
    render() {

        if(!this.state.loaded) {
            setTimeout(() => {
                let url = 'https://chaosnet.schematical.com/v0/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace + '/tranks/' + this.props.trank + '/organisms';
                if(this.props.selector && this.props.selector.length > 0){
                    url += "/" + this.props.selector;
                }
                return axios.get(url, {
                    headers: {
                        "Authorization": AuthService.accessToken
                    }
                })
                    .then((response) => {
                        console.log("Loaded: ", response.data);
                        this.state.organisms = response.data;
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
                                                <a
                                                    href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + '/tranks'}>/tranks</a>
                                               /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + '/tranks/' + this.props.trank}>{this.props.trank}</a>
                                                /organisms{ this.props.selector && "/" + this.props.selector}
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
                                                    <h3>Count: {this.state.organisms.length}</h3>
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th>
                                                                Namespace
                                                            </th>
                                                            <th>
                                                                Names
                                                            </th>

                                                            <th>
                                                                Score
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.organisms.map((organism)=>{
                                                                return <OrgListComponent organism={organism} page={this}/>
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

export default TrainingRoomTRanksOrgsListPage;