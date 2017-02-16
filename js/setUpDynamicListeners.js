function setupDynamicListeners() {
	console.info("%cFunction run:\t" + "%csetupDynamicListeners()", "color: #303F9F; font-weight:700", "color: #303F9F");
	//Main
	$(document).on('click', function(e) {
		//topMenu
		$(".topMenuUserImageActive").removeClass("topMenuUserImageActive");
		//Form
		activeDropDown = null;
		$(".dropDownOptions").slideUp(300);

	});
	//Form
	$("body").on("mousedown", ".materialLineInput > i", function() {
		$(this).parent().children("input").attr("type", "text");
	});
	$("body").on("mouseup", ".materialLineInput > i", function() {
		$(this).parent().children("input").attr("type", "password");
	});
	$("body").on("click", ".dropDownOptions > .dropDownOption", function(e) {
		e.stopPropagation();
		if ($(this).hasClass("dropDownDesc")) {
			return;
		} else if ($(this).hasClass("dropDownNone")) {
			var placeholder = activeDropDown.attr("placeholder");
			activeDropDown.removeClass("ok");
			if (placeholder == undefined) {
				activeDropDown.html('Choose your option <i class="material-icons">arrow_drop_down</i>');
			} else {
				activeDropDown.html(placeholder + ' <i class="material-icons">arrow_drop_down</i>');
			}
			activeDropDown.attr("result", "");
			$(this).parent().slideUp(300);
		} else {
			activeDropDown.addClass("ok");
			var thisHTML = $(this).html();
			activeDropDown.attr("result", $(this).attr("id"));
			activeDropDown.html(thisHTML + ' <i class="material-icons">arrow_drop_down</i>');
			$(this).parent().slideUp(300);
		}
		$(activeDropDown).trigger("change");
	});

	//Class -> Upload -> Filter and Upload button click
	$("body").on("click", "#classOptionsPanel > #filter", function() {
		$("#classUploads").slideUp(400, function() {
			$("#classFilterPanel").stop().slideToggle(200);
		});
		tagInputInit();
		dropDownInit();
		$(this).addClass("weight-700");
		$("#upload").removeClass("weight-700");
	});
	$("body").on("click", "#classOptionsPanel > #upload", function() {
		$("#classFilterPanel").slideUp(400, function() {
			$("#classUploads").stop().slideToggle(200);
		});
		tagInputInit();
		dropDownInit();
		$(this).addClass("weight-700");
		$("#filter").removeClass("weight-700");
	});
	//Class -> Timetable -> Edit and Personalize button click
	//Class -> Timetable menu arrows
	$("body").on("click", "#classTimetableMenu > #leftArrow", function() {
		activeDay = setDay(false, activeDay);
		setupTimetable();
	});
	$("body").on("click", "#classTimetableMenu > #rightArrow", function() {
		activeDay = setDay(true, activeDay);
		setupTimetable();
	});
	//Class -> Messages
	//Class -> Groups -> My groups and Create group button click
	$("body").on("click", "#classOptionsPanel > #group", function() {

	});
	$("body").on("click", "#classOptionsPanel > #create", function() {
		$("#classMyGroups").slideUp(400, function() {
			$("#classCreateGroup").stop().slideToggle(200);
		});
		materialInputInit();
		materialTextareaInit();
		materialDropdownInit();

		var privacyLeft;
		var totalWidth = $("#classCreateGroup").width();

		$("#classGroupName").width(privacyLeft = ((totalWidth - 138) / 3 * 2 - 4));
		$("#classGroupPrivacy").width((totalWidth - 138) / 3 - 4).css("left", privacyLeft + 8);
		$("#classGroupDesc").width(totalWidth - 138);

	});
	//

	//
	//Class -> Groups
	$("body").on("click", ".classGroupMembers", function() {
		$(this).parent().parent().children(".classGroupMembersPanel").stop().slideToggle(300);
	});


	$("body").on("click", ".timetableEditor .ttSubjectBody", function() {
		//TODO: 5 remove conditions for checking if the strings lengths are within the limits. Theoreticaly they all of them should be.

		if (editingBody) {
			$(editingBody.data("SubjectBody").notificationArea.editingElement).css("display", "none");
			editingBody.data("SubjectBody").notificationArea.editing = false;
		}

		editingBody = $(this);

		//Enable subject options
		if (!subjectOptionActivated) {
			subjectOptionActivated = true;
			$(".teSubjectOptions").children(".disabled").each(function() {
				$(this).removeClass("disabled");
			});
		}

		$(editingBody.data("SubjectBody").notificationArea.editingElement).css("display", "block");
		editingBody.data("SubjectBody").notificationArea.editing = true;

		editingBody.data("SubjectBody").resize();

		var subject = $(this).parent().parent().data("Subject");
		var body = $(this).data("SubjectBody");

		//Number
		if (subject.number.toString().length <= 3) {
			$("#teSubjectNumber").removeClass("invalid").addClass("valid").children(".label").addClass("active")
		} else {
			$("#teSubjectNumber").removeClass("valid").addClass("invalid").children(".label").addClass("active");
		}
		$(".teSubjectOptions > #teSubjectNumber > input").val(subject.number);
		$(".teSubjectOptions > #teSubjectNumber > .maxLengthLabel").html(subject.number.toString().length + "/3");

		//Start time
		$("#teStartTime .firstTime").val(subject.start.getHours().toString().length == 1 ? "0" + subject.start.getHours() : subject.start.getHours());
		$("#teStartTime .secondTime").val(subject.start.getMinutes().toString().length == 1 ? "0" + subject.start.getMinutes() : subject.start.getMinutes());
		//End time
		$(".teSubjectOptions #teEndTime .firstTime").val(subject.end.getHours().toString().length == 1 ? "0" + subject.end.getHours() : subject.end.getHours());
		$(".teSubjectOptions #teEndTime .secondTime").val(subject.end.getMinutes().toString().length == 1 ? "0" + subject.end.getMinutes() : subject.end.getMinutes());
		//Color
		if (body.color) {
			$("#teColorPicker").addClass("active").attr("result", body.color);
			$("#teColorPicker .cpColorCode").html(body.color);
			$("#teColorPicker .cpPreviewColor").css("background-color", body.color);
			$(".teSubjectImage").css("background-color", body.color);
		} else {
			$("#teColorPicker").removeClass("active").attr("result", "");
			$("#teColorPicker .cpColorCode").html("");
			$("#teColorPicker .cpPreviewColor").css("background-color", "");
			$(".teSubjectImage").css("background-color", "");
		}

		resizeNumberInput();
		//Icon
		if (body.icon) {
			//TODO: 6 Add functionality after icon picker is finished
		} else {
			//NOTE: 6 If no icon, charAt(0) handled in //Name section
		}
		//Name
		if (body.name) {
			if (body.name.length <= 50) {
				$("#teSubjectName").removeClass("invalid").addClass("valid").children(".label").addClass("active");
			} else {
				$("#teSubjectName").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
		} else {
			$("#teSubjectName").removeClass("valid invalid").children(".label").removeClass("active");
		}
		$("#teSubjectName > input").val(body.name);
		$("#teSubjectName > .maxLengthLabel").html(body.name.length + "/50");

		//Acronym
		if (body.acronym) {
			if (body.acronym.length <= 3) {
				$("#teSubjectAcronym").removeClass("invalid").addClass("valid").children(".label").addClass("active");
			} else {
				$("#teSubjectAcronym").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
		} else {
			$("#teSubjectAcronym").removeClass("valid invalid").children(".label").removeClass("active");
		}
		$("#teSubjectAcronym > input").val(body.acronym);
		$("#teSubjectAcronym > .maxLengthLabel").html(body.acronym.length + "/3");

		if (body.icon) {
			console.log("te has icon");
		} else {
			if (body.acronym.length == 0) {
				$(".teSubjectImage").html('<i class="material-icons">school</i>');
			} else {
				$(".teSubjectImage").html(body.acronym.charAt(0).toUpperCase());
			}
		}

		//Teacher
		if (body.teacher) {
			if (body.teacher.length <= 50) {
				$("#teTeacher").removeClass("invalid").addClass("valid").children(".label").addClass("active")
			} else {
				$("#teTeacher").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
		} else {
			$("#teTeacher").removeClass("valid invalid").children(".label").removeClass("active");
		}
		$("#teTeacher > input").val(body.teacher);
		$("#teTeacher > .maxLengthLabel").html(body.teacher.length + "/50");

		//Location
		if (body.location) {
			if (body.location.length <= 50) {
				$("#teLocation").removeClass("invalid").addClass("valid").children(".label").addClass("active")
			} else {
				$("#teLocation").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
		} else {
			$("#teLocation").removeClass("valid invalid").children(".label").removeClass("active");
		}
		$("#teLocation > input").val(body.location);
		$("#teLocation > .maxLengthLabel").html(body.location.length + "/50");

	});


}
