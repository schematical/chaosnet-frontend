import * as tf from "@tensorflow/tfjs";
import * as _ from 'underscore';
class MobileNet_v1_0{

    constructor(options) {
        this.options = _.extend(

            {
                validationSplit: 0.05,
                batchSize: 128,
                initialTransferEpochs: 100,
                fineTuningEpochs: 100,
                logUpdateFreq: 'batch',
                canvasWidth: 224,
                topLayerGroupNames: [ 'conv_pw_11']


            },
            options
        );
        this.options.topLayerName = this.options.topLayerGroupNames[this.options.topLayerGroupNames.length - 1] + `_relu`;
        this.options.labelMultiplier = this.options.labelMultiplier || [this.options.canvasWidth, 1, 1, 1, 1];
        this._listeners = {};
        this.customLossFunction = this.customLossFunction.bind(this);
    }
    build(){

    }
    load(){

    }
    on(eventType, cb){
        this._listeners[eventType] = this._listeners[eventType] || [];
        this._listeners[eventType].push(cb);
    }
    trigger(eventType, event){
        if(!this._listeners[eventType]){
            return;
        }
        this._listeners[eventType].forEach((cb) =>{
            return cb(event);
        })
    }
    async fit(inputImages){

        const tBegin = tf.util.now();
        let tagsDict = {};
        let imageEleDict = {};
        let p = Promise.resolve();
        inputImages.forEach((image)=>{
            p = p.then(()=>{
                return new Promise((resolve) => {
                        const imageEle = new Image();
                        imageEle.onload = ()=>{
                            return resolve(imageEle);
                        }
                        imageEle.src = image.imgSrc;
                    })
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
        inputImages.forEach((image)=>{

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
            loss:  this.customLossFunction, //'categoricalCrossentropy', //
            optimizer: tf.train.rmsprop(5e-3), // tf.train.adam(0.01);
            metrics: ['accuracy']
        });
        model.summary();

        // Initial phase of transfer learning.
        this.log('Phase 1 of 2: initial transfer learning');
        await model.fit(images, targets, {
            epochs: this.options.initialTransferEpochs,
            batchSize: this.options.batchSize,
            validationSplit: this.options.validationSplit,
            callbacks: {

                onEpochEnd: (epoch, logs) => {
                    this.log(
                        `Accuracy: ${(logs.acc * 100).toFixed(1)}% Epoch: ${epoch + 1}`);
                    this.trigger('progress', {
                        phase:'initial',
                        epoch: epoch + 1,
                        percent: Math.round(epoch / this.options.initialTransferEpochs * 100),
                        acc: logs.acc
                    })
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
            loss: this.customLossFunction, //'categoricalCrossentropy', //
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
            epochs: this.options.fineTuningEpochs,
            batchSize: this.options.batchSize / 2,
            validationSplit: this.options.validationSplit,
            callbacks: {

                onEpochEnd: (epoch, logs) => {
                    this.log(
                        `Accuracy: ${(logs.acc * 100).toFixed(1)}% Epoch: ${epoch + 1}`);

                    this.trigger('progress', {
                        phase:'fine',
                        epoch: epoch + 1,
                        percent: Math.round(epoch / this.options.fineTuningEpochs * 100),
                        acc: logs.acc
                    })
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
        //document.querySelector('#console').innerHTML += log + "<br>";
        console.log(log);
    }
    async predict(scaledTestImg){

        const imageTensor = tf.browser.fromPixels(scaledTestImg).cast('float32');
        const images = tf.stack([imageTensor]);
        const modelOut = await this.model.predict(images).data();
        let predictBoundingBox = modelOut.slice(1);
        this.log(JSON.stringify( predictBoundingBox, null, 3));

        tf.util.assert(
            predictBoundingBox != null && predictBoundingBox.length === 4,
            `Expected boundingBoxArray to have length 4, ` +
            `but got ${predictBoundingBox} instead`);

    }




    customLossFunction(yTrue, yPred) {
        return tf.tidy(() => {
            // Scale the the first column (0-1 shape indicator) of `yTrue` in order
            // to ensure balanced contributions to the final loss value
            // from shape and bounding-box predictions.
            return tf.metrics.meanSquaredError(yTrue.mul(this.options.labelMultiplier), yPred);
        });
    }
    async loadTruncatedBase() {
        const mobilenet = await tf.loadLayersModel(
            'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

        // Return a model that outputs an internal activation.
        const fineTuningLayers = [];
        const layer = mobilenet.getLayer(this.options.topLayerName);
        const truncatedBase =
            tf.model({inputs: mobilenet.inputs, outputs: layer.output});
        // Freeze the model's layers.
        console.log("truncatedBase.layers: ", truncatedBase.layers);
        for (const layer of truncatedBase.layers) {
            layer.trainable = false;
            for (const groupName of this.options.topLayerGroupNames) {
                if (layer.name.indexOf(groupName) === 0) {

                    fineTuningLayers.push(layer);
                    break;
                }
            }
        }
        console.log("fineTuningLayers: ", fineTuningLayers);
        tf.util.assert(
            fineTuningLayers.length > 1,
            `Did not find any layers that match the prefixes ${this.options.topLayerGroupNames}`);
        return {truncatedBase, fineTuningLayers};
    }
    /*async buildObjectDetectionModel(options) {
        const {truncatedBase, fineTuningLayers} = await this.loadTruncatedBase();

        // Build the new head model.

        let model = this.state.model;
        if(!model){
            /!* const newHead = await this.buildNewHead(truncatedBase.outputs[0].shape.slice(1));
             const newOutput = newHead.apply(truncatedBase.outputs[0]);
             model = tf.model({inputs: truncatedBase.inputs, outputs: newOutput});*!/



            let inputShape =  [ CANVAS_HEIGHT,CANVAS_WIDTH, 3];
            /!*model = tf.sequential();
            model.add(tf.layers.depthwiseConv2d({
                depthMultiplier: 8,
                kernelSize: [32, 32],
                activation: 'relu',
                inputShape: inputShape,
                dilationRate: 1
            }));

             model.add(tf.layers.maxPooling2d({poolSize: [1, 2], strides: [2, 2]}));
            model.add(tf.layers.flatten());

            model.add(tf.layers.dense({units: 200, activation: 'relu'}));
            // Five output units:
            //   - The first is a shape indictor: predicts whether the target
            //     shape is a triangle or a rectangle.
            //   - The remaining four units are for bounding-box prediction:
            //     [left, right, top, bottom] in the unit of pixels.
            model.add(tf.layers.dense({units: 5}));
            *!/
            model = tf.sequential();
            model.add(tf.layers.flatten({inputShape}));
            model.add(tf.layers.dense({units: 200, activation: 'relu'}));
            // Five output units:
            //   - The first is a shape indictor: predicts whether the target
            //     shape is a triangle or a rectangle.
            //   - The remaining four units are for bounding-box prediction:
            //     [left, right, top, bottom] in the unit of pixels.
            model.add(tf.layers.dense({units: 5}));


        }

        return {model, fineTuningLayers};
    }*/
    /**
     * Builds object-detection model from MobileNet.
     *
     * @returns {[tf.Model, tf.layers.Layer[]]}
     *   1. The newly-built model for simple object detection.
     *   2. The layers that can be unfrozen during fine-tuning.
     */
    async buildObjectDetectionModel() {
        const {truncatedBase, fineTuningLayers} = await this.loadTruncatedBase();

        // Build the new head model.
        const newHead = this.buildNewHead(truncatedBase.outputs[0].shape.slice(1));
        const newOutput = newHead.apply(truncatedBase.outputs[0]);
        let model = tf.model({inputs: truncatedBase.inputs, outputs: newOutput});
        return {model, fineTuningLayers};
    }
    buildNewHead(inputShape) {
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


}
export default MobileNet_v1_0;
