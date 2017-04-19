$(document).ready(function(){
  materialFormInit();
      console.log("Autocomplete array");



  $(".materialInput").on("keyup", function(){
    var value = $(this).children("input").val();
    var autocomplete = $(this).data("autocomplete").filter(function(item){
      return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
    });

    setAutocomplete($(this), autocomplete);
  }).on("autocompleteClick",function(event, param){
    //Handle params
  });
});
