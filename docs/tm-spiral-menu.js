import { html, PolymerElement } from "./node_modules/@polymer/polymer/polymer-element.js"; //import * as d3 from "d3v4";

import { select as d3select } from "./node_modules/d3-selection/index.js";
import { scaleLinear as d3scaleLinear } from "./node_modules/d3-scale/index.js";
import { range as d3range } from "./node_modules/d3-array/index.js";
import { radialLine as d3radialLine, curveCardinal as d3curveCardinal } from "./node_modules/d3-shape/index.js";
import { interpolate as d3interpolate } from "./node_modules/d3-interpolate/index.js";
import { transition as d3transition } from "./node_modules/d3-transition/index.js";
import { easeLinear as d3easeLinear } from "./node_modules/d3-ease/index.js";
const d3 = {
  select: d3select,
  scaleLinear: d3scaleLinear,
  range: d3range,
  radialLine: d3radialLine,
  curveCardinal: d3curveCardinal,
  interpolate: d3interpolate,
  transition: d3transition,
  easeLinear: d3easeLinear
};
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
                box-sizing: border-box;
                //border: solid red 1px;
            }
            
            #container {
                display: inline-block;
                box-sizing: border-box;
                border: solid teal 2px;
                border-radius: 100%;
            }
            
            text.items {
                border: solid teal 1px;
                box-sizing: border-box;
            }
        </style>
    
        <div id="container">
        
        </div>
    `;
  }

  static get properties() {
    return {
      animating: {
        type: Number,
        value: 0
      },
      duration: {
        type: Number,
        value: 1000
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
    return ['_buildMenu(items, spirals, radius)'];
  }

  ready() {
    super.ready();
  }

  _calculateSize(radius) {
    return radius * 2;
  }

  _buildMenu(items, noOfSpirals, radiusOfMenu) {
    let self = this;
    this.open = false;
    d3.select(this.$.container).select('*').remove();
    let r = radiusOfMenu; //size / 2;

    let size = r * 2; //500;

    let start = 0,
        end = 2.25;
    let width = size;
    let height = size;
    let svg = d3.select(this.$.container).append('svg').attr('width', width).attr('height', height);
    let marginSize = size / 30;
    let radius = d3.scaleLinear().domain([start, end]).range([marginSize, r]);
    let spirals = noOfSpirals;
    let points = d3.range(start, end + 0.001, (end - start) / 1000);
    let g = svg.append('g').attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");

    let theta = function (r) {
      return spirals * Math.PI * r;
    };

    let spiral = d3.radialLine().curve(d3.curveCardinal).angle(theta).radius(function (a, b, c) {
      let result = radius(a, b, c);
      return result < r * 0.7 ? result : r * 0.7;
    });
    let path = g.append("path").datum(points).attr("id", "spiral").attr("d", spiral).style("fill", "none").style("stroke", "none");
    let interpolator = d3.interpolate(0, path.node().getTotalLength()); //Set up interpolation from 0 to the path length

    let spiralLength = path.node().getTotalLength();
    let numberOfItems = items.length;
    let itemRadius = radiusOfMenu / numberOfItems;
    let calculatedRadius = r * 0.68; //170;

    let circumference = 2 * 3.14159 * calculatedRadius;
    let itemSeparation = circumference / numberOfItems;
    let seperationRatio = itemSeparation / spiralLength; // reduces how far an item travels along the spiral path

    let distanceAdjRatio = seperationRatio; //0.105;

    let circles = g.selectAll('g.items').data(items).enter().append('g').attr('class', 'items').attr('x', 0).attr('y', 0);
    circles.append('circle').attr('cx', 0).attr('cy', 0).attr('r', itemRadius).attr('class', 'items').attr('fill', 'teal'); //.attr('fill', function(d) { return d.color });

    circles.append('text').attr('class', 'items').attr('font-family', 'sans-serif').attr('font-size', itemRadius / 5 + "px").attr('fill', 'white').text(d => {
      return d.title ? d.title : d.color;
    }) // .attr('x', (d,i) => {return -40})
    // .attr('y', (d,i) => {return -40})
    .attr('x', -1 * itemRadius).attr('y', -1 * itemRadius).call(wrap, itemRadius * 2, itemRadius * 2);

    function wrap(text, width, height) {
      text.each(function () {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            // ems
        x = text.attr("x"),
            y = text.attr("y"),
            dy = 1,
            lines = 0,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          let currentY = lineNumber * lineHeight; //let widthAtY = 2 * Math.sqrt(size*size - ((size-currentY) * (size-currentY)));

          let widthAtY = Math.sqrt(size * size - (size - currentY) * (size - currentY));

          if (tspan.node().getComputedTextLength() > widthAtY) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            lines++;
            let lineWidth = tspan.node().getComputedTextLength();
            let dx = (width - lineWidth) / 2;
            tspan.attr("dx", dx + "px");
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }

        let lineWidth = tspan.node().getComputedTextLength();
        let dx = (width - lineWidth) / 2;
        tspan.attr("dx", dx + "px"); // let textHeight = lineHeight * lines;
        // let textTop = (height-textHeight) / 2 - 20;
        // text.attr("y", textTop);
        // text.select('tspan')
        //         .attr('dy', (d,i) => {return (textTop + 10*i) + "em"});
      });
    } // let circles = g.selectAll('circle.items').data(items).enter()
    //     .append('circle')
    //     .attr('cx', 0)
    //     .attr('cy', 0)
    //     .attr('r', itemRadius)
    //     .attr('class', 'items')
    //     .attr('fill', function(d) { return d.color });
    // g.selectAll('text.items').data(items).enter()
    //     .append('text')
    //     .attr('class', 'items')
    //     .attr('font-family', 'sans-serif')
    //     .attr('font-size', '12px')
    //     .text((d) => {return d.color + " sfasdffdsa sfasdf sdf sdf sd"})
    //     .attr('x', (d,i) => {return -25})
    //     .attr('y', (d,i) => {return -10})
    //
    //     .call(wrap, 80);


    let menuButtonSize = radiusOfMenu / 6 < itemRadius * 1.5 ? itemRadius * 1.5 : radiusOfMenu / 6;
    g.append('circle').attr('cx', 0).attr('cy', -10).attr('r', menuButtonSize).attr('fill', "teal").on('click', menu);
    let menuFontSize = menuButtonSize / 2;
    let menuText = g.append('text').text('MENU').attr('class', 'menu').attr('font-family', 'sans-serif').attr('font-size', menuFontSize + "px").attr('x', 0).attr('y', menuFontSize / 4 - 8 + "px").attr('fill', 'white');
    menuText.on('click', menu);
    let menuTextLength = menuText.node().getComputedTextLength();
    menuText.attr('x', -1 * (menuTextLength / 2)); //menu();

    function menu() {
      if (self.animating > 0) return;

      if (!self.open) {
        g.selectAll('g.items').transition().delay(function (d, i) {
          return 50 * (i + 1);
        }).duration(function (d, i) {
          return self.duration + 50 * (numberOfItems - i - 1);
        }).ease(d3.easeLinear).tween("pathTween", (d, i, circles) => {
          self.animating++;
          return function (t) {
            let distanceALongLing = interpolator(t) * (1 - distanceAdjRatio * i);
            let point = path.node().getPointAtLength(distanceALongLing);
            d3select(circles[i]).attr("transform", "translate(" + point.x + "," + point.y + ")");
          };
        }).on("end", () => {
          self.animating--;

          if (self.animating === 0) {
            self.open = true;
          }
        });
      } else {
        g.selectAll('g.items').transition().delay(function (d, i) {
          return 50 * (i + 1);
        }).duration(function (d, i) {
          return self.duration + 50 * (numberOfItems - i - 1);
        }).ease(d3.easeLinear).tween("pathTween", (d, i, circles) => {
          self.animating++;
          return function (t) {
            let distanceALongLing = spiralLength * (1 - distanceAdjRatio * i) - interpolator(t);
            let point = path.node().getPointAtLength(distanceALongLing);
            d3.select(circles[i]).attr("transform", "translate(" + point.x + "," + point.y + ")");
          };
        }).on("end", () => {
          self.animating--;

          if (self.animating === 0) {
            self.open = false;
          }
        });
      }
    }
  }

}

window.customElements.define('tm-spiral-menu', TmSpiralMenu);