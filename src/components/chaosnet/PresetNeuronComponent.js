import React, {Component} from 'react';
import Link  from 'react-router-component';

class PresetNeuronComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: props.page,
            simModel: props.simModel,
            presetNeuron: this.props.presetNeuron || {},
            neuronType: props.simModel._neuronCache[props.presetNeuron['$TYPE']],
            dirty: false,
            isNew: props.fitnessRule ? false : true
        }
        if(!this.state.neuronType) {
            console.log("NEURON TYPE: " + this.state.presetNeuron['$TYPE'], this.state.neuronType, Object.keys(props.simModel._neuronCache));
            this.state.neuronType = {}
        }


        this.handleChange = this.handleChange.bind(this);
        this.debugFitnessRule = this.debugFitnessRule.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleChange(event) {



        switch(event.target.name){
            case('neuronType'):
                this.state.presetNeuron["$TYPE"] = event.target.value;

                this.state.neuronType = this.state.simModel._neuronCache[this.state.presetNeuron['$TYPE']];
                this.state.presetNeuron._base_type = this.state.neuronType._base_type;
                break;
            default:
                this.state.presetNeuron[event.target.name] = event.target.value;

        }
        this.state.dirty = true;
        this.setState(this.state);
        console.log("TARGET:" , event.target.name, event.target.value, this.state.presetNeuron);
    }

    debugFitnessRule(){
        console.log("fitnessRule: ", (this.state.presetNeuron));
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
        console.log("this.state.neuronType keys:" + key);

        switch(key){
            case("_base_type"):
            case("$TYPE"):
                return;

                break;
            case('attributeId'):
                console.log("HIT: attributeId");

                return <td key={key} className="form-group">
                        <div className="input-group mb-3">

                            <input id="attributeId" name="attributeId"  type="text" className="form-control" placeholder="Attribute Id" aria-label="Attribute Id"
                                   aria-describedby="basic-addon1" value={this.state.presetNeuron.attributeId}  onChange={this.handleChange} />

                            <input id="attributeValue" name="attributeValue"  type="text" className="form-control" placeholder="Attribute Value" aria-label="Attribute Value"
                                   aria-describedby="basic-addon1" value={this.state.presetNeuron.attributeValue}  onChange={this.handleChange} />
                        </div>
                    </td>
            case('attributeValue'):
                //Render nothing because AttributeID renders both
                return ;
            default:
                return <td key={key} className="form-group">
                    <input type="text" className="form-control form-control-user"
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

                    <input type="text" className="form-control form-control-user"
                           id="presetNeuronId" name="id" aria-describedby="presetNeuronId"
                           /*readOnly={this.state.isNew}*/
                           placeholder="Neuron Unique ID"  value={this.state.presetNeuron.id} onChange={this.handleChange}
                    />
                </td>
                <td >
                    <select  id="neuronType" name="neuronType" value={this.state.presetNeuron["$TYPE"]} onChange={this.handleChange}>
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
                        this.state.dirty &&
                        <button className="btn btn-sm btn-primary " onClick={this.save}>Save</button>
                    }
                    <button className="btn btn-sm btn-danger " onClick={this.delete}>X</button>
                </td>

            </tr>

        );
    }
}

export default PresetNeuronComponent;