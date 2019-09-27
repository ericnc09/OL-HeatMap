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
      'sizepc': $("#source_sizepc").val(),
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
      contentType: 'application/json',
      dataType: "json"
    });
  });

  function update_content(response){
    console.log("Great success!");
    console.log(response);
  }



});