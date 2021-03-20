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
            images:[],//spriteGroup._component.previewCanvas.toDataURL()
        }


        this.handleImage = this.handleImage.bind(this);

        this.onConfirmBoxClick = this.onConfirmBoxClick.bind(this);


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
            currImage: this.state.currImage
        };
        const previewCanvas = document.getElementById('previewCanvas');
        const previewCtx = previewCanvas.getContext('2d');
        state.currImage.boxes.push({
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


    handleImage(e){

        this.canvas = document.getElementById('imageCanvas');
        this.canvas.imageSmoothingEnabled = false;

        var reader = new FileReader();
        reader.onload = (event) =>{
            this.img = new Image();
            this.img.onload = ()=>{
                this.canvasHelper.resetCanvasWithImage(this.img);
                const state = {
                    images:this.state.images,
                }
                let imageObj = {
                    id: this.state.images.length,
                    imgSrc: this.img.src,
                    boxes:[]
                }
                state.images.push(imageObj);
                state.currImage = imageObj;
                this.setState(state);
            }
            console.log("event.target.", event.target);
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
                                                        {
                                                            this.state.images.map((image) => {
                                                                return <div>
                                                                    <h3>Image {image.id}</h3>
                                                                    <img src={image.imageSrc} width={64} />
                                                                    <table>
                                                                        <tbody>
                                                                        {
                                                                            image.boxes.map((box) => {
                                                                                return <ChaosPixelBoxComponent box={box} page={this}/>
                                                                            })
                                                                        }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            })
                                                        }

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
