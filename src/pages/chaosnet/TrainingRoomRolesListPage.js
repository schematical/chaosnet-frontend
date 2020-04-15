import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import TrainingRoomListComponent from "../../components/chaosnet/TrainingRoomListComponent";
import FooterComponent from "../../components/FooterComponent";
import OrgListComponent from "../../components/chaosnet/OrgListComponent";
import TRankListComponent from "../../components/chaosnet/TRankListComponent";
import TrainingRoomSessionListComponent from "../../components/chaosnet/TrainingRoomSessionListComponent";
import HTTPService from "../../services/HTTPService";
import TrainingRoomRoleListComponent from "../../components/chaosnet/TrainingRoomRoleListComponent";
import LoadingComponent from "../../components/LoadingComponent";
class TrainingRoomRolesListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roles:[],
            uri: "/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/roles"
        }

    }
    render() {

        if(!this.state.loaded) {

            HTTPService.get('/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace + '/roles', {

            })
                .then((response) => {
                    let state = {};
                    state.roles = response.data;
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
                                                /roles
                                            </h1>

                                        </div>
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

                                                    <div className="card-body">

                                                        <table className="table">
                                                            <thead>
                                                            <tr>
                                                                <th scope="col">Count {this.state.roles.length}</th>

                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.roles.map((role) => {
                                                                    return <TrainingRoomRoleListComponent role={role}
                                                                                                          page={this}/>
                                                                })
                                                            }

                                                            </tbody>
                                                        </table>
                                                        <a href={this.state.uri + "/new"}
                                                           className="btn btn-danger btn-lg">Create New</a>
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

export default TrainingRoomRolesListPage;