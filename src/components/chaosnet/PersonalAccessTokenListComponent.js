import React, {Component} from 'react';
import Link  from 'react-router-component';
import HTTPService from "../../services/HTTPService";

class PersonalAccessTokenListComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
            page: this.props.page
        }

        this.handleChange = this.handleChange.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);

    }
    onDeleteClick(event){
        event.preventDefault();
        HTTPService.delete(
            "/" + this.state.token.owner_username+ '/tokens/' + this.state.token._id,
        )
            .then((response) => {
                let newTokens = [];
                this.state.page.state.tokens.forEach((token) => {
                    if(token._id !== this.state.token._id){
                        newTokens.push(token);
                    }
                })

                this.state.page.setState({
                    tokens: newTokens
                });
            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })
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
                    {this.props.token.name}
                </th>

                {<td>
                    <div className='btn-group'>
                        <div className="dropdown">
                            <button
                                className="btn btn-sm  btn-secondary dropdown-toggle"
                                type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                                Options
                            </button>
                            <div className="dropdown-menu"
                                 aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" href="#"
                                   onClick={this.onDeleteClick}>Delete</a>
                            </div>
                        </div>
                    </div>
                </td>}

            </tr>

        );
    }
}

export default PersonalAccessTokenListComponent;
