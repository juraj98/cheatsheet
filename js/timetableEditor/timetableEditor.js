var timetable;

function timetableEditorInit(_id) {
	console.info("%cFunction run:\t" + "%ctimetableEditorInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
	console.log("Timetable init with id: " + _id);

	editingBody = undefined;
	subjectOptionActivated = false;

	//Basic functions
	materialFormInit();

	//Create timetable
	loadTimetable(_id, function () {
		// Resize listener
		teSetupAutocompleteLists();
		$(window).off().resize(function () {
			timetable.placeTimetableOn($(".timetableEditor"));
		});
	});

	teMenuInit(_id);

	teAddListeners(_id);
	teAddAutocmplete();
}

function teMenuInit(_id){
	$("#teMenuTimetableBtn").click(function(){
		$(".teMenuItem.active").removeClass("active");
		$(this).addClass("active");
		$("#teOthersEditor").hide();
		$(".timetableEditor").show();

		//Header
		$("#teEditorHeader").html("Timetable editor:");

		//Load Timetable
		timetable.placeTimetableOn($(".timetableEditor"));
	});
	$("#teMenuBodiesBtn").click(function(){
		$(".teMenuItem.active").removeClass("active");
		$(this).addClass("active");
		$(".timetableEditor").hide();
		$("#teOthersEditor").show();

		//Header
		$("#teEditorHeader").html("Bodies editor:");

	});
	$("#teMenuTeachersBtn").click(function(){
		$(".teMenuItem.active").removeClass("active");
		$(this).addClass("active");
		$(".timetableEditor").hide();
		$("#teOthersEditor").show();

		//Header
		$("#teEditorHeader").html("Teachers editor:");

	});
	$("#teMenuLocationsBtn").click(function(){
		$(".teMenuItem.active").removeClass("active");
		$(this).addClass("active");
		$(".timetableEditor").hide();
		$("#teOthersEditor").show();

		//Header
		$("#teEditorHeader").html("Locations editor:");

	});
}


function loadTimetable(_id, _callback) {
	console.log("Load timetable");
	$.post(baseDir + "/php/get/getNewTimetableData.php", {
		idToken: googleTokenId,
		classId: _id
	}, function (_ajaxData) {

		if (_ajaxData.success) {
			timetable = new Timetable(JSON.stringify(_ajaxData.data), true);
			timetable.placeTimetableOn($(".timetableEditor"));
			_callback();
		} else {
			popout(_ajaxData.error.message);
		}
	});
}

function teSetBody(_body) {
	// body.id;


	editingBody.body = _body;
	editingBody.updateElement();
	editingBody.element.trigger("click");
}

function teSetTeacher(_teacher) {
	console.log(editingBody);

	editingBody.teacher = _teacher;
	editingBody.updateElement();
	editingBody.element.trigger("click");

}

function teSetLocation(_location) {

	editingBody.location = _location;
	editingBody.updateElement();
	editingBody.element.trigger("click");
}

function teSetupAutocompleteBodiesLists() {
	var bodiesAcronyms = [];
	var bodiesNames = [];

	for (var index in timetable.bodies) {
		bodiesAcronyms.push(timetable.bodies[index].acronym);
		bodiesNames.push(timetable.bodies[index].name);
	}

	$("#teSubjectAcronym").data("autocomplete", bodiesAcronyms);
	$("#teSubjectName").data("autocomplete", bodiesNames);

}

function teSetupAutocompleteTeachersLists() {
	var teachersNames = [];
	var teachersSurnames = [];

	for (var index in timetable.teachers) {
		teachersNames.push(timetable.teachers[index].name + " " + timetable.teachers[index].surname);
		teachersSurnames.push(timetable.teachers[index].surname + " " + timetable.teachers[index].name);
	}

	$("#teTeacherName").data("autocomplete", teachersNames);
	$("#teTeacherSurname").data("autocomplete", teachersSurnames);

}

function teSetupAutocompleteLocationsLists() {
	var locationsNames = [];

	for (var index in timetable.locations) {
		locationsNames.push(timetable.locations[index].name);
	}

	$("#teLocation").data("autocomplete", locationsNames);

}

function teSetupAutocompleteLists() {
	teSetupAutocompleteBodiesLists();
	teSetupAutocompleteLocationsLists();
	teSetupAutocompleteTeachersLists();

}

function teAutocompleteClickHandle(_type, _secondType, _param) {
	switch (_type) {
		case "body":
			var body;
			switch (_secondType) {
				case "acronym":
					console.log("Acronym case");
					for (var index in timetable.bodies) {
						if (timetable.bodies[index].acronym.toLowerCase() == _param.toLowerCase()) {
							body = timetable.bodies[index];
							break;
						}
					}
					break;
				case "name":
					for (var index in timetable.bodies) {
						if (timetable.bodies[index].name.toLowerCase() == _param.toLowerCase()) {
							body = timetable.bodies[index];
							break;
						}
					}
					break;
			}
			console.log("teSetBody(_body) - _body:");
			console.log(body);
			teSetBody(body);
			break;
		case "teacher":
			var teacher;
			switch (_secondType) {
				case "name":
					for (var index in timetable.teachers) {
						if (timetable.teachers[index].name.toLowerCase() == _param.toLowerCase()) {
							teacher = timetable.teachers[index];
							break;
						}
					}
					break;
				case "surname":
					for (var index in timetable.teachers) {
						if (timetable.teachers[index].surname.toLowerCase() == _param.toLowerCase()) {
							teacher = timetable.teachers[index];
							break;
						}
					}
					break;
			}
			teSetTeacher(teacher);
			break;
		case "location":
			console.log("Params: " + _param);

			break;
	}
}

function teAddAutocmplete() {
	//Body acronym
	$("#teSubjectAcronym").on("keyup", function () {
		var value = $(this).children("input").val();
		if (value) {
			var autocomplete = $(this).data("autocomplete").filter(function (item) {
				return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
			});

			if (autocomplete.length != 0) {
				setAutocomplete($(this), autocomplete);
			}
		}
	}).on("autocompleteClick", function (event, param) {
		teAutocompleteClickHandle("body", "acronym", param);
	});
	//Body name
	$("#teSubjectName").on("keyup", function () {
		var value = $(this).children("input").val();
		if (value) {
			var autocomplete = $(this).data("autocomplete").filter(function (item) {
				return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
			});

			if (autocomplete.length != 0) {
				setAutocomplete($(this), autocomplete);
			}
		}
	}).on("autocompleteClick", function (event, param) {
		teAutocompleteClickHandle("body", "name", param);
	});

	//Teacher name
	$("#teTeacherName").on("keyup", function () {
		var value = $(this).children("input").val();
		if (value) {
			var autocomplete = $(this).data("autocomplete").filter(function (item) {
				return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
			});
			if (autocomplete.length != 0) {
				setAutocomplete($(this), autocomplete);
			}
		}
	}).on("autocompleteClick", function (event, param) {
		teAutocompleteClickHandle("teacher", "name", param.split(" ")[0]);
	});
	//Teacher surname
	$("#teTeacherSurname").on("keyup", function () {
		var value = $(this).children("input").val();
		if (value) {
			var autocomplete = $(this).data("autocomplete").filter(function (item) {
				return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
			});

			if (autocomplete.length != 0) {
				setAutocomplete($(this), autocomplete);
			}
		}
	}).on("autocompleteClick", function (event, param) {
		teAutocompleteClickHandle("teacher", "surname", param.split(" ")[0]);
	});

	//Location name
	$("#teLocation").on("keyup", function () {
		var value = $(this).children("input").val();
		if (value) {
			var autocomplete = $(this).data("autocomplete").filter(function (item) {
				return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
			});

			if (autocomplete.length != 0) {
				setAutocomplete($(this), autocomplete);
			}
		}
	}).on("autocompleteClick", function (event, param) {
		teAutocompleteClickHandle("location", "name", param);
	});

}

function teDetachBody() {
	var newBody = new Body(-1 * timetable.newBodyIdMultiplier,
		editingBody.body.name,
		editingBody.body.acronym,
		editingBody.body.icon,
		editingBody.body.color
	);
	timetable.bodies[newBody.id] = newBody;
	editingBody.body = newBody;
	editingBody.updateElement();
}

function teDetachTeacher() {
	var newTeacher = new Teacher(-1 * timetable.newTeacherIdMultiplier,
		editingBody.teacher.name,
		editingBody.teacher.surname,
		editingBody.teacher.descrip,
		editingBody.teacher.image
	);
	timetable.teachers[newTeacher.id] = newTeacher;
	editingBody.teacher = newTeacher;
	editingBody.updateElement();
}

function teDetachLocation() {
	var newLocation = new Location(-1 * timetable.newLocationIdMultiplier,
		editingBody.location.name,
		editingBody.location.description
	);
	timetable.locations[newLocation.id] = newLocation;
	editingBody.location = newLocation;
	editingBody.updateElement();
}


function teAddListeners(_id) {
	console.log("Add listeners te");

	//Listeners
	$("#teSave").off().click(function () {
		if ($(this).hasClass("disabled"))
			return;

		console.log(JSON.stringify(timetable.toArray()));
		popout("Debug mode enabled");
		return;

		$(this).addClass("disabled");
		$.post(baseDir + "/php/set/setTimetable.php", {
			idToken: googleTokenId,
			classId: _id,
			timetableData: JSON.stringify(timetable.toArray())
		}, function (_ajaxData) {
			if (_ajaxData.success) {
				popout("Success");
				loadTimetable(_id, function () {
					//Resize listener
					$(window).off().resize(function () {
						timetable.placeTimetableOn($(".timetableEditor"));
					});
					$("#teSave").removeClass("disabled");
				});
			} else {
				popout(_ajaxData.error.message);
			}
		});
	});

	$("#teRemove").click(function () {
		if ($(this).hasClass("disabled")) {
			return;
		}

		if (editingBody) {
			var displayedDay = editingBody.element.parent().parent().parent().data("dayName");

			if (editingSubject.bodies.length == 1) {
				// subject.removed = true;
				timetable.days[displayedDay].splice($.inArray(editingSubject, timetable.days[displayedDay]), 1);

				editingSubject.element.prev(".insertSubject").remove();
				editingSubject.element.remove();

				editingSubject = undefined;
			} else {
				// subjectBody.removed = true;
				editingSubject.bodies.splice($.inArray(editingBody, editingSubject.bodies), 1);

				if (editingBody.element.next(".insertSubjectBody").hasClass("bottom")) {
					editingBody.element.prev(".insertSubjectBody").remove();
				} else {
					editingBody.element.next(".insertSubjectBody").remove();
				}

				editingBody.element.remove();
			}

			editingBody = undefined;
		}

	});

	//Detachs
	$("#teDetachBodyButton").click(function () {
		if (!$(this).hasClass("disabled"))
			teDetachBody();
	});
	$("#teDetachTeacherButton").click(function () {
		if (!$(this).hasClass("disabled"))
			teDetachTeacher();
	});
	$("#teDetachLocationButton").click(function () {
		if (!$(this).hasClass("disabled"))
			teDetachLocation();
	});

	//Number
	$("#teSubjectNumber > input").off().on("change keyup keydown paste", function () {
		console.log("Test");
		var value = $(this).val();
		if (/^\d+$/.test(value) && value.length <= 3) { // /^\d+$/.test(value - test if all characters are digits

			editingSubject.number = value;
			editingSubject.element.find(".number span").html(parseInt(value));

			setChanged(false);
		}
	});

	//Acr
	$("#teSubjectAcronym > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val().toUpperCase();
			if (value.length <= 3 && editingBody) {
				editingBody.body.acronym = value;

				updateEverySubjectBody();
				setChanged(true, true);
			}
		}, 150);
	});
	//Name
	$("#teSubjectName > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val();
			if (value.length <= 50 && editingBody) {
				editingBody.body.name = value;

				updateEverySubjectBody();
				setChanged(true, true);
			}
		}, 150);
	});
	//Teacher's name
	$("#teTeacherName > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val();
			if (value.length <= 50 && editingBody) {
				editingBody.teacher.name = value;

				updateEverySubjectBody();
				setChanged(true, false, true);
			}
		}, 150);
	});
	//Teacher's surname
	$("#teTeacherSurname > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val();
			if (value.length <= 50 && editingBody) {
				editingBody.teacher.surname = value;

				updateEverySubjectBody();
				setChanged(true, false, true);
			}
		}, 150);
	});
	//Teacher's description

	$("#teTeacherDescription > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val();
			if (value.length <= 50 && editingBody) {
				editingBody.teacher.description = value;

				updateEverySubjectBody();
				setChanged(true, false, true);
			}
		}, 150);
	});

	//Location's name
	$("#teLocation > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val();
			if (value.length <= 50 && editingBody) {
				editingBody.location.name = value;

				updateEverySubjectBody();
				setChanged(true, false, false, true);
			}
		}, 150);
	});
	//TODO: Location's description


	//Start time
	$("body").on("change keyup keydown paste focusout", "#teStartTime input", function () {
		if (subjectOptionActivated) {
			var value = $(this).parent().children(".firstTime").val() + ":" + ($(this).parent().children(".secondTime").val().length == 1 ? "0" + $(this).parent().children(".secondTime").val() : $(this).parent().children(".secondTime").val());

			editingSubject.start = new Time(value);
			editingSubject.element.find(".time > .start").html(value);

			setChanged(false);
		}
	});
	//End time
	$("body").on("change keyup keydown paste focusout", "#teEndTime input", function () {
		if (subjectOptionActivated) {
			var value = $(this).parent().children(".firstTime").val() + ":" + ($(this).parent().children(".secondTime").val().length == 1 ? "0" + $(this).parent().children(".secondTime").val() : $(this).parent().children(".secondTime").val());

			editingSubject.end = new Time(value);
			editingSubject.element.find(".time > .end").html(value);


			setChanged(false);
		}
	});
	//Color picker
	$("#teColorPicker").on("change", function () {
		console.log("Color change");
		result = $(this).attr("result");

		editingBody.body.color = result;
		// $(subjectBody).children(".ttSubjectIcon").css("background-color", result);

		$(".teSubjectImage").css("background-color", result);

		updateEverySubjectBody();
		setChanged(true, true);

	});

}

