import React, {Component} from 'react';
import * as _ from 'underscore';
import * as d3 from 'd3-selection';
import * as d3Drag from 'd3-drag';
/*import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';*/
import * as d3Zoom from 'd3-zoom';
import * as d3Force from 'd3-force';
import SidebarComponent from '../../components/SidebarComponent';
import TopbarComponent from '../../components/TopbarComponent';
import AuthService from "../../services/AuthService";
import FooterComponent from "../../components/FooterComponent";
const axios = require('axios');
class TrainingRoomOrgNNetDetailPage extends Component {
/*    selectedNodeJSON = null;
    svgParent;
    simulation;
    links = null;
    labels = null;
    nodes = null;
    padding = 30;
    x
    y
    xScale;
    yScale;
    inputCount = null;
    nodeYHight = null;
    inputNodeYHight = null;
    svg
    brainData = null;
    currBotUserame = null;
    minecraftData = null;
    nodeAgeTotals = {};
    stats = null;
    page = 'brain-view';
    bot = null;*/

    constructor(props) {
        super(props);
        console.log("Username: ", props.username, props);
        this.state = {

            
        }
        this.padding = 30;
    }
    render() {

        if(!this.state.loaded) {
            setTimeout(() => {
                return axios.get('https://chaosnet.schematical.com/v0/' + this.props.username+ '/trainingrooms/' + this.props.trainingRoomNamespace + "/organisms/" + this.props.organism + "/nnet" , {
                    headers: {
                        "Authorization": AuthService.accessToken
                    }
                })
                    .then((response) => {
                        console.log("Loaded: ", response.data);

                        this.state.nNet = response.data.nNet;

                        this.state.loaded = true;


                        this.nodeAgeTotals = {};
                        this.nodeAgeTotals.total = 0;
                        console.log(Object.keys(this.state.nNet));
                        this.state.links = [];
                        this.state.nNet.neurons.forEach((node)=>{
                            /*{
                                "$TYPE": "BiasInput",
                                "$DEFAULT": true,
                                "weight": "-4.047003962281124",
                                "_base_type": "input",
                                "dependencies": [],
                                "_uniqueString": null,
                                "_originNaturalGen": 0,
                                "_originGen": 0,
                                "id": "neuron-0"
                            },*/
                            node.dependencies.forEach((neuronDep)=>{
                                this.state.links.push({
                                    source: node.id,
                                    target: neuronDep.neuronId
                                   /* {
                                        "neuronId": "neuron-1",
                                        "weight": 0.3,
                                        "_originNaturalGen": 0,
                                        "_originGen": 0
                                    }*/
                                })
                            });
                            this.nodeAgeTotals[node._originGen] = this.nodeAgeTotals[node._originGen] || 0;
                            this.nodeAgeTotals[node._originGen] += 1;
                            this.nodeAgeTotals.total += 1;

                            this.setState(this.state);
                        })
                        //this.selectedNodeJSON = JSON.stringify(this.nodeAgeTotals);


                        setTimeout(()=>{
                            this.startDrawing();
                        }, 100)


                    })
                    .catch((err) => {
                        this.state.error = err;
                        this.setState(this.state);
                        console.error("Error: ", err.message);
                    });
            }, 1000);
        }
        return (
            <div>
                <div>
                    {/* Page Wrapper */}
                    <div id="wrapper">
                        <SidebarComponent></SidebarComponent>
                        {/* Content Wrapper */}
                        <div id="content-wrapper" className="d-flex flex-column">
                            {/* Main Content */}
                            <div id="content">
                                {/* Topbar */}
                                <TopbarComponent></TopbarComponent>
                                {/* End of Topbar */}
                                {/* Begin Page Content */}
                                {
                                    this.state.loaded && <div className="container-fluid">
                                    {/* Page Heading */}
                                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                        <h1 className="h3 mb-0 text-gray-800">
                                            /<a href={"/" + this.props.username}>{this.props.username}</a>
                                            /<a href={"/" + this.props.username + "/trainingrooms"}>trainingrooms</a>
                                            /<a
                                            href={"/" + this.props.username + "/trainingrooms/" + this.props.trainingRoomNamespace}>{this.props.trainingRoomNamespace}</a>
                                        </h1>

                                    </div>
                                    <div className="row">

                                        <div className="col-xl-12 col-lg-12">
                                            <div className="card shadow mb-4">

                                                {
                                                    this.state.error &&
                                                    <div className="card mb-4 py-3  bg-danger text-white shadow">
                                                        <div className="card-body">
                                                            Error   {this.state.error.status}
                                                            <div className="text-white-50 small">
                                                                {this.state.error.message}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                                <svg className="my-4" id="myChart" width="1400Px" height="900Px"
                                                     pointerEvents="all"  ></svg>

                                            </div>


                                        </div>
                                    </div>

                                </div>
                                }
                                {/* /.container-fluid */}
                            </div>
                            {/* End of Main Content */}
                            {/* Footer */}
                            <FooterComponent />
                            {/* End of Footer */}
                        </div>
                        {/* End of Content Wrapper */}
                    </div>
                    {/* End of Page Wrapper */}
                    {/* Scroll to Top Button*/}
                    <a className="scroll-to-top rounded" href="#page-top">
                        <i className="fas fa-angle-up"/>
                    </a>

                </div>

            </div>
        );
    }



    doSocketStuff(payload){
        let self = this;
        if(payload.username !== this.currBotUserame){
            return;
        }
        let lastFireTime = new Date().getTime();
        let nodeData = this.state.nNet.indexedNodes[payload.payload.node]
        function updateDependants(n){
            n.lastFireTime = lastFireTime;
            n.outputFiredCount = n.outputFiredCount || 0;
            n.outputFiredCount += 1;
            if(!n.dependants){
                return;
            }
            n.dependants.forEach((dep)=>{
                let depNode =  self.brainData.indexedNodes[dep.id]
                updateDependants(depNode);
            });
        }
        updateDependants.apply(this,[nodeData]);


        this.simulation.nodes(this.nodes);
        this.updateY();


        console.log("!!!!!!!!!!!");


    }

    updateY(){
        this.inputNodeYHight = ((parseInt(this.svgParent.style('height')) - (this.padding * 2))/this.inputCount);
        this.nodeYHight = ((parseInt(this.svgParent.style('height')) - (this.padding*2))/this.state.nNet.neurons.length);
console.log("this.inputNodeYHight: ", this.inputNodeYHight, "this.nodeYHight: ", this.nodeYHight, "this.inputCount: ", this.inputCount, " this.state.nNet.neurons.length: ", this.state.nNet.neurons.length, " this.padding: ", this.padding)
        this.simulation.force('Y', d3Force.forceY()
            .y((d) => {
                let y = null;
                switch(d._base_type){
                    case('output'):
                        y = d._outputIndex * this.nodeYHight + this.padding;
                        //inputYCount += 1
                        return y;

                    case('input'):
                        y = d._inputIndex * this.inputNodeYHight + this.padding;
                        //outputYCount += 1
                        return y;

                    default:
                        return y ;
                }
            })
            .strength(function(d) {

                switch(d._base_type){
                    case('output'):
                        return 1;
                    case('input'):
                        return 1;
                    default:
                        return 0 ;
                }
            })
        )
        //.alphaMin(0.5)
            .alpha(1).restart()
    }
    startDrawing() {


        //this.xScale = d3Scale.linear().range([0, 720]),
        //this.yScale = d3Scale.linear().range([0, 720]),
        this.svgParent = d3.select("svg");
        if(!this.svgParent){
            throw new Error("Missing `this.svGParent`");
        }
        console.log("svgParent:")
        this.svg = this.svgParent.append("svg:g");
        /*this.svgParent.attr('height', () => {
          return this.state.nNet.nodes.length * 20 + 100;
        })*/


        var zoom = d3Zoom.zoom()
        //.scaleExtent([1, 10])
            .on("zoom", (e)=>{ this.zoomed(e) })
        this.svg.call(zoom);



        this.inputCount = 0;
        this.outputCount = 0;
        this.state.nNet.neurons.forEach((neuron)=>{

            switch(neuron._base_type){
                case('input'):
                    neuron._inputIndex = this.inputCount;
                    this.inputCount += 1;
                break;
                case('output'):

                    neuron._outputIndex = this.outputCount;
                    this.outputCount += 1;
                    break;
            }
        })


        this.simulation = d3Force.forceSimulation()
            .force("link", d3Force.forceLink().id(function(d) { return d.id; }))
            .force("collide", d3Force.forceCollide().radius((d)=> {
                console.log("this.nodeYHight : " + this.nodeYHight );
                if(this.nodeYHight < 20){
                    return 20;
                }
                return this.nodeYHight * 2;
            }).iterations(2))

            .force('x', d3Force.forceX()
                .x((d)=> {

                    switch(d._base_type){
                        case('output'):
                            return parseInt(this.svgParent.style("width"));
                        case('input'):
                            return 0;
                        default:
                            return null;
                    }
                })
                .strength(function(d) {

                    switch(d._base_type){
                        case('output'):
                            return 1;
                        case('input'):
                            return 1;
                        default:
                            return 0 ;
                    }
                })
            )

        this.updateY();


        let force = this.simulation
            .nodes(this.state.nNet.neurons)


        this.simulation.force("link")
            .links(this.state.links);

        this.drawLink();
        this.drawNode();
        force.on("tick", ()=>{ this.ticked(); });

        //this.drawLabels();


    }
    ticked() {

        this.links
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .classed('hightlighted_link', function(d){
                if(!d.source.lastFireTime ){
                    return false;
                }
                return (new Date().getTime() - d.source.lastFireTime < 1000);
            })
            .classed('link', function(d){
                if(!d.source.lastFireTime ){
                    return true;
                }
                return !(new Date().getTime() - d.source.lastFireTime < 1000);
            })

        this.nodes
            .each(function(d){
                d3.select(d.node).attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .classed('firing_node', function(d){
                    if(!d.lastFireTime ){
                        return
                    }

                    return (new Date().getTime() - d.lastFireTime < 1000);
                })
            })




    }
    drawLink() {

        this.links = this.svg
            .selectAll("line")
            .data(this.state.links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .classed('hightlighted_link', function(d){
                if(!d.source.node){
                    return false;
                }
                return d.source.node.classed('selected_node');
            })

        this.links.exit().remove();
    }

    drawNode() {


        this.nodes = this.svg
            .selectAll("g.node")
            .data(this.state.nNet.neurons)
            .enter();

        let nodeEnter = this.nodes
            .append("g")
            .attr("class", "node")

            .each(function(d) { d.node = this; })
            .on("mouseover", (d)=>{



/*
                let self = this;
                function updateDependants(d){
                    d3.select(d.node).classed('selected_node', true);
                    if(!d.dependants){
                        return;
                    }
                    d.dependants.forEach((dep)=>{
                        let depNode = self.brainData.indexedNodes[dep.id]
                        updateDependants(depNode);
                    });
                }
                updateDependants.apply(this,[nodeData]);*/


            })
            .on("mouseout", (d)=>{

               /* let self = this;
                function updateDependants(d){
                    d3.select(d.node).classed('selected_node', false);
                    if(!d.dependants){
                        return;
                    }
                    d.dependants.forEach((dep)=>{
                        let depNode =  self.state.nNet.neurons
                        updateDependants(depNode);
                    });
                }
                updateDependants.apply(this,[nodeData]);*/
            })



        nodeEnter.append('svg:circle')
            .attr("class", "node_circle")
            .attr('r', (d) => {
                return 10;//this.nodeYHight / 2;
            })
            .each(function(d){
                let className = null;
                switch(d._base_type){
                    case('output'):
                        className = "output_node";
                        break;
                    case('input'):
                        className = "input_node";
                        break;
                    case('middle'):
                        className = "middle_node";
                        break;
                }
                d3.select(d.node).select('circle').classed(className, true);
            })


        //nodeEnter.merge(this.nodes)
        nodeEnter.append("svg:text")
            .attr("text-anchor", "middle")
            .attr("class","textClass")
            .attr("id", function(d) { return  d.id;})
            .attr("fill", "black")
            .attr("stroke-width",(d)=>{ return this.nodeYHight/10 })
            .attr("font-size", function(d){return this.nodeYHight * 6})
            .attr("text-align", "center")
            .attr("dy", function(d){return 30})
            .text(function(d) {
                let text = d["$TYPE"];
                if(d["$ATTRIBUTE_ID"]){
                    text += " " + d["$ATTRIBUTE_ID"] + ":" + d["$ATTRIBUTE_VALUE"];
                }
                return text;
            });


        var drag = d3Drag.drag()
            .on("start", (e)=>{ this.dragstarted(e); })
            .on("drag",  (e)=>{ this.dragged(e); })
            .on("end", (e)=>{  this.dragended(e); });
        drag(this.svg);

        this.nodes.exit()
        //.transition()
            .remove();
    }


    dragstarted(d) {
        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;

    }

    dragged(d) {
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;

    }

    dragended(d) {
        if (!d3.event.active) this.simulation.alphaTarget(0);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }
    zoomed(d){
        this.svg.attr("transform", d3.event.transform)
    }

}



export default TrainingRoomOrgNNetDetailPage;