import React, {Component} from 'react';
import Link  from 'react-router-component';

class FitnessRuleComponent extends Component {

    constructor(props) {
        super(props);
        switch(props.fitnessRule.eventType){
            case("EQUIP"):
                props.fitnessRule.eventType = "ITEM_EQUIPPED";
            break;
            case("CRAFT"):
                props.fitnessRule.eventType = "ITEM_CRAFTED";
                break;
        }
        this.state = {
            page: props.page,
            simModel: props.simModel,
            fitnessRule: this.props.fitnessRule || {},
            eventType: props.simModel._fitnessCache[props.fitnessRule.eventType],
            dirty: false,
            isNew: props.fitnessRule ? false : true
        }
        if(!this.state.eventType) {
            console.log("EVENT TYPE: " + this.state.fitnessRule.eventType, this.state.eventType, Object.keys(props.simModel._fitnessCache));
            this.state.eventType = {}
        }


        this.handleChange = this.handleChange.bind(this);
        this.debugFitnessRule = this.debugFitnessRule.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleChange(event) {


        this.state.fitnessRule[event.target.name] = event.target.value;
        switch(event.target.name){
            case('eventType'):
                this.state.eventType = this.state.simModel._fitnessCache[this.state.fitnessRule.eventType];
                break;

        }
        this.state.dirty = true;
        this.setState(this.state);
        console.log("TARGET:" , event.target.name, event.target.value, this.state.fitnessRule);
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
        this.state.page.removeRule(this.state.fitnessRule);
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
                           placeholder="Training Room Name..."  value={this.state.fitnessRule.id} onChange={this.handleChange}
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
                        {
                            this.state.simModel.fitness.map((fitnessModel)=>{
                                return <option value={fitnessModel.eventType}>{fitnessModel.eventType}</option>
                            })
                        }
                    </select>
                </td>

                <td className="form-group">
                    {
                        this.state.eventType.attributeId &&
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
                    <button className="btn btn-sm btn-danger " onClick={this.delete}>X</button>
                </td>

            </tr>

        );
    }
}

export default FitnessRuleComponent;