function updateEverySubjectBody() {
	timetable.element.find(".ttSubjectBody").each(function (index, value) {
		$(this).data("SubjectBody").updateElement();
	});
}

function setChanged(_onlySubjectBody, _body = false, _teacher = false, _location = false) {

	console.log("setChanged");

	//SubjectBodies
	var subjects = timetable.getTimetableSubjects();
	for (var i = 0; i < subjects; i++) {
		//Loop through subjects
		var isSubjectChanged = false;
		for (var j = 0; j < subjects[i].bodies.length; j++) {
			//Loop through subjectBodies

			//Check body
			if (subjects[i].bodies[j].body.id == editingBody.body.id ||
				subjects[i].bodies[j].teacher.id == editingBody.teacher.id ||
				subjects[i].bodies[j].location.id == editingBody.location.id) {
				subjects[i].bodies[j].changed = true;
				subjects[i].changed = true;
				continue;
			}
		}

	}

	if (_onlySubjectBody) {
		editingBody.changed = true;
		$(editingBody.notificationArea.changeElement).css("display", "block");
		editingBody.notificationArea.changed = true;
		editingBody.resize();
	} else {
		editingBody.changed = true;
		for (var i = 0; i < editingSubject.bodies.length; i++) {
			editingSubject.bodies[i].changed = true;
			$(editingSubject.bodies[i].notificationArea.changeElement).css("display", "block");
			editingSubject.bodies[i].notificationArea.changed = true;
			editingSubject.bodies[i].resize();
		}
	}

	//Bodies
	if (_body) {
		var bodies = $.grep(timetable.bodies, function (e) {
			return e.id == editingBody.body.id;
		});
		for (var i = 0; i < bodies.length; i++) {
			bodies[i].changed = true;
		}
	}

	//Teachers
	if (_teacher) {
		var teachers = $.grep(timetable.teachers, function (e) {
			return e.id == editingBody.teacher.id;
		});
		for (var i = 0; i < teachers.length; i++) {
			teachers[i].changed = true;
		}
	}

	//Locations
	if (_location) {
		var locations = $.grep(timetable.locations, function (e) {
			return e.id == editingBody.location.id;
		});
		for (var i = 0; i < locations.length; i++) {
			locations[i].changed = true;
		}
	}

}
