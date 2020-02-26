import React, {Component} from 'react';
import Link  from 'react-router-component';
import AuthService from "../../services/AuthService";

class PresetNeuronComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: props.page,
            simModel: props.simModel,
            presetNeuron: props.presetNeuron || {},
            neuronType: props.simModel._neuronCache[props.presetNeuron['$TYPE']],
            dirty: false,
            isNew: props.presetNeuron ? false : true,
            canEdit: props.page.state.canEdit
        }

        if(!this.state.neuronType) {
            this.state.neuronType = {}
        }


        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleChange(event) {



        switch(event.target.name){
            case('neuronType'):
                this.state.presetNeuron["$TYPE"] = event.target.value;

                this.state.neuronType = this.state.simModel._neuronCache[this.state.presetNeuron['$TYPE']];
                this.state.presetNeuron._base_type = this.state.neuronType._base_type;
                if(this.state.neuronType['$EVAL_GROUP']) {
                    this.state.presetNeuron["$EVAL_GROUP"] = this.state.neuronType['$EVAL_GROUP']
                }
                if(this.state.neuronType['$OUTPUT_GROUP']) {
                    this.state.presetNeuron["$OUTPUT_GROUP"] = this.state.neuronType['$OUTPUT_GROUP']
                }
                break;
            default:
                this.state.presetNeuron[event.target.name] = event.target.value;

        }
        this.state.dirty = true;
        this.setState(this.state);

    }

    save(){
        /*if(this.state.neuronType && this.state.neuronType.attributeId){
            this.state.fitnessRule.attributeId = this.state.neuronType.attributeId;
        }else{
            this.state.fitnessRule.attributeId = null;
        }*/
        this.setState(this.state);
        this.state.page.save(this.state.presetNeuron, this);
    }
    delete(){
        this.state.page.removeRule(this);
    }
    markClean(){
        let state = {};
        state.dirty = false;
        this.setState(state);
    }
    renderInputs(key){


        switch(key){
            case("_base_type"):
            case("$TYPE"):
            case("$EVAL_GROUP"):
            case("$DEFAULT"):
                return;

                break;
            case('attributeId'):


                return <td key={key} className="form-group">
                        <div className="input-group mb-3">

                            <input readOnly={!this.state.canEdit} id="attributeId" name="attributeId"  type="text" className="form-control" placeholder="Attribute Id" aria-label="Attribute Id"
                                   aria-describedby="basic-addon1" value={this.state.presetNeuron.attributeId}  onChange={this.handleChange} />

                            <input readOnly={!this.state.canEdit} id="attributeValue" name="attributeValue"  type="text" className="form-control" placeholder="Attribute Value" aria-label="Attribute Value"
                                   aria-describedby="basic-addon1" value={this.state.presetNeuron.attributeValue}  onChange={this.handleChange} />
                        </div>
                    </td>
            case('attributeValue'):
                //Render nothing because AttributeID renders both
                return ;
            default:
                return <td key={key} className="form-group">
                    <input  readOnly={!this.state.canEdit} type="text" className="form-control form-control-user"
                           id={key} name={key} aria-describedby={key}
                           placeholder={key}  value={this.state.presetNeuron[key]} onChange={this.handleChange}
                    />
                </td>
        }

    }

    render() {


        return (

            <tr>

                <td>

                    <input  readOnly={!this.state.canEdit} type="text" className="form-control form-control-user"
                           id="presetNeuronId" name="id" aria-describedby="presetNeuronId"
                           placeholder="Neuron Unique ID"  value={this.state.presetNeuron.id} onChange={this.handleChange}
                    />
                </td>
                <td >
                    <select  readOnly={!this.state.canEdit}  id="neuronType" name="neuronType" value={this.state.presetNeuron["$TYPE"]} onChange={this.handleChange}>
                        {
                            Object.keys(this.state.simModel._neuronCache).map((neruonTypeId)=>{


                                       return <option value={neruonTypeId}>{neruonTypeId}</option>

                            })
                        }
                    </select>
                </td>

                {
                    Object.keys(this.state.neuronType).map((key)=>{
                        return this.renderInputs(key);
                    })
                }





                <td>
                    {/*<button class="btn btn-sm btn-primary " onClick={this.debugFitnessRule}>Debug</button>*/}
                    {
                        this.state.canEdit &&
                        this.state.dirty &&
                        <button className="btn btn-sm btn-primary " onClick={this.save}>Save</button>
                    }
                    {
                        this.state.canEdit &&
                        <button className="btn btn-sm btn-danger " onClick={this.delete}>X</button>
                    }

                </td>

            </tr>

        );
    }
}

export default PresetNeuronComponent;