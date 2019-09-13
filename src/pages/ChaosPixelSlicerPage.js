import React, {Component} from 'react';
import * as _ from 'underscore';
import SidebarComponent from '../components/SidebarComponent';
import TopbarComponent from '../components/TopbarComponent';
import AuthService from '../services/AuthService';
import SpriteGroupComponent from "../components/SpriteGroupComponent";
import TagTextComponent from "../components/TagTextComponent";
const axios = require('axios');

class ChaosPixelSlicerPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: 16,
            width:16,
            background_color: "#ffffff",
            sprite_group_range: 3,
            max_batch_tick_duration: 100,
            scale: 1,
            zoom: 5,
            background_color_range: 8,
            max_stack_size: 1000,
            batch_size: 250,
            selectedSpriteGroups:[],
            alerts:[]
        }
        this.alerts = [];
        this.currBatchAction = null;
        this.handleChange = this.handleChange.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.drawSliceLines = this.drawSliceLines.bind(this);
        this.onCanvasMouseMove = this.onCanvasMouseMove.bind(this);
        this.autosliceSpriteGroup = this.autosliceSpriteGroup.bind(this);
        this.autoscale = this.autoscale.bind(this);
        this.resetCanvasWithImage = this.resetCanvasWithImage.bind(this);
        this.onCanvasMouseDown = this.onCanvasMouseDown.bind(this);
        this.saveTrainingData = this.saveTrainingData.bind(this);
        this.onTagAdd = this.onTagAdd.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.tick = this.tick.bind(this);
        this.timer = setInterval(this.tick, this.state.max_batch_tick_duration);

    }
    onKeyDown(event){

        if(event.keyCode === 27) {
            //Do whatever when esc is pressed
        }
        if(event.key == 'a'){

            this.setState({
                selectedSpriteGroups: this.spriteGroups || []
            })
        }
    }
    onTagAdd(selectedSpriteGroups, tag){
        this.setState({
            selectedSpriteGroups: selectedSpriteGroups
        })
    }
    tick(){
        if(!this.previewCanvas){
            this.previewCanvas = document.getElementById('previewCanvas');
            if(this.previewCanvas){
                this.previewCanvas.imageSmoothingEnabled = false;
            }
        }
        if(this.currBatchAction){
            let tickStart = new Date().getTime();
            while(
                this.currBatchAction.i <  this.currBatchAction.goal &&
                new Date().getTime() - tickStart < this.state.max_batch_tick_duration
            ) {
                try {
                    this.state['batch_status'] = this.currBatchAction.tick();

                } catch (e) {
                    this.currBatchAction = null;
                    throw e;
                }
            }

            if(this.state['batch_status'].done){
                this.currBatchAction.cleanUp();
                this.currBatchAction = null;
                console.log("Completed: ",this.state['batch_status']);
            }
            this.setState(this.state);
        }
    }
    alert(message){
        this.state.alerts.push({
            id: Math.random() * 1000,
            message: message
        })
        this.setState(this.state);;
    }
    handleChange(event) {
        //console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        switch(event.target.name){
            case("height"):
            case("width"):
            case("background_color_range"):
            case("sprite_group_range"):
            case("zoom"):
            case("scale"):
            case("batch_size"):
            case("max_stack_size"):
                state[event.target.name] = parseFloat(event.target.value);
                break;
            default:
                state[event.target.name] = event.target.value;
        }

        this.setState(state);
    }
    componentDidMount(){
        document.addEventListener("keydown", this.onKeyDown, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.onKeyDown, false);
    }
    handleImage(e){
        this.canvas = document.getElementById('imageCanvas');
        this.canvas.imageSmoothingEnabled = false;
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
        let scaledWidth = this.img.width * this.state.scale;
        let scaledHeight = this.img.height * this.state.scale;
        this.canvas.width = scaledWidth;
        this.canvas.height = scaledHeight;
        ctx.drawImage(this.img,0,0, scaledWidth, scaledHeight);
        let imageData = ctx.getImageData(0, 0, 1, 1);
        this.state.background_color = this.rgbToHex(
            imageData.data[0],
            imageData.data[1],
            imageData.data[2]
        );
        console.log("Background: ", this.state.background_color);
        this.setState(this.state);
    }
    drawSliceLines(){
        this.resetCanvasWithImage();
        var ctx = this.canvas.getContext("2d");

        for(let x = 0; x < this.img.width; x += this.state.width){
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.img.height);
            ctx.stroke();
        }
        for(let y = 0; y < this.img.height; y += this.state.height){
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.img.width,y);
            ctx.stroke();
        }


    }
    onCanvasMouseDown(e){

        if(!this.hoveredSpriteGroup){
            return;
        }
        if (!e.shiftKey) {
            this.state.selectedSpriteGroups = [];
        }
        let blnExists = false;
        this.state.selectedSpriteGroups.forEach((spriteGroup)=>{
            if(spriteGroup.id == this.hoveredSpriteGroup.id){
                blnExists = true;
            }
        })
        if(blnExists){
            return;
        }
        this.state.selectedSpriteGroups.push(this.hoveredSpriteGroup);
        this.setState({
            selectedSpriteGroups: this.state.selectedSpriteGroups
        });


    }
    onCanvasMouseMove(e){
        if(!this.img){
            return;
        }
        if(!this.canvas){
            this.canvas  = document.getElementById('imageCanvas');
        }
        let mousePos = this.getMousePos(e)
        if(
            this.spriteGroupingMap &&
            !_.isUndefined(this.spriteGroupingMap[mousePos.x]) &&
            !_.isUndefined(this.spriteGroupingMap[mousePos.x][mousePos.y]) &&
            this.spriteGroups[this.spriteGroupingMap[mousePos.x][mousePos.y]]
        ){
            this.hoveredSpriteGroup =  this.spriteGroups[this.spriteGroupingMap[mousePos.x][mousePos.y]];
            //console.log(this.hoveredSpriteGroup.id);
        }else{
            //console.log("No sprite group found: ", mousePos.x, mousePos.y, this.spriteGroupingMap[mousePos.x] &&  this.spriteGroupingMap[mousePos.x][mousePos.y]);
        }
        return;
        if(
            !this.lastBounds ||
            this.lastBounds.xMin != mousePos.bounds.x ||
            this.lastBounds.yMin != mousePos.bounds.y
        ){
            this.lastBounds = mousePos.bounds;
            this.drawSliceLines();
            let ctx = this.canvas.getContext("2d");
            ctx.fillStyle = "#FF0000";
            ctx.globalAlpha = 0.5;
            ctx.fillRect(
                this.lastBounds.xMin,
                this.lastBounds.yMin,
            this.lastBounds.xMax - this.lastBounds.xMin,
            this.lastBounds.yMax - this.lastBounds.yMin
            );
            ctx.globalAlpha = 1;
        }
    }
    getMousePos( evt) {
        var rect = this.canvas.getBoundingClientRect();
        let response = {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top),
            bounds:{}
        };
        for(let x = 0; x < this.img.width; x += this.state.width){
            if(
                response.x >= x &&
                response.x < x + this.state.width
            ){
                response.bounds.xMin = x;
                response.bounds.xMax = x + this.state.width;
                break;
            }
        }
        for(let y = 0; y < this.img.height; y += this.state.height){
            if(
                response.y >= y &&
                response.y < y + this.state.height
            ){
                response.bounds.yMin = y;
                response.bounds.yMax = y + this.state.height;
                break;
            }
        }


        return response;
    }
    autosliceSpriteGroup(){

        this.spriteGroupingMap = {};
        this.spriteGroups = [];
        this.currBatchAction = new AutoSliceBatchAction(this);
        this.currBatchAction.setDimensions({
            width: this.canvas.width,
            height: this.canvas.height
        });

    }
    eachPixel(fun){
        for(let y = 0; y < this.canvas.height; y ++){
            for(let x = 0; x < this.canvas.width; x ++){

               fun(x, y);
            }
        }
    }
    /*checkSpriteGroupPixel(x, y, ctx, bgColor, spriteGroupIndex, stack){

        if(!this.spriteGroupingMap[x]){
            this.spriteGroupingMap[x] = {};
        }
        if(
            !_.isUndefined(this.spriteGroupingMap[x]) &&
            !_.isUndefined(this.spriteGroupingMap[x][y]) ||
            this.spriteGroupingMap[x][y] == -2
        ){
            return;
        }
        let imageData = ctx.getImageData(x, y, 1, 1);
        var c = imageData.data;
        if(
           this.isTransparent(c)
        ) {
            this.spriteGroupingMap[x][y] = -2;
            return;
        }
        //Check pixels before and after

        let spriteGroup = null;
        if(spriteGroupIndex == -1){
            //Create a new sprite group
            spriteGroup = {
                id: this.spriteGroups.length,
                pixels: [],
                color: {
                    r: Math.random() * 255,
                    g: Math.random() * 255,
                    b: Math.random() * 255
                },
                tags:[
                    'pixel'
                ]
            }
            this.spriteGroups.push(spriteGroup);
        }else{
            spriteGroup = this.spriteGroups[spriteGroupIndex];
        }

        spriteGroup.pixels.push({
            x: x,
            y: y
        })

        this.spriteGroupingMap[x][y] = spriteGroup.id;
        imageData.data[0] = spriteGroup.color.r;
        imageData.data[1] = spriteGroup.color.g;
        imageData.data[2] = spriteGroup.color.b;
        ctx.putImageData(imageData, x, y);

        if(stack > this.state.max_stack_size){
            return;
        }

        for(let _x = x - this.state.sprite_group_range; _x <= x + this.state.sprite_group_range; _x++){

            for(let _y = y - this.state.sprite_group_range; _y <= y + this.state.sprite_group_range; _y++){

                //if(!this.spriteGroupingMap[_x][_y]){
                //console.log("Checking: ", spriteGroup.id);
                   this.checkSpriteGroupPixel(_x, _y, ctx, bgColor, spriteGroup.id, stack + 1);
                //}
            }
        }

    }*/

    autoscale(){

        let ctx = this.canvas.getContext("2d");
        let lastPixelColor = null;
        let pixelMatchCount = 0;
        let arrPixelCounts = {};
        let lastY = -1;
        this.eachPixel((x, y)=>{
            if(y < 8){
                return;
            }

            let imageData = ctx.getImageData(x, y, 1, 1);


            if(y != lastY){
                lastY = y;
                pixelMatchCount = 0;
                lastPixelColor = null;
            }
            if(this.isTransparent(imageData.data)){
                pixelMatchCount = 0;
                lastPixelColor = null;
                return true;
            }
            if(!lastPixelColor){
                lastPixelColor = imageData.data;
                return;
            }

            if(
                lastPixelColor[0] > imageData.data[0] -  this.state.background_color_range &&
                lastPixelColor[0] < imageData.data[0] +  this.state.background_color_range &&
                lastPixelColor[1] > imageData.data[1] -  this.state.background_color_range &&
                lastPixelColor[1] < imageData.data[1] +  this.state.background_color_range &&
                lastPixelColor[2] > imageData.data[2] -  this.state.background_color_range &&
                lastPixelColor[2] < imageData.data[2] +  this.state.background_color_range
            ) {

                //console.log("Match:", x, y);
                pixelMatchCount += 1;
                return;
            }
            //console.log("pixelMatchCount:", pixelMatchCount);
            arrPixelCounts[pixelMatchCount] =  arrPixelCounts[pixelMatchCount] || 0;
            arrPixelCounts[pixelMatchCount] += 1;
            pixelMatchCount = 1;
            lastPixelColor = imageData.data;

        })
        let sortable = [];
        Object.keys(arrPixelCounts).forEach((pixelCount)=>{
            sortable.push({
                pixelCount: pixelCount,
                occurrences: arrPixelCounts[pixelCount]
            })
        })
        let sortedPixelCounts = _.sortBy(sortable, 'occurrences').reverse();
        console.log("sortedPixelCounts: ", sortedPixelCounts);
        console.log(sortedPixelCounts[1].pixelCount, " % ", sortedPixelCounts[0].pixelCount, " == ", sortedPixelCounts[1].pixelCount % sortedPixelCounts[0].pixelCount)
        /*if(sortedPixelCounts[1].pixelCount % sortedPixelCounts[0].pixelCount != 0){
            this.alert("Failed to determine a scale");
            return;
        }*/
        /*if(sortedPixelCounts[0].pixelCount == 1){
            this.alert("Scale is already 1. No need to scale");
            return;
        }*/
        console.log("Winner: ", sortedPixelCounts[0].pixelCount);
        this.state.scale = 1/sortedPixelCounts[0].pixelCount;
        this.resetCanvasWithImage();
    }
    isTransparent(c){
        let bgColor = this.hexToRgb(this.state.background_color);
        let rMin = c[0] - this.state.background_color_range;
        let rMax = c[0] + this.state.background_color_range;

        if(
            bgColor.r > rMin &&
            bgColor.r < rMax &&
            bgColor.g > c[1] - this.state.background_color_range  &&
            bgColor.g < c[1] + this.state.background_color_range &&
            bgColor.b > c[2] - this.state.background_color_range  &&
            bgColor.b < c[2] + this.state.background_color_range
        ) {
            return true;
        }

        return false;
    }
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    componentToHex(c){
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    saveTrainingData(){
        /*console.log(this.previewCanvas.toDataURL());
        return;*/
        let payload = [];

        this.state.selectedSpriteGroups.forEach((spriteGroup)=>{
            //TODO: Reverse zoom
            let actualZoom = this.state.zoom;
            this.state.zoom = 1;
            spriteGroup._component.setupPreview();
            payload.push({
                tags: spriteGroup.tags,
                base64String: spriteGroup._component.previewCanvas.toDataURL().replace("data:image/png;base64,", "")
            })
            this.state.zoom = actualZoom;
            spriteGroup._component.setupPreview();
        })
        return axios.post('https://chaosnet.schematical.com/v0/' + AuthService.userData.username + '/trainingdatas', payload, {
            headers:{
                "Authorization": AuthService.accessToken
            }
        })
            .then((response)=>{
               this.alert("Saved!");
            })
            .catch((err)=>{
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

                                    {/* Content Row */}
                                    <div className="row">
                                        {this.state.alerts.map((item, key) =>
                                            <div className="alert alert-warning alert-dismissible fade show" key={item.id} role="alert">
                                                {item.message}
                                                <button type="button" className="close" data-dismiss="alert"
                                                        aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                        )}
                                        {/* Area Chart */}
                                        <div className="col-xl-12 col-lg-12">
                                            <div className="card shadow mb-4">

                                                {/* Card Body */}
                                                <div className="card-body">
                                                    <div >
                                                        <form>


                                                            <div className="accordion" id="accordionExample">
                                                                <div className="card">
                                                                    <div className="card-header" id="headingOne">
                                                                        <h2 className="mb-0">
                                                                            <button className="btn btn-link"
                                                                                    type="button" data-toggle="collapse"
                                                                                    data-target="#upload"
                                                                                    aria-expanded="true"
                                                                                    aria-controls="upload">
                                                                                Upload
                                                                            </button>
                                                                        </h2>
                                                                    </div>

                                                                    <div id="upload" className="collapse show"
                                                                         aria-labelledby="headingOne"
                                                                         data-parent="#accordionExample">
                                                                        <div className="card-body">
                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">Upload Image </label>
                                                                                <input type="file" id="imageLoader" name="imageLoader" onChange={this.handleImage}/>
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">Background Color</label>
                                                                                <input type="color" name="background_color" placeholder="Background Color" value={this.state.background_color} onChange={this.handleChange} />
                                                                                <input type="button" className="btn btn-danger btn-lg" onClick={this.drawSliceLines} value="Set Background Color" />
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">Background Color Range</label>
                                                                                <input type="number" name="background_color_range" placeholder="Background Color Range" value={this.state.background_color_range} onChange={this.handleChange} />

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="card">
                                                                    <div className="card-header" id="headingThree">
                                                                        <h2 className="mb-0">
                                                                            <button className="btn btn-link collapsed"
                                                                                    type="button" data-toggle="collapse"
                                                                                    data-target="#scale"
                                                                                    aria-expanded="false"
                                                                                    aria-controls="scale">
                                                                               Scale
                                                                            </button>
                                                                        </h2>
                                                                    </div>
                                                                    <div id="scale" className="collapse"
                                                                         aria-labelledby="headingThree"
                                                                         data-parent="#accordionExample">
                                                                        <div className="card-body">
                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">Zoom </label>
                                                                                <input type="number" name="zoom" placeholder="Zoom" value={this.state.zoom} onChange={this.handleChange} />
                                                                            </div>

                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">Scale </label>
                                                                                <input type="number" name="scale" placeholder="Scale" value={this.state.scale} onChange={this.handleChange} />
                                                                            </div>

                                                                            <input type="button" className="btn btn-danger btn-lg" onClick={this.autoscale} value="Auto Scale" />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="card">
                                                                    <div className="card-header" id="headingTwo">
                                                                        <h2 className="mb-0">
                                                                            <button className="btn btn-link collapsed"
                                                                                    type="button" data-toggle="collapse"
                                                                                    data-target="#grid_slice"
                                                                                    aria-expanded="false"
                                                                                    aria-controls="grid_slice">
                                                                                Grid Slice
                                                                            </button>
                                                                        </h2>
                                                                    </div>
                                                                    <div id="grid_slice" className="collapse"
                                                                         aria-labelledby="headingTwo"
                                                                         data-parent="#accordionExample">
                                                                        <div className="card-body">

                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">Sprite Height </label>
                                                                                <input type="number" name="height" placeholder="Height" value={this.state.height} onChange={this.handleChange} />
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">Sprite Width </label>
                                                                                <input type="number" name="width" placeholder="Width" value={this.state.width} onChange={this.handleChange} />
                                                                            </div>
                                                                            <input type="button" className="btn btn-danger btn-lg" onClick={this.drawSliceLines} value="Splice" />


                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="card">



                                                                    <div className="card-header" id="headingThree">
                                                                        <h2 className="mb-0">
                                                                            <button className="btn btn-link collapsed"
                                                                                    type="button" data-toggle="collapse"
                                                                                    data-target="#fancy_slice"
                                                                                    aria-expanded="false"
                                                                                    aria-controls="fancy_slice">
                                                                                Fancy Slice
                                                                            </button>
                                                                        </h2>
                                                                    </div>
                                                                    <div id="fancy_slice" className="collapse"
                                                                         aria-labelledby="headingThree"
                                                                         data-parent="#accordionExample">
                                                                        <div className="card-body">
                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">AutoSlice  Sprite Group Range Max</label>
                                                                                <input type="number" name="sprite_group_range" placeholder="Height" value={this.state.sprite_group_range} onChange={this.handleChange} />
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">Max Stack</label>
                                                                                <input type="number" name="max_stack_size" placeholder="Height" value={this.state.max_stack_size} onChange={this.handleChange} />
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label htmlFor="exampleInputEmail1">Batch Szie</label>
                                                                                <input type="number" name="batch_size" placeholder="Height" value={this.state.batch_size} onChange={this.handleChange} />
                                                                            </div>
                                                                            <input type="button" className="btn btn-danger btn-lg" onClick={this.autosliceSpriteGroup} value="Auto Slice" />
                                                                        </div>
                                                                    </div>
                                                            </div>

                                                            </div>








                                                            <input type="button" className="btn btn-danger btn-lg" onClick={this.resetCanvasWithImage} value="Refresh" />


                                                            <p>
                                                                Pixel Count: {this.canvas ? (this.canvas.width + "x" + this.canvas.height + "->" + (this.canvas.width * this.canvas.height) ): ''}
                                                            </p>

                                                            {this.state.batch_status &&
                                                                <div>
                                                                    <p>
                                                                        Batch Status: {this.state.batch_status ? (this.state.batch_status.completed + " / " + this.state.batch_status.total) : ""}
                                                                        &nbsp;&nbsp;
                                                                        {
                                                                            this.state.batch_status._childStatus &&
                                                                            <span> Depth: {this.state.batch_status._childStatus.stack }</span>
                                                                        }
                                                                    </p>
                                                                    <div className="row no-gutters align-items-center">
                                                                        <div className="col-auto">
                                                                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                                                { Math.round(this.state.batch_status.completed / this.state.batch_status.total * 100) }%

                                                                            </div>
                                                                        </div>
                                                                        <div className="col">
                                                                            <div className="progress progress-sm mr-2">
                                                                                <div className="progress-bar bg-info"
                                                                                     role="progressbar" style={{width: (this.state.batch_status.completed / this.state.batch_status.total * 100) + '%'}}
                                                                                     aria-valuenow={this.state.batch_status.completed} aria-valuemin={0}
                                                                                     aria-valuemax={this.state.batch_status.total}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }




                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        <div className="col-xl-8 col-lg-7">
                                            <div className="card shadow mb-4">


                                                <div className="card-body">
                                                    <div>
                                                        <canvas id="imageCanvas" onMouseMove={this.onCanvasMouseMove} onMouseDown={this.onCanvasMouseDown}></canvas>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xl-12 col-lg-12">

                                            <div className="card shadow mb-4">

                                                <div className="card-body">
                                                    <TagTextComponent taggedObjects={this.state.selectedSpriteGroups} onTagAdd={this.onTagAdd} />
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th scope="col">#</th>

                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.selectedSpriteGroups.map((spriteGroup)=>{
                                                                return <SpriteGroupComponent spriteGroup={spriteGroup} page={this}/>
                                                            })
                                                        }

                                                        </tbody>
                                                    </table>
                                                    <input type="button" className="btn btn-danger btn-lg" onClick={this.saveTrainingData} value="Save" />
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
                                        <span>Copyright © Schematical Platform LLC</span>
                                    </div>
                                </div>
                            </footer>
                            {/* End of Footer */}
                        </div>
                        {/* End of Content Wrapper */}
                    </div>
                    {/* End of Page Wrapper */}


                </div>

            </div>
        );
    }
}
class BatchPixelAction{
    constructor(page){
        this.id = Math.floor(Math.random() * 9999)
        this.page = page;
        this.startX = 0;
        this.startY = 0;
        this.height = 0;
        this.width = 0;
        this.i = 0;
        this.stack = 0;


        this.total = this.page.canvas.width * this.page.canvas.height;

        this.childBatchActions = [];


    }
    setDimensions(dimensions){
        if(!_.isUndefined(dimensions.width)){
            this.width = dimensions.width;
        }
        if(!_.isUndefined(dimensions.height)){
            this.height = dimensions.height;
        }
        if(!_.isUndefined(dimensions.startX)){
            this.startX = dimensions.startX;
        }
        if(!_.isUndefined(dimensions.startY)){
            this.startY = dimensions.startY;
        }
        this.goal = this.width * this.height;
    }

