function materialTimePickerInit(){
    console.log("run");
    $(".materialTimePicker").each(function (index, value) {
        var temp;
        if((temp = $(this).children("center").children(".firstTime")).val().length == 0){
            temp.val("00");
        }
        if((temp = $(this).children("center").children(".secondTime")).val().length == 0){
            temp.val("00");
        }
        $(this).children("center").children("input").on("focusout", function(){
            console.log("focusout");
            if((temp = $(this).val().length) == 0){
                $(this).val("00");
            }else if (temp == 1){
                $(this).val("0" + $(this).val());
            }else {
                temp = $(this).val().substring(0, 2).replace(/\D/g,'');
                console.log(temp);
                if($(this).hasClass("firstTime")){
                    if(temp > 23){
                        $(this).val("23");
                    } else {
                        if(temp.length == 1){
                            $(this).val("0"+temp);
                        } else {
                          $(this).val(temp);
                        }
                    }
                } else {
                    if(temp > 59){
                        $(this).val("59");
                    } else {
                        if(temp.length == 1){
                            $(this).val("0"+temp);
                        } else {
                          $(this).val(temp);
                        }
                    }
                }
            }
        });
    });
}
