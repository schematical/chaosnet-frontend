import React, {Component} from "react";
import CanvasHelper from "../../services/CanvasHelper";

class ChaosPixelBoxComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: "canvas_" + Math.floor(Math.random() * 9999),
            box: props.box
        }

    }
    componentDidMount(){
        this.canvas = document.getElementById(this.state.id)
        const ctx = this.canvas.getContext('2d');
        ctx.putImageData(
            this.state.box.previewImageData,
            0,
            0
        );
    }
    render() {


        return (

            <tr>

                <td>
                    <canvas id={this.state.id}  height={32} width={32}></canvas>
                </td>
                <td>
                    <span className="badge badge-pill badge-info">
                    {this.state.box.tags.join(", ")}
                    </span>
                    {/*{
                        this.state.box.tags.map((tag) => {
                            return  <span className="badge badge-pill badge-info">{{tag}}</span>
                        })
                    }*/}
                </td>
            </tr>
        );
    }

}
export  default  ChaosPixelBoxComponent;
