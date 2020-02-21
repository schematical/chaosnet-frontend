import React, {Component} from 'react';
const  url = require('url');
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");

class LinkParserComponent extends Component {

    constructor(props) {
        super(props);
        let routes = [
            "/:username/trainingrooms/:trainingRoomNamespace/organisms/:organism/nnet"
        ];
        let routeInfos = [];
        routes.forEach((_path)=>{
             let data = {
                 regexp:pathToRegexp(_path),
                 parseData: parse(_path)
             };

             routeInfos.push((path)=>{
                 let results = data.regexp.exec(path);
                 if(!results){
                     return null;
                 }
                 let response = {};
                 let i = 0;
                 data.parseData.forEach((pathElement)=>{
                     if(pathElement.name) {
                         response[pathElement.name] = results[i];
                         i ++;
                     }
                 });
                 return response;
             })
         })
        this.routes = routeInfos;
        this.handleChange = this.handleChange.bind(this);


    }

    handleChange(event) {

        let urlData = url.parse(event.target.value);
        console.log("Parse URL Data: ", urlData);
        let path = urlData.path;
        switch(urlData.host){
            case("chaosnet.schematical.com"):
                path = path.substr( '/v1'.length);
                break;
            case("localhost:3000"):
            case("chaoslabs.schematical.com"):

            break;
        }
// keys = [{ name: 'foo', prefix: '/', ... }, { name: 'bar', prefix: '/', ... }]
        let foundData = null;
        this.routes.forEach((routeTest)=>{
            let results = routeTest(path);
            if(!results) {
                return;
            }
            foundData = results;
        })
        console.log("foundData: ", foundData);

//=> [ '/test/route', 'test', 'route', index: 0, input: '/test/route', groups: undefined ]

        //this.state.fitnessRule[event.target.name] = event.target.value;


        this.setState(this.state);
    }
    render() {
        return (


            <form className="form-inline mr-auto w-100 navbar-search">
                <div className="input-group">
                    <input type="text"
                           className="form-control bg-light border-0 small"
                           placeholder="Search for..." aria-label="Search"
                           aria-describedby="basic-addon2" onChange={this.handleChange}/>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                            <i className="fas fa-search fa-sm"/>
                        </button>
                    </div>
                </div>
            </form>

        );
    }
}

export default LinkParserComponent;