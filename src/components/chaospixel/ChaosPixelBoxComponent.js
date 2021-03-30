import React, {Component} from "react";
import CanvasHelper from "../../services/CanvasHelper";

class ChaosPixelBoxComponent extends Component {


    constructor(props) {
        super(props);

        this.state = {
            id: "canvas_" + Math.floor(Math.random() * 9999),
            box: props.box,
            image: props.image,
            page: props.page,
            buttons: props.buttons || []
        }

    }

    componentDidMount(){
        this.canvas = document.getElementById(this.state.id)
        const ctx = this.canvas.getContext('2d');
        const fakeCanvas = document.createElement("canvas");
        const fakeCtx = fakeCanvas.getContext('2d');

        let img = new Image();
        let _this = this;
        img.onload = ()=>{
            fakeCanvas.height = img.height;
            fakeCanvas.width = img.width;
            document.body.appendChild(fakeCanvas);
            fakeCtx.drawImage(
                img,
                0, //_this.state.box.bbox[0] * -1,
                0, // _this.state.box.bbox[1] * -1,

               //  img.width,
                // img.height,
            );
            const imageData = fakeCtx.getImageData(
                _this.state.box.bbox[0],
                _this.state.box.bbox[1],
                _this.state.box.bbox[2],
                _this.state.box.bbox[3],
            );
            ctx.putImageData(
                imageData,
                0,
                0
            );
            document.body.removeChild(fakeCanvas);

        }

        img.src = this.state.image.imgSrc;

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
                <td>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle"
                                type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                            Options
                        </button>
                        <div className="dropdown-menu"
                             aria-labelledby="dropdownMenuButton">
                            {
                                this.state.buttons.map((button) => {
                                    return   <a className="dropdown-item" href="#" onClick={(event => {
                                        event.preventDefault();
                                        button.onClick(
                                            event,
                                            this.state.image,
                                            this.state.box,
                                            this
                                        );
                                    })}>{button.text}</a>
                                })
                            }
                        </div>
                    </div>


                </td>
            </tr>
        );
    }

}
export  default  ChaosPixelBoxComponent;
