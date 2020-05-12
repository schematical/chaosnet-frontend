import React, {Component} from 'react';
import Link  from 'react-router-component';
import HTTPService from "../../services/HTTPService";
import AuthService from "../../services/AuthService";
import LoadingComponent from "../LoadingComponent";

class SettingsCollectionComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            uri: this.props.uri + "/settings",
            canEdit: this.props.canEdit,
            loaded:false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        HTTPService.get(this.state.uri, {})
            .then((response) => {
                let state = {};
                state.isNew = false;
                state.settings = response.data;

                state.loaded = true;
                this.setState(state);
            })
            .catch((err) => {
                let state = {};
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })
    }

    handleChange(event) {
        let state = {

        };
        let blnFound = false;
        this.state.settings.forEach((setting)=>{
            if(setting.namespace == event.target.name){
                blnFound = true;
                setting.value = event.target.value;
                setting._dirty = true;
            }
        })

        this.setState(state);
    }
    handleSubmit(event) {
        event.preventDefault();
        let dirtySettings = [];
        this.state.settings.forEach((setting)=>{
            if(setting._dirty){
                delete(setting._dirty);
                dirtySettings.push(setting);
            }

        })

        return HTTPService.put(this.state.uri ,
            dirtySettings,
            {
            }
        )

            .then((response) => {
                let state = {
                    settings: response.data
                }

                this.setState(state);
            })
            .catch((err) => {
                let state = {}
                state.error = err;
                this.setState(state);
                console.error("Error: ", err.message);
            })
    }

    render() {

        return (
            <div>
                { !this.state.error && !this.state.loaded && <LoadingComponent /> }
                {
                    this.state.error &&
                    <div className="card mb-4 py-3  bg-danger text-white shadow">
                        <div className="card-body">
                            Error   {this.state.error.status}
                            <div className="text-white-50 small">
                                {this.state.error.message}
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.loaded &&
                    <form className="user" onSubmit={this.handleSubmit}>

                        {
                            this.state.settings.map((setting) => {
                                return <div className="form-group row" key={setting.namespace}>
                                        <label htmlFor="staticEmail" className="col-sm-6 col-form-label">
                                            {setting.namespace}
                                        </label>
                                        <div className="col-sm-16">
                                            <input type="text" readOnly={(!(this.props.canEdit && (setting.s != 'admin' || AuthService.isAdmin())))} className="form-control form-control-user"
                                                   id={setting.namespace} name={setting.namespace}  value={setting.value}
                                                   onChange={this.handleChange} />
                                        </div>
                                    </div>

                            })
                        }
                        <button className="btn btn-primary btn-user btn-block">
                            Save
                        </button>

                  </form>
                }
        </div>

        );
    }
}

export default SettingsCollectionComponent;