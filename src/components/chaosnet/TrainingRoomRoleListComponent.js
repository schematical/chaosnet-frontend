import React, {Component} from 'react';
import Link  from 'react-router-component';

class TrainingRoomRoleListComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            role: this.props.role
        }

        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {

        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    render() {

        return (

            <tr>
                <th scope="row">
                    <a href={"/" + this.props.page.props.username + "/trainingrooms/" + this.props.page.props.trainingRoomNamespace + "/roles/" +this.state.role.namespace }>
                        {this.state.role.namespace}
                    </a>

                </th>

               {/* <td>
                    <div className="dropdown">
                        <a className="btn btn-sm btn-secondary nav-link collapsed" href="#" data-toggle="collapse"
                           data-target={"#spriteGroup_" + this.state.role.namespace} aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-cog"/>
                            <span>Options</span>
                        </a>
                        <div id={"spriteGroup_" + this.state.role.namespace} className="collapse" aria-labelledby="headingTwo"
                             data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">ChaosCraft:</h6>
                                <a className="collapse-item" href="/chaospixel">Slicer</a>
                            </div>
                        </div>
                    </div>
                </td>
*/}
            </tr>

        );
    }
}

export default TrainingRoomRoleListComponent;