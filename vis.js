// draw a plot with only the data regions, no overlaps/grid
function load_data_plot(data){

  var svg = d3.select("#dataPlot");

  svg.selectAll("rect").remove();
  var rects = svg.selectAll("rects")
    .data(data.regions)
    .enter()
    .append("rect");

  var rectAttributes = rects
    .attr("x", function(r) {
      return r.factors[0].lower;} )
    .attr("y", function (r){return r.factors[1].upper;})
    .attr("width", function(r) {
      return r.factors[0].upper - r.factors[0].lower;})
    .attr("height", function(r){
      return r.factors[1].upper - r.factors[1].lower;})
    .attr("fill-opacity", 0)
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
}


function load_plot(data, plot_id){

  var max_overlap = 0;
  for (var i=0; i<data.regions.length; i++){
    r = data.regions[i];
    if (r.originals.length > max_overlap) {
      max_overlap = r.originals.length;
    }
  }

  var svg = d3.select(plot_id);
  svg.attr('data-max-overlap', max_overlap)

  svg.selectAll("rect").remove();

  var rects = svg.selectAll("rects")
    .data(data.regions)
    .enter()
    .append("rect");

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
      .attr("data-c", function (r){return r.originals.length;})
  }
  // cleanup for faster garbage disposal
  data={}
}


function set_plot_colors(colorScale){

  max_overlap = Math.max($('#overlapPlot').attr("data-max-overlap"),
    $('#gridPlot').attr("data-max-overlap"));
  colors = colorScale.colors(max_overlap);

  colors.unshift("white")

  $('#overlapPlot rect, #gridPlot rect').each(function(){
    $(this).css("fill", colors[$(this).attr("data-c")])
  })

}