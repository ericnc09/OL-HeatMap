// draw a plot with only the data regions, no overlaps/grid
function load_data_plot(data){

  var svg = d3.select("#dataPlot");

  svg.selectAll("rect").remove();
  var rects = svg.selectAll("rects")
    .data(data.regions)
    .enter()
    .append("rect");

  if (data.id.includes("US")) {
    svg.selectAll("image")
      .attr("display", "inherit")
      .attr("y", data.bounds.factors[1].upper - 49.7)
  } else {
    svg.selectAll("image")
      .attr("display", "none")
  }

  if (data.dimension == 1) {

    // data.regions.sort(function(x, y){
    //    return d3.ascending(x.factors[0].lower, y.factors[0].lower);
    // })

    var total_height = (data.bounds.factors[0].upper
      - data.bounds.factors[0].lower)
    var rect_height = (total_height / data.regions.length) - 1
    for (var i = 0; i < data.regions.length; i++){
      data.regions[i].factors.push({
        'lower': total_height - (i + (i + 1) * rect_height),
        'upper': total_height - (i + i * rect_height)})
    }
  
  } 

  var width = data.bounds.factors[0].upper - data.bounds.factors[0].lower

  var rectAttributes = rects
    .attr("data-id", function(r){ return r.id;})
    .attr("data-y", function(r){ return r.factors[1].lower;})
    .attr("x", function(r) {
      return r.factors[0].lower;} )
    .attr("y", function (r){
      return data.bounds.factors[1].upper - r.factors[1].upper;})
    .attr("width", function(r) {
      return r.factors[0].upper - r.factors[0].lower;})
    .attr("height", function(r){
      return r.factors[1].upper - r.factors[1].lower;})
    .attr("fill-opacity", 0)
    .attr("stroke", "black")
    .attr("stroke-width", 0.001 * width)

  if (data.dimension == 1) {
    for (var i = 0; i < data.regions.length; i++){
      data.regions[i].factors.pop()
    }
  }
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

  data.regions.sort(function(a, b){
    return a.originals.length - b.originals.length
  })


  if (data.id.includes("US")) {
    svg.selectAll("image")
      .attr("display", "inherit")
      .attr("y", data.bounds.factors[1].upper - 49.7)
  } else {
    svg.selectAll("image")
      .attr("display", "none")
  }

  svg.selectAll("rect").remove();
  var rects = svg.selectAll("rects")
    .data(data.regions)
    .enter()
    .append("rect");

  if (data.dimension == 1) {

    var total_height = (data.bounds.factors[0].upper
      - data.bounds.factors[0].lower)


    for (var i = 0; i < data.regions.length; i++){
      data.regions[i].factors.push({
        'lower': (total_height / 2) - 30,
        'upper': (total_height / 2) + 30})
    }
  
  }

  var rectAttributes = rects
    .attr("data-id", function(r){ return r.id;})
    .attr("data-y", function(r){ return r.factors[1].lower;})
    .attr("data-originals", function(r){ return r.originals.join("<br>");})
    .attr("x", function(r) {
      return r.factors[0].lower;} )
    .attr("y", function (r){
      return data.bounds.factors[1].upper - r.factors[1].upper;})
    .attr("width", function(r) {
      return r.factors[0].upper - r.factors[0].lower;})
    .attr("height", function(r){
      return r.factors[1].upper - r.factors[1].lower;})
    .attr("z-index", function (r){return r.originals.length;})
    .attr("data-c", function (r){return r.originals.length;})
  
  // cleanup for faster garbage disposal
  data={}

  if (data.dimension == 1) {
    for (var i = 0; i < data.regions.length; i++){
      data.regions[i].factors.pop()
    }
  }
}


function set_plot_colors(colorScale){

  var overlapMax = $('#overlapPlot').attr("data-max-overlap")
  var gridMax = $('#gridPlot').attr("data-max-overlap")

  // if extreme difference in max overlaps, set scales separately
  if (gridMax > overlapMax * 10) {

    colors = colorScale.colors(overlapMax);
    colors.unshift("rgba(255, 255, 255, 0)")
    
    $('#overlapPlot rect').each(function(){
      $(this).attr("fill", colors[$(this).attr("data-c")])
    })

    colors = colorScale.colors(gridMax);
    colors.unshift("rgba(255, 255, 255, 0)")
    
    $('#gridPlot rect').each(function(){
      $(this).attr("fill", colors[$(this).attr("data-c")])
    })
  
  // otherwise set the maximum scale
  } else {

    max_overlap = Math.max(overlapMax, gridMax);
    colors = colorScale.colors(max_overlap);

    colors.unshift("rgba(255, 255, 255, 0)")

    $('#overlapPlot rect, #gridPlot rect').each(function(){
      $(this).attr("fill", colors[$(this).attr("data-c")])
    })
  }
}