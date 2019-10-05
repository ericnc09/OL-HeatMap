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
        
        $("#main svg").hide()
        $("#dataPlot").show()
      } else {
        // otherwise show whichever viz plot is active

        $("#dataPlot").hide()
        $("#main svg.active").show()
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

  // window resize handling 
  function update_plot_size(){
    plotSize = Math.max(500,
      Math.min($("body").width() - 505, $("body").height()-24));
    $("#main").width(plotSize);
    $("#main").height(plotSize);
    $("#main svg").width(plotSize);
    $("#main svg").height(plotSize);
  }
  $(window).resize(update_plot_size)
  update_plot_size()


  // ==== Data source tab ====

  // ---- Color scale dropdown ----

  // Initialize
  var color_scales = {
    'Scale 1': ['#8cbeff','#001454'],
    'Scale 2': ['yellow','red']
  }
  var i = 1;
  for (var key in color_scales) {
    var element = $("<a>" + key + "</a>");
    element.attr({"id":'viz_scale' + i});
    element.css({'background-image':'linear-gradient(to right, ' 
      + color_scales[key][0] + ','
      + color_scales[key][1] + ')'});
    element.attr({'data-color1':color_scales[key][0]});
    element.attr({'data-color2':color_scales[key][1]});
    $(".dropdown-content").append(element)
    i++;
  }

  // Click update
  function update_color_scale(id){
    
    var element = $('#viz_scale .dropbtn');
    element.css({'background-image': $('#'+id).css('background-image')});
    element.html($('#'+id).text() + " &#9660;");
    element.attr({'data-color1': $('#'+id).attr('data-color1'),
      'data-color2': $('#'+id).attr('data-color2')
    });

  }
  $('#viz_scale .dropdown-content a').click(function(){
    update_color_scale($(this).attr("id"))
    set_plot_colors(get_color_scale())
  })
  update_color_scale("viz_scale1")

  // Retrieve value
  function get_color_scale(){

    var color1 = $('#viz_scale .dropbtn').attr('data-color1');
    var color2 = $('#viz_scale .dropbtn').attr('data-color2');

    return chroma.scale([color1,color2]).mode('lch');
  }

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
      break;
      case "triangular":
        $("label[for='dist_param_1']").text("Mode:");
        $("#no_param").hide();
        $("#dist_param_1").show();
        $("#dist_param_1").parent().css('visibility', 'visible');
        $("#dist_param_2").parent().css('visibility', 'hidden');
        $("#dist_param_3").parent().css('visibility', 'hidden');
        $("#dist_param_4").parent().css('visibility', 'hidden');
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
      break;
    }
  }
  $("#source_distribution").change(update_distribution);
  update_distribution()

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

    $.post({
      url: "/generate",
      data: JSON.stringify(data),
      success: update_data_plot,
      error: function(error){alert(error.responseText);},
      contentType: 'application/json',
      dataType: "json"
    });
  });

  // Update data plot with results
  function update_data_plot(data){
    
    load_data_plot(data)
    $("#tabs > li").removeClass("disabled")

    window.regions = data;

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
    // document.body.appendChild(a)

    // console.log($("#link"))
    // $("#link").click()
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

  // Get visualization parameters and post to backend
  $("#visualize").click(function(){
    
    var data = {
      'regions': window.regions,
      'grid_size': $("#viz_grid_size").val()}

    $.post({
      url: "/visualize",
      data: JSON.stringify(data),
      success: update_viz_plot,
      error: function(error){alert(error.responseText);},
      contentType: 'application/json',
      dataType: "json"
    });
  });

  // Update visualization plots with results
  function update_viz_plot(data){
    
    load_plot(data['overlap'], "#overlapPlot")
    load_plot(data['grid'], "#gridPlot")
    set_plot_colors(get_color_scale())
    assign_rect_handlers()

    $("#eval_tab").text(data['eval'])
  }

  // Assign mouse hover event handlers to plot rects for tooltip 
  function assign_rect_handlers(){
   
    // tooltip handling
    $("#overlapPlot rect, #gridPlot rect").hover(function(){
      // when mousing over rectangle
      $("#tooltip").html(
        "<b>Details:</b>"
        + "<br>x: " + Number.parseFloat($(this).attr("x")).toFixed(2)
        + "<br>y: " + Number.parseFloat($(this).attr("y")).toFixed(2)
        + "<br>width: " + Number.parseFloat($(this).attr("width")).toFixed(2)
        + "<br>height: " + Number.parseFloat($(this).attr("height")).toFixed(2)
        + "<br>overlaps: " + $(this).attr("data-c"))
      $("#tooltip").show()
    }, function(){
      // when mouse leaving rectangle
      $("#tooltip").hide()
    })
  }

  // ==== Evaluation tab ====




  


  // Manually trigger data generation
  $("#generate").click()

});