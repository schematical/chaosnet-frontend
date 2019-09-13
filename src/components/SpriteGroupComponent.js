import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import SearchbarComponent from './SearchbarComponent';
import {instanceOf} from "prop-types";
import {Cookies, withCookies} from "react-cookie";

class SpriteGroupComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            canvas_id: "previewCanvas_" + this.props.spriteGroup.id
        }
        this.onAddTag = this.onAddTag.bind(this);
        this.onSaveTag = this.onSaveTag.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    onAddTag(){
        this.setState({
            show_add_tag: true
        })
    }
    onSaveTag(){
        this.props.spriteGroup.tags.push(this.state.new_tag_name);
        this.setState({
            show_add_tag: false
        })
    }
    handleChange(event) {
        //console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }
    setupPreview(){

        this.previewCanvas = document.getElementById(this.state.canvas_id);
        this.props.spriteGroup._component = this;
        //draw to new canvas
        let xMin = -1;
        let xMax = -1;
        let yMin = -1;
        let yMax = -1;
        this.props.spriteGroup.pixels.forEach((pixelPos)=>{
            if(
                pixelPos.x < xMin ||
                xMin == -1
            ){
                xMin = pixelPos.x;
            }
            if(
                pixelPos.y < yMin ||
                yMin == -1
            ){
                yMin = pixelPos.y;
            }

            if(
                pixelPos.x > xMax ||
                xMax == -1
            ){
                xMax = pixelPos.x;
            }
            if(
                pixelPos.y > yMax ||
                yMax == -1
            ){
                yMax = pixelPos.y;
            }
        })
        let zoom = this.props.page.state.zoom;
        this.previewCanvas.width = (xMax - xMin) * zoom;
        this.previewCanvas.height = (yMax - yMin) * zoom;
        let previewCtx = this.previewCanvas.getContext("2d");

        let ctx = this.props.page.canvas.getContext("2d");
        this.props.spriteGroup.pixels.forEach((pixelPos)=> {
            let imageData = ctx.getImageData(pixelPos.x, pixelPos.y, 1, 1);
            let startX = pixelPos.x - xMin;
            let startY = pixelPos.y - yMin;
            for(let y = startY * zoom; y < ((startY+ 1) * zoom); y++) {
                for (let x = startX * zoom; x < ((startX + 1) * zoom); x++) {
                    previewCtx.putImageData(imageData, x, y);
                }
            }

        });
    }
    componentDidMount() {
        this.setupPreview();
    }
    render() {

        return (

            <tr>
                <th scope="row">{this.props.spriteGroup.id}</th>
                <td>
                    <canvas id={this.state.canvas_id} ></canvas>
                </td>
                <td>
                    {
                        this.props.spriteGroup.tags.map((tag)=>{
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
                           data-target={"#spriteGroup_" + this.props.spriteGroup.id} aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-cog"/>
                            <span>Options</span>
                        </a>
                        <div id={"spriteGroup_" + this.props.spriteGroup.id} className="collapse" aria-labelledby="headingTwo"
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

export default SpriteGroupComponent;