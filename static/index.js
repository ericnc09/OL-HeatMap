$(document).ready(function() {
  
  // ==== Common ====

  // tab handling
  $('#tabs li').click(function(){

    if(! ($(this).hasClass('active') || $(this).hasClass('disabled'))){ 
      $('#tabs li').removeClass('active');           
      $(this).addClass('active');

      $('.tab_content').hide();
      $('#'+ $(this).attr('id') + '_tab').fadeIn();

      if($(this).attr("id") == "data"){
        // if this is the first tab, show data plot
        
        $("#main .plot").hide()
        $("#dataPlot").show()
      } else {
        // otherwise show whichever viz plot is active

        $("#dataPlot").hide()
        $("#main .plot.active").show()
      }
      $('.'+ $(this).attr('id') + '_plot').addClass("tab_active");
    }
  });

  // radio box handling
  $('.radiobox').click(function(e){

    if(! $(this).hasClass('active')){ 
      var group = $(this).attr("data-group")
      $('.radiobox[data-group=' + group + ']').removeClass('active');
      $(this).addClass('active');
    }
  });


  function handleZoom(){

    // plot zoom handling
    const svgContainer = $('#main')
    const svgPlot = $('.plot')
    var svgSize = {w: $('#dataPlot').width(), h: $('#dataPlot').height()}
    var viewBox = {x:0,y:0,w:1000,h:1000}
    if (window.regions != undefined) {
      var bounds = window.regions.bounds.factors;
      viewBox = { x: bounds[0].lower, y: 0,
                  w: bounds[0].upper - bounds[0].lower,
                  h: bounds[1].upper - bounds[1].lower};
    }
    svgPlot.attr("viewBox",
      `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`)
    var isPanning = false;
    var startPoint = {x:0,y:0};
    var endPoint = {x:0,y:0};;
    var scale = svgSize.w/viewBox.w;

    svgContainer.on("mousewheel", function(e) {
       e.originalEvent.preventDefault();
       var w = viewBox.w;
       var h = viewBox.h;
       var mx = e.originalEvent.x;
       var my = e.originalEvent.y;
       var dw = w*(-1)*Math.sign(e.originalEvent.deltaY)*0.05;
       var dh = h*(-1)*Math.sign(e.originalEvent.deltaY)*0.05;
       var dx = dw*mx/svgSize.w;
       var dy = dh*my/svgSize.h;
       viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w-dw,h:viewBox.h-dh};
       scale = svgSize.w/viewBox.w;
       svgPlot.attr('viewBox',
        `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    })


    svgContainer.on("mousedown", function(e){
       isPanning = true;
       startPoint = {x:e.originalEvent.x, y:e.originalEvent.y};   
    })

    svgContainer.on("mousemove", function(e){
      if (isPanning){
        endPoint = {x:e.originalEvent.x, y:e.originalEvent.y};
        var dx = (startPoint.x - endPoint.x)/scale;
        var dy = (startPoint.y - endPoint.y)/scale;
        var movedViewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
        svgPlot.attr('viewBox',
          `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
      }
    })

    svgContainer.on("mouseup", function(e){
      if (isPanning){ 
        endPoint = {x:e.originalEvent.x, y:e.originalEvent.y};
        var dx = (startPoint.x - endPoint.x)/scale;
        var dy = (startPoint.y - endPoint.y)/scale;
        viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
        svgPlot.attr('viewBox',
          `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        isPanning = false;
      }
    })

    svgContainer.on("mouseleave", function(e){
     isPanning = false;
    })
  }
  handleZoom()



  // window resize handling 
  function update_plot_size(){
    plotSize = Math.max(500,
      Math.min($("body").width() - 505, $("body").height()-24));
    $("#main").width(plotSize);
    $("#main").height(plotSize);
    $("#main .plot").width(plotSize);
    $("#main .plot").height(plotSize);

    svgSize = {w: $('#dataPlot').width(), h: $('#dataPlot').height()}
  }
  $(window).resize(update_plot_size)
  update_plot_size()


  // ==== Data source tab ====


  // ---- Distribution choice ----

  // update the distribution parameters based on selected distribution
  function update_distribution(){
    switch($("#source_distribution").val()){
      case "uniform":
        $("label[for='dist_param_1']").text("No Parameters");
        $("#dist_param_1").hide();
        $("#dist_param_1").parent().css('visibility', 'visible');
        $("#dist_param_2").parent().css('visibility', 'hidden');
        $("#dist_param_3").parent().css('visibility', 'hidden');
        $("#dist_param_4").parent().css('visibility', 'hidden');
        $("#dist_param_5").parent().css('visibility', 'hidden');
      break;
      case "gauss":
        $("label[for='dist_param_1']").text("Mean:");
        $("label[for='dist_param_2']").text("Sigma:");
        $("#no_param").hide();
        $("#dist_param_1").show();
        $("#dist_param_1").parent().css('visibility', 'visible');
        $("#dist_param_2").parent().css('visibility', 'visible');
        $("#dist_param_3").parent().css('visibility', 'hidden');
        $("#dist_param_4").parent().css('visibility', 'hidden');
        $("#dist_param_5").parent().css('visibility', 'hidden');
      break;
      case "triangular":
        $("label[for='dist_param_1']").text("Mode:");
        $("#no_param").hide();
        $("#dist_param_1").show();
        $("#dist_param_1").parent().css('visibility', 'visible');
        $("#dist_param_2").parent().css('visibility', 'hidden');
        $("#dist_param_3").parent().css('visibility', 'hidden');
        $("#dist_param_4").parent().css('visibility', 'hidden');
        $("#dist_param_5").parent().css('visibility', 'hidden');
      break;
      case "bimodal":
        $("label[for='dist_param_1']").text("1st Mean:");
        $("label[for='dist_param_2']").text("1st Sigma:");
        $("label[for='dist_param_3']").text("2nd Mean:");
        $("label[for='dist_param_4']").text("2nd Sigma:");
        $("#no_param").hide();
        $("#dist_param_1").show();
        $("#dist_param_1").parent().css('visibility', 'visible');
        $("#dist_param_2").parent().css('visibility', 'visible');
        $("#dist_param_3").parent().css('visibility', 'visible');
        $("#dist_param_4").parent().css('visibility', 'visible');
        $("#dist_param_5").parent().css('visibility', 'hidden');
      break;
      case "hotspot":
        $("label[for='dist_param_1']").text("Hotspots:");
        $("label[for='dist_param_2']").text("Min Mean:");
        $("label[for='dist_param_3']").text("Max Mean:");
        $("label[for='dist_param_4']").text("Min Sigma:");
        $("label[for='dist_param_5']").text("Max Sigma:");
        $("#no_param").hide();
        $("#dist_param_1").show();
        $("#dist_param_1").parent().css('visibility', 'visible');
        $("#dist_param_2").parent().css('visibility', 'visible');
        $("#dist_param_3").parent().css('visibility', 'visible');
        $("#dist_param_4").parent().css('visibility', 'visible');
        $("#dist_param_5").parent().css('visibility', 'visible');
      break;
    }
  }
  $("#source_distribution").change(update_distribution);
  update_distribution()

  // Dimension control regenerate
  $('input[type=radio][name=source_dimension]').change(function(){
    $("#generate").click()
  })

  // ---- Data generation handling ----

  // Get data parameters and post to backend
  $("#generate").click(function(){
    
    var data = {
      'nr_obj': $("#source_count").val(),
      'dimension': $("input[name='source_dimension']:checked").val(),
      'sizepc': [$("#source_sizepc_lower").val(),
                 $("#source_sizepc_upper").val()],
      'posnrng': $("#source_distribution").val(),
      'params': [$("#dist_param_1").val(),
                 $("#dist_param_2").val(),
                 $("#dist_param_3").val(),
                 $("#dist_param_4").val()]
    }

    $("#loading").show()

    $.post({
      url: "/generate",
      data: JSON.stringify(data),
      success: update_data_plot,
      error: function(error){alert(error.responseText);},
      contentType: 'application/json',
      dataType: "json"
    });
  });

  // Load data from file
  $("#source_file_tab").on("change", "input", function(){
    
    file = $(this).prop('files')[0]
    fr = new FileReader();
    fr.onload = function(){ update_data_plot(JSON.parse(fr.result)) };
    fr.readAsText(file)
  })

  // Update data plot with results
  function update_data_plot(data){
    
    $("#loading").show()

    if (data.dimension == 1 && data.bounds.factors.length == 1) {
      var total_height = (data.bounds.factors[0].upper
        - data.bounds.factors[0].lower)
      data.bounds.factors.push({ 'lower': 0, 'upper': total_height})
    }

    load_data_plot(data)
    $("#tabs > li").removeClass("disabled")

    window.regions = data;
    assign_rect_handlers()
    handleZoom()
    $("#loading").hide()

    // Manually trigger data visualization
    $("#visualize").click()
  }

  // ---- Save dataset ----
  $("#save").click(function(){

    var json = JSON.stringify(window.regions, null, 2);
    var blob = new Blob([json], {type: "application/json"});
    var url  = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.id = "link"
    a.download    = window.regions.id + ".json";
    a.href        = url;
    a.textContent = window.regions.id + ".json";

    $("#save").parent().append($(a))
  })


  // ==== Visualization tab ====

  // switch between visualizations
  $("#viz_overlap").click(function(){
    $("#overlapPlot").addClass("active")
    $("#overlapPlot").show()
    $("#gridPlot").removeClass("active")
    $("#gridPlot").hide()
  })

  $("#viz_grid").click(function(){
    $("#gridPlot").addClass("active")
    $("#gridPlot").show()
    $("#overlapPlot").removeClass("active")
    $("#overlapPlot").hide()
  })


  // ---- Color scale dropdown ----

  // Initialize
  var color_scales = {
    'Scale 1': ['#8cbeff','#001454'],
    'Scale 2': ['yellow','red'],
    'Scale 3': ['#ADD8E6','#66CDAA', 'yellow', 'orange', 'red']
  }
  var i = 1;
  for (var key in color_scales) {
    var element = $("<a>" + key + "</a>");
    element.attr({"id":'viz_scale' + i});
    var gradient = 'linear-gradient(to right, '
    gradient += color_scales[key][0] 
    for (var j = 0; j < color_scales[key].length; j++) {
      gradient += ',' + color_scales[key][j]
    }
    gradient += ')'
    element.css({'background-image':gradient});
    element.attr({'data-scale':key});
    $(".dropdown-content").append(element)
    i++;
  }

  // Click update
  function update_color_scale(id){
    console.log(id)
    
    var element = $('#viz_scale .dropbtn');
    element.css({'background-image': $('#'+id).css('background-image')});
    element.html($('#'+id).text() + " &#9660;");
    element.attr({'data-scale': $('#'+id).attr('data-scale')});

  }
  $('#viz_scale .dropdown-content a').click(function(){
    update_color_scale($(this).attr("id"))
    set_plot_colors(get_color_scale())
  })
  update_color_scale("viz_scale1")

  // Retrieve value
  function get_color_scale(){

    var scale = $('#viz_scale .dropbtn').attr('data-scale');

    return chroma.scale(color_scales[scale]).mode('lch');
  }

  // Get visualization parameters and post to backend
  $("#visualize").click(function(){

    var data = {
      'regions': window.regions,
      'grid_size': $("#viz_grid_size").val()}

    $("#loading").show()

    $.post({
      url: "/visualize",
      data: JSON.stringify(data),
      success: update_viz_plot,
      error: function(error){
        if (error.status == 420) {
          alert("Too many intersections!\n"
            + "Perhaps try fewer objects or a sparser distribution.");
        } else {
          alert(error.responseText);
        }
        $("#loading").hide()},
      contentType: 'application/json',
      dataType: "json"
    });
  });

  // Update visualization plots with results
  function update_viz_plot(data){

    if (data['overlap'].dimension == 1
      && data['overlap'].bounds.factors.length == 1) {

      var total_height = (data['overlap'].bounds.factors[0].upper
        - data['overlap'].bounds.factors[0].lower)

      data['overlap'].bounds.factors.push({'lower': 0, 'upper': total_height})
      data['grid'].bounds.factors.push({'lower': 0, 'upper': total_height})
    }
    
    load_plot(data['overlap'], "#overlapPlot")
    load_plot(data['grid'], "#gridPlot")
    set_plot_colors(get_color_scale())
    assign_rect_handlers()

    $("#eval_button").show()
    $("#eval_results").hide()
    $("#loading").hide()
  }

  // Assign mouse hover event handlers to plot rects for tooltip 
  function assign_rect_handlers(){
   
    // tooltip handling
    $(".plot rect").hover(function(){
      // when mousing over rectangle
      html = "<b>Details:</b>"
        + "<br>id: " + $(this).attr("data-id")
        + "<br>x: " + Number.parseFloat($(this).attr("x")).toFixed(2)
        + "<br>y: " + Number.parseFloat($(this).attr("data-y")).toFixed(2)
        + "<br>width: "+Number.parseFloat($(this).attr("width")).toFixed(2)
        + "<br>height: "+Number.parseFloat($(this).attr("height")).toFixed(2)
      
      if ($(this)[0].hasAttribute("data-c")) {
        html += "<br>overlaps: " + $(this).attr("data-c")
        + "<br>originals: " + $(this).attr("data-originals")
      }
        
      $(".tooltip").html(html)
      $(".tooltip").show()
    }, function(){
      // when mouse leaving rectangle
      $(".tooltip").hide()
    })
  }

  // ==== Evaluation button ====


  // Get visualization parameters and post to backend
  $("#evaluate").click(function(){

    var data = {
      'regions': window.regions,
      'grid_size': $("#viz_grid_size").val()}

    $("#loading").show()

    $.post({
      url: "/evaluate",
      data: JSON.stringify(data),
      success: function(data){
        $("#overlap_count").text(data['count'][0])
        $("#cover_count").text(data['count'][1])
        $("#eval_cells").text(Math.round(data['eval'][0]*10000)/100)
        $("#eval_area").text(Math.round(data['eval'][1]*10000)/100)
        $("#eval_button").hide()
        $("#eval_results").show()
        $("#loading").hide()
      },
      error: function(error){
        if (error.status == 420) {
          alert("Too many intersections!\n\
            Perhaps try fewer objects or a sparser distribution.");
        } else {
          alert(error.responseText);
        }
        $("#loading").hide()},
      contentType: 'application/json',
      dataType: "json"
    });

  })



  // Manually trigger data generation
  $("#generate").click()

});