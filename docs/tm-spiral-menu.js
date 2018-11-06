define(["./node_modules/@polymer/polymer/polymer-element.js","./node_modules/d3-selection/index.js","./node_modules/d3-scale/index.js","./node_modules/d3-array/index.js","./node_modules/d3-shape/index.js","./node_modules/d3-interpolate/index.js","./node_modules/d3-transition/index.js","./node_modules/d3-ease/index.js"],function(_polymerElement,_index,_index2,_index3,_index4,_index5,_index6,_index7){"use strict";const d3={select:_index.select,scaleLinear:_index2.scaleLinear,range:_index3.range,radialLine:_index4.radialLine,curveCardinal:_index4.curveCardinal,interpolate:_index5.interpolate,transition:_index6.transition,easeLinear:_index7.easeLinear};class TmSpiralMenu extends _polymerElement.PolymerElement{static get template(){return _polymerElement.html`
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
    `}static get properties(){return{animating:{type:Number,value:0},duration:{type:Number,value:1e3},open:{type:Boolean,value:!1},items:{type:Array,value:[]},spirals:{type:Number,value:2},radius:{type:Number,value:250},size:{type:Number,computed:"_calculateSize(radius)"}}}static get observers(){return["_buildMenu(items, spirals, radius)"]}ready(){super.ready()}_calculateSize(radius){return 2*radius}_buildMenu(items,noOfSpirals,radiusOfMenu){let self=this;this.open=!1;d3.select(this.$.container).select("*").remove();let r=radiusOfMenu,size=2*r,start=0,end=2.25,svg=d3.select(this.$.container).append("svg").attr("width",size).attr("height",size),radius=d3.scaleLinear().domain([start,end]).range([size/30,r]),points=d3.range(start,end+.001,(end-start)/1e3),g=svg.append("g").attr("transform","translate("+size/2+","+size/2+")"),spiral=d3.radialLine().curve(d3.curveCardinal).angle(function(r){return noOfSpirals*Math.PI*r}).radius(function(a,b,c){let result=radius(a,b,c);return result<.7*r?result:.7*r}),path=g.append("path").datum(points).attr("id","spiral").attr("d",spiral).style("fill","none").style("stroke","none"),interpolator=d3.interpolate(0,path.node().getTotalLength()),spiralLength=path.node().getTotalLength(),numberOfItems=items.length,itemRadius=radiusOfMenu/numberOfItems,distanceAdjRatio=3.14159*2*(.68*r)/numberOfItems/spiralLength,circles=g.selectAll("g.items").data(items).enter().append("g").attr("class","items").attr("x",0).attr("y",0);circles.append("circle").attr("cx",0).attr("cy",0).attr("r",itemRadius).attr("class","items").attr("fill","teal");circles.append("text").attr("class","items").attr("font-family","sans-serif").attr("font-size",itemRadius/5+"px").attr("fill","white").text(d=>{return d.title?d.title:d.color}).attr("x",-1*itemRadius).attr("y",-1*itemRadius).call(function(text,width){text.each(function(){let text=d3.select(this),words=text.text().split(/\s+/).reverse(),word,line=[],lineNumber=0,lineHeight=1.1,x=text.attr("x"),y=text.attr("y"),dy=1,lines=0,tspan=text.text(null).append("tspan").attr("x",x).attr("y",y).attr("dy",dy+"em");while(word=words.pop()){line.push(word);tspan.text(line.join(" "));let currentY=lineNumber*lineHeight,widthAtY=Math.sqrt(size*size-(size-currentY)*(size-currentY));if(tspan.node().getComputedTextLength()>widthAtY){line.pop();tspan.text(line.join(" "));line=[word];lines++;let lineWidth=tspan.node().getComputedTextLength();tspan.attr("dx",(width-lineWidth)/2+"px");tspan=text.append("tspan").attr("x",x).attr("y",y).attr("dy",++lineNumber*lineHeight+dy+"em").text(word)}}let lineWidth=tspan.node().getComputedTextLength();tspan.attr("dx",(width-lineWidth)/2+"px")})},2*itemRadius,2*itemRadius);let menuButtonSize=radiusOfMenu/6<1.5*itemRadius?1.5*itemRadius:radiusOfMenu/6;g.append("circle").attr("cx",0).attr("cy",-10).attr("r",menuButtonSize).attr("fill","teal").on("click",menu);let menuFontSize=menuButtonSize/2,menuText=g.append("text").text("MENU").attr("class","menu").attr("font-family","sans-serif").attr("font-size",menuFontSize+"px").attr("x",0).attr("y",menuFontSize/4-8+"px").attr("fill","white");menuText.on("click",menu);let menuTextLength=menuText.node().getComputedTextLength();menuText.attr("x",-1*(menuTextLength/2));function menu(){if(0<self.animating)return;if(!self.open){g.selectAll("g.items").transition().delay(function(d,i){return 50*(i+1)}).duration(function(d,i){return self.duration+50*(numberOfItems-i-1)}).ease(d3.easeLinear).tween("pathTween",(d,i,circles)=>{self.animating++;return function(t){let distanceALongLing=interpolator(t)*(1-distanceAdjRatio*i),point=path.node().getPointAtLength(distanceALongLing);(0,_index.select)(circles[i]).attr("transform","translate("+point.x+","+point.y+")")}}).on("end",()=>{self.animating--;if(0===self.animating){self.open=!0}})}else{g.selectAll("g.items").transition().delay(function(d,i){return 50*(i+1)}).duration(function(d,i){return self.duration+50*(numberOfItems-i-1)}).ease(d3.easeLinear).tween("pathTween",(d,i,circles)=>{self.animating++;return function(t){let distanceALongLing=spiralLength*(1-distanceAdjRatio*i)-interpolator(t),point=path.node().getPointAtLength(distanceALongLing);d3.select(circles[i]).attr("transform","translate("+point.x+","+point.y+")")}}).on("end",()=>{self.animating--;if(0===self.animating){self.open=!1}})}}}}window.customElements.define("tm-spiral-menu",TmSpiralMenu)});