    tick(){
        let status = {
            stack: this.stack,
            completed: this.i,
            total: this.goal,
        }
        status.percent = (status.completed / status.total) * 100;
        if(this.childBatchActions.length > 0){
            let childStatus = this.childBatchActions[0].tick();
            if(this.stack > 0){
                return childStatus;
            }
            status._childStatus = childStatus;
            return status;
        }


        if(this.i > this.goal){
            if(this.parentAction){
                this.parentAction.onChildFinish(this);
            }
            return ;
        }
        let y = Math.floor(this.i / this.width);
        let x = this.i % this.width;
        this.i += 1;
        if(this.stack > 0){
            console.log({
                stack: this.stack,
                c: this.parentAction.childBatchActions.length,
                i: this.i,
                x: x,
                y: y,

                startX: this.startX,
                startY: this.startY
            })
        }
        this.run(
            this.startX + x,
            this.startY + y
        );
        if(
            x > this.page.canvas.width &&
            y > this.page.canvas.height
        ){
            throw new Error("X and Y out of bounds");
        }

        return status;


    }
    onChildFinish(action){
        let blnFound = false;
        for(let i = 0; i < this.childBatchActions.length; i++){
            if(this.childBatchActions[i].id == action.id){
                this.childBatchActions.splice(i,1);
                blnFound = true;
                break;
            }
        }
        if(!blnFound){
            console.error(this.childBatchActions);
            throw new Error("Could not find childAction:" + action.id);
        }
    }
    run(x, y){
        throw new Error("You must override this: ", x, y);
    }

