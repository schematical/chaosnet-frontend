import React, {Component} from 'react';
import AuthService from '../services/AuthService';
import SearchbarComponent from './SearchbarComponent';
import {instanceOf} from "prop-types";
import {Cookies, withCookies} from "react-cookie";
import TagTextComponent from "./TagTextComponent";

class SpriteGroupComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            canvas_id: "previewCanvas_" + this.props.spriteGroup.id
        }

        this.handleChange = this.handleChange.bind(this);
        this.removeMe = this.removeMe.bind(this);
        this.onTagAdd = this.onTagAdd.bind(this);
    }
    removeMe(event){
        event.preventDefault();
        for(let i = 0; i < this.props.page.state.selectedSpriteGroups.length; i++){

            if(this.props.page.state.selectedSpriteGroups[i].id == this.props.spriteGroup.id){
                this.props.page.state.selectedSpriteGroups.splice(i, 1);
                this.props.page.setState({
                    selectedSpriteGroups: this.props.page.state.selectedSpriteGroups
                })
                break;
            }
        }
    }


    onTagAdd(spriteGroups){
        if(spriteGroups.length != 1){
            throw new Error("SHould only get one result here");
        }
        this.props.spriteGroup.tags = spriteGroups[0].tags;
        this.setState({
            tags: this.props.spriteGroup.tags
        });

    }
    handleChange(event) {

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
        this.setState({
            canvas_loaded: true
        })
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
                        this.state.canvas_loaded &&
                        <TagTextComponent taggedObjects={[this.props.spriteGroup]} onTagAdd={this.onTagAdd}/>
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

                                <a className="collapse-item" href="#" onClick={this.removeMe}>Remove</a>
                            </div>
                        </div>
                    </div>
                </td>

            </tr>

        );
    }
}

export default SpriteGroupComponent;