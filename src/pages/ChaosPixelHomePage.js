import React, {Component} from 'react';
import _ from 'underscore';
import SidebarComponent from '../components/SidebarComponent';
import TopbarComponent from '../components/TopbarComponent';
class ChaosPixelHomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: 16,
            width:16,
            background_color: "#ffffff",
            sprite_group_range: 3
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.drawSliceLines = this.drawSliceLines.bind(this);
        this.onCanvasMouseMove = this.onCanvasMouseMove.bind(this);
        this.autosliceSpriteGroup = this.autosliceSpriteGroup.bind(this);
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
            ctx.stroke();
        }
        for(let y = 0; y < this.img.height; y += this.state.height){
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.img.width,y);
            ctx.stroke();
        }


    }
    onCanvasMouseMove(e){
        if(!this.canvas){
            this.canvas  = document.getElementById('imageCanvas');
        }
        let mousePos = this.getMousePos(e);
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
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
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
        let bgColor = this.hexToRgb(this.state.background_color);
        let ctx = this.canvas.getContext("2d");
        this.spriteGroupingMap = {};
        this.spriteGroups = [];
        for(let x = 0; x < this.img.width; x ++){
            for(let y = 0; y < this.img.height; y ++){
               this.checkSpriteGroupPixel(x,y, ctx, bgColor, -1);
            }
        }
    }
    checkSpriteGroupPixel(x, y, ctx, bgColor, spriteGroupIndex){
        //console.log("checkSpriteGroupPixel: ", spriteGroupIndex);
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
            bgColor.r == c[0] &&
            bgColor.g == c[1] &&
            bgColor.b == c[2]
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
                }
            }
            this.spriteGroups.push(spriteGroup);
        }else{
            spriteGroup = this.spriteGroups[spriteGroupIndex];
        }
        console.log(x + ',' + y, spriteGroupIndex, this.rgbToHex(c[0], c[1], c[2]), spriteGroup);
        spriteGroup.pixels.push({
            x: x,
            y: y
        })

        this.spriteGroupingMap[x][y] = spriteGroup.id;
        imageData.data[0] = spriteGroup.color.r;
        imageData.data[1] = spriteGroup.color.g;
        imageData.data[2] = spriteGroup.color.b;
        ctx.putImageData(imageData, x, y);


        for(let _x = x - this.state.sprite_group_range; _x < x + this.state.sprite_group_range; _x++){

            for(let _y = y - this.state.sprite_group_range; _y < y + this.state.sprite_group_range; _y++){

                //if(!this.spriteGroupingMap[_x][_y]){
                //console.log("Checking: ", spriteGroup.id);
                   this.checkSpriteGroupPixel(_x, _y, ctx, bgColor, spriteGroup.id);
                //}
            }
        }

    }
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
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
                                                                <label htmlFor="exampleInputEmail1">Background Color</label>
                                                                <input type="color" name="background_color" placeholder="Background Color" value={this.state.background_color} onChange={this.handleChange} />
                                                                <input type="button" className="btn btn-danger btn-lg" onClick={this.drawSliceLines} value="Set Background Color" />
                                                            </div>

                                                            <div className="form-group">
                                                                <label htmlFor="exampleInputEmail1">Sprite Height </label>
                                                                <input type="number" name="height" placeholder="Height" value={this.state.height} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="exampleInputEmail1">Sprite Width </label>
                                                                <input type="number" name="width" placeholder="Width" value={this.state.width} onChange={this.handleChange} />
                                                            </div>
                                                            <input type="button" className="btn btn-danger btn-lg" onClick={this.drawSliceLines} value="Splice" />



                                                            <input type="button" className="btn btn-danger btn-lg" onClick={this.autosliceSpriteGroup} value="Auto Slice" />


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
                                                        <canvas id="imageCanvas" onMouseMove={this.onCanvasMouseMove}></canvas>
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