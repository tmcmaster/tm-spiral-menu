import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import * as d3 from "d3v4";

/**
 * `tm-spiral-menu`
 * Polymer spiral menu web component
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TmSpiralMenu extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
              display: block;
            }
            
            svg { 
                position: absolute;
                top: 200px;
                left: 100px;
                box-sizing: border-box;
                border: solid red 1px;
            }
            
            /*#ball {*/
              /*width: 10px;*/
              /*height: 10px;*/
              /*background-color: red;*/
              /*border-radius: 50%;*/
              /**/
              /*offset-path: path('M 10 80 Q 77.5 10, 145 80 T 280 80');*/
              /*offset-distance: 0%;*/
            
              /*//animation: red-ball 2s linear alternate infinite;*/
              /*animation: red-ball 2s linear forwards;*/
            /*}*/
            
            /*@keyframes red-ball {*/
              /*from {*/
                /*offset-distance: 0%;*/
              /*}*/
              /*to {*/
                /*offset-distance: 100%;*/
              /*}*/
            /*}*/

        </style>
        <svg id="svg" height="500" width="500">
            <g>
               <circle id="ball" class="" cx="0" cy="0" r="10" stroke="black" stroke-width="1" fill="cyan" />
               <circle id="ball" class="" cx="0" cy="0" r="10" stroke="black" stroke-width="1" fill="teal" />
            </g>
        </svg> 
    `;
    }


    // d3.select('path')
    //     .transition()
    //     .attrTween('d', function (d) {
    //         var previous = d3.select(this).attr('d');
    //         var current = line(d);
    //         return d3.interpolatePath(previous, current);
    //     });

    static get properties() {
        return {
            prop1: {
                type: String,
                value: 'tm-spiral-menu',
            },
        };
    }

    ready() {
        super.ready();

        let svg = d3.select(this.$.svg).select('g').attr("transform", "translate(" + 200 + "," + 200 + ")");

        let circle = svg.select('#ball');

        let width = 200;
        let start=0, end=2.25;
        let r = 100;
        let marginSize = width / 30;
        let radius = d3.scaleLinear()
            .domain([start, end])
            .range([marginSize, r]);
        let spirals = 3;
        let points = d3.range(start, end + 0.001, (end - start) / 1000);
        let theta = function(r) {
            return spirals * Math.PI * r;
        };

        let spiral = d3.radialLine()
            .curve(d3.curveCardinal)
            .angle(theta)
            .radius(radius);

        let path = svg.append("path")
            .datum(points)
            .attr("id", "spiral")
            .attr("d", spiral)
            .style("fill", "none")
            .style("stroke", "steelblue");


        console.log('PATH: ', path);


        // let length = path.node().getTotalLength();
        // let rr = d3.interpolate(0, length);
        //
        // function createPathTween(circle, length, r) {
        //
        //     return function(t){
        //         let point = path.node().getPointAtLength(r(t)); // Get the next point along the path
        //         circle.attr("cx", point.x) // Set the cx
        //             .attr("cy", point.y) // Set the cy
        //     }
        // }


        let interpolator = d3.interpolate(0, path.node().getTotalLength()); //Set up interpolation from 0 to the path length
        // let items = [
        //     {name: 'A', color: 'teal'},
        //     {name: 'B', color: 'cyan'},
        //     {name: 'C', color: 'purple'}
        // ];
        // let circles = svg.select('circle').data(items).enter()
        //     .append('circle')
        //     .attr('cx', 0)
        //     .attr('cy', 0)
        //     .attr('r', 10)
        //     .attr('fill', function(d) { return d.color });

         circle.transition()
            .delay(250)
            .duration(10000)
            .ease(d3.easeLinear)
            .tween("pathTween", function(){
                //let circle = d3.select(this);
                return function(t){
                    let point = path.node().getPointAtLength(interpolator(t)); // Get the next point along the path
                    // Select the circle
                    //let circle = d3.select(self);

                    circle.attr("cx", point.x) // Set the cx
                        .attr("cy", point.y) // Set the cy
                }
            });
    }

}

window.customElements.define('tm-spiral-menu', TmSpiralMenu);
