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

        let svg = d3.select(this.$.svg);

        let size = 500;
        let start=0, end=2.25;
        let r = size / 2;
        let marginSize = size / 30;
        let radius = d3.scaleLinear()
            .domain([start, end])
            .range([marginSize, r]);
        let spirals = 2;
        let points = d3.range(start, end + 0.001, (end - start) / 1000);

        let g = svg.append('g').attr("transform", "translate(" + (size/2) + "," + (size/2)  + ")");

        let circle = svg.select('#ball');



        let theta = function(r) {
            return spirals * Math.PI * r;
        };

        let spiral = d3.radialLine()
            .curve(d3.curveCardinal)
            .angle(theta)
            .radius(function(a,b,c) {
                let result = radius(a,b,c);
                //console.log('Radial: ', a, b, result);
                return (result < r*0.7 ? result : r*0.7);
            });

        let path = g.append("path")
            .datum(points)
            .attr("id", "spiral")
            .attr("d", spiral)
            .style("fill", "none")
            .style("stroke", "none");


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
        let items = [
            {name: 'A', color: 'teal'},
            {name: 'B', color: 'cyan'},
            {name: 'C', color: 'purple'},
            {name: 'A', color: 'orange'},
            {name: 'B', color: 'green'},
            {name: 'C', color: 'blue'}
        ];


        let circles = g.selectAll('circle.items').data(items).enter()
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 50)
            .attr('class', 'items')
            .attr('fill', function(d) { return d.color });

        let spiralLength = path.node().getTotalLength();
        let numberOfItems = items.length;

        let open = 0;
        let animating = false;

        g.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 50)
            .attr('fill', "red")
            .on('click', function() {
                if (animating) return;
                animating = true;

                if (open === 0) {
                    g.selectAll('circle.items').transition()
                        .delay(function(d,i) {return 50*(i+1)})
                        .duration(5000)
                        .ease(d3.easeLinear)
                        .tween("pathTween", (d,i,circles) => {
                            //let circle = d3.select(this);
                            console.log('---A : ', d, i, circles[i]);
                            return function(t){
                                let distanceALongLing = interpolator(t)*(1-(0.105*i));
                                console.log('INTER: ', distanceALongLing);
                                let point = path.node().getPointAtLength(distanceALongLing); // Get the next point along the path
                                // Select the circle
                                //let circle = d3.select(self);

                                d3.select(circles[i]).attr("cx", point.x) // Set the cx
                                    .attr("cy", point.y) // Set the cy
                            }
                        });
                } else {
                    g.selectAll('circle.items').transition()
                        .delay(function(d,i) {return 50*(numberOfItems-(i+1))})
                        .duration(5000)
                        .ease(d3.easeLinear)
                        .tween("pathTween", (d,i,circles) => {
                            //let circle = d3.select(this);
                            console.log('---A : ', d, i, circles[i]);
                            return function(t){
                                let distanceALongLing = spiralLength - interpolator(t);
                                console.log('INTER: ', distanceALongLing);
                                let point = path.node().getPointAtLength(distanceALongLing); // Get the next point along the path
                                // Select the circle
                                //let circle = d3.select(self);

                                d3.select(circles[i]).attr("cx", point.x) // Set the cx
                                    .attr("cy", point.y) // Set the cy
                            }
                        });
                }
                open = 1 - open;
                animating = false;
            });


    }

}

window.customElements.define('tm-spiral-menu', TmSpiralMenu);
