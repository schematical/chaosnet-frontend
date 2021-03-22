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
const CANVAS_SIZE = 224;  // Matches the input size of MobileNet.

class ChaosPixelBoxerPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: true,
            images:[],//spriteGroup._component.previewCanvas.toDataURL()
        }
        const strData = localStorage.getItem('chaospixel:images');
        if(strData){
            this.state.images = JSON.parse(strData);
        }
        this.handleImage = this.handleImage.bind(this);

        this.onConfirmBoxClick = this.onConfirmBoxClick.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onNextImageClick = this.onNextImageClick.bind(this);
        this.onPrevImageClick = this.onPrevImageClick.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

    }
    componentDidMount(){
        this.canvasHelper = new CanvasHelper({
            canvas: document.getElementById('imageCanvas'),
            previewCanvas: document.getElementById('previewCanvas'),
            mode: CanvasHelper.Mode.BOX_SELECT,
            canvasSize: CANVAS_SIZE
        });
        document.body.onkeypress = this.onKeyPress
    }
    onNextImageClick(e){

        if(!this.state.currImage){
            this.setImageById(0);
        }else{
            this.setImageById(this.state.currImage.id + 1);
        }

    }
    onPrevImageClick(e){
        if(!this.state.currImage){
            this.setImageById(0);
        }else{
            this.setImageById(this.state.currImage.id - 1);
        }
    }
    setImageById(imgId){
        console.log("SETTING: " + imgId);
        if(this.state.images.length == 0){
            return;
        }
        if(imgId === -1){
            this.onSelectImage(this.state.images[this.state.images.length - 1]);
            return
        }
        for(let i = 0; i < this.state.images.length; i++){
            let imgObj = this.state.images[i];
            if(imgObj.id === imgId){
                this.onSelectImage(imgObj);
                return;

            }
        }
        this.onSelectImage(this.state.images[0]);

    }
    onConfirmBoxClick(event){
        let state = {
            currImage: this.state.currImage
        };
        state.currImage.boxes.push({
            bbox: this.canvasHelper.getBBox(),
            tags: [ 'zelda.link']
        })
        this.setState(state);
    }
    onSaveClick(e){
        let cleanImages = [];
        this.state.images.forEach((imageObj)=>{
            if(!imageObj.boxes || imageObj.boxes.length === 0){
                return;
            }
            cleanImages.push(imageObj);

        })
        let state = {
            images: cleanImages
        }
        this.setState(state);
        const strData = JSON.stringify(cleanImages);
        localStorage.setItem('chaospixel:images', strData);
    }

    async onSelectImage(imageObj) {
        const imageEle = await this.canvasHelper.loadAndShapeImage(imageObj.imgSrc)
        this.canvasHelper.resetCanvasWithImage(imageEle);
        const state = {
            currImage:imageObj,
        }
        this.setState(state);

    }
    async handleImage(e){

        this.canvas = document.getElementById('imageCanvas');
        this.canvas.imageSmoothingEnabled = false;
        const state = {
            images:this.state.images,
        }
        let p = Promise.resolve(p);
        for( let i = 0; i < e.target.files.length; i++){
            let file = e.target.files[i];
            p = p.then(()=>{
                return new Promise((resolve, reject) =>{
                    const reader = new FileReader();
                    reader.onload = async (event) =>{

                        let imageObj = {
                            id: this.state.images.length,
                            imgSrc: event.target.result,// imageEle.src,
                            boxes:[]
                        }
                        state.images.push(imageObj);
                        if(i === 0){
                            const imageEle = await this.canvasHelper.loadAndShapeImage(event.target.result)
                            this.canvasHelper.resetCanvasWithImage(imageEle);
                            state.currImage = imageObj;
                        }
                        return resolve();


                    }
                    reader.readAsDataURL(file);
                })
            })
        }
        await p;
        this.setState(state);






    }
    onKeyPress = (event) => {
        console.log("Key Press Event: ", event);
       switch(event.key){
           case('q'):
               this.onPrevImageClick(event);
               break;
           case('e'):
               this.onPrevImageClick(event);
               break;
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
                                                            <input type="file" id="imageLoader" name="imageLoader" onChange={this.handleImage}  multiple/>
                                                        </div>
                                                        <div className="form-group">

                                                            <button className="btn btn-info" onClick={this.onSaveClick}>Save</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">
                                                        <div className="card-header py-3">
                                                            <h1 className="h3 mb-0 text-gray-800">Preview</h1>

                                                        </div>


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
                                                                    <h3>
                                                                        <a href="#" onClick={(e)=>{ this.onSelectImage(image); }}>Image {image.id}</a>
                                                                    </h3>
                                                                    <img src={image.imgSrc} width={64} />
                                                                    <table>
                                                                        <tbody>
                                                                        {
                                                                            image.boxes.map((box) => {
                                                                                return <ChaosPixelBoxComponent box={box} page={this} image={image}/>
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
                                                    <div className='btn-group'>

                                                        <button className="btn btn-info" onClick={this.onPrevImageClick}>Prev</button>
                                                        <button className="btn btn-info" onClick={this.onNextImageClick}>Next</button>
                                                    </div>
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
