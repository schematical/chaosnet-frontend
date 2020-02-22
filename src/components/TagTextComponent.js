import React, {Component} from 'react';

import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import AuthService from "../services/AuthService";
import * as _ from "underscore";
import HTTPService from "../services/HTTPService";

const axios = require('axios');


class TagTextComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            taggedObjects: props.taggedObjects,
            tags:[],
            isLoading: false,
            multi: props.taggedObjects.length > 1
        }

        this.handleTypeaheadChange = this.handleTypeaheadChange.bind(this);
        this.onSaveTag = this.onSaveTag.bind(this);
        this.onAddTag = this.onAddTag.bind(this);
        this.onMenuToggle = this.onMenuToggle.bind(this);
        this.refreshTagCount(props.taggedObjects);
    }
    onMenuToggle(isOpen){
        if(!isOpen){
            this.refreshTagCount( this.state.taggedObjects);
            this.setState({
                show_add_tag: false
            });
        }
    }
    _handleSearch = (query) => {
        this.setState({isLoading: true});
        return HTTPService('/chaospixel/tags?q=' + query, )
        .then((response) => {

            this.setState({
                isLoading: false,
                options:response.data,
            });
        })
        .catch((err) => {
            console.error("Error: ", err.message);
        })
    }
    refreshTagCount(taggedObjects){
        let  tagCounts = {};
        this.state.multi = taggedObjects.length > 1;
        this.state.tags = [];
        this.state._tags = [];
        taggedObjects.forEach((obj)=>{
            obj.tags = obj.tags || [];
            obj.tags.forEach((tag)=> {
                tagCounts[tag] = tagCounts[tag] || 0;
                tagCounts[tag] += 1;
            });
        })
        Object.keys(tagCounts).forEach((tag)=>{
            this.state._tags.push(tag);
            this.state.tags.push({
                key: tag,
                count: tagCounts[tag],
                all: tagCounts[tag] == taggedObjects.length
            })

        })

    }
    componentWillReceiveProps(nextProps) {
        if(!nextProps.taggedObjects){
            return;
        }
        this.setState({ taggedObjects: nextProps.taggedObjects });

        this.refreshTagCount(nextProps.taggedObjects);
    }
    handleTypeaheadChange(tags) {
        let tagCache = {};
        this.state.tags.forEach((oldTag)=>{
            tagCache[oldTag.key] = 'old';
        })
        tags.forEach((newTag)=>{

            if(_.isObject(newTag)){
                newTag = newTag.key;
            }
            if(tagCache[newTag]){
                tagCache[newTag] = 'keep'
            }else{
                tagCache[newTag] = 'new';
            }

        })

        this.state.taggedObjects.forEach((obj)=>{
            Object.keys(tagCache).forEach((tag)=>{
                let indexOf = _.indexOf(obj.tags, tag);
                let action = tagCache[tag];
                switch(action){
                    case('old'):
                        if(indexOf !== -1){
                            obj.tags.splice(indexOf, 1)
                        };
                    break;
                    case('keep'):
                        //Do nothing
                        break;
                    case('new'):
                        if(indexOf === -1){
                            obj.tags.push(tag);
                        };
                        break;
                    default:
                        throw new Error("Unknown action:" + action);
                }

            })
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
                    this.state.show_add_tag ?
                        <div className="input-group">
                            <AsyncTypeahead
                                {...this.state}
                                allowNew
                                name="new_tag_name"
                                labelKey="key"
                                selected={this.state._tags}
                                clearButton
                                multiple
                                minLength={0}
                                onSearch={this._handleSearch}
                                placeholder="Search for a Tag..."
                                /*renderMenuItemChildren={(option, props) => (
                                    <option key={option.id} user={option} />
                                )}*/
                                value={this.state.new_tag_name}
                                onChange={this.handleTypeaheadChange}
                                onMenuToggle={this.onMenuToggle}
                            />
                            {/*<input type="text" name="new_tag_name" placeholder="Tag" onChange={this.handleChange} />
                            <button className="btn btn-danger  btn-sm" onClick={this.onSaveTag} >Add Tag</button>*/}
                        </div>
                        :
                        <div>
                            <span className="badge badge-pill badge-info" onClick={this.onAddTag}>Edit Tags</span>
                            {
                                this.state.tags.map((tagData)=>{
                                    return <span key={tagData.key} className={"badge badge-pill " + (tagData.all ? "badge-primary" : "badge-secondary")}>{tagData.key}{this.state.multi && " " + tagData.count}</span>
                                })
                            }
                        </div>
                }
            </div>

        );
    }
}

export default TagTextComponent;