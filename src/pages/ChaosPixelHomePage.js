import React, {Component} from 'react';
import SidebarComponent from '../components/SidebarComponent';
import TopbarComponent from '../components/TopbarComponent';
class ChaosPixelHomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: 16,
            width:16
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.drawSliceLines = this.drawSliceLines.bind(this);
    }
    handleChange(event) {
        console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        switch(event.target.name){
            case("height"):
            case("width"):
                state[event.target.name] = parseInt(event.target.value);
                break;
            default:
                state[event.target.name] = event.target.value;
        }

        this.setState(state);
    }
    handleImage(e){
        this.canvas = document.getElementById('imageCanvas');

        var reader = new FileReader();
        reader.onload = (event) =>{
            this.img = new Image();
            this.img.onload = ()=>{
                this.resetCanvasWithImage();
            }
            this.img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);





    }
    resetCanvasWithImage(){
        var ctx = this.canvas.getContext('2d');
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
        ctx.drawImage(this.img,0,0);
    }
    drawSliceLines(){
        this.resetCanvasWithImage();
        var ctx = this.canvas.getContext("2d");

        for(let x = 0; x < this.img.width; x += this.state.width){
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.img.height);
            console.log(x, 0, "   to   ", x, this.img.height);
            ctx.stroke();
        }
        for(let y = 0; y < this.img.height; y += this.state.height){
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.img.width,y);
            ctx.stroke();
        }


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

                                                {/* Card Body */}
                                                <div className="card-body">
                                                    <div >
                                                        <form>
                                                            <div className="form-group">
                                                                <label htmlFor="exampleInputEmail1">Upload Image </label>
                                                                <input type="file" id="imageLoader" name="imageLoader" onChange={this.handleImage}/>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="exampleInputEmail1">Sprite Height </label>
                                                                <input type="number" name="height" placeholder="Height" value={this.state.height} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="exampleInputEmail1">Sprite Width </label>
                                                                <input type="number" name="width" placeholder="Width" value={this.state.width} onChange={this.handleChange} />
                                                            </div>
                                                            <input type="button" className="btn btn-danger btn-circle btn-lg" onClick={this.drawSliceLines} value="Splice">
                                                            </input>

                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        {/* Area Chart */}
                                        <div className="col-xl-8 col-lg-7">
                                            <div className="card shadow mb-4">

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