import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";
import LoadingComponent from "../../components/LoadingComponent";
import ChaosProjectListComponent from "../../components/chaosnet/ChaosProjectListComponent";

class ChaosProjectFeaturedListPage extends Component {

    constructor(props) {
        super(props);
console.log("PROBS: ", props);
        this.state = {
            newProjectUri: "/" + this.props.username + "/projects/new?"
        }
        let url = '/projects';
        if(this.props.username) {
            url = "/" + this.props.username+ '/projects';
        }
        url += '?';

        if(this.props._query.type){
            url += 'type=' + this.props._query.type + '&';
            this.state.newProjectUri += 'type=' + this.props._query.type + '&';
        }
        HTTPService.get(
            url,
            { }
        )
        .then((response) => {
            let state = {};
            state.projects = response.data;
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
                                        {/*<a href="#"
                                           className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                            className="fas fa-download fa-sm text-white-50"/> Generate Report</a>*/}
                                    </div>
                                    <div className="row">




                                        <div className="col-xl-12 col-lg-12">

                                            { !this.state.loaded && <LoadingComponent /> }
                                            {
                                                this.state.loaded &&
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">
                                                        {
                                                            this.state.error &&
                                                            <div className="card mb-4 py-3  bg-danger text-white shadow">
                                                                <div className="card-body">
                                                                    Error {this.state.error.status}
                                                                    <div className="text-white-50 small">
                                                                        {this.state.error.message}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        {
                                                            this.state.projects &&
                                                            this.state.projects.owned.length > 0 &&
                                                            <div>
                                                                <h3>Your Projects</h3>
                                                                <table className="table">
                                                                   {/* <thead>
                                                                    <tr>
                                                                        <th scope="col">#</th>

                                                                    </tr>
                                                                    </thead>*/}
                                                                    <tbody>
                                                                    {
                                                                        this.state.projects.owned.map((chaosProject) => {
                                                                            return <ChaosProjectListComponent
                                                                                key={chaosProject.namespace}
                                                                                chaosProject={chaosProject} page={this}/>
                                                                        })
                                                                    }

                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                        }

                                                        {
                                                            this.state.projects &&
                                                            this.state.projects.featured.length > 0 &&
                                                            <div>
                                                                <h3>Featured Projects</h3>
                                                                <table className="table">
                                                                   {/* <thead> <tr> <th scope="col">#</th> </tr> </thead>*/}
                                                                    <tbody>
                                                                    {
                                                                        this.state.projects.featured.map((chaosProject) => {
                                                                            return <ChaosProjectListComponent
                                                                                key={chaosProject.namespace}
                                                                                chaosProject={chaosProject} page={this}/>
                                                                        })
                                                                    }

                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                        }
                                                    </div>
                                                    <a href={this.state.newProjectUri}
                                                       className="btn btn-danger btn-lg"
                                                    >Create New</a>
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

export default ChaosProjectFeaturedListPage;
