var cpFirstTime = true;

function materialFormInit() {
	console.info("%cFunction run:\t" + "%cmaterialFormInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
	$(".content").append('<div class="dropDownOptions"></div>');
	$("body").append('<div id="cpMain"> <div id="cpColorPicker" class="card-3"> <div id="cpHeader" class="card-1"> <input type="text"> </div> <div id="cpColors"> </div> <div id="cpAccents"> </div> </div> </div><div id="dpMain" hidden><div id="dpDatePicker" class="card-2"><div id="dpSide"><h2></h2><h1 class="dpTextDay"></h1><h1 class="dpDate"></h1></div><div id="dpCalendar"><div id="dpHeader"><i class="material-icons leftArrow">keyboard_arrow_left</i><div class="month"></div><div class="year"></div><i class="material-icons rightArrow">keyboard_arrow_right</i></div><div id="dpContent"></div></div></div></div>');
	//TODO: 2 For datepicker add clear button next to cancel
	materialInputInit();
	materialTextareaInit();
	materialTagInputInit();
	materialDropdownInit();
	materialSwitchInit();
	materialRadioButtonsInit();
	materialCheckmarkInit();
	materialColorPickerInit();
	materialTimePickerInit();
	materialDatePickerInit();
	materialSubmitInit();
	$.fn.extend({ //TODO: 3 Use this for EVERYTHING
		materialInputInsert: function(value) {
			if ($(this).hasClass("materialInput")) {
				$(this).children("input").val(value);
				$(this).children("span").addClass("active");
			}
		}
	});
}

function materialInputInit() {
	$(".materialInput").each(function(index, value) {
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
			setTimeout(function() { //For browser's autofill
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
		$(this).find("input").off("change keyup keydown paste").on("change keyup keydown paste", function() {
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
		$(this).find("input").off("focusin").on("focusin", function() {
			if ($(this).parent().hasClass("disabled")) {
				$(this).blur();
				return;
			}
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
		$(this).find("input").off("focusout").on("focusout", function() {
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
	$(".materialTextarea").each(function(index, value) {
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
		$(this).find("textarea").off("change keyup keydown paste").on("change keyup keydown paste", function() {
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
		$(this).find("textarea").off("focusin").on("focusin", function() {
			if ($(this).parent().hasClass("disabled")) {
				$(this).blur();
				return;
			}
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
		$(this).find("textarea").off("focusout").on("focusout", function() {
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
	var tags = new Array();
	loadTagInput();
	$(".materialTagInput").click(function() {
		$(this).children("input").focus();
	});
	$(".materialTagInput").children("input").focusin(function() {
		if ($(this).parent().hasClass("disabled")) {
			$(this).blur();
			return;
		}
		$(this).parent().addClass("active");
	});
	$(".materialTagInput").children("input").focusout(function() {
		if (!$(this).val() && !$(this).parent().attr("result")) {
			$(this).parent().removeClass("active");
		}
		var tagText = $(this).val().replace(/\s/g, '');
		var tags;
		if ($(this).parent().attr("array") != undefined) tags = $(this).parent().attr("array").split(',');
		else tags = Array();
		if (($.inArray(tagText, tags)) == -1 && tagText != "") {
			tags.push(tagText);
			$(this).before('<span unselectable="on" class="unselectable tagInputTag ' + tagText + '" id=' + (tags.length - 1) + '>' + tagText + '</span>');
			//Width set
			var remainingspace = $(this).parent().width();
			$(".materialTagInput").children(".tagInputTag").each(function() {
				if (remainingspace < $(this).outerWidth(true)) {
					remainingspace = $(this).parent().width();
				}
				remainingspace -= $(this).outerWidth(true) + 0.5;
			});
			if (remainingspace < 100) $(this).width($(this).parent().width());
			else $(this).width(remainingspace);
			$(".tagInputTag").click(function() {
				if ($(this).parent().attr("array") != undefined) tags = $(this).parent().attr("array").split(',');
				else tags = Array();
				tags[$(this).attr("id")] = "";
				$(this).parent().attr("array", tags);
				$(this).parent().attr("result", cleanArray(tags));
				var parent = $(this).parent();
				$(this).remove();
				//Width set
				var remainingspace = parent.width();
				$(".materialTagInput").children(".tagInputTag").each(function() {
					if (remainingspace < $(this).outerWidth(true)) {
						remainingspace = $(this).parent().width();
					}
					remainingspace -= $(this).outerWidth(true) + 0.5;
				})
				if (remainingspace < 100) parent.children("input").width($(this).parent().width());
				else parent.children("input").width(remainingspace);
			});
		}
		$(this).parent().attr("array", tags);
		$(this).parent().attr("result", cleanArray(tags));
		$(this).val("");
	});
	$(".materialTagInput > input").keypress(function(e) {
		if (e.which == 32) {
			var tagText = $(this).val().replace(/\s/g, '');
			var tags;
			if ($(this).parent().attr("array") != undefined) tags = $(this).parent().attr("array").split(',');
			else tags = Array();
			if (($.inArray(tagText, tags)) == -1 && tagText != "") {
				tags.push(tagText);
				$(this).before('<span unselectable="on" class="unselectable tagInputTag ' + tagText + '" id=' + (tags.length - 1) + '>' + tagText + '</span>');
				//Width set
				var remainingspace = $(this).parent().width();
				$(".materialTagInput").children(".tagInputTag").each(function() {
					if (remainingspace < $(this).outerWidth(true)) {
						remainingspace = $(this).parent().width();
					}
					remainingspace -= $(this).outerWidth(true) + 0.5;
				});
				if (remainingspace < 100) $(this).width($(this).parent().width());
				else $(this).width(remainingspace);
				$(".tagInputTag").click(function() {
					if ($(this).parent().attr("array") != undefined) tags = $(this).parent().attr("array").split(',');
					else tags = Array();
					tags[$(this).attr("id")] = "";
					$(this).parent().attr("array", tags);
					$(this).parent().attr("result", cleanArray(tags));
					var parent = $(this).parent();
					$(this).remove();
					//Width set
					var remainingspace = parent.width();
					$(".materialTagInput").children(".tagInputTag").each(function() {
						if (remainingspace < $(this).outerWidth(true)) {
							remainingspace = $(this).parent().width();
						}
						remainingspace -= $(this).outerWidth(true) + 0.5;
					})
					if (remainingspace < 100) parent.children("input").width($(this).parent().width());
					else parent.children("input").width(remainingspace);
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
	$(".materialTagInput > input").each(function() {
		//Width set
		var remainingspace = $(this).parent().width();
		$(".materialTagInput").children(".tagInputTag").each(function() {
			if (remainingspace < $(this).outerWidth(true)) {
				remainingspace = $(this).parent().width();
			}
			remainingspace -= $(this).outerWidth(true) + 0.5;
		});
		if ($(this).parent().attr("label")) {
			$(this).parent().html($(this).parent().html() + "<span unselectable='on' class='unselectable label'>" + $(this).parent().attr("label") + "</span>");
			$(this).parent().css("margin-top", "21px");
		}
		if (remainingspace < 100) $(this).width($(this).parent().width());
		else $(this).width(remainingspace);
	});
}

function materialDropdownInit() {
	dropDownOptions = $(".dropDownOptions");
	$(".materialDropDown").each(function(index, value) {
		var placeholder = $(this).attr("placeholder");
		var options = JSON.parse($(this).attr("options"));
		var none = $(this).attr("none");
		var optionsHTML = '<div unselectable="on" class="unselectable dropDownOption dropDownDesc unselectable" unseletable="on">' + placeholder + '</div>';
		var that = $(this);
		if (none != undefined) {
			optionsHTML += '<div unselectable="on" class="unselectable dropDownOption dropDownNone" >' + none + '</div>'
		}
		$.each(options, function(index, value) {
			optionsHTML += '<div unselectable="on" id=' + index + ' class="unselectable dropDownOption">' + value + '</div>'
		});
		$(this).off("click").on("click", function(e) {
			e.stopPropagation();
			if ($(this).hasClass("disabled")) {
				return;
			}
			dropDownOptions.slideUp(300, function() {
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
} //Fix me: dropdown options are adding 2 times
function materialSwitchInit() {
	$(".materialSwitch").click(function() {
		if ($(this).hasClass("disabled")) {
			return;
		}
		$(this).toggleClass("active");
		$(this).attr("result", $(this).hasClass("active"));
	});
}

function materialRadioButtonsInit() {
	$(".materialRadioButtons").each(function(index, value) {
		var that = $(this);
		var options = JSON.parse(that.attr("options"));
		var active = that.attr("active");
		$.each(options, function(index, value) {
			that.append('<div class="radioButton ' + (value == active ? "active" : "") + '" index="' + index + '">' + value + '</div>');
		});
		that.children(".radioButton").click(function() {
			if ($(this).hasClass("disabled")) {
				return;
			}
			$(this).parent().children(".active").removeClass("active");
			$(this).addClass("active");
			$(this).parent().attr("result", $(this).attr("index"));
			$(that).trigger("change", [$(this).attr("index"), $(this).html()]);
		});
	});
}

function materialCheckmarkInit() {
	$(".materialCheckmark").click(function() {
		if ($(this).hasClass("disabled")) {
			return;
		}
		$(this).toggleClass("active");
		$(this).attr("result", $(this).hasClass("active"));
	});
}

function materialColorPickerInit() {
	console.info("%cFunction run:\t" + "%cmaterialColorPickerInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
	if (cpFirstTime) {
		cpFirstTime == false;
		var html = '<div class="cpColor card-1" id="none">?</div>';
		cpColors.forEach(function(value, index) {
			html += '<div class="cpColor card-1" id="' + index + '" style="background-color: ' + value[6] + ';"></div>'
		});
		$("#cpColors").html(html);
		$(".cpColor").click(function() {
			cpColor = $(this).attr("id");
			if (cpColor == "none") {
				cpResult = undefined;
				$("#cpColorPicker").css("height", "258px");
				$("#cpHeader").css("background-color", "transparent").css("color", "#212121");
				$("#cpHeader > input").val("None");
				$("#cpAccents").html('');
			} else {
				$("#cpColorPicker").css("height", "328px");
				html = "";
				cpColors[cpColor].forEach(function(value, index) {
					html += '<div class="cpAccent card-1" id="' + index + '" style="background-color: ' + value + ';"></div>'
				});
				$("#cpAccents").html(html);
				$(".cpAccent").click(function() {
					cpAccent = $(this).attr("id");
					$("#cpHeader").css("background-color", cpColors[cpColor][cpAccent]).css("color", ((((0.299 * ("0x" + cpColors[cpColor][cpAccent].substring(1, 7)[0] + cpColors[cpColor][cpAccent].substring(1, 7)[1])) + ((0.587 * ("0x" + cpColors[cpColor][cpAccent].substring(1, 7)[2] + cpColors[cpColor][cpAccent].substring(1, 7)[3])) + (0.114 * ("0x" + cpColors[cpColor][cpAccent].substring(1, 7)[4] + cpColors[cpColor][cpAccent].substring(1, 7)[5])))) / 255) > 0.5 ? "#212121" : "#FAFAFA"));
					$("#cpHeader > input").val(cpColorsNames[cpColor] + " (" + cpAccentsNames[cpAccent] + ")");
					cpResult = cpColors[cpColor][cpAccent];
				});
			}
		});
		$("#cpHeader > input").click(function() {
			if ($(this).val() == "None") {
				$(this).val("");
				$("#cpColorPicker").height("258px");
			}
		});
		$("#cpHeader > input").on("change paste keyup", function(e) {
			$("#cpColorPicker").height("258px");
			value = $.trim($(this).val());
			var index = 0;
			var rgb = ["", "", ""];
			if (e.which == 13) {
				if (value[0] == "#") {
					if (value.length >= 7 && $.isNumeric("0x" + value.substring(1, 7))) {
						$("#cpHeader > input").val(cpResult = value.substring(0, 7));
						$("#cpHeader").css("background-color", cpResult).css("color", ((((0.299 * ("0x" + value.substring(1, 7)[0] + value.substring(1, 7)[1])) + ((0.587 * ("0x" + value.substring(1, 7)[2] + value.substring(1, 7)[3])) + (0.114 * ("0x" + value.substring(1, 7)[4] + value.substring(1, 7)[5])))) / 255) > 0.5 ? "#212121" : "#FAFAFA"));
					}
				} else {
					for (var i = 0; i < value.length && index < 3; i++) {
						if (value[i] == ",") {
							index++;
						} else if ($.isNumeric(value[i])) {
							rgb[index] += value[i];
						}
					}
					if (rgb[0] != "" && rgb[1] != "" && rgb[2] != "") {
						var colorR = rgb[0].substring(0, 3) < 256 ? rgb[0].substring(0, 3) : rgb[0].substring(0, 2);
						var colorG = rgb[1].substring(0, 3) < 256 ? rgb[1].substring(0, 3) : rgb[1].substring(0, 2);
						var colorB = rgb[2].substring(0, 3) < 256 ? rgb[2].substring(0, 3) : rgb[2].substring(0, 2);
						$("#cpHeader > input").val(cpResult = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")");
						$("#cpHeader").css("background-color", cpResult).css("color", ((((0.299 * colorR) + ((0.587 * colorG) + (0.114 * colorB))) / 255) > 0.5 ? "#212121" : "#FAFAFA"));
					} else if (value.length >= 6 && $.isNumeric("0x" + value)) {
						$("#cpHeader > input").val(cpResult = "#" + value.substring(0, 6));
						$("#cpHeader").css("background-color", cpResult).css("color", ((((0.299 * ("0x" + value[0] + value[1])) + ((0.587 * ("0x" + value[2] + value[3])) + (0.114 * ("0x" + value[4] + value[5])))) / 255) > 0.5 ? "#212121" : "#FAFAFA"));
					}
				}
			} else {
				if (value[0] == "#") {
					if (value.length >= 7 && $.isNumeric("0x" + value.substring(1, 7))) {
						cpResult = value.substring(0, 7);
						$("#cpHeader").css("background-color", cpResult).css("color", ((((0.299 * ("0x" + value[0] + value[1])) + ((0.587 * ("0x" + value[2] + value[3])) + (0.114 * ("0x" + value[4] + value[5])))) / 255) > 0.5 ? "#212121" : "#FAFAFA"));
					}
				} else {
					for (var i = 0; i < value.length && index < 3; i++) {
						if (value[i] == ",") {
							index++;
						} else if ($.isNumeric(value[i])) {
							rgb[index] += value[i];
						}
					}
					if (rgb[0] != "" && rgb[1] != "" && rgb[2] != "") {
						var colorR = rgb[0].substring(0, 3) < 256 ? rgb[0].substring(0, 3) : rgb[0].substring(0, 2);
						var colorG = rgb[1].substring(0, 3) < 256 ? rgb[1].substring(0, 3) : rgb[1].substring(0, 2);
						var colorB = rgb[2].substring(0, 3) < 256 ? rgb[2].substring(0, 3) : rgb[2].substring(0, 2);
						cpResult = "rgb(" + colorR + ", " + colorG + ", " + colorB + ")"
						$("#cpHeader").css("background-color", cpResult).css("color", ((((0.299 * colorR) + ((0.587 * colorG) + (0.114 * colorB))) / 255) > 0.5 ? "#212121" : "#FAFAFA"));
					} else if (value.length >= 6 && $.isNumeric("0x" + value)) {
						cpResult = "#" + value.substring(0, 6);
						$("#cpHeader").css("background-color", cpResult).css("color", ((((0.299 * ("0x" + value[0] + value[1])) + ((0.587 * ("0x" + value[2] + value[3])) + (0.114 * ("0x" + value[4] + value[5])))) / 255) > 0.5 ? "#212121" : "#FAFAFA"));
					}
				}
			}
		});
		$("#cpMain").click(function(e) {
			if (e.target !== this) {
				return;
			}
			if (cpResult == undefined) {
				$(activeColorPicker).removeClass("active");
				$(activeColorPicker).attr("result", "");
				$(activeColorPicker).children(".cpPreviewColor").css("background-color", "");
				$(activeColorPicker).children(".cpColorCode").html("");
			} else {
				$(activeColorPicker).attr("result", cpResult);
				$(activeColorPicker).children(".cpPreviewColor").css("background-color", cpResult);
				$(activeColorPicker).children(".cpColorCode").html(cpResult);
			}
			$("#cpMain").hide();
			$(activeColorPicker).trigger("change");
		});
		$("#cpColorPicker").click(function(e) {
			e.preventDefault();
		});
	}
	$(".materialColorPicker").each(function(index, value) {

		var cpLabel;
		if ((cpLabel = $(this).attr("label")) != undefined) {
			$(this).append('<span unselectable="on" class="unselectable label">' + cpLabel + '</span>');
		}
		$(this).css("min-width", 32 + $(this).children(".label").width()).click(function() {
			if ($(this).hasClass("disabled")) {
				return;
			}
			activeColorPicker = $(this);
			$(this).addClass("active");

			var colorNotFound = true;
			var result = $(this).attr("result");

			for (var loopColors = 0; loopColors < cpColors.length; loopColors++) {

				var lastColor;

				for (var loopAccents = 0; loopAccents < cpColors[loopColors].length; loopAccents++) {

					if (result == (lastColor = cpColors[loopColors][loopAccents])) {
						$("#cpHeader").css("background-color", cpColors[loopColors][loopAccents]).css("color", ((((0.299 * ("0x" + cpColors[loopColors][loopAccents].substring(1, 7)[0] + cpColors[loopColors][loopAccents].substring(1, 7)[1])) + ((0.587 * ("0x" + cpColors[loopColors][loopAccents].substring(1, 7)[2] + cpColors[loopColors][loopAccents].substring(1, 7)[3])) + (0.114 * ("0x" + cpColors[loopColors][loopAccents].substring(1, 7)[4] + cpColors[loopColors][loopAccents].substring(1, 7)[5])))) / 255) > 0.5 ? "#212121" : "#FAFAFA"));
						$("#cpHeader > input").val(cpColorsNames[loopColors] + " (" + cpAccentsNames[loopAccents] + ")");
						cpResult = cpColors[loopColors][loopAccents];
						break;
					}
				}
				if (lastColor == result) {
					colorNotFound = false;
					break;
				}
			}

			if (colorNotFound) {
				$("#cpHeader")
					.css("background-color", result)
					.css("color", ((((0.299 * ("0x" + result.substring(1, 7)[0] + result.substring(1, 7)[1])) + ((0.587 * ("0x" + result.substring(1, 7)[2] + result.substring(1, 7)[3])) + (0.114 * ("0x" + result.substring(1, 7)[4] + result.substring(1, 7)[5])))) / 255) > 0.5 ? "#212121" : "#FAFAFA"));
				$("#cpHeader > input").val(result);
				cpResult = result;
			}

			$("#cpMain").show();
		});
	});
}

function materialSubmitInit() {
	//TODO: URGENT add colorpicker input;
	$.fn.extend({
		materialSubmit: function() {
			var result = {};
			$(this).children(".materialLineInput").each(function(index, value) {
				var name;
				if (name = $(this).attr("name")) {
					result[name] = $(this).children("input, textarea").val();
				} else {
					console.error("%cInput without name:", "color: #FF5722;");
					console.error($(this));
				}
			});
			$(this).children(".materialDropDown, .materialTagInput, .materialRadioButtons, .materialCheckmark").each(function(index, value) {
				var name;
				if (name = $(this).attr("name")) {
					result[name] = $(this).attr("result");
				} else {

				}
			});
			return result;
		}
	});
}

function materialTimePickerInit() {
	$(".materialTimePicker").each(function(index, value) {
		var temp;
		if ((temp = $(this).children("center").children(".firstTime")).val().length == 0) {
			temp.val("00");
		}
		if ((temp = $(this).children("center").children(".secondTime")).val().length == 0) {
			temp.val("00");
		}

		$(this).children("center").children("input").on("focusin", function() {
			if ($(this).parent().parent().hasClass("disabled")) {
				$(this).blur();
				return;
			}
		});
		$(this).children("center").children("input").on("focusout", function() {
			if ($(this).parent().parent().hasClass("disabled")) {
				return;
			}
			if ((temp = $(this).val().length) == 0) {
				$(this).val("00");
			} else if (temp == 1) {
				$(this).val("0" + $(this).val());
			} else {
				temp = $(this).val().substring(0, 2).replace(/\D/g, '');
				if ($(this).hasClass("firstTime")) {
					if (temp > 23) {
						$(this).val("23");
					} else {
						if (temp.length == 1) {
							$(this).val("0" + temp);
						} else {
							$(this).val(temp);
						}
					}
				} else {
					if (temp > 59) {
						$(this).val("59");
					} else {
						if (temp.length == 1) {
							$(this).val("0" + temp);
						} else {
							$(this).val(temp);
						}
					}
				}
			}
		});
	});
}
//TODO: 4 Animate this
function materialDatePickerInit() {
	$(".materialDatePicker").each(function(index, value) {
		var result;
		if ((result = $(this).attr("result")) != undefined && $(this).attr("result") != "") {
			if (result == "today") { //NOTE: If needed add yesterday, tomorrow, etc..
				activeDate = previousDate = new Date(today);
				$(this).attr("result", activeDate);
			} else {
				activeDate = previousDate = new Date($(this).attr("result"));
			}
			if ($(this).attr("past") == "true") {
				$(this).addClass("valid");
			} else {
				if (activeDate.getTime() < today.getTime()) {
					$(this).addClass("invalid");
				} else {
					$(this).addClass("valid");
				}
			}
			$(this).children("span").html(activeDate.getDate() + ". " + (activeDate.getMonth() + 1) + ". " + activeDate.getFullYear());
		} else {
			activeDate = new Date(today);
		}
	});
	setupDatePicker(activeDate);
	updateSide();
	$('.materialDatePicker').click(function() {
		if ($(this).hasClass("disabled")) {
			return;
		}
		activeDatePicker = $(this);
		if ($(this).attr("result") != undefined && $(this).attr("result") != "") {
			activeDate = previousDate = new Date($(this).attr("result"));
		} else {
			activeDate = new Date(today);
		}
		setupDatePicker(activeDate);
		$("#dpMain").show();
	});
}

function updateSide(only = 0) {
	switch (only) {
		case 0:
			$("#dpSide > h2").html(activeDate.getFullYear());
			$("#dpSide > .dpTextDay").html(getDayById(activeDate.getDay()).substring(0, 3));
			$("#dpSide > .dpDate").html(getMonthById(activeDate.getMonth()).substring(0, 3) + ", " + activeDate.getDate());
			break;
		case 1:
			$("#dpSide > h2").html(activeDate.getFullYear());
			break;
		case 2:
			$("#dpSide > .dpTextDay").html(getDayById(activeDate.getDay()).substring(0, 3));
			break;
		case 3:
			$("#dpSide > .dpDate").html(getMonthById(activeDate.getMonth()).substring(0, 3) + ", " + activeDate.getDate());
			break;
	}
}

function setupDatePicker(day) {
	var m = day.getMonth(),
		y = day.getFullYear();
	var firstDayOfMonth = new Date(y, m, 1);
	var lastDayOfMonth = new Date(y, m + 1, 0);
	var tempDate = new Date(firstDayOfMonth);
	tempDate.setHours(0, 0, 0, 0);
	var html = '<table><tbody><tr><td class="dpHeader">Su</td><td class="dpHeader">Mo</td><td class="dpHeader">Tu</td><td class="dpHeader">We</td><td class="dpHeader">Th</td><td class="dpHeader">Fr</td><td class="dpHeader">Sa</td></tr><tr>';
	var i;
	for (i = 0; i < firstDayOfMonth.getDay(); i++) {
		if (i != 0 && i % 7 == 0) {
			html += "</tr><tr>";
		}
		html += "<td></td>";
	}
	if (i != 0 && i % 7 == 0) {
		html += "</tr><tr>";
	}
	for (; tempDate <= lastDayOfMonth; tempDate.setDate(tempDate.getDate() + 1)) {
		html += '<td class="dpDay ' + (tempDate.getTime() == today.getTime() ? 'today ' : '') + (tempDate.getTime() == activeDate.getTime() ? 'active"' : '"') + '>' + tempDate.getDate() + '</td>';
		if (++i != 0 && i % 7 == 0) {
			html += "</tr><tr>";
		}
	}
	$("#dpCalendar > #dpContent").html(html + '</tr></tbody></table><div id="dpFooter"><span id=dpCancel>Cancel</span><span id="dpOk">Ok</span></div>');
	$("#dpHeader > .month").html(getMonthById(day.getMonth()));
	$("#dpHeader > .year").html(day.getFullYear());
	$("#dpHeader > .year").off().on("click", function() {
		setupYearPicker(displayedDate);
	});
	$("#dpHeader > .month").off().on("click", function() {
		setupMonthPicker(displayedDate);
	});
	$("#dpCalendar .dpDay").click(function() {
		activeDate.setDate($(this).html());
		activeDate.setFullYear(displayedDate.getFullYear());
		activeDate.setMonth(displayedDate.getMonth());
		updateSide();
		$("#dpCalendar td.active").removeClass("active");
		$(this).addClass("active");
	});
	$("#dpHeader > .leftArrow").off().on("click", function() {
		displayedDate.setMonth(displayedDate.getMonth() - 1);
		setupDatePicker(displayedDate);
	});
	$("#dpHeader > .rightArrow").off().on("click", function() {
		displayedDate.setMonth(displayedDate.getMonth() + 1);
		setupDatePicker(displayedDate);
	});
	$("#dpMain").click(function(e) {
		if (e.target !== this) {
			return;
		}
		$("#dpMain").hide();
		$(activeDatePicker).trigger("change");
		activeDatePicker = null;
	});
	$("#dpCancel").click(function(e) {
		$(activeDatePicker).removeClass("invalid").removeClass("valid").attr("result", "").children("span").html("Select date");
		$(activeDatePicker).trigger("change");
		activeDatePicker = null;
		$("#dpMain").hide();
	});
	$("#dpOk").click(function() {
		$(activeDatePicker).attr("result", activeDate);
		$(activeDatePicker).children("span").html(activeDate.getDate() + ". " + (activeDate.getMonth() + 1) + ". " + activeDate.getFullYear());
		if ($(activeDatePicker).attr("past") == "true") {
			$(activeDatePicker).addClass("valid");
		} else {
			if (activeDate.getTime() < today.getTime()) {
				$(activeDatePicker).removeClass("valid").addClass("invalid");
			} else {
				$(activeDatePicker).removeClass("invalid").addClass("valid");
			}
		}
		$(activeDatePicker).trigger("change");
		$("#dpMain").hide();
	});
}

function setupYearPicker(date) {
	var html = "";
	$("#dpHeader div").remove();
	$("#dpHeader .leftArrow").after('<div>Year</div>');
	for (var j = 1; j <= 12; j++) {
		html = '<div class="yearOption">' + (date.getFullYear() - j) + '</div>' + html;
	}
	html += '<div class="yearOption active">' + date.getFullYear() + '</div>';
	for (var j = 1; j <= 12; j++) {
		html += '<div class="yearOption">' + (date.getFullYear() + j) + '</div>';
	}
	$("#dpContent").html(html);
	$("#dpHeader > .leftArrow").off().on("click", function() {
		displayedDate.setFullYear(displayedDate.getFullYear() - 25);
		setupYearPicker(displayedDate);
	});
	$("#dpHeader > .rightArrow").off().on("click", function() {
		displayedDate.setFullYear(displayedDate.getFullYear() + 25);
		setupYearPicker(displayedDate);
	});
	$("#dpContent > .yearOption").click(function() {
		displayedDate.setFullYear($(this).html());
		setupMonthPicker(displayedDate);
	});
}

function setupMonthPicker(date) {
	$("#dpHeader div").remove();
	$("#dpHeader .leftArrow").after('<div>Month</div>');
	var html = "";
	for (var j = 0; j < 12; j++) {
		html += '<div id="' + j + '"  class="month ' + (j == today.getMonth() ? 'active' : '') + '">' + getMonthById(j) + '</div>';
	}
	$("#dpContent").html(html);
	$("#dpHeader > .leftArrow").off().on("click", function() {
		displayedDate.setMonth(displayedDate.getMonth() - 12);
		setupMonthPicker(displayedDate);
	});
	$("#dpHeader > .rightArrow").off().on("click", function() {
		displayedDate.setMonth(displayedDate.getMonth() + 12);
		setupMonthPicker(displayedDate);
	});
	$("#dpContent > .month").click(function() {
		displayedDate.setMonth($(this).attr("id"));
		setupDatePicker(displayedDate);
		$("#dpHeader div").remove();
		$("#dpHeader .leftArrow").after('<div class="month">January</div><div class="year">1990</div>');
		$("#dpHeader > .year").off().on("click", function() {
			setupYearPicker(displayedDate);
		});
		$("#dpHeader > .month").off().on("click", function() {
			setupMonthPicker(displayedDate);
		});
	});
}
