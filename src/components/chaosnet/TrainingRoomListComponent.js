import React, {Component} from 'react';
import Link  from 'react-router-component';

class TrainingRoomListComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            trainingRoom: this.props.trainingRoom
        }

        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        //console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    render() {

        return (

            <tr>
                <th scope="row">
                    <a href={"/" + this.props.trainingRoom.owner_username + "/trainingrooms/" + this.props.trainingRoom.namespace}>
                        {this.props.trainingRoom.namespace}
                    </a>

                </th>

                {/*<td>
                    <div className="dropdown">
                        <a className="btn btn-sm btn-secondary nav-link collapsed" href="#" data-toggle="collapse"
                           data-target={"#spriteGroup_" + this.props.trainingRoom.namespace} aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-cog"/>
                            <span>Options</span>
                        </a>
                        <div id={"spriteGroup_" + this.props.trainingRoom.namespace} className="collapse" aria-labelledby="headingTwo"
                             data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">ChaosPixel:</h6>
                                <a className="collapse-item" href="/chaospixel">Slicer</a>
                            </div>
                        </div>
                    </div>
                </td>*/}

            </tr>

        );
    }
}

export default TrainingRoomListComponent;