import React, {Component} from 'react';
import Link  from 'react-router-component';
import AuthService from "../../services/AuthService";
import RawEditComponent from "./RawEditComponent";

const _ = require('underscore');
class PresetNeuronComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: props.page,
            simModel: props.simModel,
            presetNeuron: props.presetNeuron || {},
            neuronType: props.simModel._neuronCache[props.presetNeuron['$TYPE']][props.presetNeuron._neruonTypeIndex || 0],
            dirty: false,
            isNew: props.presetNeuron ? false : true,
            canEdit: props.page.state.canEdit
        }

        if(!this.state.neuronType) {
            this.state.neuronType = {}
        }
        this.setNeuronType(this.state.neuronType, this.state.presetNeuron._neruonTypeIndex);


        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.renderInputs = this.renderInputs.bind(this);
        this.onRawUpdate = this.onRawUpdate.bind(this);
        this.showRawEdit = this.showRawEdit.bind(this);

    }
    showRawEdit(){
        this.refs.rawEditComponent.show(this.state.presetNeuron);
    }
    onRawUpdate(newPresetNeuron){
        let state = {
            presetNeuron: newPresetNeuron,
            dirty: true
        }
        this.setState(state);

    }
    handleChange(event) {
        let state = {
            presetNeuron: this.state.presetNeuron
        };

        switch(event.target.name){
            case('neuronType'):

                let parts = event.target.value.split("-");
                if(parts.length === 1){
                    parts.push(0)
                }else {
                    parts[1] = parseInt(parts[1]) - 1;
                }
                this.setNeuronType(this.state.page.state.simModel._neuronCache[parts[0]][parts[1]], parts[1]);

                break;
            default:
                state.presetNeuron[event.target.name] = event.target.value;
                state.dirty = true;
                this.setState(state);

        }


    }
    setNeuronType(neuronType, neuronTypeIndex){
        let state = {
            presetNeuron: this.state.presetNeuron
        };
        state.neuronType = neuronType;
        state.presetNeuron["$TYPE"] = neuronType['$TYPE'];//event.target.value;
        //console.log("this.state.page.state.simModel._neuronCache[parts[0]]: ", this.state.page.state.simModel._neuronCache[parts[0]])
        if(!_.isUndefined(neuronTypeIndex)) {
            state.presetNeuron._neruonTypeIndex = neuronTypeIndex;
        }
        state.presetNeuron._base_type = state.neuronType._base_type;
        if(state.neuronType['$EVAL_GROUP']) {
            state.presetNeuron["$EVAL_GROUP"] = state.neuronType['$EVAL_GROUP']
        }
        if(state.neuronType['$OUTPUT_GROUP']) {
            state.presetNeuron["$OUTPUT_GROUP"] = state.neuronType['$OUTPUT_GROUP']
        }
        if(state.neuronType['attributeId']) {
            state.presetNeuron["attributeId"] = state.neuronType['attributeId']
        }
        this.setState(state);
    }
    save(){
        /*if(this.state.neuronType && this.state.neuronType.attributeId){
            this.state.fitnessRule.attributeId = this.state.neuronType.attributeId;
        }else{
            this.state.fitnessRule.attributeId = null;
        }*/
        this.setState(this.state);
        this.state.page.updateNeuron(this.state.presetNeuron, this);
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

        if(this.state.neuronType[key]["$SOURCE"]){
            switch(this.state.neuronType[key]["$SOURCE"]){
                case('biology'):
                    let biologyTypes = [];
                    this.state.page.state.simModel.biology.forEach((b)=>{
                        if(this.state.neuronType[key]["$BIOLOGY_TYPE"] == b["$TYPE"]){
                            biologyTypes.push(b);
                        }
                    })
                    let biologyIds = [];
                    biologyTypes.forEach((biology)=>{

                        for(let i = 0; i < biology["$COUNT"]; i++){
                            if( biology["$ID"]){
                                biologyIds.push(biology["$ID"]);
                            }else {
                                biologyIds.push(biology["$TYPE"] + "_" + i);
                            }
                        }
                    })
                    return <td key={key}>
                        <div className="input-group mb-3">

                            <input readOnly={true} id={key} name={key}  type="text" className="form-control" placeholder={key} aria-label={key}
                                   aria-describedby="basic-addon1" value={key}  onChange={this.handleChange} />


                            <select  readOnly={!this.state.canEdit}  id={key} name={key} value={this.state.presetNeuron[key]} className="form-control" onChange={this.handleChange}>
                                <option value=""></option>
                                {
                                    biologyIds.map((biologyId)=>{

                                        return <option value={biologyId}>{biologyId}</option>

                                    })
                                }
                            </select>

                        </div>
                        {
                            this.state.canEdit &&
                            <button className="btn btn-sm btn-danger " onClick={()=>{this.state.page.addAll(this.state.presetNeuron, this.state.neuronType, key, biologyTypes[0]);}}>Add All</button>
                        }


                    </td>
                break;
            }

        }
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

                            <input readOnly={true} id="attributeId" name="attributeId"  type="text" className="form-control" placeholder="Attribute Id" aria-label="Attribute Id"
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
                    <div className="input-group mb-3">

                        <input readOnly={true} id={key} name={key}  type="text" className="form-control" placeholder={key} aria-label={key}
                               aria-describedby="basic-addon1" value={key}  onChange={this.handleChange} />

                        <input  readOnly={!this.state.canEdit} type="text" className="form-control form-control-user"
                                id={key} name={key} aria-describedby={key}
                                placeholder={key}  value={this.state.presetNeuron[key]} onChange={this.handleChange}
                        />

                    </div>

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
                    <select  id="neuronType" name="neuronType" class="form-control" readOnly={!this.state.canEdit}  value={this.state.presetNeuron["$TYPE"]} onChange={this.handleChange}>
                        {
                            this.state.page.state.neuronOptions.map((option)=>{


                                       return <option value={option.id}>{option.id}</option>

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
                    {
                        this.state.canEdit &&
                        <button className="btn btn-sm btn-info " onClick={this.showRawEdit}>R</button>
                    }
                    <RawEditComponent ref="rawEditComponent" id={this.state.presetNeuron.id + "_rawEditComponent"} title={this.state.presetNeuron.id} onSave={this.onRawUpdate} />
                </td>

            </tr>

        );
    }
}

export default PresetNeuronComponent;