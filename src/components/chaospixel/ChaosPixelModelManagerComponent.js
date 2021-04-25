import React, {Component} from "react";
import MobileNet_v1_0 from "../../services/model_helper/MobileNet_v1_0";



class ChaosPixelModelManagerComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            page: props.page,

        }

        this.onModelUpload = this.onModelUpload.bind(this);
        this.onLoadFromUploadClick = this.onLoadFromUploadClick.bind(this);
    }

    componentDidMount(){




    }
    async onModelUpload(e){
        const uploadJSONInput = document.getElementById('modelLoader');
        const uploadWeightsInput = document.getElementById('weightLoader');
        console.log("uploadWeightsInput.files[0]: ", uploadWeightsInput.files[0]);
        this.state.page.state.modelHelper.setModelFromData(
            uploadJSONInput.files[0],
            uploadWeightsInput.files[0]
        );
        /* const model = await tf.loadLayersModel(
             tf.io.browserFiles(
                 [
                     uploadJSONInput.files[0],
                     uploadWeightsInput.files[0]
                 ]
             )
         );
         this.setState({
             model: model
         })*/
    }
    onStartClick(e){
        e.preventDefault();
        this.state.modelHelper.fit(
            this.state.page.getDataSet()
        )
    }
    onLoadFromUploadClick(e) {
        e.preventDefault();
        this.setState({
            mode: 'LOAD_UPLOAD'
        })
    }
    render() {


        return (

            /*<div className="col-xl-3 col-md-3 mb-3 col-sm-12">*/

                <div className="card shadow mb-4">

                    <div className="card-body">

                        <div className="form-group">
                            <div className='btn-group'>
                                {/*<div className="dropdown">
                                    <button
                                        className="btn btn-sm  btn-secondary dropdown-toggle"
                                        type="button" id="dropdownMenuButton"
                                        data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                        Save
                                    </button>
                                    <div className="dropdown-menu"
                                         aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#"
                                           onClick={this.onSaveClick}>Save in
                                            Browser</a>
                                        <a className="dropdown-item" href="#"
                                           onClick={this.onDownloadClick}>Download</a>
                                        <a className="dropdown-item" href="#"
                                           onClick={this.onSaveToServerClick}>Save to
                                            Server</a>
                                    </div>
                                </div>*/}

                                <div className="dropdown">
                                    <button
                                        className="btn btn-sm  btn-secondary dropdown-toggle"
                                        type="button" id="dropdownMenuButton"
                                        data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                        Load Model
                                    </button>
                                    <div className="dropdown-menu"
                                         aria-labelledby="dropdownMenuButton">

                                        <a className="dropdown-item" href="#"
                                           onClick={this.onLoadFromUploadClick}>Upload</a>
                                    </div>
                                </div>


                            </div>
                        </div>
                        {
                            this.state.mode === 'LOAD_UPLOAD' &&
                            <div className="form-group">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Upload Model </label>
                                    <input type="file" id="modelLoader" name="modelLoader"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Upload Weight </label>
                                    <input type="file" id="weightLoader" name="weightLoader"/>
                                </div>
                                <button className="btn btn-info" onClick={this.onModelUpload}>Load Model</button>

                            </div>
                        }
                    </div>
                </div>
           /* </div>*/

        );
    }


}
export  default  ChaosPixelModelManagerComponent;
