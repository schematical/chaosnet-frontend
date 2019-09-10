import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import SearchbarComponent from './SearchbarComponent';
import {instanceOf} from "prop-types";
import {Cookies, withCookies} from "react-cookie";
const axios = require('axios');

class TrainingDataComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            canvas_id: "previewCanvas_" + this.props.trainingData.namespace
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        //console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }
    setupPreview(){

        this.state.loading = true;
        return axios.get('https://chaosnet.schematical.com/v0/' + AuthService.userData.username + '/trainingdatas/' + this.props.trainingData.namespace, {
            headers: {
                "Authorization": AuthService.accessToken
            }
        })
            .then((response) => {
                console.log("Loaded: ", response.data);
                this.state.trainingdatas = response.data;
                this.setState(this.state);
                return axios.get('https://chaosnet.schematical.com/v0/' + AuthService.userData.username + '/trainingdatas/' + this.props.trainingData.namespace + "/media", {
                    headers: {
                        "Authorization": AuthService.accessToken
                    },
                    responseType: 'arraybuffer'

                })
            })
            .then((response) => {
                this.img = new Image();
                var reader = new window.FileReader();
                this.img.src =  "data:image/png;base64," + new Buffer(response.data, 'binary').toString('base64');
                this.img.onload = ()=> {

                    this.canvas = document.getElementById(this.state.canvas_id);


                    let zoom = 5;
                    this.canvas.width = this.img.width * zoom;
                    this.canvas.height = this.img.height * zoom;
                    let ctx = this.canvas.getContext("2d");
                    ctx.imageSmoothingEnabled= false
                    let scaledWidth = this.img.width * zoom;
                    let scaledHeight = this.img.height * zoom;
                    this.canvas.width = scaledWidth;
                    this.canvas.height = scaledHeight;
                    console.log(this.img.width, this.img.height, "CANVAS: ", this.canvas.width, this.canvas.height);

                    let tmpCanvas = document.getElementById(this.state.canvas_id + "_tmp");
                    tmpCanvas.width =this.img.width;
                    tmpCanvas.height =this.img.height;
                    let tmpCtx = tmpCanvas.getContext("2d");
                    tmpCtx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
                    for(let x = 0; x < this.img.width; x++){
                        for(let y = 0; y < this.img.height; y++){
                            let imageData = tmpCtx.getImageData(x, y, 1, 1);

                            for(let yy = y * zoom; yy < ((y+ 1) * zoom); yy++) {
                                for (let xx = x * zoom; xx < ((x + 1) * zoom); xx++) {
                                    ctx.putImageData(imageData, xx, yy);
                                }
                            }
                        }
                    }

                    //
                }

            })
            .catch((err) => {
                console.error("Error: ", err.message);
            })

    }
    render() {
        if(!this.state.loading){
            setTimeout(()=>{

                this.setupPreview();
            }, 100);
        }

        return (

            <tr>
                <th scope="row">{this.props.trainingData.id}</th>
                <td>
                    <canvas id={this.state.canvas_id} ></canvas>
                </td>
                <td>
                    <canvas id={this.state.canvas_id + "_tmp"} ></canvas>
                </td>
                <td>
                    {
                        this.props.trainingData.tags && this.props.trainingData.tags.map((tag)=>{
                            return <span className="badge badge-pill badge-primary">{tag}</span>
                        })
                    }
                    {
                        this.state.show_add_tag ?
                        <div className="input-group">
                            <input type="text" name="new_tag_name" placeholder="Tag" value={this.state.new_tag_name} onChange={this.handleChange} />
                            <button className="btn btn-danger  btn-sm" onClick={this.onSaveTag} >Add Tag</button>
                        </div>
                        :
                        <span className="badge badge-pill badge-secondary" onClick={this.onAddTag}>Add</span>

                    }

                </td>
                <td>
                    <div className="dropdown">
                        <a className="btn btn-sm btn-secondary nav-link collapsed" href="#" data-toggle="collapse"
                           data-target={"#spriteGroup_" + this.props.trainingData.namespace} aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-cog"/>
                            <span>Options</span>
                        </a>
                        <div id={"spriteGroup_" + this.props.trainingData.namespace} className="collapse" aria-labelledby="headingTwo"
                             data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">ChaosPixel:</h6>
                                <a className="collapse-item" href="/chaospixel">Slicer</a>
                            </div>
                        </div>
                    </div>
                </td>

            </tr>

        );
    }
}

export default TrainingDataComponent;