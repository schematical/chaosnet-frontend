import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";
class TrainingRoomSessionDetailPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            session:{},
            showHardReset: false,
            loaded:false,
            canEdit: (AuthService.userData && this.props.username === AuthService.userData.username)
        }
        this.repairSession = this.repairSession.bind(this);
        this.hardReset = this.hardReset.bind(this);
        this.showHardResetButton = this.showHardResetButton.bind(this);
    }
    showHardResetButton(){
        let state = {};
        state.showHardReset = true;
        this.setState(state);
    }
    hardReset(){
        let url = '/'  + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/sessions/start"
        return HTTPService.post(url, {
            reset: true
        }, {

        })
            .then((response) => {
                let state = {};
                state.session = response.data;
                state.message = response.data.message  || "success";;
                this.setState(state);
            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })
    }
    repairSession(){
        let url = '/'  + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/sessions/" +  this.props.session + "/repair"
        return HTTPService.post(url, {}, {

        })
        .then((response) => {
            let state  = {};
            state.message = response.data.message  || "success";;

            this.setState(state);
        })
        .catch((err) => {

            let state  = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        })

    }
    render() {

        if(!this.state.loaded) {
            setTimeout(() => {
                let url = '/' + this.props.username + '/trainingrooms/' + this.props.trainingRoomNamespace + '/sessions/' + this.props.session;

                return HTTPService.get(url, {

                })
                    .then((response) => {
                        let state = {};
                        state.session = response.data
                        state.loaded = true;
                        this.setState(state);
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
                                                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/sessions" }>sessions</a>
                                                /<a
                                                    href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/sessions/"+ this.props.session}>{this.props.session}</a>

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
                                                    <h1>
                                                        {this.state.session.owner_username}
                                                    </h1>
                                                    <h3>
                                                        Genus Namespace:
                                                        <a
                                                            href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks/"+ this.state.session.genusNamespace}>
                                                            {this.state.session.genusNamespace}
                                                        </a>
                                                    </h3>
                                                    {
                                                        this.state.canEdit &&
                                                        <div>
                                                            <button className="btn btn-primary btn-sm"
                                                                    onClick={this.repairSession}>
                                                                Repair
                                                            </button>

                                                            {
                                                                !this.state.showHardReset ?
                                                                <button className="btn btn-primary btn-sm" onClick={this.showHardResetButton}>
                                                                Hard Reset
                                                                </button> :
                                                                <button className="btn btn-danger btn-sm" onClick={this.hardReset}>
                                                                Hard Reset
                                                                </button>
                                                            }
                                                        </div>
                                                    }

                                                    <h3>

                                                    </h3>
                                                    <a className="btn btn-primary btn-sm" href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/sessions/" + this.props.session + "/species"}>
                                                        Species
                                                    </a>
                                                    <h3>
                                                        Organisms
                                                    </h3>
                                                    <table>
                                                        {this.state.session.organisms && this.state.session.organisms.map((organismNamespace)=>{
                                                            return <tr>
                                                                <td>
                                                                    <a
                                                                        href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/organisms/" + organismNamespace }>
                                                                        {organismNamespace}
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        })}
                                                    </table>

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

export default TrainingRoomSessionDetailPage;