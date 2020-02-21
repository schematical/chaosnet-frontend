import React, {Component} from 'react';
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");


class LinkBuilderComponent extends Component {

    constructor(props) {
        super(props);

        this.regexp = pathToRegexp("/:username/trainingrooms/:trainingRoomNamespace/organisms/:organism/nnet");
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {

// keys = [{ name: 'foo', prefix: '/', ... }, { name: 'bar', prefix: '/', ... }]

        let data = this.regexp.exec(event.target.value);
//=> [ '/test/route', 'test', 'route', index: 0, input: '/test/route', groups: undefined ]
console.log(data);
        //this.state.fitnessRule[event.target.name] = event.target.value;


        this.setState(this.state);
    }
    render() {
        return (


            <div>
                /<a href={"/" + this.props.username}>{this.props.username}</a>
                /<a href={"/" + this.props.username + "/trainingrooms"}>trainingrooms</a>
                /<a
                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace}>{this.props.trainingRoomNamespace}</a>
                /<a
                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks" }>tranks</a>
                /<a
                href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace + "/tranks/"+ this.props.trank}>{this.props.trank}</a>
            </div>
        );
    }
}

export default LinkBuilderComponent;