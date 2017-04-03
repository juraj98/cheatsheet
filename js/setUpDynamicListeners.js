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
		// TODO: change limits

		if (editingBody) {
			$(editingBody.data("SubjectBody").notificationArea.editingElement).css("display", "none");
			editingBody.data("SubjectBody").notificationArea.editing = false;
		}

		editingBody = $(this);

		//Enable options
		if (!subjectOptionActivated) {
			subjectOptionActivated = true;
			// TODO: Add iconpicker
			$("#teSubjectOptions, #teTeacherOptions, #teLocationOptions").children(".disabled").not("#teIconPicker").each(function() {
				$(this).removeClass("disabled");
			});
		}

		$(editingBody.data("SubjectBody").notificationArea.editingElement).css("display", "block");
		editingBody.data("SubjectBody").notificationArea.editing = true;

		editingBody.data("SubjectBody").resize();

		var subject = $(this).parent().parent().data("Subject");
		var subjectBody = $(this).data("SubjectBody");

		//Number ✓
		if (subject.number.toString().length <= 3) {
			$("#teSubjectNumber").removeClass("invalid").addClass("valid").children(".label").addClass("active")
		} else {
			$("#teSubjectNumber").removeClass("valid").addClass("invalid").children(".label").addClass("active");
		}
		$("#teSubjectNumber > input").val(subject.number);
		$("#teSubjectNumber > .maxLengthLabel").html(subject.number.toString().length + "/3");

		//Day index
		$("#teSubjectDay").addClass("ok").attr("result", subject.dayIndex).html(JSON.parse($("#teSubjectDay").attr("options"))[subject.dayIndex] + '<i class="material-icons">arrow_drop_down</i>');

		//Start time ✓
		$("#teStartTime .firstTime").val(subject.startTime.getHours().toString().length == 1 ? "0" + subject.startTime.getHours() : subject.startTime.getHours());
		$("#teStartTime .secondTime").val(subject.startTime.getMinutes().toString().length == 1 ? "0" + subject.startTime.getMinutes() : subject.startTime.getMinutes());
		//End time ✓
		$("#teEndTime .firstTime").val(subject.endTime.getHours().toString().length == 1 ? "0" + subject.endTime.getHours() : subject.endTime.getHours());
		$(" #teEndTime .secondTime").val(subject.endTime.getMinutes().toString().length == 1 ? "0" + subject.endTime.getMinutes() : subject.endTime.getMinutes());

		//Color ✓
		if (subjectBody.body.color) {
			$("#teColorPicker").addClass("active").attr("result", subjectBody.body.color);
			$("#teColorPicker .cpColorCode").html(subjectBody.body.color);
			$("#teColorPicker .cpPreviewColor").css("background-color", subjectBody.body.color);
			$(".teSubjectImage").css("background-color", subjectBody.body.color);
		} else {
			$("#teColorPicker").removeClass("active").attr("result", "");
			$("#teColorPicker .cpColorCode").html("");
			$("#teColorPicker .cpPreviewColor").css("background-color", "");
			$(".teSubjectImage").css("background-color", "");
		}

		//Icon
		if (subjectBody.body.icon) {
			//TODO: 6 Add functionality after icon picker is finished
		} else {
			//NOTE: 6 If no icon, charAt(0) handled in //Name section
		}
		//Name
		if (subjectBody.body.name) {
			if (subjectBody.body.name.length <= 50) {
				$("#teSubjectName").removeClass("invalid").addClass("valid").children(".label").addClass("active");
			} else {
				$("#teSubjectName").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
		} else {
			$("#teSubjectName").removeClass("valid invalid").children(".label").removeClass("active");
		}
		$("#teSubjectName > input").val(subjectBody.body.name);
		$("#teSubjectName > .maxLengthLabel").html(subjectBody.body.name.length + "/50");

		//Acronym
		if (subjectBody.body.acronym) {
			if (subjectBody.body.acronym.length <= 3) {
				$("#teSubjectAcronym").removeClass("invalid").addClass("valid").children(".label").addClass("active");
			} else {
				$("#teSubjectAcronym").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
		} else {
			$("#teSubjectAcronym").removeClass("valid invalid").children(".label").removeClass("active");
		}
		$("#teSubjectAcronym > input").val(subjectBody.body.acronym);
		$("#teSubjectAcronym > .maxLengthLabel").html(subjectBody.body.acronym.length + "/3");

		if (subjectBody.body.icon) {
			console.log("te has icon");
		} else {
			if (subjectBody.body.acronym.length == 0) {
				$(".teSubjectImage").html('<i class="material-icons">school</i>');
			} else {
				$(".teSubjectImage").html(subjectBody.body.acronym.charAt(0).toUpperCase());
			}
		}

		//Teacher's name
		if (subjectBody.teacher.name) {
			if (subjectBody.teacher.name.length <= 50) {
				$("#teTeacherName").removeClass("invalid").addClass("valid").children(".label").addClass("active")
			} else {
				$("#teTeacherName").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
		} else {
			$("#teTeacherName").removeClass("valid invalid").children(".label").removeClass("active");
		}
		$("#teTeacherName > input").val(subjectBody.teacher.name);
		$("#teTeacherName > .maxLengthLabel").html(subjectBody.teacher.name.length + "/50");

		//Teacher's description
		if (subjectBody.teacher.description) {
			if (subjectBody.teacher.description.length <= 50) {
				$("#teTeacherDescription").removeClass("invalid").addClass("valid").children(".label").addClass("active")
			} else {
				$("#teTeacherDescription").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
			$("#teTeacherDescription > input").val(subjectBody.teacher.description);
			$("#teTeacherDescription > .maxLengthLabel").html(subjectBody.teacher.description.length + "/50");
		} else {
			$("#teTeacherDescription").removeClass("valid invalid").children(".label").removeClass("active");
		}

		//Teacher's surname
		if (subjectBody.teacher.surname) {
			if (subjectBody.teacher.surname.length <= 50) {
				$("#teTeacherSurname").removeClass("invalid").addClass("valid").children(".label").addClass("active")
			} else {
				$("#teTeacherSurname").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
		} else {
			$("#teTeacherSurname").removeClass("valid invalid").children(".label").removeClass("active");
		}
		$("#teTeacherSurname > input").val(subjectBody.teacher.surname);
		$("#teTeacherSurname > .maxLengthLabel").html(subjectBody.teacher.surname.length + "/50");

		//Location
		if (subjectBody.location.name) {
			if (subjectBody.location.name.length <= 50) {
				$("#teLocation").removeClass("invalid").addClass("valid").children(".label").addClass("active")
			} else {
				$("#teLocation").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
		} else {
			$("#teLocation").removeClass("valid invalid").children(".label").removeClass("active");
		}
		$("#teLocation > input").val(subjectBody.location.name);
		$("#teLocation > .maxLengthLabel").html(subjectBody.location.name.length + "/50");

		//Location
		if (subjectBody.location.description) {
			if (subjectBody.location.description.length <= 50) {
				$("#teLocationDescription").removeClass("invalid").addClass("valid").children(".label").addClass("active")
			} else {
				$("#teLocationDescription").removeClass("valid").addClass("invalid").children(".label").addClass("active");
			}
			$("#teLocationDescription > input").val(subjectBody.location.description);
			$("#teLocationDescription > .maxLengthLabel").html(subjectBody.location.description.length + "/50");
		} else {
			$("#teLocationDescription").removeClass("valid invalid").children(".label").removeClass("active");
		}

	});


}
