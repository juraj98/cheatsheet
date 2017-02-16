$(document).ready(function () {
    materialFormInit();
    setupDynamicListeners();
});

function materialFormInit() {
    $("body").append('<div class="dropDownOptions"></div>');
    materialInputInit();
    materialTextareaInit();
    materialTagInputInit();
    materialDropdownInit();
    materialSwitchInit();
    materialRadioButtonsInit();
    materialCheckmarkInit();

    materialSubmitInit();

}

function materialInputInit() {
    $(".materialInput").each(function (index, value) {
        var displayLabel = ($(this).attr("label") != undefined);
        var displayMaxLength = ($(this).attr("maxLength") != undefined);
        var maxLength = $(this).attr("maxLength");
        var that = $(this);

        if ($(this).children("input").attr("type") == "password") {
            $(this).html($(this).html() + '<i class="material-icons">remove_red_eye</i>');
        }

        if (displayLabel) {
            $(this).html($(this).html() + "<span unselectable='on' class='unselectable label'>" + $(this).attr("label") + "</span>");
            $(this).css("margin-top", "21px");
            setTimeout(function () { //For browser's autofill
                if (that.children("input").css("background-color") == "rgb(250, 255, 189)") {
                    that.children(".label").addClass("active");
                    if (!(that.hasClass("valid") || that.hasClass("invalid"))) {
                        that.addClass("active");
                    }
                }
            }, 250);
        }

        if (displayMaxLength) {
            $(this).html($(this).html() + "<span unselectable='on' class='unselectable maxLengthLabel'>0/" + $(this).attr("maxLength") + "</span>");
            $(this).css("margin-bottom", "21px");
        }

        $(this).find("input").off("change keyup keydown paste").on("change keyup keydown paste", function () {
            if (displayMaxLength) {
                var valLength = $(this).val().length;
                if (valLength <= maxLength) {
                    $(this).parent().removeClass("invalid").addClass("valid");
                    $(this).parent().children(".maxLengthLabel").html(valLength + "/" + maxLength);
                } else {
                    $(this).parent().removeClass("valid").addClass("invalid");
                    $(this).parent().children(".maxLengthLabel").html(valLength + "/" + maxLength);
                }
            }
        });

        $(this).find("input").off("focusin").on("focusin", function () {
            var valLength = $(this).val().length;

            if (displayLabel) {
                $(this).parent().children(".label").addClass("active");
            }
            if (displayMaxLength) {
                if (valLength <= maxLength) {
                    $(this).parent().removeClass("invalid").addClass("valid");
                    $(this).parent().children(".maxLengthLabel").html(valLength + "/" + maxLength);
                } else {
                    $(this).parent().removeClass("valid").addClass("invalid");
                    $(this).parent().children(".maxLengthLabel").html(valLength + "/" + maxLength);
                }
            } else {
                $(this).parent().addClass("active");
            }
        });

        $(this).find("input").off("focusout").on("focusout", function () {
            if (displayLabel) {
                if ($(this).val().length == 0) {
                    $(this).parent().children(".label").removeClass("active");
                }
            }
            if (displayMaxLength) {
                if ($(this).val().length == 0) {
                    $(this).parent().removeClass("invalid").removeClass("valid");
                }
            } else {
                if ($(this).val().length == 0) {
                    $(this).parent().removeClass("active");
                }
            }
        });

    });
}

function materialTextareaInit() {
    $(".materialTextarea").each(function (index, value) {
        var displayLabel = ($(this).attr("label") != undefined);
        var displayMaxLength = ($(this).attr("maxLength") != undefined);
        var maxLength = $(this).attr("maxLength");

        if (displayLabel) {
            $(this).html($(this).html() + "<span unselectable='on' class='unselectable label'>" + $(this).attr("label") + "</span>");
            $(this).css("margin-top", "21px");
        }

        if (displayMaxLength) {
            $(this).html($(this).html() + "<span unselectable='on' class='unselectable maxLengthLabel'>0/" + $(this).attr("maxLength") + "</span>");
            $(this).css("margin-bottom", "21px");
        }

        $(this).find("textarea").off("change keyup keydown paste").on("change keyup keydown paste", function () {
            if (displayMaxLength) {
                var valLength = $(this).val().length;

                if (valLength <= maxLength) {
                    $(this).parent().removeClass("invalid").addClass("valid");
                    $(this).parent().children(".maxLengthLabel").html(valLength + "/" + maxLength);
                } else {
                    $(this).parent().removeClass("valid").addClass("invalid");
                    $(this).parent().children(".maxLengthLabel").html(valLength + "/" + maxLength);
                }
            }
        });

        $(this).find("textarea").off("focusin").on("focusin", function () {
            var valLength = $(this).val().length;

            if (displayLabel) {
                $(this).parent().children(".label").addClass("active");
            }
            if (displayMaxLength) {
                if (valLength <= maxLength) {
                    $(this).parent().removeClass("invalid").addClass("valid");
                    $(this).parent().children(".maxLengthLabel").html(valLength + "/" + maxLength);
                } else {
                    $(this).parent().removeClass("valid").addClass("invalid");
                    $(this).parent().children(".maxLengthLabel").html(valLength + "/" + maxLength);
                }
            } else {
                $(this).parent().addClass("active");
            }
        });

        $(this).find("textarea").off("focusout").on("focusout", function () {
            if (displayLabel) {
                if ($(this).val().length == 0) {
                    $(this).parent().children(".label").removeClass("active");
                }
            }
            if (displayMaxLength) {
                if ($(this).val().length == 0) {
                    $(this).parent().removeClass("invalid").removeClass("valid");
                }
            } else {
                if ($(this).val().length == 0) {
                    $(this).parent().removeClass("active");
                }
            }
        });

    });
    autosize($(".materialTextarea > textarea"));
}

