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
import axios from 'axios';
import * as tf from "@tensorflow/tfjs";
import ChaosPixelTrainProgressComponent from "../../components/chaospixel/ChaosPixelTrainProgressComponent";
import ChaosPixelModelManagerComponent from "../../components/chaospixel/ChaosPixelModelManagerComponent";
import MobileNet_v1_0 from "../../services/model_helper/MobileNet_v1_0";
import ChaosProjectDatasetSelectComponent from "../../components/ChaosProjectDatasetSelectComponent";
import ConfirmComponent from "../../components/chaosnet/ConfirmComponent";
const CANVAS_WIDTH = 224;// 320;//640;//224;  // Matches the input size of MobileNet.
const CANVAS_HEIGHT = 224;
class ChaosPixelBoxerPageMode{
    static get Input(){
        return "Input";
    }
    static get Train(){
        return "Train";
    }
    static get Predict(){
        return "Predict";
    }
}
class ChaosPixelBoxerPage extends Component {

    constructor(props) {
        super(props);
        this.showError = this.showError.bind(this);
        this.onDatasetLoad = this.onDatasetLoad.bind(this);
        this.handleImage = this.handleImage.bind(this);

        this.onConfirmBoxClick = this.onConfirmBoxClick.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onNextImageClick = this.onNextImageClick.bind(this);
        this.onPrevImageClick = this.onPrevImageClick.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onDownloadClick = this.onDownloadClick.bind(this);
        this.onSaveToServerClick = this.onSaveToServerClick.bind(this);
        this.onLoadFromServerClick = this.onLoadFromServerClick.bind(this);
        this.onScaleChange = this.onScaleChange.bind(this);
        this.onClearAllImages = this.onClearAllImages.bind(this);
        this.predictImageBox = this.predictImageBox.bind(this);
        this.onPromptDatasetName = this.onPromptDatasetName.bind(this);
        this.onConfirmDatasetNamePromptComponent = this.onConfirmDatasetNamePromptComponent.bind(this);
        this.handleDatasetNamePromptComponentChange = this.handleDatasetNamePromptComponentChange.bind(this);
        this.onLoadDataSetsClick = this.onLoadDataSetsClick.bind(this);

        this.onUploadTestImage = this.onUploadTestImage.bind(this);
        this.state = {
            loaded: true,
            images:[],//spriteGroup._component.previewCanvas.toDataURL()
            scale: 2,
            mode: ChaosPixelBoxerPageMode.Input,
            modelHelper: new MobileNet_v1_0(),
        }
        tf.loadLayersModel('indexeddb://my-model-1')
            .then((model)=>{
                this.state.modelHelper.setModel(model);
            })
            .catch((err)=>{
                this.setState({
                    error: err
                })
            })

        /*if(AutShervice.userData){
            this.loadDataSet();
        }*/
        this.loadProject();

    }
    componentDidMount(){
        this.canvasHelper = new CanvasHelper({
            canvas: document.getElementById('imageCanvas'),
            previewCanvas: document.getElementById('previewCanvas'),
            mode: CanvasHelper.Mode.BOX_SELECT,
            canvasWidth: CANVAS_WIDTH,
            canvasHeight: CANVAS_HEIGHT,
            scale: this.state.scale
        });
        document.body.onkeypress = this.onKeyPress
    }
    getMainNavButtonClass(modeName){
        let baseClasses = "btn btn-sm ";
        if(this.state.mode == modeName){
            baseClasses += "btn-info";
        }else{
            baseClasses += "btn-dark";
        }
        return baseClasses;
    }