    addChildBatchAction(action){
        action.stack =  this.stack + 1;
        action.parentAction = this;
        this.childBatchActions.push(action);
    }
}
class AutoSliceBatchAction extends BatchPixelAction{
    constructor(page, spriteGroup){
        super(page);
        this.spriteGroup = spriteGroup;

    }
    run(x,y){

        this.bgColor =  this.bgColor|| this.page.hexToRgb(this.page.state.background_color);
        this.ctx = this.ctx || this.page.canvas.getContext("2d");


        if(!this.page.spriteGroupingMap[x]){
            this.page.spriteGroupingMap[x] = {};
        }
        if(
            !_.isUndefined(this.page.spriteGroupingMap[x]) &&
            !_.isUndefined(this.page.spriteGroupingMap[x][y]) ||
            this.page.spriteGroupingMap[x][y] == -2
        ){
            return;
        }
        let imageData = this.ctx.getImageData(x, y, 1, 1);
        var c = imageData.data;
        if(
            this.page.isTransparent(c)
        ) {
            this.page.spriteGroupingMap[x][y] = -2;
            return;
        }
        //Check pixels before and after

        let spriteGroup = null;
        if(!this.spriteGroup){
            //Create a new sprite group
            spriteGroup = {
                id: this.page.spriteGroups.length,
                pixels: [],
                color: {
                    r: Math.random() * 255,
                    g: Math.random() * 255,
                    b: Math.random() * 255
                },
                tags:[
                    'pixel'
                ]
            }
            this.page.spriteGroups.push(spriteGroup);
        }else{
            spriteGroup = this.spriteGroup;
        }

        spriteGroup.pixels.push({
            x: x,
            y: y
        })

        this.page.spriteGroupingMap[x][y] = spriteGroup.id;
        imageData.data[0] = spriteGroup.color.r;
        imageData.data[1] = spriteGroup.color.g;
        imageData.data[2] = spriteGroup.color.b;
        this.ctx.putImageData(imageData, x, y);

        if(this.stack > this.page.state.max_stack_size){
            return;
        }

        let action = new AutoSliceBatchAction(
            this.page,
            spriteGroup
        );
        action.setDimensions({
            width: this.page.state.sprite_group_range * 2,
            height: this.page.state.sprite_group_range * 2,
            startX: x - this.page.state.sprite_group_range,
            startY: y - this.page.state.sprite_group_range,
        })
        this.addChildBatchAction(
            action
        );


    }
    cleanUp(){
        this.page.resetCanvasWithImage();
    }
}

export default ChaosPixelSlicerPage;