function materialTagInputInit() {
    console.info("%cFunction run:\t" + "%ctagInputInit()", "color: #303F9F; font-weight:700", "color: #303F9F");

    $()

    var tags = new Array();
    loadTagInput();
    $(".materialTagInput").click(function () {
        $(this).children("input").focus();
    });
    $(".materialTagInput").children("input").focusin(function () {
        $(this).parent().addClass("active");
    });
    $(".materialTagInput").children("input").focusout(function () {
        console.log("result = " + $(this).parent().attr("result"));
        if (!$(this).val() && !$(this).parent().attr("result")) {
            $(this).parent().removeClass("active");
        }
        var tagText = $(this).val().replace(/\s/g, '');
        var tags;
        if ($(this).parent().attr("array") != undefined)
            tags = $(this).parent().attr("array").split(',');
        else
            tags = Array();

        if (($.inArray(tagText, tags)) == -1 && tagText != "") {
            tags.push(tagText);

            $(this).before('<span unselectable="on" class="unselectable tagInputTag ' + tagText + '" id=' + (tags.length - 1) + '>' + tagText + '</span>');

            //Width set
            var remainingspace = $(this).parent().width();
            $(".materialTagInput").children(".tagInputTag").each(function () {
                if (remainingspace < $(this).outerWidth(true)) {
                    remainingspace = $(this).parent().width();
                }
                remainingspace -= $(this).outerWidth(true) + 0.5;
            });

            if (remainingspace < 100)
                $(this).width($(this).parent().width());
            else
                $(this).width(remainingspace);

            $(".tagInputTag").click(function () {
                if ($(this).parent().attr("array") != undefined)
                    tags = $(this).parent().attr("array").split(',');
                else
                    tags = Array();
                tags[$(this).attr("id")] = "";
                $(this).parent().attr("array", tags);
                $(this).parent().attr("result", cleanArray(tags));
                var parent = $(this).parent();

                $(this).remove();
                //Width set
                var remainingspace = parent.width();
                $(".materialTagInput").children(".tagInputTag").each(function () {
                    if (remainingspace < $(this).outerWidth(true)) {
                        remainingspace = $(this).parent().width();
                    }
                    remainingspace -= $(this).outerWidth(true) + 0.5;
                })

                if (remainingspace < 100)
                    parent.children("input").width($(this).parent().width());
                else
                    parent.children("input").width(remainingspace);


            });
        }
        $(this).parent().attr("array", tags);
        $(this).parent().attr("result", cleanArray(tags));

        $(this).val("");
    });
    $(".materialTagInput > input").keypress(function (e) {
        if (e.which == 32) {
            var tagText = $(this).val().replace(/\s/g, '');
            var tags;
            if ($(this).parent().attr("array") != undefined)
                tags = $(this).parent().attr("array").split(',');
            else
                tags = Array();

            if (($.inArray(tagText, tags)) == -1 && tagText != "") {
                tags.push(tagText);

                $(this).before('<span unselectable="on" class="unselectable tagInputTag ' + tagText + '" id=' + (tags.length - 1) + '>' + tagText + '</span>');

                //Width set
                var remainingspace = $(this).parent().width();
                $(".materialTagInput").children(".tagInputTag").each(function () {
                    if (remainingspace < $(this).outerWidth(true)) {
                        remainingspace = $(this).parent().width();
                    }
                    remainingspace -= $(this).outerWidth(true) + 0.5;
                });

                if (remainingspace < 100)
                    $(this).width($(this).parent().width());
                else
                    $(this).width(remainingspace);

                $(".tagInputTag").click(function () {
                    if ($(this).parent().attr("array") != undefined)
                        tags = $(this).parent().attr("array").split(',');
                    else
                        tags = Array();
                    tags[$(this).attr("id")] = "";
                    $(this).parent().attr("array", tags);
                    $(this).parent().attr("result", cleanArray(tags));
                    var parent = $(this).parent();

                    $(this).remove();
                    //Width set
                    var remainingspace = parent.width();
                    $(".materialTagInput").children(".tagInputTag").each(function () {
                        if (remainingspace < $(this).outerWidth(true)) {
                            remainingspace = $(this).parent().width();
                        }
                        remainingspace -= $(this).outerWidth(true) + 0.5;
                    })

                    if (remainingspace < 100)
                        parent.children("input").width($(this).parent().width());
                    else
                        parent.children("input").width(remainingspace);


                });
            }
            $(this).parent().attr("array", tags);
            $(this).parent().attr("result", cleanArray(tags));

            $(this).val("");
            return false;
        }
    });
}

