import React, {Component} from 'react';
import $ from "jquery";

class ConfirmComponent extends Component {

    constructor(props) {
        super(props);


        this.state = {


        }


        this.handleChange = this.handleChange.bind(this);
        this.confirm = this.confirm.bind(this);
        this.show = this.show.bind(this);
    }
    show(){

        $('#' + this.props.id).modal('show');
    }
    handleChange(event) {

        let state = {};

        state[event.target.name] = event.target.value;

        state.dirty = true;
        this.setState(state);
    }


    confirm(){
        try {

            this.props.onConfirm(true);
            $('#' + this.props.id).modal('hide');
        }catch(err){
            this.setState({
                error: err
            })
        }

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
                            {this.props.body}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">
                                Cancel
                            </button>
                            <button className="btn btn-secondary btn-danger" type="button" onClick={this.confirm}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmComponent;