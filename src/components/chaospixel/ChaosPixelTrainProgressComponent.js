import React, {Component} from "react";
import CanvasHelper from "../../services/CanvasHelper";

class ChaosPixelTrainProgressComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            page: props.page,
        }


    }

    componentDidMount(){




    }

    render() {


        return (

                <div className="col-xl-8 col-lg-8  col-md-8">
                    <div className='sticky'>
                        <div className="card shadow mb-4" >
                            {/*<div className="card-header py-3">

                            </div>*/}

                            <div className="card-body">
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width: '15%'}} aria-valuenow="15"
                                         aria-valuemin="0" aria-valuemax="100"></div>
                                    <div className="progress-bar bg-success" role="progressbar" style={{width: '30%'}} aria-valuenow="30"
                                         aria-valuemin="0" aria-valuemax="100"></div>
                                    <div className="progress-bar bg-info" role="progressbar" style={{width: '20%'}} aria-valuenow="20"
                                         aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        );
    }

}
export  default  ChaosPixelTrainProgressComponent;
