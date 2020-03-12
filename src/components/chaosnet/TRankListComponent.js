import React, {Component} from 'react';
import Link  from 'react-router-component';

class TRankListComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            trank: this.props.trank,
            uri: "/" + this.props.page.props.username + "/trainingrooms/" + this.props.page.props.trainingRoomNamespace + "/tranks/" +this.state.trank.namespace
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
                    <a href={this.state.uri}>
                        {this.state.trank.namespace}
                    </a>

                </th>
                <a href={this.state.uri}>
                    {this.state.trank.name}
                </a>
                <td>
                    {this.state.trank.age}
                </td>
                <td>
                    {this.state.trank.currScore}
                </td>
                <td>
                    {this.state.trank.highScore}
                </td>
                <td>
                    {this.state.trank.lifeState}
                </td>
                <td>
                    <div className="dropdown">
                        <a className="btn btn-sm btn-secondary nav-link collapsed" href="#" data-toggle="collapse"
                           data-target={"#spriteGroup_" + this.state.trank.namespace} aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-cog"/>
                            <span>Options</span>
                        </a>
                        <div id={"spriteGroup_" + this.state.trank.namespace} className="collapse" aria-labelledby="headingTwo"
                             data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">ChaosCraft:</h6>
                                <a className="collapse-item" href={this.state.uri + '/organisms'}>Organisms</a>
                            </div>
                        </div>
                    </div>
                </td>

            </tr>

        );
    }
}

export default TRankListComponent;