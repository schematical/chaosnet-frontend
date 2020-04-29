import React, {Component} from 'react';
import Link  from 'react-router-component';

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
                    <a href={"/" + this.props.simModel.owner_username + "/trainingrooms/" + this.props.simModel.namespace}>
                        {this.props.simModel.owner_username}:{this.props.simModel.namespace}
                    </a>

                </th>



            </tr>

        );
    }
}

export default SimModelListComponent;