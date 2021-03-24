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
import * as tf from '@tensorflow/tfjs';
import axios from "axios";



const CANVAS_WIDTH = 320;  // Matches the input size of MobileNet.
const CANVAS_HEIGHT = 240;
// Name prefixes of layers that will be unfrozen during fine-tuning.
// const topLayerGroupNames = ['conv_pw_9', 'conv_pw_10', 'conv_pw_11'];
const topLayerGroupNames = [ 'conv_pw_11'];
// Name of the layer that will become the top layer of the truncated base.
const topLayerName =
    `${topLayerGroupNames[topLayerGroupNames.length - 1]}_relu`;

// Used to scale the first column (0-1 shape indicator) of `yTrue`
// in order to ensure balanced contributions to the final loss value
// from shape and bounding-box predictions.
const LABEL_MULTIPLIER = [CANVAS_WIDTH, 1, 1, 1, 1];
class ChaosPixelTrainPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: true,
            scale: 1,
            images:[],//spriteGroup._component.previewCanvas.toDataURL()
        }
        HTTPService.get(
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
        })
        .catch((err) => {
            let state = {};
            state.error = err;
            this.setState(state);
            console.error("Error: ", err.message);
        });

        this.onTrainClick = this.onTrainClick.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.predictImageBox = this.predictImageBox.bind(this);
        this.handelModel = this.handelModel.bind(this);

    }
    componentDidMount(){


        this.canvasHelper = new CanvasHelper({
            canvas: document.getElementById('predictCanvas'),
            canvasWidth: CANVAS_WIDTH,
            canvasHeight: CANVAS_HEIGHT

        });
        this.canvasHelper.on(CanvasHelper.Events.MOUSE_MOVE, this.onMouseMove);
    }
    async handelModel(e){
        const uploadJSONInput = document.getElementById('modelLoader');
        const uploadWeightsInput = document.getElementById('weightLoader');
        const model = await tf.loadLayersModel(
            tf.io.browserFiles(
            [
                    uploadJSONInput.files[0],
                    uploadWeightsInput.files[0]
                ]
            )
        );
        this.setState({
            model: model
        })
    }
    onMouseMove(e){
       // console.log(e.mousePos)
    }
    async onTrainClick(event){
        const args = {
            numExamples: 2000,
            validationSplit: 0.05,
            batchSize: 128,
            initialTransferEpochs: 100,
            fineTuningEpochs: 100,
            logUpdateFreq: 'batch'
        }
        const tBegin = tf.util.now();
        let tagsDict = {};
        let imageEleDict = {};
        let p = Promise.resolve();
        this.state.images.forEach((image)=>{
            p = p.then(()=>{
                return this.canvasHelper.loadAndShapeImage(image.imgSrc)
                    .then((imageEle)=>{
                        imageEleDict[image.id] = imageEle;
                    });
            })
            image.boxes.forEach((box)=>{
                box.tags.forEach((tag)=>{
                    if(!tagsDict[tag]) {
                        tagsDict[tag] = {
                            tag: tag,
                            id: Object.keys(tagsDict).length
                        }
                    }
                })
            })
        })
        await p;
        //build a Dictionary/list of all the tags

        //Iterate through all the images

        //Iterate foreach image's boxes
        let imageTensors = [];
        let targetTensors = [];
        this.state.images.forEach((image)=>{

            image.boxes.forEach((box)=>{
                box.tags.forEach((tag)=> {
                    let data = tf.tidy(() => {
                        const imageTensor = tf.browser.fromPixels(imageEleDict[image.id]).cast('float32');
                        const shapeClassIndicator = tagsDict[tag].id;
                        const targetTensor =
                            tf.tensor1d([shapeClassIndicator].concat(box.bbox));
                        return {image: imageTensor, target: targetTensor};
                    });
                    imageTensors.push(data.image);
                    targetTensors.push(data.target);
                })
            })
        })
        const images = tf.stack(imageTensors);
        const targets = tf.stack(targetTensors);
        tf.dispose([imageTensors, targetTensors]);



        const {model, fineTuningLayers} = await this.buildObjectDetectionModel({
            classCount: Object.keys(tagsDict).length
        });
        model.compile({
            loss: this.customLossFunction, //  'categoricalCrossentropy',
            optimizer: tf.train.rmsprop(5e-3), // tf.train.adam(0.01);
            metrics: ['accuracy']
        });
        model.summary();

        // Initial phase of transfer learning.
        this.log('Phase 1 of 2: initial transfer learning');
        await model.fit(images, targets, {
            epochs: args.initialTransferEpochs,
            batchSize: args.batchSize,
            validationSplit: args.validationSplit,
            callbacks: {

                onEpochEnd: (epoch, logs) => {
                    this.log(
                        `Accuracy: ${(logs.acc * 100).toFixed(1)}% Epoch: ${epoch + 1}`);

                },
                onTrainEnd: async (logs) => {

                    //const saveResult = await model.save('localstorage://my-model-1');
                    //await model.save('downloads://my-model'); Downloads the file
                    //https://www.tensorflow.org/js/guide/save_load
                    //await model.save('http://model-server.domain/upload')
                    //NodeJS: await model.save('file:///path/to/my-model');
                    this.log("Train End: " + JSON.stringify(logs, null, 3));
                }
            }
        });

        // Fine-tuning phase of transfer learning.
        // Unfreeze layers for fine-tuning.
        for (const layer of fineTuningLayers) {
            layer.trainable = true;
        }
        model.compile({
            loss: this.customLossFunction,
            optimizer: tf.train.rmsprop(2e-3),
            metrics: ['accuracy']
        });
        model.summary();

        // Do fine-tuning.
        // The batch size is reduced to avoid CPU/GPU OOM. This has
        // to do with the unfreezing of the fine-tuning layers above,
        // which leads to higher memory consumption during backpropagation.
        this.log('Phase 2 of 2: fine-tuning phase');
        await model.fit(images, targets, {
            epochs: args.fineTuningEpochs,
            batchSize: args.batchSize / 2,
            validationSplit: args.validationSplit,
            callbacks: {

                onEpochEnd: (epoch, logs) => {
                   this.log(
                        `Accuracy: ${(logs.acc * 100).toFixed(1)}% Epoch: ${epoch + 1}`);

                },
                onTrainEnd: async  (logs) =>{

                    this.log("Train End: " + JSON.stringify(logs, null, 3));
                }
            }
        });
        const saveResult = await model.save('indexeddb://my-model-1');
        this.log(`Model training took ${(tf.util.now() - tBegin) / 1e3} s`);



    }
    log(log){
        document.querySelector('#console').innerHTML += log + "<br>";
        console.log(log);
    }
     customLossFunction(yTrue, yPred) {
        return tf.tidy(() => {
            // Scale the the first column (0-1 shape indicator) of `yTrue` in order
            // to ensure balanced contributions to the final loss value
            // from shape and bounding-box predictions.
            return tf.metrics.meanSquaredError(yTrue.mul(LABEL_MULTIPLIER), yPred);
        });
    }
    async loadTruncatedBase() {
        const mobilenet = await tf.loadLayersModel(
            'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

        // Return a model that outputs an internal activation.
        const fineTuningLayers = [];
        const layer = mobilenet.getLayer(topLayerName);
        const truncatedBase =
            tf.model({inputs: mobilenet.inputs, outputs: layer.output});
        // Freeze the model's layers.
        for (const layer of truncatedBase.layers) {
            layer.trainable = false;
            for (const groupName of topLayerGroupNames) {
                if (layer.name.indexOf(groupName) === 0) {
                    fineTuningLayers.push(layer);
                    break;
                }
            }
        }

        tf.util.assert(
            fineTuningLayers.length > 1,
            `Did not find any layers that match the prefixes ${topLayerGroupNames}`);
        return {truncatedBase, fineTuningLayers};
    }
    async buildObjectDetectionModel(options) {
        const {truncatedBase, fineTuningLayers} = await this.loadTruncatedBase();

        // Build the new head model.

        let model = this.state.model;
        if(!model){
           /* const newHead = await this.buildNewHead(truncatedBase.outputs[0].shape.slice(1));
            const newOutput = newHead.apply(truncatedBase.outputs[0]);
            model = tf.model({inputs: truncatedBase.inputs, outputs: newOutput});*/




            model = tf.sequential();
            model.add(tf.layers.depthwiseConv2d({
                depthMultiplier: 8,
                kernelSize: [32, 32],
                activation: 'relu',
                inputShape: [CANVAS_WIDTH, CANVAS_HEIGHT, 3]
            }));
            model.add(tf.layers.maxPooling2d({poolSize: [1, 2], strides: [2, 2]}));
            model.add(tf.layers.flatten());
            model.add(tf.layers.dense({units: options.classCount, activation: 'softmax'}));



        }

        return {model, fineTuningLayers};
    }
    async buildNewHead(inputShape) {
        const newHead = tf.sequential();
        newHead.add(tf.layers.flatten({inputShape}));
        newHead.add(tf.layers.dense({units: 200, activation: 'relu'}));
        // Five output units:
        //   - The first is a shape indictor: predicts whether the target
        //     shape is a triangle or a rectangle.
        //   - The remaining four units are for bounding-box prediction:
        //     [left, right, top, bottom] in the unit of pixels.
        newHead.add(tf.layers.dense({units: 5}));
        return newHead;
    }

    async handleImage(e){




        let imgSrc = await new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = (event) => {
                return resolve(event.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        });
        await this.predictImageBox(
            {},
            {
                imgSrc: imgSrc
            }
        )
    }




    async predictImageBox(event, image, box){
console.log("event, image, box", event, image, box);

        let scaledTestImg = await this.canvasHelper.loadAndShapeImage(image.imgSrc);

       /* let unscaledTestImg = await new Promise((resolve, reject)=> { //await this.loadAndShapeImage(image.imgSrc);
            let img = new Image();
            img.onload = ()=>{
                return resolve(img);
            }
            img.src = image.imgSrc;
        });*/
        this.canvasHelper.setImage(scaledTestImg);
        this.canvasHelper.resetCanvasWithImage();
        let model = this.state.model;
        /*try {
            model = await tf.loadLayersModel('indexeddb://my-model-1');
            if (model) {
                this.log("Loaded!");
            }
        }catch(err){
            this.log(err.message);
        }*/


        const imageTensor = tf.browser.fromPixels(scaledTestImg).cast('float32');
        const images = tf.stack([imageTensor]);
        const modelOut = await model.predict(images).data();
        let predictBoundingBox = modelOut.slice(1);
        this.log(JSON.stringify( predictBoundingBox, null, 3));

        tf.util.assert(
            predictBoundingBox != null && predictBoundingBox.length === 4,
            `Expected boundingBoxArray to have length 4, ` +
            `but got ${predictBoundingBox} instead`);


        /*
                let left = predictBoundingBox[0];
                let right = predictBoundingBox[1];
                let top = predictBoundingBox[2];
                let bottom =redictBoundingBox[3];

               /* ctx.beginPath();
                ctx.lineWidth = "2";
                ctx.strokeStyle = "red";
                ctx.moveTo(left, top);
                ctx.lineTo(right, top);
                ctx.lineTo(right, bottom);
                ctx.lineTo(left, bottom);
                ctx.lineTo(left, top);
                ctx.stroke();*/
        predictBoundingBox = this.canvasHelper.applyScaleToBBox(predictBoundingBox);
        this.canvasHelper.drawRect({
            lineWidth: "2",
            strokeStyle: "blue",
            bbox:predictBoundingBox
        })

        if(!box){
            return;
        }

        this.log(JSON.stringify( box.bbox, null, 3));
        this.canvasHelper.drawRect({
            lineWidth: "2",
            strokeStyle: "green",
            bbox: this.canvasHelper.applyScaleToBBox(box.bbox)
        })


    }
    getBoxButtons() {

        return [
            {
                text:'Predict',
                onClick: this.predictImageBox
            }
        ]
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
                                            <div className="col-xl-3 col-md-3 mb-3 col-sm-12">

                                                <div className="card shadow mb-4">

                                                    <div className="card-body">



                                                        <div className="form-group">


                                                            <div className="form-group">
                                                                <label htmlFor="exampleInputEmail1">Upload Model </label>
                                                                <input type="file" id="modelLoader" name="modelLoader"   multiple/>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="exampleInputEmail1">Upload Weight </label>
                                                                <input type="file" id="weightLoader" name="weightLoader" onChange={this.handelModel}  multiple/>
                                                            </div>
                                                            <button className="btn btn-info" onClick={this.handelModel}>Load Model</button>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">



                                                        <div className="form-group">

                                                            <button className="btn btn-info" onClick={this.onTrainClick}>Train</button>
                                                            <div className="form-group">
                                                                <label htmlFor="exampleInputEmail1">Upload Image </label>
                                                                <input type="file" id="imageLoader" name="imageLoader" onChange={this.handleImage}/>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card shadow mb-4">

                                                    <div className="card-body">
                                                        {
                                                            this.state.images.map((image) => {
                                                                return <div>
                                                                    <h3>
                                                                        <a href="#" onClick={(e)=>{  e.preventDefault(); this.onSelectImage(image); }}>Image {image.id}</a>
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
                                        }
                                        <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                                            <div className="card shadow mb-4">
                                                <div className="card-header py-3">
                                                    <h1 className="h3 mb-0 text-gray-800">Box</h1>
                                                </div>

                                                <div className="card-body">
                                                    <canvas id="predictCanvas" height={CANVAS_WIDTH} width={CANVAS_WIDTH}></canvas>
                                                    <div id='console'>
Waiting...
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

export default ChaosPixelTrainPage;
