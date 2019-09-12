import React, {Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
class TagTextComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            taggedObjects: props.taggedObjects,
            tags:[]
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSaveTag = this.onSaveTag.bind(this);
        this.onAddTag = this.onAddTag.bind(this);
        this.refreshTagCount(props.taggedObjects);
    }
    refreshTagCount(taggedObjects){
        let  tagCounts = {};
        this.state.tags = [];
        taggedObjects.forEach((obj)=>{
            obj.tags = obj.tags || [];
            obj.tags.forEach((tag)=> {
                tagCounts[tag] = tagCounts[tag] || 0;
                tagCounts[tag] += 1;
            });
        })
        Object.keys(tagCounts).forEach((tag)=>{
            this.state.tags.push({
                key: tag,
                count: tagCounts[tag],
                all: tagCounts[tag] == taggedObjects.length
            })

        })
        console.log("this.props.taggedObjects: ", taggedObjects, "STATE: ", this.state);
    }
    componentWillReceiveProps(nextProps) {
        if(!nextProps.taggedObjects){
            return;
        }
        this.setState({ taggedObjects: nextProps.taggedObjects });

        this.refreshTagCount(nextProps.taggedObjects);
    }
    handleChange(event) {
        //console.log("TARGET:" , event.target.name, event.target.value, event.target);
        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }
    onSaveTag(event){
        this.state.taggedObjects.forEach((obj)=>{
            obj.tags.push(this.state.new_tag_name);
        })
        this.refreshTagCount( this.state.taggedObjects);
        let tag = this.state.new_tag_name

        this.state.new_tag_name = null;
        this.state.show_add_tag = false;
        this.setState(this.state);
        if(this.props.onTagAdd){
            this.props.onTagAdd(this.state.taggedObjects, tag)
        }
    }
    onAddTag(event){
        this.state.show_add_tag = true;
        this.setState(this.state);


    }
    render() {
        return (
            <div>
                {
                    this.state.tags.map((tagData)=>{
                        return <span className={"badge badge-pill " + (tagData.all ? "badge-primary" : "badge-secondary")}>{tagData.key} {tagData.count}</span>
                    })
                }
                {
                    this.state.show_add_tag ?
                        <div className="input-group">
                            <input type="text" name="new_tag_name" placeholder="Tag" value={this.state.new_tag_name} onChange={this.handleChange} />
                            <button className="btn btn-danger  btn-sm" onClick={this.onSaveTag} >Add Tag</button>
                        </div>
                        :
                        <span className="badge badge-pill badge-secondary" onClick={this.onAddTag}>Add</span>

                }
            </div>

        );
    }
}

export default TagTextComponent;