    setMode(mode) {
        return (p1) => {
            this.setState({
                mode: mode
            })
        };
    }
    onClearAllImages(e){
        e.preventDefault();
        this.setState({
            currImage: null,
            images:[]
        })
    }
    onScaleChange(e){
        const scale =  e.target.value;
        this.setState({
            scale: scale
        })
        this.canvasHelper.setScale(scale);
        this.redrawImageBoxes();
    }
    onNextImageClick(e){
        this.onConfirmBoxClick(e);
        if(!this.state.currImage){
            this.setImageById(0);
        }else{
            this.setImageById(this.state.currImage.id + 1);
        }


    }
    onPrevImageClick(e){
        this.onConfirmBoxClick(e);
        if(!this.state.currImage){
            this.setImageById(0);
        }else{
            this.setImageById(this.state.currImage.id - 1);
        }
    }
    reorderImages(){
        for(let i = 0; i < this.state.images.length; i++){
            let imgObj = this.state.images[i];
            imgObj.id = i;
        }
        this.setState({
            images: this.state.images
        });
    }
    setImageById(imgId){
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
        const bbox = this.canvasHelper.getBBox();
        if(!bbox){
            return;
        }
        let state = {
            currImage: this.state.currImage
        };
        state.currImage.boxes.push({
            bbox: bbox,
            tags: [ 'zelda.link']
        })
        this.setState(state);
    }
    getCleanImages(){
        let cleanImages = [];
        this.state.images.forEach((imageObj)=>{
            if(!imageObj.boxes || imageObj.boxes.length === 0){
                return;
            }
            cleanImages.push(imageObj);

        })

        return cleanImages;
    }
    onSaveClick(e){

        e.preventDefault();
        const cleanImages = this.getCleanImages();
        let state = {
            images: cleanImages
        }
        this.setState(state);
        const strData = JSON.stringify(cleanImages);
        localStorage.setItem('chaospixel:images', strData);
    }
    onSaveToServerClick(e, dataSetTag){
        e.preventDefault();
        const cleanImages = this.getCleanImages();


        HTTPService.post(
            '/' + this.state.project.owner_username + '/projects/' + this.state.project.namespace + '/data/images/tags/' + (dataSetTag || this.state.dataSetTag)
        )
        .then((response) => {
            return axios.put(response.data.url, cleanImages, {
              /*  headers: {
                    'Content-Type': 'application/json'
                }*/
            });

        })
        .then(()=>{
            /*let state = {};
            state.keys = response.data;
            this.setState(state);*/
            alert("Saved");

        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        });
    }
    onLoadFromServerClick(e, dataSetTag){

        e.preventDefault();

        HTTPService.get(
            '/' + this.state.project.owner_username + '/projects/' + this.state.project.namespace + '/data/images/tags/' + (dataSetTag || this.state.dataSetTag)
        )
            .then((response) => {
                return axios.get(response.data.url);

            })
            .then((response) => {
                console.log("response", response.data);
                let state = {
                    images: response.data
                }
                this.setState(state);
            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            });
    }
    onDownloadClick(e){
        const cleanImages = this.getCleanImages();
        let state = {
            images: cleanImages
        }
        this.setState(state);
        const strData = JSON.stringify(cleanImages);
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(strData);
        e.target.setAttribute("href",     dataStr     );
        e.target.setAttribute("download", "chaospixel.json");
        //e.target.click();
    }

    async onSelectImage(imageObj) {
        const imageEle = await this.canvasHelper.loadAndShapeImage(imageObj.imgSrc)
        this.canvasHelper.resetCanvasWithImage(imageEle);
        imageObj.boxes.forEach((box)=>{
            this.canvasHelper.drawRect({
                bbox: this.canvasHelper.applyScaleToBBox(box.bbox)
            })
        })
        const state = {
            currImage:imageObj,
        }
        this.setState(state);
        this.redrawImageBoxes();
        if(this.state.mode === ChaosPixelBoxerPageMode.Predict){
            imageObj.boxes.forEach((box)=> {
                this.predictImageBox(null, imageObj, box);
            });
        }

    }
    redrawImageBoxes(){
        if(!this.state.currImage){
            return;
        }
        this.state.currImage.boxes.forEach((box)=>{
            this.canvasHelper.drawRect({
                bbox: this.canvasHelper.applyScaleToBBox(box.bbox)
            })
        })
    }
    async onUploadTestImage(e){

            let file = e.target.files[0];

        return new Promise((resolve, reject) =>{
            const reader = new FileReader();
            reader.onload = async (event) =>{
                const imageEle = await this.canvasHelper.loadAndShapeImage(event.target.result)
                let imageObj = {
                    id: this.state.images.length,
                    imgSrc: imageEle.src,//  event.target.result,
                    boxes:[]
                }


                this.canvasHelper.resetCanvasWithImage(imageEle);
                this.setState({
                    currImage: imageObj
                });

                return resolve(imageObj);


            }
            reader.readAsDataURL(file);
        })
        .then((imageObj)=>{
            return this.predictImageBox(e, imageObj, null);
        })
        .catch(this.showError);


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
                        const imageEle = await this.canvasHelper.loadAndShapeImage(event.target.result)
                        let imageObj = {
                            id: this.state.images.length,
                            imgSrc: imageEle.src,//  event.target.result,
                            boxes:[]
                        }
                        state.images.push(imageObj);
                        if(i === 0){

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
               this.onNextImageClick(event);
               break;
        }
    }



