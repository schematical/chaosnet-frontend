import React, {Component} from 'react';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import FooterComponent from "../../components/FooterComponent";
import HTTPService from "../../services/HTTPService";

import LoadingComponent from "../../components/LoadingComponent";
import AuthService from "../../services/AuthService";
import CanvasHelper from "../../services/CanvasHelper";
import * as _ from "underscore";
import FitnessRuleComponent from "../../components/chaosnet/FitnessRuleComponent";
import ChaosPixelBoxComponent from "../../components/chaospixel/ChaosPixelBoxComponent";
class ChaosPixelBoxerPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: true,
            scale: 1,
            boxes: []
        }

        this.handelKeyChange = this.handelKeyChange.bind(this);
        this.handleKeySubmit = this.handleKeySubmit.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.resetCanvasWithImage = this.resetCanvasWithImage.bind(this);

        this.onConfirmBoxClick = this.onConfirmBoxClick.bind(this);
        // this.onCanvasMouseDown = this.onCanvasMouseDown.bind(this);
        /*HTTPService.get('/admin/home', {})
            .then((response) => {
                let state = {};
                state.stats = response.data;
                this.setState(state);
                return HTTPService.get('/admin/keys', {})

            })
            .then((response) => {
                let state = {};
                state.loaded = true;
                state.keys = response.data;
                this.setState(state);
            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            });*/

    }
    componentDidMount(){
        this.canvasHelper = new CanvasHelper({
            canvas: document.getElementById('imageCanvas'),
            previewCanvas: document.getElementById('previewCanvas'),
            mode: CanvasHelper.Mode.BOX_SELECT
        });
    }
    onConfirmBoxClick(event){
        let state = {
            boxes: this.state.boxes
        };
        const previewCanvas = document.getElementById('previewCanvas');
        const previewCtx = previewCanvas.getContext('2d');
        state.boxes.push({
            previewImageData: previewCtx.getImageData(
                0,
                0,
                previewCanvas.width,
                previewCanvas.height
            ),
            bbox: this.canvasHelper.getBBox(),
            tags: [ 'zelda.link']
        })
        this.setState(state);
    }
    handelKeyChange(event){
        let state = {
            keyPayload: this.state.keyPayload
        }
        state.keyPayload[event.target.name] = event.target.value;
        this.setState(state);
    }
    handleKeySubmit(event){
        event.preventDefault();
        /*HTTPService.post(
            '/admin/keys',
            this.state.keyPayload
        )
            .then((response) => {
                let state = {};
                state.keys = response.data;
                this.setState(state);

            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            });*/

    }
    resetCanvasWithImage(){
        if(!this.canvas){
            this.canvas = document.getElementById('imageCanvas');
        }
        var ctx = this.canvas.getContext('2d');
        let scaledWidth = this.img.width * this.state.scale;
        let scaledHeight = this.img.height * this.state.scale;
        this.canvas.width = scaledWidth;
        this.canvas.height = scaledHeight;
        ctx.drawImage(this.img,0,0, scaledWidth, scaledHeight);
        let imageData = ctx.getImageData(0, 0, 1, 1);
        let state = {
            background_color: this.canvasHelper.rgbToHex(
                imageData.data[0],
                imageData.data[1],
                imageData.data[2]
            )
        };

        this.setState(state);
    }
    handleImage(e){

        this.canvas = document.getElementById('imageCanvas');
        this.canvas.imageSmoothingEnabled = false;
        var reader = new FileReader();
        reader.onload = (event) =>{
            this.img = new Image();
            this.img.onload = ()=>{
                this.canvasHelper.resetCanvasWithImage(this.img);
            }
            this.img.src = event.target.result;
            this.spriteGroups = [];
            this.setState({
                selectedSpriteGroups:[]
            })
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

                                    <div className="row">

                                        {
                                            this.state.error &&
                                            <div className="alert alert-danger">
                                                {this.state.error.message}
                                            </div>
                                        }
                                        {
                                            !this.state.loaded &&
                                            <LoadingComponent />
                                        }
                                        {
                                            this.state.loaded &&
                                            <div className="col-xl-3 col-md-12 mb-3">
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">

                                                        <div className="card-header py-3">
                                                            <h1 className="h3 mb-0 text-gray-800">Upload</h1>
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="exampleInputEmail1">Upload Image </label>
                                                            <input type="file" id="imageLoader" name="imageLoader" onChange={this.handleImage}/>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">

                                                        <canvas id="previewCanvas" height={256} width={256}></canvas>

                                                        <div className="form-group">

                                                            <button className="btn btn-info" onClick={this.onConfirmBoxClick}>Confirm</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">
                                                        <table>
                                                            <tbody>
                                                            {
                                                                this.state.boxes.map((box) => {
                                                                    return <ChaosPixelBoxComponent box={box} page={this}/>
                                                                })
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <div className="col-xl-9 col-lg-9">
                                            <div className="card shadow mb-4">
                                                <div className="card-header py-3">
                                                    <h1 className="h3 mb-0 text-gray-800">Box</h1>
                                                </div>

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

export default ChaosPixelBoxerPage;
