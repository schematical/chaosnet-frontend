import React, {Component} from 'react';
import SidebarComponent from '../components/SidebarComponent';
import TopbarComponent from '../components/TopbarComponent';
import FooterComponent from "../components/FooterComponent";
import HTTPService from "../services/HTTPService";
import OrgListComponent from "../components/chaosnet/OrgListComponent";
import TrainingRoomListComponent from "../components/chaosnet/TrainingRoomListComponent";
import TrainingRoomSessionListComponent from "../components/chaosnet/TrainingRoomSessionListComponent";
class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded:false
        }

    }
    render() {
        if(!this.state.loaded){

            HTTPService.get('/trainingrooms/home', {})
                .then((response) => {
                    let state = {};
                    state.loaded = true;
                    state.trainingRooms = response.data.trainingRooms;
                    state.trainingRoomSessions = response.data.trainingRoomSessions;
                    this.setState(state);
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

                                    <div className="row">



                                        <div className="col-xl-6 col-md-12 mb-6">
                                            <div className="card shadow mb-4">
                                                <div className="card-header py-3">
                                                    <h1 className="h3 mb-0 text-gray-800">ChaosNet</h1>
                                                </div>
                                                <div className="card-body">
                                                    <iframe width="560" height="315"
                                                            src="https://www.youtube.com/embed/videoseries?list=PLLkpLgU9B5xJ7Qy4kOyBJl5J6zsDIMceH"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen></iframe>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-md-12 mb-4">
                                            <div className="card shadow mb-4">
                                                <div className="card-header py-3">
                                                    <h1 className="h3 mb-0 text-gray-800">Discord</h1>
                                                </div>
                                                <div className="card-body">
                                                    <iframe src="https://discordapp.com/widget?id=477184896171900928&theme=dark"
                                                            width="100%" height="500" allowTransparency="true"
                                                            frameBorder="0"></iframe>

                                                </div>
                                            </div>
                                        </div>
                                        {
                                            this.state.trainingRooms &&

                                            <div className="col-xl-3 col-md-6 mb-4">
                                                <div className="card shadow mb-4">
                                                    <div className="card-header py-3">
                                                        <h1 className="h3 mb-0 text-gray-800">Recent Rooms</h1>
                                                    </div>
                                                    <div className="card-body">
                                                        <ul>
                                                            {
                                                                this.state.trainingRooms.map((trainingRoom) => {
                                                                    return <TrainingRoomListComponent
                                                                        key={trainingRoom.namespace}
                                                                        trainingRoom={trainingRoom} page={this}/>
                                                                })
                                                            }
                                                        </ul>

                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            this.state.trainingRoomSessions &&

                                            <div className="col-xl-3 col-md-6 mb-4">
                                                <div className="card shadow mb-4">
                                                    <div className="card-header py-3">
                                                        <h1 className="h3 mb-0 text-gray-800">Recent Sessions</h1>
                                                    </div>
                                                    <div className="card-body">
                                                        <ul>
                                                            {
                                                                this.state.trainingRoomSessions.map((session) => {
                                                                    return <TrainingRoomSessionListComponent session={session} page={this}/>
                                                                })
                                                            }
                                                        </ul>

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
                            {/* End of Footer */}
                        </div>
                        {/* End of Content Wrapper */}
                    </div>
                    {/* End of Page Wrapper */}
                    {/* Scroll to Top Button*/}

                </div>

            </div>
        );
    }
}

export default HomePage;