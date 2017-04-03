function timetableEditorInit(_id) {
	console.info("%cFunction run:\t" + "%ctimetableEditorInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
	console.log("Timetable init with id: " + _id);

	editingBody = undefined;
	subjectOptionActivated = false;

	//Create timetable
	$.post(baseDir + "/php/get/getNewTimetableData.php", {
		idToken: googleTokenId,
		classId: _id
	}, function(_ajaxData) {

		if (_ajaxData.success) {

			var timetable = new Timetable(JSON.stringify(_ajaxData.data), true);
			timetable.placeTimetableOn($(".timetableEditor"));

			//Basic functions
			materialFormInit();

			//Listeners
			$("#save").click(function() {
				// $.post(baseDir + "/php/set/setTimetable.php", {
				// 	idToken: googleTokenId,
				// 	classId: _id,
				// 	timetable: timetable.toJSON()
				// }, function(_ajaxData) {
				//
				// 	if (_ajaxData.success) {
				// 		popout("Success");
				// 	} else {
				// 		popout(_ajaxData.error.message);
				// 	}
				// });

				console.log("SAVE");
				console.log(JSON.stringify(timetable.toArray()));

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

			//Number
			$("#teSubjectNumber > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (/^\d+$/.test(value) && value.length <= 3) { // /^\d+$/.test(value - test if all characters are digits
					var subject = $(editingBody).parent().parent();
					$(subject).data("Subject").number = value;
					$(subject).find(".number span").html(value);

					setChanged();

				}
			});
			//Acr
			$("#teSubjectAcronym > input").on("change keyup keydown paste", function() {
				var value = $(this).val().toUpperCase();
				if (value.length <= 3) {
					var subjectBody = $(editingBody);
					timetable.bodies[subjectBody.data("SubjectBody").body.id].acronym = value;
					$(subjectBody).data("SubjectBody").body.acronym = value;
					if (!$(subjectBody).data("SubjectBody").body.icon) {
						if (value.length > 0) {
							$(subjectBody).children(".ttSubjectIcon").html(value.charAt(0));
							$(".teSubjectImage").html(value.charAt(0));
						} else {
							$(subjectBody).children(".ttSubjectIcon").html('<i class="material-icons">school</i>');
							$(".teSubjectImage").html('<i class="material-icons">school</i>');
						}
					}

					setChanged(true);
				}
			});
			//Name
			$("#teSubjectName > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (value.length <= 50) {
					var subjectBody = $(editingBody);
					console.log("SUBJECTBODY");
					console.log(timetable.bodies[subjectBody.data("SubjectBody").body.id]);
					timetable.bodies[subjectBody.data("SubjectBody").body.id].name = value;
					$(subjectBody).children(".ttSubjectName").html(value);

					setChanged(true);
				}
			});
			//Teacher's name
			$("#teTeacherName > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (value.length <= 50) {
					var subjectBody = $(editingBody);
					timetable.teachers[subjectBody.data("SubjectBody").teacher.id].name = value;
					$(subjectBody).children(".ttSubjectInfo").html(
						timetable.teachers[subjectBody.data("SubjectBody").teacher.id].getFullName() + (timetable.teachers[subjectBody.data("SubjectBody").teacher.id].getFullName() && timetable.locations[subjectBody.data("SubjectBody").location.id].name ? " - " : "") + timetable.locations[subjectBody.data("SubjectBody").location.id].name);

					setChanged(false, true);
				}
			});
			//Teacher's surname
			$("#teTeacherSurname > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (value.length <= 50) {
					var subjectBody = $(editingBody);
					timetable.teachers[subjectBody.data("SubjectBody").teacher.id].surname = value;
					$(subjectBody).children(".ttSubjectInfo").html(
						timetable.teachers[subjectBody.data("SubjectBody").teacher.id].getFullName() + (timetable.teachers[subjectBody.data("SubjectBody").teacher.id].getFullName() && timetable.locations[subjectBody.data("SubjectBody").location.id].name ? " - " : "") + timetable.locations[subjectBody.data("SubjectBody").location.id].name);

					setChanged(false, true);
				}
			});
			//Teacher's description

			$("#teTeacherDescription > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (value.length <= 50) {
					var subjectBody = $(editingBody);
					timetable.teachers[$(editingBody).data("SubjectBody").teacher.id].description = value;

					setChanged(false, true);
				}
			});

			//Location's name
			$("#teLocation > input").on("change keyup keydown paste", function() {
				var value = $(this).val();
				if (value.length <= 50) {
					var subjectBody = $(editingBody);
					$(subjectBody).data("SubjectBody").location.name = value;

					$(subjectBody).children(".ttSubjectInfo").html(
						timetable.teachers[subjectBody.data("SubjectBody").teacher.id].getFullName() + (timetable.teachers[subjectBody.data("SubjectBody").teacher.id].getFullName() && timetable.locations[subjectBody.data("SubjectBody").location.id].name ? " - " : "") + timetable.locations[subjectBody.data("SubjectBody").location.id].name
					);

					setChanged(false, false, true);
				}
			});
			//TODO: Location's description


			//Start time
			$("body").on("change keyup keydown paste focusout", "#teStartTime input", function() {
				if (subjectOptionActivated) {
					var value = $(this).parent().children(".firstTime").val() + ":" + ($(this).parent().children(".secondTime").val().length == 1 ? "0" + $(this).parent().children(".secondTime").val() : $(this).parent().children(".secondTime").val());



					var subject = $(editingBody).parent().parent();
					$(subject).data("Subject").start = new Time(value);
					$(subject).find(".time > .start").html(value);

					setChanged();
				}
			});
			//End time
			$("body").on("change keyup keydown paste focusout", "#teEndTime input", function() {
				if (subjectOptionActivated) {
					var value = $(this).parent().children(".firstTime").val() + ":" + ($(this).parent().children(".secondTime").val().length == 1 ? "0" + $(this).parent().children(".secondTime").val() : $(this).parent().children(".secondTime").val());

					var subject = $(editingBody).parent().parent();
					$(subject).data("Subject").end = new Time(value);
					$(subject).find(".time > .end").html(value);


					setChanged();
				}
			});
			//Color picker
			$("body").on("change", "#teColorPicker", function() {
				result = $(activeColorPicker).attr("result");

				var subjectBody = $(editingBody);
				$(subjectBody).data("SubjectBody").color = result;
				$(subjectBody).children(".ttSubjectIcon").css("background-color", result);

				$(".teSubjectImage").css("background-color", result);

				setChanged(true);

			});
		} else {
			popout(_ajaxData.error.message);
		}
	});
}

function setChanged(_body = false, _teacher = false, _location = false){
	var subject = $(editingBody).parent().parent().data("Subject");

	subject.changed = true;

	for (var i = 0; i < subject.bodies.length; i++){
		// var subjectBody = subject.bodies[i];
		subject.bodies[i].body.changed = _body;
		subject.bodies[i].teacher.changed = _teacher;
		subject.bodies[i].location.changed = _location;
		$(subject.bodies[i].notificationArea.changeElement).css("display", "block");
		subject.bodies[i].notificationArea.changed = true;
		subject.bodies[i].resize();

	}

}
