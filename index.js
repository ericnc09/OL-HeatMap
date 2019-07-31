function load_rect_tree(rect_js){
    //loads the json as rectangle with two axes and width and height
    //console.log(rect_js);
    var rect =  {
        "minX": rect_js.dimensions[0][0],
        "minY": rect_js.dimensions[1][0],
        "maxX": rect_js.dimensions[0][1],
        "maxY" : rect_js.dimensions[1][1]
    };


    if (rect_js.data != undefined){
        rect.originals = rect_js.data.intersect;
        rect.c = rect.originals.length;
    } else {
        rect.c = 1;
    }

    return rect;


}


function construct_grid(width, height) {
    var cell_width=1000/width;
    var cell_height=1000/height;

    var cells=[];

    //console.log(cell_width);
    for(i=0;i<width;i++){
        for(j=0;j<height;j++){
            var new_cell={minX:cell_width*i,
                minY:cell_height*j,
                maxX:cell_width*(i+1),
                maxY:cell_height*(j+1)};
            cells.push(new_cell);
        }
    }
    return cells;

}


function load_rect(rect_js){
    //loads the json as rectangle with two axes and width and height
    //console.log(rect_js);
    var rect =  {
            "x": rect_js.dimensions[0][0],
            "y": rect_js.dimensions[1][0],
            "w": rect_js.dimensions[0][1] - rect_js.dimensions[0][0],
            "h" : rect_js.dimensions[1][1] - rect_js.dimensions[1][0]
    };
    if (rect_js.data != undefined){
        rect.originals = rect_js.data.intersect;
        rect.c = rect.originals.length;
    } else {
        rect.c = 1;
    }

    return rect;
}

function load_graphics(data){


    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    // Add title to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("A d3.js work");

    // create a tooltip
    var Tooltip = d3.select("#div_template")
        .append("div")
        .style("opacity", 0.5)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        Tooltip
            // .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
             //.style("opacity", .5)
    };
    var mousemove = function(d) {
        Tooltip
            .html("The exact value of<br>this cell is: " + d.c)
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    };
    var mouseleave = function(d) {
        Tooltip
            // .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            //
    };

    //var color = d3.scale.category20();

/*    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Frequency:</strong> <span style='color:red'>" + d.c + "</span>";
        });

    svg.call(tip);*/


    var rects = svg.selectAll("rects")
        .data(data)
        .enter()
        .append("rect");


    var colors = ["#FFFFFF", "#8cbeff","#558ee5","#0161b2","#003882","#001454"];

    //color selection

  /*  var colorScale = d3.scale.quantile()
        .domain(valueArray)
        .range(colors);*/
    var colorScale = ["#61ff99", "#63eb68", "#48a44d", "#2c702f", "#105010"];

 /*   var cs = chroma.scale(['#fafa6e','#2A4858'])
        .mode('lch').colors(6);*/

/*    var colorScaleGR =["#54af46",
        "#8adb95",
        "#fbff7c",
        "#f4777f"
        ,"#93003a"];*/

//    var colors = chroma.scale('Spectral').domain([1,0]);

    var rectAttributes = rects
        .attr("x", function(d) {return d.x;} )
        .attr("y", function (d){return d.y;})
        .attr("width", function(d) {return Math.abs(d.w);})
        .attr("height", function(d){return Math.abs(d.h);})
        .attr("z-index", function (d){return d.c;})
        /*.call(d3.zoom().on("zoom", function(){
            svg.attr("transform",d3.event.transform)
        }))*/
        //.style("fill", chroma.random())
        //.style("fill",function (d) {return colorScaleGR[d.c-1];})
       /* .style("fill",function (d){return colorScale[d.c-1];})*/
       .style("fill", function (d){return colors[d.c];})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);


}
