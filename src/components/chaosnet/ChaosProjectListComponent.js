import React, {Component} from 'react';
import Link  from 'react-router-component';

class ChaosProjectListComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chaosProject: this.props.chaosProject
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
                    <a href={"/" + this.props.trainingRoom.owner_username + "/projects/" + this.props.chaosProject.namespace}>
                        {this.props.chaosProject.name}
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

export default ChaosProjectListComponent;
