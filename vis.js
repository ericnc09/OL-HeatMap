
function load_rect_plot(data){

  var svg = d3.select("svg");

  svg.selectAll("rect").remove();

  var rects = svg.selectAll("rects")
    .data(data.regions)
    .enter()
    .append("rect");


  var colors = ["#FFFFFF", "#8cbeff","#558ee5","#0161b2","#003882","#001454"];
  var colorScale = ["#61ff99", "#63eb68", "#48a44d", "#2c702f", "#105010"];

  if (data.dimension == 2) {

    var rectAttributes = rects
      .attr("x", function(r) {
        return r.factors[0].lower;} )
      .attr("y", function (r){return r.factors[1].upper;})
      .attr("width", function(r) {
        return r.factors[0].upper - r.factors[0].lower;})
      .attr("height", function(r){
        return r.factors[1].upper - r.factors[1].lower;})
      .attr("z-index", function (r){return r.originals.length;})
      /*.call(d3.zoom().on("zoom", function(){
          svg.attr("transform",d3.event.transform)
      }))*/
      //.style("fill", chroma.random())
      //.style("fill",function (d) {return colorScaleGR[d.c-1];})
      /* .style("fill",function (d){return colorScale[d.c-1];})*/
      .style("fill", function (r){return colors[r.originals.length];})

  }
}