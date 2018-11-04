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
              display: flex;
              flex-direction: row;
              justify-content: center;
            }
            
            svg { 
                flex: 1;
                /*position: absolute;*/
                /*top: 200px;*/
                /*left: 100px;*/
                box-sizing: border-box;
                //border: solid red 1px;
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
            #container {
                display: inline-block;
                box-sizing: border-box;
                border: solid teal 2px;
            }
        </style>
        <div id="container">
        
        </div>
      
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
            animating: {
                type: Number,
                value: 0,
            },
            duration: {
                type: Number,
                value: 2000
            },
            open: {
                type: Boolean,
                value: false
            },
            items: {
                type: Array,
                value: []
            },
            spirals: {
                type: Number,
                value: 2
            },
            radius: {
                type: Number,
                value: 250
            },
            size: {
                type: Number,
                computed: '_calculateSize(radius)'
            }
        };
    }

    static get observers() {
        return [
            '_buildMenu(items, spirals, radius)'
        ];
    }

    ready() {
        super.ready();
    }

    _calculateSize(radius) {
        return radius*2;
    }

    _buildMenu(items, noOfSpirals, radiusOfMenu) {
        var self = this;

        let r = radiusOfMenu; //size / 2;
        let size = r*2;//500;
        let start=0, end=2.25;

        let width = size;
        let height = size;

        let svg = d3.select(this.$.container)
            .append('svg').attr('width', width).attr('height', height);


        let marginSize = size / 30;
        let radius = d3.scaleLinear()
            .domain([start, end])
            .range([marginSize, r]);
        let spirals = noOfSpirals;
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
        // let items = [
        //     {name: 'A', color: 'teal'},
        //     {name: 'B', color: 'cyan'},
        //     {name: 'C', color: 'purple'},
        //     {name: 'A', color: 'orange'},
        //     {name: 'B', color: 'green'},
        //     {name: 'C', color: 'blue'},
        //     {name: 'C', color: 'yellow'},
        //     {name: 'A', color: 'teal'},
        //     // {name: 'B', color: 'cyan'},
        //     // {name: 'C', color: 'purple'},
        //     // {name: 'A', color: 'orange'},
        //     // {name: 'B', color: 'green'},
        //     // {name: 'C', color: 'blue'},
        //     // {name: 'C', color: 'yellow'},
        //     // {name: 'A', color: 'teal'},
        //     // {name: 'B', color: 'cyan'},
        //     // {name: 'C', color: 'purple'},
        //     // {name: 'A', color: 'orange'},
        //     // {name: 'B', color: 'green'},
        //     // {name: 'C', color: 'blue'},
        //     // {name: 'C', color: 'yellow'},
        //     // {name: 'A', color: 'teal'},
        //     // {name: 'B', color: 'cyan'},
        //     // {name: 'C', color: 'purple'},
        //     // {name: 'A', color: 'orange'},
        //     // {name: 'B', color: 'green'},
        //     // {name: 'C', color: 'blue'},
        //     // {name: 'C', color: 'yellow'},
        //     // {name: 'A', color: 'teal'},
        //     // {name: 'B', color: 'cyan'},
        //     // {name: 'C', color: 'purple'},
        //     // {name: 'A', color: 'orange'},
        //     // {name: 'B', color: 'green'},
        //     // {name: 'C', color: 'blue'},
        //     // {name: 'C', color: 'yellow'},
        //     // {name: 'A', color: 'teal'},
        //     // {name: 'B', color: 'cyan'},
        //     // {name: 'C', color: 'purple'},
        //     // {name: 'A', color: 'orange'},
        //     // {name: 'B', color: 'green'},
        //     // {name: 'C', color: 'blue'},
        //     // {name: 'C', color: 'yellow'},
        // ];

        // let items = data;

        let spiralLength = path.node().getTotalLength();
        let numberOfItems = items.length;
        let itemRadius = radiusOfMenu / numberOfItems;
        let calculatedRadius = r*0.68; //170;
        let circumference = 2*3.14159*calculatedRadius;
        let itemSeparation = circumference / numberOfItems;
        let seperationRatio = itemSeparation / spiralLength;

        // reduces how far an item travels along the spiral path
        let distanceAdjRatio = seperationRatio; //0.105;


        let circles = g.selectAll('circle.items').data(items).enter()
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', itemRadius)
            .attr('class', 'items')
            .attr('fill', function(d) { return d.color });

        g.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', radiusOfMenu/6)
            .attr('fill', "red")
            .on('click', function() {
                if (self.animating > 0) return;

                if (!self.open) {
                    g.selectAll('circle.items').transition()
                        .delay(function(d,i) {return 50*(i+1)})
                        .duration(function(d,i) {return self.duration + (50 * (numberOfItems-i-1))})
                        .ease(d3.easeLinear)
                        .tween("pathTween", (d,i,circles) => {
                            self.animating++;
                            //let circle = d3.select(this);
                            console.log('---A : ', d, i, circles[i]);
                            return function(t){
                                let distanceALongLing = interpolator(t)*(1-(distanceAdjRatio*i));
                                console.log('INTER: ', distanceALongLing);
                                let point = path.node().getPointAtLength(distanceALongLing); // Get the next point along the path
                                // Select the circle
                                //let circle = d3.select(self);

                                d3.select(circles[i]).attr("cx", point.x) // Set the cx
                                    .attr("cy", point.y) // Set the cy
                            }
                        }).on("end", (d,i,circles) => {

                            self.animating--;
                            if (self.animating === 0) {
                                self.open = true;
                            }
                        });
                } else {
                    g.selectAll('circle.items').transition()
                        .delay(function(d,i) {return i*50})
                        .duration(self.duration)
                        .ease(d3.easeLinear)
                        .tween("pathTween", (d,i,circles) => {
                            self.animating++;
                            let circle = circles[i];

                            console.log('---A : ', d, i, circle);
                            return function(t){
                                let distanceALongLing = spiralLength*(1-(distanceAdjRatio*i)) - interpolator(t);
                                console.log('INTER: ', distanceALongLing);
                                let point = path.node().getPointAtLength(distanceALongLing); // Get the next point along the path
                                // Select the circle
                                //let circle = d3.select(self);

                                console.log('CIRCLE: ', d.color, point);
                                d3.select(circles[i]).attr("cx", point.x) // Set the cx
                                    .attr("cy", point.y) // Set the cy
                            }
                        }).on("end", (d,i,circles) => {
                            //d3.select(circles[i]).attr("cx", 0).attr("cy", 0);
                            self.animating--;
                            if (self.animating === 0) {
                                self.open = false;
                            }
                        });
                }

            });


    }

}

window.customElements.define('tm-spiral-menu', TmSpiralMenu);
