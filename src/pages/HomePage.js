import React, {Component} from 'react';
import SidebarComponent from '../components/SidebarComponent';
import TopbarComponent from '../components/TopbarComponent';
import FooterComponent from "../components/FooterComponent";
class HomePage extends Component {
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

                                    <div className="row">

                                        <div className="col-xl-8 col-lg-7">
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
                                            <div className="card shadow mb-4">
                                                <div className="card-header py-3">
                                                    <h1 className="h3 mb-0 text-gray-800">Featured Room</h1>
                                                </div>
                                                <div className="card-body">
                                                    <ul>
                                                        <li>
                                                            <a href="/schematical/trainingrooms/chickenhunt">Chicken Hunt</a>
                                                        </li>
                                                        <li>
                                                            <a href="/schematical/trainingrooms/maze">Maze</a>
                                                        </li>
                                                    </ul>

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

                </div>

            </div>
        );
    }
}

export default HomePage;