    async predictImageBox(event, image, box){

        let scaledTestImg = await this.canvasHelper.loadAndShapeImage(image.imgSrc);

        this.canvasHelper.setImage(scaledTestImg);
        this.canvasHelper.resetCanvasWithImage();
        const modelOut = await this.state.modelHelper.predict(scaledTestImg);


        let predictBoundingBox = modelOut.slice(1);
        console.log(JSON.stringify( predictBoundingBox, null, 3));

        tf.util.assert(
            predictBoundingBox != null && predictBoundingBox.length === 4,
            `Expected boundingBoxArray to have length 4, ` +
            `but got ${predictBoundingBox} instead`);


        predictBoundingBox = this.canvasHelper.applyScaleToBBox(predictBoundingBox);
        this.canvasHelper.drawRect({
            lineWidth: "2",
            strokeStyle: "blue",
            bbox:predictBoundingBox
        })

        if(!box){
            return;
        }

        this.canvasHelper.drawRect({
            lineWidth: "2",
            strokeStyle: "green",
            bbox: this.canvasHelper.applyScaleToBBox(box.bbox)
        })


    }
    getBoxButtons() {

        return [
            {
                text:'Delete',
                onClick: (event, img, box, component) =>{
                    let boxIndex = -1;
                    img.boxes.forEach((testBox, index) => {
                        if(
                            testBox.bbox[0] == box.bbox[0] &&
                            testBox.bbox[1] == box.bbox[1] &&
                            testBox.bbox[2] == box.bbox[2] &&
                            testBox.bbox[3] == box.bbox[3]
                        ){
                            boxIndex = index;
                        }
                    });
                    if(boxIndex === -1){
                        throw new Error("Could not find box");
                    }
                    img.boxes.splice(boxIndex, 1);
                    this.setState({
                        images: this.state.images
                    });
                }
            },
            {
                text:'Predict',
                onClick: this.predictImageBox
            }
        ]
    }
    getDataSet(){
        return this.state.images;
    }
    loadProject() {
        return HTTPService.get(
            '/' + this.props.username + '/projects/' + this.props.chaosproject
        )
        .then((response) => {
            console.log("choasProject", response);
            let state = {
                project: response.data
            }
            this.setState(state);
        })
        .catch(this.showError);
    }
    onLoadDataSetsClick() {
        this.setState({
            projectDatas: null
        });
        return HTTPService.get(
            '/' + this.props.username + '/projects/' + this.props.chaosproject + '/data'
        )
            .then((response) => {

                let state = {
                    projectDatas: response.data
                }
                console.log("projectDatas", state);
                this.setState(state);
            })
            .catch(this.showError);
    }
    /*loadDataSet() {
        return HTTPService.get(
            '/' + AuthService.userData.username + '/chaospixel'
        )
            .then((response) => {
                return axios.get(response.data.url);

            })
            .then((response) => {
                console.log("response", response.data);
                let state = {
                    images: response.data
                }
                this.setState(state);
                this.reorderImages();
            })
            .catch(this.showError);
    }*/
    showError(err){
        let state = {};
        state.error = err;
        this.setState(state);
        console.error("Error: ", err.message);
    }
    onDatasetLoad(images, tag){
        this.setState({
            images: images,
            dataSetTag: tag
        });
    }
    onConfirmDatasetNamePromptComponent(e){
        this.setState({
            dataSetTag: this.state._dataSetTag,
            _dataSetTag: null
        })
        this.onSaveToServerClick(e, this.state._dataSetTag);
    }
    handleDatasetNamePromptComponentChange(e){
        console.log(" e.target.value: ",  e.target.value);
        this.setState({
            _dataSetTag: e.target.value
        })
    }
    onPromptDatasetName(e) {
        e.preventDefault();
        this.refs.datasetNamePromptComponent.show();
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
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-12 col-lg-12  col-md-12">

                                            <div className="card shadow mb-4" >
                                               {/* <div className="card-header py-3">


                                                </div>*/}

                                                <div className="card-body">
                                                    {/*{
                                                        this.state.project &&
                                                        <ChaosProjectDatasetSelectComponent className="float-left"
                                                        chaosProject={this.state.project} type='images'
                                                        onDatasetLoad={this.onDatasetLoad} />
                                                    }*/}
                                                    <div className='btn-group' className="float-left">

                                                        <button className={this.getMainNavButtonClass(ChaosPixelBoxerPageMode.Input)} onClick={this.setMode(ChaosPixelBoxerPageMode.Input)}>Input</button>
                                                        <button className={this.getMainNavButtonClass(ChaosPixelBoxerPageMode.Train)} onClick={this.setMode(ChaosPixelBoxerPageMode.Train)}>Train</button>
                                                        <button className={this.getMainNavButtonClass(ChaosPixelBoxerPageMode.Predict)} onClick={this.setMode(ChaosPixelBoxerPageMode.Predict)}>Predict</button>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row">
                                        {
                                            this.state.mode !== ChaosPixelBoxerPageMode.Train &&
                                            <div className="col-xl-8 col-lg-8  col-md-8">
                                                <div className='sticky'>
                                                    <div className="card shadow mb-4">
                                                        <div className="card-header py-3">
                                                            <h1 className="h3 mb-0 text-gray-800">Box {this.state.currImage && this.state.currImage.id}</h1>
                                                            <div className='btn-group'>

                                                                <button className="btn btn-info"
                                                                        onClick={this.onPrevImageClick}>Prev
                                                                </button>
                                                                <button className="btn btn-info"
                                                                        onClick={this.onNextImageClick}>Next
                                                                </button>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="scale">Scale {this.state.scale} </label>
                                                                <input type="range" id="scale" name="scale" step=".25"
                                                                       min="0" max="8" value={this.state.scale}
                                                                       onChange={this.onScaleChange}/>
                                                            </div>
                                                            <div className="float-right">
                                                                {
                                                                    this.state.mode === ChaosPixelBoxerPageMode.Predict &&
                                                                    <div className="form-group">
                                                                        <label htmlFor="exampleInputEmail1">Upload Image </label>
                                                                        <input type="file" id="imageLoader" name="imageLoader"
                                                                               onChange={this.onUploadTestImage} multiple/>
                                                                    </div>
                                                                }
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
                                        }

                                        {
                                            this.state.mode === ChaosPixelBoxerPageMode.Train && <ChaosPixelTrainProgressComponent  page={this} ></ChaosPixelTrainProgressComponent>
                                        }

                                            <div className="col-xl-3 col-lg-3 col-md-3">
                                                {
                                                    this.state.mode === ChaosPixelBoxerPageMode.Input &&
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">

                                                        <div className="card-header py-3">
                                                            <h1 className="h3 mb-0 text-gray-800">Upload</h1>
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="exampleInputEmail1">Upload Image </label>
                                                            <input type="file" id="imageLoader" name="imageLoader"
                                                                   onChange={this.handleImage} multiple/>
                                                        </div>


                                                        <div className="form-group">
                                                            <div className='btn-group'>
                                                                <div className="dropdown">
                                                                    <button
                                                                        className="btn btn-sm  btn-secondary dropdown-toggle"
                                                                        type="button" id="dropdownMenuButton"
                                                                        data-toggle="dropdown" aria-haspopup="true"
                                                                        aria-expanded="false">
                                                                        Save
                                                                    </button>
                                                                    <div className="dropdown-menu"
                                                                         aria-labelledby="dropdownMenuButton">
                                                                        <a className="dropdown-item" href="#"
                                                                           onClick={this.onSaveClick}>Save in
                                                                            Browser</a>
                                                                        <a className="dropdown-item" href="#"
                                                                           onClick={this.onDownloadClick}>Download</a>
                                                                        <a className="dropdown-item" href="#"
                                                                           onClick={this.onSaveToServerClick}>
                                                                            Save to Server
                                                                        </a>
                                                                        <a className="dropdown-item" href="#"
                                                                           onClick={ this.onPromptDatasetName}>
                                                                            Save to
                                                                            Server as ...
                                                                        </a>
                                                                    </div>
                                                                </div>

                                                                <div className="dropdown">
                                                                    <button
                                                                        className="btn btn-sm  btn-secondary dropdown-toggle"
                                                                        type="button" id="dropdownMenuButton"
                                                                        data-toggle="dropdown" aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        onClick={this.onLoadDataSetsClick}
                                                                    >
                                                                        Load

                                                                    </button>
                                                                    <div className="dropdown-menu"
                                                                         aria-labelledby="dropdownMenuButton">
                                                                        {
                                                                            this.state.projectDatas &&
                                                                            this.state.projectDatas.images.map((tag) => {
                                                                                return <a className="dropdown-item" href="#"
                                                                                   onClick={(e) => {
                                                                                       this.onLoadFromServerClick(e, tag)
                                                                                   }}>
                                                                                    {tag}
                                                                                </a>
                                                                            })
                                                                        }
                                                                        {
                                                                            !this.state.projectDatas &&
                                                                            <a className="dropdown-item" href="#">
                                                                                Loading ...
                                                                            </a>
                                                                        }
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            }
                                            {
                                                this.state.mode === ChaosPixelBoxerPageMode.Input &&
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">
                                                        <div className="card-header py-3">
                                                            <h1 className="h3 mb-0 text-gray-800">Preview</h1>

                                                        </div>


                                                        <canvas id="previewCanvas" height={256} width={256}></canvas>
                                                        <div className="form-group">

                                                            <button className="btn btn-info"
                                                                    onClick={this.onConfirmBoxClick}>Confirm
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            {
                                                this.state.mode !== ChaosPixelBoxerPageMode.Input &&
                                                <ChaosPixelModelManagerComponent page={this}></ChaosPixelModelManagerComponent>
                                            }
                                            <div className="card shadow mb-4">

                                                <div className="card-body">
                                                    <div className="card-header py-3">
                                                        <h1 className="h3 mb-0 text-gray-800">Images</h1>
                                                        <button className="btn btn-info" onClick={this.onClearAllImages}>Clear All Images</button>
                                                    </div>

                                                    {
                                                        this.state.images.map((image) => {
                                                            return <div>
                                                                <h3>
                                                                    <a href="#" onClick={(e)=>{ e.preventDefault(); this.onSelectImage(image); }}>Image {image.id}</a>
                                                                </h3>
                                                                <img src={image.imgSrc} width={64} />
                                                                <table>
                                                                    <tbody>
                                                                    {
                                                                        image.boxes.map((box) => {
                                                                            return <ChaosPixelBoxComponent box={box} page={this} image={image} buttons={this.getBoxButtons()}/>
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
                                    </div>
                                </div>
                                {/* /.container-fluid */}
                            </div>
                            {/* End of Main Content */}
                            {/* Footer */}
                            <FooterComponent />
                            {/* End of Footer */}

                            <ConfirmComponent ref="datasetNamePromptComponent" id='datasetNamePromptComponent' title={"Save As"} body={
                                <div>
                                    Name: <input type='text' onChange={this.handleDatasetNamePromptComponentChange} value={this.state.dataSetTag}/>
                                </div>

                            } onConfirm={this.onConfirmDatasetNamePromptComponent} />

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
