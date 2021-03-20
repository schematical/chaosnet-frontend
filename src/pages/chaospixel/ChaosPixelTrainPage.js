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



const CANVAS_SIZE = 224;  // Matches the input size of MobileNet.

// Name prefixes of layers that will be unfrozen during fine-tuning.
const topLayerGroupNames = ['conv_pw_9', 'conv_pw_10', 'conv_pw_11'];

// Name of the layer that will become the top layer of the truncated base.
const topLayerName =
    `${topLayerGroupNames[topLayerGroupNames.length - 1]}_relu`;

// Used to scale the first column (0-1 shape indicator) of `yTrue`
// in order to ensure balanced contributions to the final loss value
// from shape and bounding-box predictions.
const LABEL_MULTIPLIER = [CANVAS_SIZE, 1, 1, 1, 1];
class ChaosPixelTrainPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: true,
            scale: 1,
            images:[],//spriteGroup._component.previewCanvas.toDataURL()
        }
        const strData = localStorage.getItem('chaospixel:images');
        if(strData){
            this.state.images = JSON.parse(strData);
        }

        this.onTrainClick = this.onTrainClick.bind(this);
        this.onPredictClick = this.onPredictClick.bind(this);


    }
    componentDidMount(){

    }
    async onTrainClick(event){
        const args = {
            numExamples: 2000,
            validationSplit: 0.15,
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
                return this.loadAndShapeImage(image)
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
                        const imageTensor = tf.browser.fromPixels(imageEleDict[image.id]);
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



        const {model, fineTuningLayers} = await this.buildObjectDetectionModel();
        model.compile({loss: this.customLossFunction, optimizer: tf.train.rmsprop(5e-3)});
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
        model.compile({loss: this.customLossFunction, optimizer: tf.train.rmsprop(2e-3)});
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
        // TODO(cais): Add unit test.
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
    async buildObjectDetectionModel() {
        const {truncatedBase, fineTuningLayers} = await this.loadTruncatedBase();

        // Build the new head model.
        const newHead = await this.buildNewHead(truncatedBase.outputs[0].shape.slice(1));
        const newOutput = newHead.apply(truncatedBase.outputs[0]);
        const model = tf.model({inputs: truncatedBase.inputs, outputs: newOutput});

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
    async onPredictClick(e){
        let model = null;
        try {
            model = await tf.loadLayersModel('indexeddb://my-model-1');
            if (model) {
               this.log("Loaded!");
            }
        }catch(err){
           this.log(err.message);
        }
        const imageEle = await this.loadAndShapeImage(this.state.images[0])

        const imageTensor = tf.browser.fromPixels(imageEle);
        const images = tf.stack([imageTensor]);
        const modelOut = await model.predict(images).data();
        this.log(JSON.stringify(modelOut));
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



                                                        <div className="form-group">

                                                            <button className="btn btn-info" onClick={this.onTrainClick}>Train</button>
                                                            <button className="btn btn-info" onClick={this.onPredictClick}>Predict</button>
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
                                                </div>

                                                <div className="card-body">
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

    loadAndShapeImage(image) {
        return new Promise((resolve, reject)=>{
            const fakeCanvas = document.createElement("canvas");
            const fakeCtx = fakeCanvas.getContext('2d');
            let imageEle = new Image();
            imageEle.onload = ()=>{


                fakeCanvas.height = CANVAS_SIZE;
                fakeCanvas.width = CANVAS_SIZE;
                document.body.appendChild(fakeCanvas);
                fakeCtx.drawImage(
                    imageEle,
                    0,
                    0,
                    CANVAS_SIZE,
                    CANVAS_SIZE
                );
                imageEle.onload = ()=>{

                    document.body.removeChild(fakeCanvas);
                    return resolve(imageEle);
                }
                imageEle.src = fakeCanvas.toDataURL();
                imageEle.height = CANVAS_SIZE;
                imageEle.width = CANVAS_SIZE;

            }
            imageEle.src = image.imgSrc;
        });
    }
}

export default ChaosPixelTrainPage;
