import React, {Component} from "react";
import MobileNet_v1_0 from "../../services/model_helper/MobileNet_v1_0";



class ChaosPixelTrainProgressComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            page: props.page,
            modelHelper: new MobileNet_v1_0(),
            progress:{
                'initial':{
                    percent: 0
                },
                'fine':{
                    percent: 0
                }
            },
            acc: 0
        }
        this.state.modelHelper.on('progress', this.onProgress.bind(this));

        this.onStartClick = this.onStartClick.bind(this);

    }

    componentDidMount(){




    }
    onStartClick(e){
        e.preventDefault();
        this.state.modelHelper.fit(
            this.state.page.getDataSet()
        )
    }
    onProgress(e){
        const progress = this.state.progress;
        progress[e.phase] = e;
        console.log("progress: ", progress);
        this.setState({
            acc: Math.round(e.acc * 100),
            progress: progress
        })
    }
    render() {


        return (

                <div className="col-xl-8 col-lg-8  col-md-8">
                    {/*<div className='sticky'>*/}
                        <div className="card shadow mb-4" >
                            <div className="card-header py-3">
                                <div className="dropdown">
                                    <button className="btn btn-sm  btn-secondary dropdown-toggle"
                                            type="button" id="dropdownMenuButton"
                                            data-toggle="dropdown" aria-haspopup="true"
                                            aria-expanded="false">
                                        Train
                                    </button>
                                    <div className="dropdown-menu"
                                         aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#" onClick={this.onStartClick}>Start</a>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">

                                <div className="progress">
                                    {
                                        this.state.progress.fine.percent !== 0 &&
                                        <div className="progress-bar bg-success" role="progressbar" style={{width: (this.state.progress.fine.percent) +  '%'}} aria-valuenow={this.state.progress.fine.percent}
                                             aria-valuemin="0" aria-valuemax="100">
                                            Epoch: {(this.state.progress.fine.epoch)} - {(this.state.progress.fine.percent)} %
                                        </div>
                                    }
                                </div>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width:(this.state.progress.initial.percent) + '%'}} aria-valuenow={this.state.progress.initial.percent}
                                         aria-valuemin="0" aria-valuemax="100">
                                        Fine Tuning - Epoch: {(this.state.progress.initial.epoch)} - {(this.state.progress.initial.percent)}%
                                    </div>
                                </div>
                                <div className="progress">
                                    <div className="progress-bar  bg-info" role="progressbar" style={{width:this.state.acc + '%'}}
                                         aria-valuenow={this.state.acc} aria-valuemin="0" aria-valuemax="100">
                                        Accuracy: { this.state.acc } %
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/*</div>*/}
                </div>

        );
    }

}
export  default  ChaosPixelTrainProgressComponent;
