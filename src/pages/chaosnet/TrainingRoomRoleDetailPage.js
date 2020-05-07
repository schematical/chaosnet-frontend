import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";
import LoadingComponent from "../../components/LoadingComponent";
import ConfirmComponent from "../../components/chaosnet/ConfirmComponent";
import SettingsCollectionComponent from "../../components/chaosnet/SettingsCollectionComponent";
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
        this.promptDelete = this.promptDelete.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
        this.state.canEdit = this.state.isNew;
        if(this.state.isNew){
            this.state.role = {
                trainingRoomUsername: this.props.username,
                trainingRoomNamespace: this.props.trainingRoomNamespace,
            }
            this.state.loaded = true;

        }else {


            HTTPService.get(this.state.uri, {})
                .then((response) => {
                    let state = {};
                    state.isNew = false;
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
    promptDelete(event){
        event.preventDefault();
        this.refs.confirmComponent.show();
    }
    onConfirmDelete(){

        return HTTPService.delete('/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace + '/roles/' + this.props.role,
            this.state.trainingroom,
            {

            }
        )
            .then((response) => {
                let state = {};
                state.trainingroom = response.data;
                document.location.href = '/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace + '/roles?delete=success';
                this.setState(state);
            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })
    }
    handleChange(event) {
        //console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {
            role: this.state.role
        };
        switch(event.target.name){
            case('namespace'):
                if(this.state.isNew) {
                    state.role.namespace = event.target.value.toLowerCase().replace(/[^0-9a-z]/g, '');
                }
                break;
            case('name'):
                state.role.name = event.target.value;
                if(this.state.isNew) {
                    state.role.namespace = state.role.name.toLowerCase().replace(/[^0-9a-z]/g, '');
                }
                break;
            default:
                state.role[event.target.name] = event.target.value;

        }

        this.setState(state);
    }
    handleSubmit(event) {
        let method = 'post';
        let uri = '/' + this.state.role.trainingRoomUsername + '/trainingrooms/' + this.state.role.trainingRoomNamespace + '/roles';
        if(!this.state.isNew){
            method = 'put';
            uri += '/' + this.state.role.namespace;
        }
        event.preventDefault();
        return HTTPService[method](
            uri,
            this.state.role,
            {
            }
        )
        .then((response) => {
            let blnWasNew = this.state.isNew;
            let state = {
                isNew: false
            }
            state.role = response.data;

            this.setState(state);
            if(blnWasNew){
                document.location.href = uri + '/' + this.state.role.namespace;
            }

        })
        .catch((err) => {
            let state = {}
            state.error = err;
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
                                                    {!this.state.isNew &&
                                                    <div className="btn-group" role="group"
                                                         aria-label="Options">
                                                        <a className="btn btn-primary btn-sm"
                                                           href={this.state.uri + "/fitnessrules"}>Fitness
                                                            Rules</a>
                                                        <a className="btn btn-primary btn-sm"
                                                           href={this.state.uri + "/presetneurons"}>Preset
                                                            Neurons</a>
                                                        <div className="btn-group" role="group">
                                                            <button id="btnGroupDrop1" type="button"
                                                                    className="btn btn-secondary dropdown-toggle"
                                                                    data-toggle="dropdown" aria-haspopup="true"
                                                                    aria-expanded="false">
                                                                Options
                                                            </button>
                                                            <div className="dropdown-menu"
                                                                 aria-labelledby="btnGroupDrop1">
                                                                {/*<a className="dropdown-item" href={"/" + this.state.trainingroom.owner_username + "/trainingrooms/" + this.state.trainingroom.namespace + "/presetneurons"}>
                                                                    Preset Neurons
                                                                </a>
                                                                <a className="dropdown-item" href={"/" + this.state.trainingroom.owner_username + "/trainingrooms/" + this.state.trainingroom.namespace + "/fitnessrules"}>
                                                                    Fitness Rules
                                                                </a>*/}
                                                               {/* <a className="dropdown-item" href={"/" + this.state.trainingroom.owner_username + "/trainingrooms/" + this.state.trainingroom.namespace + "/roles"}>
                                                                    Roles
                                                                </a>*/}

                                                                {
                                                                    this.state.canEdit &&
                                                                    <a className="dropdown-item" href={this.state.uri + "/delete"} onClick={this.promptDelete}>
                                                                        Delete
                                                                    </a>
                                                                }


                                                            </div>
                                                        </div>
                                                    </div>
                                                    }

                                                    <div className="card-body">
                                                        <div className="card-body">

                                                            <form className="user" onSubmit={this.handleSubmit}>
                                                                <div className="form-group">
                                                                    <label>
                                                                        Name
                                                                    </label>
                                                                    <input type="text"
                                                                           className="form-control form-control-user"
                                                                           readOnly={!this.state.canEdit}
                                                                           id="name" name="name" aria-describedby="name"
                                                                           placeholder="Name"
                                                                           value={this.state.role.name}
                                                                           onChange={this.handleChange}
                                                                    />
                                                                </div>
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
                                                                        Description
                                                                    </label>
                                                                    <textarea
                                                                           className="form-control form-control-user"
                                                                           id="desc" name="desc"
                                                                           aria-describedby="desc"
                                                                           placeholder="Description"
                                                                           value={this.state.role.desc}
                                                                           onChange={this.handleChange}
                                                                    ></textarea>
                                                                </div>

                                                                <button className="btn btn-primary btn-user btn-block">
                                                                    Save
                                                                </button>

                                                            </form>

                                                        </div>


                                                    </div>





                                                </div>
                                            }
                                        </div>

                                        {
                                            this.state.loaded &&
                                            <div className="col-xl-12 col-lg-12">
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">
                                                        <SettingsCollectionComponent uri={this.state.uri}
                                                                                     canEdit={(AuthService.userData && AuthService.userData.username == this.state.role.owner_username)}/>


                                                    </div>

                                                </div>
                                            </div>
                                        }

                                    </div>

                                </div>
                                {/* /.container-fluid */}
                            </div>
                            {/* End of Main Content */}
                            {/* Footer */}
                            <FooterComponent />
                            <ConfirmComponent ref="confirmComponent" id={this.props.role + "_confirmComponent"} title={"Confirm Delete"} body={"Are you sure you want to delete this training room role? This will delete all Species, Organisms for everyone that ever trained on this room so think it over carefully."} onConfirm={this.onConfirmDelete} />

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