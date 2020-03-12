import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";
class TrainingRoomRoleDetailPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            role:{},
            showHardReset: false,
            loaded:false,
            isNew: this.props.role == 'new',
            uri: '/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace + '/roles/' + this.props.role
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state.canEdit = this.state.isNew;
        if(this.state.isNew){
            this.state.role = {
                trainingRoomUsername: this.props.username,
                trainingRoomNamespace: this.props.trainingRoomNamespace,
            }

        }else {


            HTTPService.get(this.state.uri, {})
                .then((response) => {
                    let state = {};
                    state.role = response.data;
                    state.canEdit = (AuthService.userData && AuthService.userData.username == state.role.owner_username)
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

    }
    handleChange(event) {
        //console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {
            role: this.state.role
        };
        state.role[event.target.name] = event.target.value;
        this.setState(state);
    }
    handleSubmit(event) {
        event.preventDefault();
        return HTTPService.post('/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace + '/roles',
            this.state.role,
            {
            }
        )
            .then((response) => {

                this.state.role = response.data;

                this.setState(this.state);
                document.location.href = ("/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + '/roles/' + this.state.role.namespace);
            })
            .catch((err) => {
                let state = {}
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })
    }
    render() {
        if(!this.state.loaded){
            return <span>Loading...</span>;
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
                                                /<a
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/roles" }>roles</a>
                                                /<a
                                                    href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/roles/"+ this.props.role}>{this.props.role}</a>

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
                                                    {
                                                        this.state.message &&
                                                        <div className="card mb-4 py-3  bg-info text-white shadow">
                                                            <div className="card-body">
                                                                 {this.state.message}
                                                                <div className="text-white-50 small">

                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    {this.state.role &&
                                                        <div className="card-body">
                                                            {!this.state.isNew &&
                                                            <div className="btn-group" role="group" aria-label="Options">
                                                                <a className="btn btn-primary btn-sm"
                                                                   href={this.state.uri + "/fitnessrules"}>Fitness
                                                                    Rules</a>
                                                                <a className="btn btn-primary btn-sm"
                                                                   href={ this.state.uri + "/presetneurons"}>Preset
                                                                    Neurons</a>
                                                            </div>
                                                            }
                                                            <form className="user" onSubmit={this.handleSubmit}>

                                                                <div className="form-group">
                                                                    <label>
                                                                        Namespace
                                                                    </label>
                                                                    <input type="text"
                                                                           className="form-control form-control-user"
                                                                           readOnly={!this.state.isNew}
                                                                           id="namespace" name="namespace"
                                                                           aria-describedby="namespace"
                                                                           placeholder="Namespace"
                                                                           value={this.state.role.namespace}
                                                                           onChange={this.handleChange}
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>
                                                                        Name
                                                                    </label>
                                                                    <input type="text"
                                                                           className="form-control form-control-user"
                                                                           readOnly={!this.state.canEdit}
                                                                           id="name" name="name" aria-describedby="name"
                                                                           placeholder="Name" value={this.state.role.name}
                                                                           onChange={this.handleChange}
                                                                    />
                                                                </div>
                                                                <button className="btn btn-primary btn-user btn-block">
                                                                    Save
                                                                </button>

                                                            </form>

                                                        </div>
                                                    }

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

export default TrainingRoomRoleDetailPage;