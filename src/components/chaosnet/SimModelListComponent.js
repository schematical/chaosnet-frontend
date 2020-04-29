import React, {Component} from 'react';
import Link  from 'react-router-component';
import AuthService from "../../services/AuthService";

class SimModelListComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            simModel: this.props.simModel
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
                    <a href={"/" + this.props.simModel.owner_username + "/simmodels/" + this.props.simModel.namespace}>
                        {this.props.simModel.owner_username}:{this.props.simModel.namespace}
                    </a>

                </th>
                <td>
                    {
                        AuthService.userData &&
                        <a
                            className="btn btn-info   btn-sm"
                            href={"/" + AuthService.userData.username + "/trainingrooms/new?simModelUsername=" + this.state.simModel.owner_username + "&simModelNamespace=" + this.state.simModel.namespace }
                        >
                            Create Training Room
                        </a>
                    }
                    {
                        !AuthService.userData &&
                        <a
                            className="btn btn-info btn-sm"
                            href={"/signup"}
                        >
                            Create Training Room
                        </a>
                    }
                </td>



            </tr>

        );
    }
}

export default SimModelListComponent;