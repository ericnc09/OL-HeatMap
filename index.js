$(document).ready(function() {
  
  var color_scales = {
    'Scale 1': ['yellow','red'],
    'Scale 2': ['#8cbeff','#001454']
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

  function get_color_scale(){

    var color1 = $('#viz_scale .dropbtn').attr('data-color1');
    var color2 = $('#viz_scale .dropbtn').attr('data-color2');

    return chroma.scale([color1,color2]).mode('lch');
  }
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
    set_rect_plot_colors(get_color_scale())
  })
  update_color_scale("viz_scale1")




  // update the distribution parameters based on selected distribution
  function update_distribution(){
    switch($("#source_distribution").val()){
      case "uniform":
        $("label[for='source_parameter_1']").text("No Parameters");
        $("#source_parameter_1").hide();
        $("#source_parameter_1").parent().css('visibility', 'visible');
        $("#source_parameter_2").parent().css('visibility', 'hidden');
        $("#source_parameter_3").parent().css('visibility', 'hidden');
        $("#source_parameter_4").parent().css('visibility', 'hidden');
      break;
      case "gauss":
        $("label[for='source_parameter_1']").text("Mean:");
        $("label[for='source_parameter_2']").text("Sigma:");
        $("#no_param").hide();
        $("#source_parameter_1").show();
        $("#source_parameter_1").parent().css('visibility', 'visible');
        $("#source_parameter_2").parent().css('visibility', 'visible');
        $("#source_parameter_3").parent().css('visibility', 'hidden');
        $("#source_parameter_4").parent().css('visibility', 'hidden');
      break;
      case "triangular":
        $("label[for='source_parameter_1']").text("Mode:");
        $("#no_param").hide();
        $("#source_parameter_1").show();
        $("#source_parameter_1").parent().css('visibility', 'visible');
        $("#source_parameter_2").parent().css('visibility', 'hidden');
        $("#source_parameter_3").parent().css('visibility', 'hidden');
        $("#source_parameter_4").parent().css('visibility', 'hidden');
      break;
      case "bimodal":
        $("label[for='source_parameter_1']").text("1st Mean:");
        $("label[for='source_parameter_2']").text("1st Sigma:");
        $("label[for='source_parameter_3']").text("2nd Mean:");
        $("label[for='source_parameter_4']").text("2nd Sigma:");
        $("#no_param").hide();
        $("#source_parameter_1").show();
        $("#source_parameter_1").parent().css('visibility', 'visible');
        $("#source_parameter_2").parent().css('visibility', 'visible');
        $("#source_parameter_3").parent().css('visibility', 'visible');
        $("#source_parameter_4").parent().css('visibility', 'visible');
      break;
    }
  }
  $("#source_distribution").change(update_distribution);
  update_distribution()



  function update_source_choice(value){

    switch( value ){
      case "random":
        $("#source_file_tab").hide();
        $("#source_random_tab").show();
      break;
      case "file":
        $("#source_file_tab").show();
        $("#source_random_tab").hide();
      break;
    }
  }
  $('input[type=radio][name=source]').change(function() {
    update_source_choice(this.value);
  });
  update_source_choice($('#source_choice_random').val());

  $("#generate").click(function(){

    var data = {
      'nr_obj': $("#source_count").val(),
      'dimension': $("input[name='source_dimension']:checked").val(),
      'sizepc': [$("#source_sizepc_lower").val(),
                 $("#source_sizepc_upper").val()],
      'posnrng': $("#source_distribution").val(),
      'params': [$("#source_parameter_1").val(),
                    $("#source_parameter_2").val(),
                    $("#source_parameter_3").val(),
                    $("#source_parameter_4").val()]
    }

    $.post({
      url: "/generate",
      data: JSON.stringify(data),
      success: update_content,
      error: function(error){alert(error.responseText);},
      contentType: 'application/json',
      dataType: "json"
    });
  });

  function update_content(data){
    
    load_rect_plot(data['results'])
    set_rect_plot_colors(get_color_scale())
  }

  $("input[type=radio][name=viz]").change(function(){
    if (this.value == "overlap") {
      $("#rectPlot").show()
      $("#gridPlot").hide()
      $("#viz_grid_params").css({"visibility":"hidden"})
    } else {
      $("#rectPlot").hide()
      $("#gridPlot").show()
      $("#viz_grid_params").css({"visibility":"visible"})
    
    }
  })
  


  function update_plot_size(){
    plotSize = Math.max( 500,
      Math.min($("body").width() - 505, $("body").height()-24));
    $("#main").width(plotSize);
    $("#main").height(plotSize);
    $("#rectPlot").width(plotSize);
    $("#rectPlot").attr("width",plotSize);
    $("#rectPlot").attr("height",plotSize);
  }
  $(window).resize(update_plot_size)
  update_plot_size()
  


});