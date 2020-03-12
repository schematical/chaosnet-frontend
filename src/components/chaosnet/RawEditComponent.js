import React, {Component} from 'react';
import $ from "jquery";

class RawEditComponent extends Component {

    constructor(props) {
        super(props);


        this.state = {


        }


        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.show = this.show.bind(this);
    }
    show(body){
        let state = {
            bodyStr: JSON.stringify(body, null, 3)
        }
        this.setState(state);
        $('#' + this.props.id).modal('show');
    }
    handleChange(event) {

        let state = {};

        state[event.target.name] = event.target.value;

        state.dirty = true;
        this.setState(state);
    }


    save(){
        try {
            let newBody = JSON.parse(this.state.bodyStr);
            this.props.onSave(newBody);
            $('#' + this.props.id).modal('hide');
        }catch(err){
            this.setState({
                error: err
            })
        }

    }

    markClean(){
        let state = {};
        state.dirty = false;
        this.setState(state);
    }

    render() {


        return (
            <div className="modal fade" id={this.props.id} tabIndex={-1} role="dialog"
                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{this.props.title}</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.state.error &&
                                <div className="alert alert-danger">{this.state.error.message}</div>
                            }
                            <div className="form-group">
                                <label htmlFor="exampleTextarea">{this.props.title}</label>
                                <textarea className="form-control" id="bodyStr" name="bodyStr" rows="10" value={this.state.bodyStr} onChange={this.handleChange}></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel
                            </button>
                            {
                                this.state.dirty &&
                                <button className="btn btn-primary" onClick={this.save}>Save</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RawEditComponent;