function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

function loadTagInput() {
    $(".materialTagInput > input").each(function () {
        //Width set
        var remainingspace = $(this).parent().width();
        $(".materialTagInput").children(".tagInputTag").each(function () {
            if (remainingspace < $(this).outerWidth(true)) {
                remainingspace = $(this).parent().width();
            }
            remainingspace -= $(this).outerWidth(true) + 0.5;
        });

        if ($(this).parent().attr("label")) {
            $(this).parent().html($(this).parent().html() + "<span unselectable='on' class='unselectable label'>" + $(this).parent().attr("label") + "</span>");
            $(this).parent().css("margin-top", "21px");
        }

        if (remainingspace < 100)
            $(this).width($(this).parent().width());
        else
            $(this).width(remainingspace);
    });
}

function materialDropdownInit() {
    dropDownOptions = $(".dropDownOptions");
    $(".materialDropDown").each(function (index, value) {
        var placeholder = $(this).attr("placeholder");
        var options = JSON.parse($(this).attr("options"));
        var none = $(this).attr("none");
        var optionsHTML = '<div unselectable="on" class="unselectable dropDownOption dropDownDesc unselectable" unseletable="on">' + placeholder + '</div>';
        var that = $(this);


        if (none != undefined) {
            optionsHTML += '<div unselectable="on" class="unselectable dropDownOption dropDownNone" >' + none + '</div>'
        }

        $.each(options, function (index, value) {
            optionsHTML += '<div unselectable="on" id=' + index + ' class="unselectable dropDownOption">' + value + '</div>'
        });

        $(this).off("click").on("click", function (e) {
            e.stopPropagation();
            dropDownOptions.slideUp(300, function () {
                activeDropDown = that;
                dropDownOptions.width(that.width());
                dropDownOptions.css("top", that.offset().top + $(".content").scrollTop());
                dropDownOptions.css("left", that.offset().left - $(".content").offset().left);
                dropDownOptions.html(optionsHTML);
                dropDownOptions.slideDown(300);
            });
        });

        if (placeholder == undefined) {
            $(this).html('Choose your option <i class="material-icons">arrow_drop_down</i>');
        } else {
            $(this).html(placeholder + ' <i class="material-icons">arrow_drop_down</i>');
        }


    });
}

function materialSwitchInit() {
    $(".materialSwitch").click(function () {
        $(this).toggleClass("active");
        $(this).attr("result", $(this).hasClass("active"));
    });
}

function materialRadioButtonsInit() {
    $(".materialRadioButtons").each(function (index, value) {
        var that = $(this);
        var options = JSON.parse(that.attr("options"));
        var active = that.attr("active");
        $.each(options, function (index, value) {
            console.log("active - value: " + value + ", active: " + active + " = " + value == active);
            that.append('<div class="radioButton ' + value == active ? "active" : "" + '" index="' + index + '">' + value + '</div>');
        });
        that.children(".radioButton").click(function () {
            $(this).parent().children(".active").removeClass("active");
            $(this).addClass("active");
            $(this).parent().attr("result", $(this).attr("index"));
        });
    });

}

function materialCheckmarkInit() {
    $(".materialCheckmark").click(function () {
        $(this).toggleClass("active");
        $(this).attr("result", $(this).hasClass("active"));
    });
}

function materialSubmitInit() {
    $.fn.extend({
        materialSubmit: function () {
            var result = new Array();
            console.log("materialSubmit run");
            $(this).children(".materialLineInput").each(function(index, value){
                var name;
                if(name = $(this).attr("name")){
                    result[name] = $(this).children("input").val();
                } else {
                    console.log(("%cInput without name: " + JSON.parse(JSON.stringify($(this)))), "color: #FF5722;");
                }
            });
            $(this).children(".materialDropDown, .materialTagInput, .materialRadioButtons, .materialCheckmark").each(function(index, value){
                var name;
                if(name = $(this).attr("name")){
                    result[name] = $(this).attr("result");
                } else {
                    console.log("%cInput without name:", "color: #FF5722;");
                    console.log($(this));
                }
            });

            return result;
        }
    });
}
