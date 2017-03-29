function timetableEditorInit(_id) {
	console.info("%cFunction run:\t" + "%ctimetableEditorInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
	console.log("Timetable init with id: " + _id);

	editingBody = undefined;
	subjectOptionActivated = false;

	//Create timetable

	$.post(baseDir + "/php/get/getTimetableData.php", {
		idToken: googleTokenId,
		classId: _id
	}, function(_ajaxData) {

		if (_ajaxData.success) {
			var timetable = new Timetable(JSON.stringify(_ajaxData.data.timetable), true, null);
			timetable.placeTimetableOn(".timetableEditor");
			resizeNumberInput();

			//Basic functions
			materialFormInit();


			//Listeners
			$("#save").click(function() {
				$.post(baseDir + "/php/set/setTimetable.php", {
					idToken: googleTokenId,
					classId: _id,
					timetable: timetable.toJSON()
				}, function(_ajaxData) {

					if (_ajaxData.success) {
						popout("Success");
					} else {
						popout(_ajaxData.error.message);
					}

				});
			});
			$("#remove").click(function() {
				if ($(this).parent().hasClass("disabled")) {
					return;
				}

				if (editingBody) {
					var currentTimetableDay = timetable.getCurrentTimetableDay(),
						subjectId = $(editingBody).parent().parent().data("Subject").id,
						bodyId = $(editingBody).data("SubjectBody").id;

					//Deleting body
					for (var currentSubjectId = 0; currentSubjectId < currentTimetableDay.subjects.length; currentSubjectId++) {

						if (subjectId == currentTimetableDay.subjects[currentSubjectId].id) {

							//If deleting last body of subject delete whole subject istead
							if (currentTimetableDay.subjects[currentSubjectId].bodies.length == 1) {
								currentTimetableDay.subjects.splice(currentSubjectId, 1); //Remove from subjects array

								editingBody = $(editingBody).parent().parent();

								if (currentTimetableDay.subjects.length == 0) { //If there is no subject left in timetableDay
									$(editingBody).next(".insertSubject").remove();
									$(editingBody).prev(".insertSubject").removeClass("top").addClass("insertFirstSubject").html('<p>Insert first subject</p><p>Timetable for this day is empty</p>');

									subjectOptionActivated = false;
									$(".teSubjectOptions").children().each(function() {
										if ($(this).hasClass("materialLineInput")) {
											$(this).removeClass("valid invalid").addClass("disabled").children("span").removeClass("active");
											$(this).children("input").val("");
										} else if ($(this).hasClass("teSubjectImage")) {
											$(this).css("background-color", "");
										} else if ($(this).hasClass("materialColorPicker")) {
											$(this).attr("result", "").removeClass("active").addClass("disabled");
											$(this).children(".cpColorCode").html("");
											$(this).children(".cpPreviewColor").css("background-color", "");
										} else if ($(this).hasClass("materialTimePicker")) {
											$(this).addClass("disabled").find("input").val("00");

										}
									});
								} else {
									if ($(editingBody).prev(".insertSubject").hasClass("top")) { //remove insert
										$(editingBody).next(".insertSubject").remove();
									} else {
										$(editingBody).prev(".insertSubject").remove();
									}
								}

								$(editingBody).remove();
								editingBody = null;

								return;
							}

							var bodyFound = false;

							for (var currentBodyId = 0; currentBodyId < currentTimetableDay.subjects[currentSubjectId].bodies.length; currentBodyId++) {

								if (bodyId == currentTimetableDay.subjects[currentSubjectId].bodies[currentBodyId].id) {

									bodyFound = true;
									break;
								}

							}
						}

						if (bodyFound) {
							//Delete inserSubjectBody element

							currentTimetableDay.subjects[currentSubjectId].bodies.splice(currentBodyId, 1); //Remove from subjects array

							if ($(editingBody).prev(".insertSubjectBody").hasClass("top")) { //remove insert
								$(editingBody).next(".insertSubjectBody").remove();
							} else {
								$(editingBody).prev(".insertSubjectBody").remove();
							}

							//save next body for later
							var nextBody = $(editingBody).next(".ttSubjectBody").length > 0 ? $(editingBody).next(".ttSubjectBody") : $(editingBody).prev(".ttSubjectBody");

							//Delete body
							$(editingBody).remove();
							editingBody = null;

							//makeNextBodyActive
							$(nextBody).trigger("click");

							break;
						}
					}
				}

			});

			//.ttSubjectBody click listener in setUpDynamicListeners.js

			//Number
			$("#teSubjectNumber > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (/^\d+$/.test(value) && value.length <= 3) { ///^\d+$/.test(value - test if all characters are digits
					var subject = $(editingBody).parent().parent();
					$(subject).data("Subject").number = value;
					$(subject).find(".number span").html(value);

					for (var i = 0; i < $(subject).data("Subject").bodies.length; i++) { //TODO: 11 Adding changed notification even when there was no change
						var subjectBody = $(subject).data("Subject").bodies[i];
						$(subjectBody.notificationArea.changeElement).css("display", "block");
						subjectBody.notificationArea.changed = true;
						subjectBody.resize();
					}
				}
			});
			//Acr
			$("#teSubjectAcronym > input").on("change keyup keydown paste", function() {
				var value = $(this).val().toUpperCase();
				if (value.length <= 3) {
					var subjectBody = $(editingBody);
					$(subjectBody).data("SubjectBody").acronym = value;
					if (!$(subjectBody).data("SubjectBody").icon) {
						if (value.length > 0) {
							$(subjectBody).children(".ttSubjectIcon").html(value.charAt(0));
						} else {
							$(subjectBody).children(".ttSubjectIcon").html('<i class="material-icons">school</i>');
						}
					}

					subjectBody = $(editingBody).data("SubjectBody");
					$(subjectBody.notificationArea.changeElement).css("display", "block");
					subjectBody.notificationArea.changed = true;
					subjectBody.resize();
				}
			});
			//Name
			$("#teSubjectName > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (value.length <= 50) {
					var subjectBody = $(editingBody);
					$(subjectBody).data("SubjectBody").name = value;
					$(subjectBody).children(".ttSubjectName").html(value);

					subjectBody = $(editingBody).data("SubjectBody");
					$(subjectBody.notificationArea.changeElement).css("display", "block");
					subjectBody.notificationArea.changed = true;
					subjectBody.resize();
				}
			});
			//Teacher
			$("#teTeacher > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (value.length <= 50) {
					var subjectBody = $(editingBody);
					$(subjectBody).data("SubjectBody").teacher = value;
					$(subjectBody).children(".ttSubjectInfo").html(value + ($(subjectBody).data("SubjectBody").teacher && $(subjectBody).data("SubjectBody").location ? " - " : "") + $(subjectBody).data("SubjectBody").location);

					subjectBody = $(editingBody).data("SubjectBody");
					$(subjectBody.notificationArea.changeElement).css("display", "block");
					subjectBody.notificationArea.changed = true;
					subjectBody.resize();
				}
			});
			//Location
			$("#teLocation > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (value.length <= 50) {
					var subjectBody = $(editingBody);
					$(subjectBody).data("SubjectBody").location = value;
					$(subjectBody).children(".ttSubjectInfo").html($(subjectBody).data("SubjectBody").teacher + ($(subjectBody).data("SubjectBody").teacher && $(subjectBody).data("SubjectBody").location ? " - " : "") + value);

					subjectBody = $(editingBody).data("SubjectBody");
					$(subjectBody.notificationArea.changeElement).css("display", "block");
					subjectBody.notificationArea.changed = true;
					subjectBody.resize();
				}
			});


			//Start time
			$("body").on("change keyup keydown paste focusout", "#teStartTime input", function() {
				if (subjectOptionActivated) {
					var value = $(this).parent().children(".firstTime").val() + ":" + ($(this).parent().children(".secondTime").val().length == 1 ? "0" + $(this).parent().children(".secondTime").val() : $(this).parent().children(".secondTime").val());



					var subject = $(editingBody).parent().parent();
					$(subject).data("Subject").start = new Time(value);
					$(subject).find(".time > .start").html(value);

					for (var i = 0; i < $(subject).data("Subject").bodies.length; i++) { //TODO: 12 Adding changed notification even when there was no change
						var subjectBody = $(subject).data("Subject").bodies[i];
						$(subjectBody.notificationArea.changeElement).css("display", "block");
						subjectBody.notificationArea.changed = true;
						subjectBody.resize();
					}
				}
			});
			//End time
			$("body").on("change keyup keydown paste focusout", "#teEndTime input", function() {
				if (subjectOptionActivated) {
					var value = $(this).parent().children(".firstTime").val() + ":" + ($(this).parent().children(".secondTime").val().length == 1 ? "0" + $(this).parent().children(".secondTime").val() : $(this).parent().children(".secondTime").val());

					var subject = $(editingBody).parent().parent();
					$(subject).data("Subject").end = new Time(value);
					$(subject).find(".time > .end").html(value);

					for (var i = 0; i < $(subject).data("Subject").bodies.length; i++) { //TODO: 13 Adding changed notification even when there was no change
						var subjectBody = $(subject).data("Subject").bodies[i];
						$(subjectBody.notificationArea.changeElement).css("display", "block");
						subjectBody.notificationArea.changed = true;
						subjectBody.resize();
					}
				}
			});
			//Color picker
			$("body").on("change", "#teColorPicker", function() {
				result = $(activeColorPicker).attr("result");
				resizeNumberInput();

				var subjectBody = $(editingBody);
				$(subjectBody).data("SubjectBody").color = result;
				$(subjectBody).children(".ttSubjectIcon").css("background-color", result);

				$(".teSubjectImage").css("background-color", result);

				subjectBody = $(editingBody).data("SubjectBody");
				$(subjectBody.notificationArea.changeElement).css("display", "block");
				subjectBody.notificationArea.changed = true;
				subjectBody.resize();

			});
		} else {
			popout(_ajaxData.error.message);
		}
	});
}

function resizeNumberInput() {
	//	console.log("Size: " + $(".teSubjectOptions").outerWidth(true) + " - (" + $("#teColorPicker").outerWidth(true) + " + 82)" + " = " + ($(".teSubjectOptions").outerWidth(true) - ($("#teColorPicker").outerWidth(true) + 82)));
}
