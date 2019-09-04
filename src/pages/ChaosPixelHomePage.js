import React, {Component} from 'react';
import SidebarComponent from '../components/SidebarComponent';
import TopbarComponent from '../components/TopbarComponent';
class ChaosPixelHomePage extends Component {
    handleImage(e){
        var canvas = document.getElementById('imageCanvas');
        var ctx = canvas.getContext('2d');
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            img.onload = function(){
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);





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

                                    {/* Content Row */}
                                    <div className="row">
                                        {/* Area Chart */}
                                        <div className="col-xl-8 col-lg-7">
                                            <div className="card shadow mb-4">
                                                {/* Card Header - Dropdown */}
                                                <div
                                                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <h6 className="m-0 font-weight-bold text-primary">Image Info</h6>
                                                    <div className="dropdown no-arrow">
                                                        <a className="dropdown-toggle" href="#" role="button"
                                                           id="dropdownMenuLink" data-toggle="dropdown"
                                                           aria-haspopup="true" aria-expanded="false">
                                                            <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"/>
                                                        </a>
                                                        <div
                                                            className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                            aria-labelledby="dropdownMenuLink">
                                                            <div className="dropdown-header">Dropdown Header:</div>
                                                            <a className="dropdown-item" href="#">Action</a>
                                                            <a className="dropdown-item" href="#">Another action</a>
                                                            <div className="dropdown-divider"/>
                                                            <a className="dropdown-item" href="#">Something else
                                                                here</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Card Body */}
                                                <div className="card-body">
                                                    <div >
                                                        <input type="file" id="imageLoader" name="imageLoader" onChange={this.handleImage}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        {/* Area Chart */}
                                        <div className="col-xl-8 col-lg-7">
                                            <div className="card shadow mb-4">
                                                {/* Card Header - Dropdown */}
                                                <div
                                                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                    <h6 className="m-0 font-weight-bold text-primary">Image</h6>
                                                    <div className="dropdown no-arrow">
                                                        <a className="dropdown-toggle" href="#" role="button"
                                                           id="dropdownMenuLink" data-toggle="dropdown"
                                                           aria-haspopup="true" aria-expanded="false">
                                                            <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"/>
                                                        </a>
                                                        <div
                                                            className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                            aria-labelledby="dropdownMenuLink">
                                                            <div className="dropdown-header">Dropdown Header:</div>
                                                            <a className="dropdown-item" href="#">Action</a>
                                                            <a className="dropdown-item" href="#">Another action</a>
                                                            <div className="dropdown-divider"/>
                                                            <a className="dropdown-item" href="#">Something else
                                                                here</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Card Body */}
                                                <div className="card-body">
                                                    <div>
                                                        <canvas id="imageCanvas"></canvas>
                                                    </div>
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
                                        <span>Copyright © Your Website 2019</span>
                                    </div>
                                </div>
                            </footer>
                            {/* End of Footer */}
                        </div>
                        {/* End of Content Wrapper */}
                    </div>
                    {/* End of Page Wrapper */}
                    {/* Scroll to Top Button*/}
                    <a className="scroll-to-top rounded" href="#page-top">
                        <i className="fas fa-angle-up"/>
                    </a>
                    {/* Logout Modal*/}
                    <div className="modal fade" id="logoutModal" tabIndex={-1} role="dialog"
                         aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                                    <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body">Select "Logout" below if you are ready to end your current
                                    session.
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel
                                    </button>
                                    <a className="btn btn-primary" href="login.html">Logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default ChaosPixelHomePage;