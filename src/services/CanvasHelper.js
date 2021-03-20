import * as _ from "underscore";

class CanvasHelper{
    static get Events(){
        return {
            MOUSE_MOVE: 'MOUSE_MOVE',
            MOUSE_UP: 'MOUSE_UP',
            MOUSE_DOWN: 'MOUSE_DOWN',
            RESET_DRAW: 'RESET_DRAW'
        };
    }
    static get Mode(){
        return {
            BOX_SELECT: 'BOX_SELECT',
        };
    }
    constructor(options) {
        this.options = options || {};
        if(!this.options.canvas){
            throw new Error("Missing `canvas` argument");
        }
        this.options.scale = this.options.scale || 2;
        if(!this.options.canvasSize){
            throw new Error("Missing `canvasSize`");
        }
        this.canvas = this.options.canvas;
        this.canvas.onmousemove = this.onCanvasMouseMove.bind(this);
        this.canvas.onmousedown = this.onCanvasMouseDown.bind(this);
        this.canvas.onmouseup = this.onCanvasMouseUp.bind(this);
        console.log("this.canvas", this.canvas);
        this.state = {
            mouseIsDown: false,
            mouseDownPos: null
        }
        this._listeners = {};
    }
    applyScaleToBBox(bbox){
        return [
            bbox[0] * this.options.scale,
            bbox[1] * this.options.scale,
            bbox[2] * this.options.scale,
            bbox[3] * this.options.scale
        ]
    }
    loadAndShapeImage(imgSrc) {
        return new Promise((resolve, reject)=>{
            const fakeCanvas = document.createElement("canvas");
            const fakeCtx = fakeCanvas.getContext('2d');
            let imageEle = new Image();
            imageEle.onload = ()=>{


                fakeCanvas.height = this.options.canvasSize;
                fakeCanvas.width = this.options.canvasSize;
                fakeCtx.fillStyle = 'green';
                fakeCtx.fillRect(0, 0, this.options.canvasSize, this.options.canvasSize);
                document.body.appendChild(fakeCanvas);
                fakeCtx.drawImage(
                    imageEle,
                    0,
                    0,
                    this.options.canvasSize,
                    this.options.canvasSize
                );
                imageEle.onload = ()=>{

                    document.body.removeChild(fakeCanvas);
                    return resolve(imageEle);
                }
                imageEle.src = fakeCanvas.toDataURL();
                imageEle.height = this.options.canvasSize;
                imageEle.width = this.options.canvasSize;

            }
            imageEle.src = imgSrc;
        });
    }
    on(eventKey, cb){
        this._listeners[eventKey] = this._listeners[eventKey] || [];
        this._listeners[eventKey].push(cb);
    }
    trigger(eventKey, event){
        if(
            !this._listeners[eventKey]
        ){
            return;
        }
        this._listeners[eventKey].forEach((listener)=>{
            listener(event);
        })
    }

    setImage(image){
        this.img = image;
    }

