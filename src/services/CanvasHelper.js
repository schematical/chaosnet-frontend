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
        this.options.scale = this.options.scale || 1;
        this.options.previewScale = this.options.previewScale || 8;
        if(!this.options.canvasWidth){
            throw new Error("Missing `canvasWidth`");
        }
        if(!this.options.canvasHeight){
            throw new Error("Missing `canvasHeight`");
        }
        this.canvas = this.options.canvas;
        this.canvas.onmousemove = this.onCanvasMouseMove.bind(this);
        this.canvas.onmousedown = this.onCanvasMouseDown.bind(this);
        this.canvas.onmouseup = this.onCanvasMouseUp.bind(this);

        this.canvas.width = this.options.canvasWidth * this.options.scale;
        this.canvas.height = this.options.canvasHeight * this.options.scale;

        const ctx = this.canvas.getContext('2d');
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;
        this.state = {
            mouseIsDown: false,
            mouseDownPos: null
        }
        this._listeners = {};
    }
    applyScaleToBBox(bbox, scale){
        scale = scale || this.options.scale;
        return [
            bbox[0] * scale,
            bbox[1] * scale,
            bbox[2] * scale,
            bbox[3] * scale
        ]
    }
    setScale(scale){
        this.options.scale = scale;
        this.canvas.width = this.options.canvasWidth * this.options.scale;
        this.canvas.height = this.options.canvasHeight * this.options.scale;
        this.resetCanvasWithImage();
    }
    clearCtxScale(){
        const ctx = this.canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    loadAndShapeImage(imgSrc, options) {
        options = options || {};
        options.goalHeight = options.goalHeight || this.options.canvasHeight;
        options.goalWidth = options.goalWidth || this.options.canvasWidth;
        /*return new Promise((resolve, reject)=>{

            let imageEle = new Image();
            imageEle.onload = ()=>{
                return resolve(imageEle);
            }
            imageEle.src = imgSrc;
        });*/
        return new Promise((resolve, reject)=>{
            const fakeCanvas = document.createElement("canvas");
            document.body.appendChild(fakeCanvas);
            const fakeCtx = fakeCanvas.getContext('2d');

            let imageEle = new Image();
            imageEle.style = `image-rendering: auto;
                image-rendering: crisp-edges;
                image-rendering: pixelated;`;
            imageEle.onload = ()=>{
                let scale = options.goalWidth / imageEle.width;


                fakeCanvas.width = options.goalWidth; //this.options.canvasWidth;
                fakeCanvas.height = options.goalHeight;// this.options.canvasHeight;
                fakeCtx.scale(scale, scale);
                fakeCtx.mozImageSmoothingEnabled = false;
                fakeCtx.webkitImageSmoothingEnabled = false;
                fakeCtx.imageSmoothingEnabled = false;
                fakeCtx.msImageSmoothingEnabled = false;
                fakeCtx.oImageSmoothingEnabled = false;
                console.log("fakeCtx.imageSmoothingEnabled: ", fakeCtx.imageSmoothingEnabled);
                fakeCtx.fillStyle = 'green';
                fakeCtx.fillRect(
                    0,
                    0,
                    options.goalWidth,
                    options.goalHeight
                );
                fakeCtx.drawImage(imageEle,0,0,   imageEle.width, imageEle.height); //width, height); //this.options.canvasWidth, this.options.canvasHeight);//
                fakeCtx.setTransform(1, 0, 0, 1, 0, 0);



                //imageEle.width = width;// this.options.canvasWidth;
                //imageEle.height = height;// this.options.canvasHeight;

                let newImageEle = new Image();
                newImageEle.style = `image-rendering: auto;
                image-rendering: crisp-edges;
                image-rendering: pixelated;`;
                newImageEle.onload = ()=>{

                    document.body.removeChild(fakeCanvas);
                    return resolve(newImageEle);
                }
                newImageEle.src = fakeCanvas.toDataURL('image/bmp',1);


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
        this.state = {
            mouseIsDown: false,
            mouseDownPos: null,
            mouseUpPos: null
        };
        console.log("Setting Image: ", image);
    }

    resetCanvasWithImage(image){
        if(image){

            this.setImage(image);
        }
        if(!this.img){
            return;
        }
        var ctx = this.canvas.getContext('2d');

        let scaledWidth = this.img.width * this.options.scale;
        let scaledHeight =  this.img.height * this.options.scale;

        let drawScale = this.options.canvasWidth / scaledWidth;

     /*   this.canvas.width = scaledWidth;
        this.canvas.height = scaledHeight;*/
        console.log("DRAW SCALE: ", 1/drawScale);
        ctx.scale(1/drawScale, 1/drawScale)
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;
        console.log("ctx.imageSmoothingEnabled", ctx.imageSmoothingEnabled)
        ctx.drawImage(this.img,0,0, this.img.width, this.img.height);//this.img.width,this.img.height );//this.options.canvasWidth, this.options.canvasHeight);//scaledWidth, scaledHeight);//
        this.clearCtxScale();
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
        if(
            !this.state.mouseDownPos ||
            !this.state.mouseUpPos
        ){
            return null;
        }
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
            /*if(
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
                previewCtx.scale(this.options.previewScale, this.options.previewScale);
                previewCtx.putImageData(
                    imageData,
                    0,
                    0,
                    0,
                    0,
                    (mousePos.x - this.state.mouseDownPos.x),
                    (mousePos.y - this.state.mouseDownPos.y)
                );
                previewCtx.scale(1,1)

            }*/
        }
    }
    onCanvasMouseDown(e){
        this.state.mouseIsDown = true;
        let mousePos = this.getMousePos(e)
        this.state.mouseDownPos = mousePos;
        e.mousePos = mousePos;
        this.trigger(CanvasHelper.Events.MOUSE_DOWN, e);

    }
    drawRect(options){
        console.log("OPTIONS", options);
        const ctx = this.canvas.getContext("2d");
        // ctx.scale(1/this.state.scale,1/this.state.scale);
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
        // this.clearCtxScale();
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
