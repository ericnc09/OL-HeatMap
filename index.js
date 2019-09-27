$(document).ready(function() {
  
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
      'dimension': $("#source_dimension").val(),
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
  }


  function update_plot_size(){
    plotSize = Math.max( 500,
      Math.min($("body").width() - 500, $("body").height() - 24));
    $("#main").width(plotSize - 12);
    $("#main").height(plotSize - 12);
    $("#rectPlot").width(plotSize - 12);
    $("#rectPlot").height(plotSize - 12);
  }
  $(window).resize(update_plot_size)
  update_plot_size()
  


});