    resetCanvasWithImage(image){
        if(image){
            this.setImage(image);
        }
        var ctx = this.canvas.getContext('2d');
        let scaledWidth = this.img.width * this.options.scale;
        let scaledHeight = this.img.height * this.options.scale;
        this.canvas.width = scaledWidth;
        this.canvas.height = scaledHeight;
        ctx.drawImage(this.img,0,0, scaledWidth, scaledHeight);
        let imageData = ctx.getImageData(0, 0, 1, 1);

        this.options.background_color = this.rgbToHex(
            imageData.data[0],
            imageData.data[1],
            imageData.data[2]
        );

    }
    isTransparent(c){
        let bgColor = this.hexToRgb(this.options.background_color);
        let rMin = c[0] - this.options.background_color_range;
        let rMax = c[0] + this.options.background_color_range;

        if(
            bgColor.r > rMin &&
            bgColor.r < rMax &&
            bgColor.g > c[1] - this.options.background_color_range  &&
            bgColor.g < c[1] + this.options.background_color_range &&
            bgColor.b > c[2] - this.options.background_color_range  &&
            bgColor.b < c[2] + this.options.background_color_range
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
        return hex.length === 1 ? "0" + hex : hex;
    }
    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    getBBox(){
        return [
            this.state.mouseDownPos.x / this.options.scale,
            this.state.mouseDownPos.y / this.options.scale,
            (this.state.mouseUpPos.x - this.state.mouseDownPos.x) / this.options.scale,
            (this.state.mouseUpPos.y - this.state.mouseDownPos.y) / this.options.scale
        ];
    }
    onCanvasMouseMove(e){

        let mousePos = this.getMousePos(e)
        this.state.mousePos = mousePos;
        e.mousePos = mousePos;
        this.trigger(CanvasHelper.Events.MOUSE_MOVE, e);
        if(
            this.options.mode == CanvasHelper.Mode.BOX_SELECT &&
            this.state.mouseIsDown
        ){
            this.resetCanvasWithImage();

            this.drawRect({
                bbox:[
                    this.state.mouseDownPos.x,
                    this.state.mouseDownPos.y,
                    mousePos.x - this.state.mouseDownPos.x,
                    mousePos.y - this.state.mouseDownPos.y
                ]
            })
            if(
                this.options.previewCanvas &&
                mousePos.x - this.state.mouseDownPos.x > 0 &&
                mousePos.y - this.state.mouseDownPos.y > 0
            ){
                const ctx = this.canvas.getContext('2d');
                const previewCtx = this.options.previewCanvas.getContext('2d');

                let imageData = ctx.getImageData(
                    this.state.mouseDownPos.x,
                    this.state.mouseDownPos.y,
                    mousePos.x - this.state.mouseDownPos.x,
                    mousePos.y - this.state.mouseDownPos.y
                );

                previewCtx.clearRect(0, 0, this.options.previewCanvas.width, this.options.previewCanvas.height);
                previewCtx.putImageData(
                    imageData,
                    0,
                    0
                );


            }
        }
    }
    onCanvasMouseDown(e){
        console.log("MOUSE DOWN");
        this.state.mouseIsDown = true;
        let mousePos = this.getMousePos(e)
        this.state.mouseDownPos = mousePos;
        e.mousePos = mousePos;
        this.trigger(CanvasHelper.Events.MOUSE_DOWN, e);

    }
    drawRect(options){
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = options.lineWidth || "2";
        ctx.strokeStyle = options.strokeStyle ||   "red";
        ctx.rect(
            options.bbox[0],
            options.bbox[1],
            options.bbox[2],
            options.bbox[3]
        );
        ctx.stroke();
    }
    eachPixel(fun, options){
        options = options || {};
        options.startY = options.startY || 0;
        options.startX = options.startX || 0;
        options.endY = options.endY || this.canvas.height;
        options.endX = options.endX || this.canvas.width;
        for(let y = options.startY ; y < options.endY; y ++){
            for(let x = options.startX; x <  options.endX; x ++){
                fun(x, y, options);
            }
        }
    }
    onCanvasMouseUp(e){
        this.state.mouseUpPos = this.getMousePos(e);
        this.state.mouseIsDown = false;
        let mousePos = this.getMousePos(e)
        e.mousePos = mousePos;
        this.trigger(CanvasHelper.Events.MOUSE_UP, e);
    }
    getMousePos( evt) {
        var rect = this.canvas.getBoundingClientRect();
        let response = {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top),
            bounds:{}
        };
       /* for(let x = 0; x < this.img.width; x += this.options.width){
            if(
                response.x >= x &&
                response.x < x + this.options.width
            ){
                response.bounds.xMin = x;
                response.bounds.xMax = x + this.options.width;
                break;
            }
        }
        for(let y = 0; y < this.img.height; y += this.options.height){
            if(
                response.y >= y &&
                response.y < y + this.options.height
            ){
                response.bounds.yMin = y;
                response.bounds.yMax = y + this.options.height;
                break;
            }
        }*/


        return response;
    }
}
export default CanvasHelper;
