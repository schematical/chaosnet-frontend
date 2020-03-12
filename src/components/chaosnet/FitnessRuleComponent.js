import React, {Component} from 'react';
import Link  from 'react-router-component';
import AuthService from "../../services/AuthService";
import RawEditComponent from "./RawEditComponent";

class FitnessRuleComponent extends Component {

    constructor(props) {
        super(props);

        let eventType = null;
        if(props.fitnessRule.eventType){
            eventType = props.simModel._fitnessCache[props.fitnessRule.eventType] &&
                props.simModel._fitnessCache[props.fitnessRule.eventType][props.fitnessRule.eventTypeIndex || 0];
        }
        this.state = {
            page: props.page,
            simModel: props.simModel,
            fitnessRule: this.props.fitnessRule || {},
            eventType: eventType,
            dirty: false,
            isNew: props.fitnessRule ? false : true,
            canEdit: props.page.state.canEdit
        }
        if(!this.state.eventType) {
            this.state.eventType = {}
        }


        this.handleChange = this.handleChange.bind(this);
        this.debugFitnessRule = this.debugFitnessRule.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.onRawUpdate = this.onRawUpdate.bind(this);
        this.showRawEdit = this.showRawEdit.bind(this);

    }
    showRawEdit(){
        this.refs.rawEditComponent.show(this.state.fitnessRule);
    }
    onRawUpdate(fitnessRule){
        let state = {
            fitnessRule: fitnessRule,
            dirty: true
        }
        this.setState(state);

    }

    handleChange(event) {

        console.log("Updating: ", event.target.name, event.target.value,this.state.fitnessRule.eventType)
        let state = {
            fitnessRule: this.state.fitnessRule,
        }
        state.fitnessRule[event.target.name] = event.target.value;

        switch(event.target.name){
            case('eventType'):
                let parts = state.fitnessRule.eventType.split("-");
                state.fitnessRule.eventTypeIndex = parts[1] || 0;
                state.fitnessRule.eventType = parts[0];
                state.eventType = this.state.simModel._fitnessCache[state.fitnessRule.eventType][state.fitnessRule.eventTypeIndex];

                break;

        }
        state.dirty = true;
        this.setState(state);
        console.log("this.state.eventType: ", this.state.eventType);
    }

    debugFitnessRule(){
        console.log("fitnessRule: ", (this.state.fitnessRule));
    }
    save(){
        if(this.state.eventType && this.state.eventType.attributeId){
            this.state.fitnessRule.attributeId = this.state.eventType.attributeId;
        }else{
            this.state.fitnessRule.attributeId = null;
        }
        this.setState(this.state);
        this.state.page.save(this.state.fitnessRule, this);
    }
    delete(){
        this.state.page.removeRule(this);
    }
    markClean(){
        let state = {};
        state.dirty = false;
        this.setState(state);
    }

    render() {


        return (

            <tr>

                <td>

                    <input type="text" className="form-control form-control-user"
                           id="fitnessRuleId" name="id" aria-describedby="fitnessRuleId"
                           readOnly={this.state.isNew}
                           placeholder="Rule Unique ID"  value={this.state.fitnessRule.id} onChange={this.handleChange}
                    />
                </td>

                <td>
                    <input type="number" className="form-control form-control-user"
                           id="scoreEffect" name="scoreEffect" aria-describedby="scoreEffect"
                           placeholder="Score Effect"  value={this.state.fitnessRule.scoreEffect} onChange={this.handleChange}
                    />
                </td>



                <td>
                    <input type="number" className="form-control form-control-user"
                           id="lifeEffect" name="lifeEffect" aria-describedby="lifeEffect"
                           placeholder="Life Effect"  value={this.state.fitnessRule.lifeEffect} onChange={this.handleChange}
                    />
                </td>
                <td className="form-group">
                    <input type="number" className="form-control form-control-user"
                           id="maxOccurrences" name="maxOccurrences" aria-describedby="maxOccurrences"
                           placeholder="Max Occurrences"  value={this.state.fitnessRule.maxOccurrences} onChange={this.handleChange}
                    />
                </td>

                <td>
                    <select id="eventType" name="eventType" value={this.state.fitnessRule.eventType} onChange={this.handleChange}>
                        <option value={null}></option>
                        {
                            Object.keys(this.state.simModel._fitnessCache).map((key)=>{
                                let fitnessModels = this.state.simModel._fitnessCache[key];
                                return fitnessModels.map((fitnessModel)=> {
                                    let id = fitnessModel.eventType;
                                    if(fitnessModel.eventTypeIndex > 0){
                                        id += "-" + fitnessModel.eventTypeIndex
                                    }
                                    return <option value={id}>{id}</option>
                                })
                            })
                        }
                    </select>
                </td>

                <td className="form-group">
                    {
                        (this.state.eventType && this.state.eventType.attributeId) &&
                        <div className="input-group mb-3">

                            <input id="attributeId" name="attributeId"  type="text" className="form-control" placeholder="Attribute Id" aria-label="Attribute Id"
                                aria-describedby="basic-addon1" value={this.state.eventType.attributeId}  onChange={this.handleChange} />

                            <input id="attributeValue" name="attributeValue"  type="text" className="form-control" placeholder="Attribute Value" aria-label="Attribute Value"
                                   aria-describedby="basic-addon1" value={this.state.fitnessRule.attributeValue}  onChange={this.handleChange} />
                        </div>
                    }
                </td>
                <td>
                    {/*<button class="btn btn-sm btn-primary " onClick={this.debugFitnessRule}>Debug</button>*/}
                    {
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
                    <RawEditComponent ref="rawEditComponent"id={this.state.fitnessRule.id + "_rawEditComponent"} title={this.state.fitnessRule.id} onSave={this.onRawUpdate} />
                </td>

            </tr>

        );
    }
}

export default FitnessRuleComponent;