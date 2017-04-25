var timetable;

function timetableEditorInit(_id) {
	console.info("%cFunction run:\t" + "%ctimetableEditorInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
	console.log("Timetable init with id: " + _id);

	editingSubjectBody = undefined;
	subjectOptionActivated = false;

	//Basic functions
	materialFormInit();

	//Create timetable
	loadTimetable(_id, function () {
		// Resize listener
		teSetupAutocompleteLists();
		$(window).off().resize(function () {
			if (isTimetableDisplayed == 0) {
				timetable.placeTimetableOn($(".timetableEditor"));
			}
		});
	});

	teMenuInit(_id);

	teAddListeners(_id);
	teAddAutocmplete();
}

/*
	0 - timetable
	1 - body
	2 - Location
	3 - teacher
*/
var isTimetableDisplayed = 0;

function teMenuInit(_id) {
	$("#teMenuTimetableBtn").click(function () {
		//Handle menu actions
		$(".teMenuItem.active").removeClass("active");
		$(this).addClass("active");
		//Handle areas
		$("#teOthersEditor").hide();
		$(".timetableEditor").show();
		//Toggle options
		toggleOptionsPanels(true, true, true);
		//Clear inputs
		clearEditing();
		clearInputs();

		$("#teSubjectOptions").find("disabled").removeClass("disabled");

		//Header
		$("#teEditorHeader").html("Timetable editor:");

		//Load Timetable
		isTimetableDisplayed = 0;
		timetable.placeTimetableOn($(".timetableEditor"));
	});
	$("#teMenuBodiesBtn").click(function () {
		//Handle menu actions
		$(".teMenuItem.active").removeClass("active");
		$(this).addClass("active");
		//Handle areas
		$(".timetableEditor").hide();
		$("#teOthersEditor").show().html("");
		//Toggle options
		toggleOptionsPanels(true, false, false);
		//Clear inputs
		clearEditing();
		clearInputs();

		$("#teSubjectNumber").addClass("disabled");
		$("#teSubjectDay").addClass("disabled");
		$("#teStartTime").addClass("disabled");
		$("#teEndTime").addClass("disabled");

		//Header
		$("#teEditorHeader").html("Bodies editor:");

		isTimetableDisplayed = 1;
		//Load bodies TODO: Sort
		for (var index in timetable.bodies) {
			$("#teOthersEditor").append(timetable.bodies[index].toElement());
		}

	});
	$("#teMenuTeachersBtn").click(function () {
		//Handle menu actions
		$(".teMenuItem.active").removeClass("active");
		$(this).addClass("active");
		//Handle areas
		$(".timetableEditor").hide();
		$("#teOthersEditor").show().html("");
		//Toggle options
		toggleOptionsPanels(false, false, true);
		//Clear inputs
		clearEditing();
		clearInputs();

		//Header
		$("#teEditorHeader").html("Teachers editor:");

		isTimetableDisplayed = 3;
		//Load Teachers TODO: Sort
		for (var index in timetable.teachers) {
			$("#teOthersEditor").append(timetable.teachers[index].toElement());
		}
	});
	$("#teMenuLocationsBtn").click(function () {
		//Handle menu actions
		$(".teMenuItem.active").removeClass("active");
		$(this).addClass("active");
		//Handle areas
		$(".timetableEditor").hide();
		$("#teOthersEditor").show().html("");
		//Toggle options
		toggleOptionsPanels(false, true, false);
		//Clear inputs
		clearEditing();
		clearInputs();

		//Header
		$("#teEditorHeader").html("Locations editor:");

		isTimetableDisplayed = 2;
		//Load Teachers TODO: Sort
		for (var index in timetable.locations) {
			$("#teOthersEditor").append(timetable.locations[index].toElement());
		}
	});
}

function clearEditing() {
	if (editingSubjectBody) {
		$(editingSubjectBody.notificationArea.editingElement).css("display", "none");
		editingSubjectBody.notificationArea.editing = false;
		editingSubjectBody = null;
	}
	if (editingSubject) {
		editingSubject = null;
	}
	if (editingBody) {
		editingBody.notificationArea.toggleEditing();
		editingBody = null;
	}
	if (editingTeacher) {
		editingTeacher.notificationArea.toggleEditing();
		editingTeacher = null;
	}
	if (editingLocation) {
		editingLocation.notificationArea.toggleEditing();
		editingLocation = null;
	}
}

function toggleOptionsPanels(_subject, _location, _teacher) {
	if (_subject) {
		$("#teSubjectOptionsHeader").show();
		$("#teSubjectOptions").show();
	} else {
		$("#teSubjectOptionsHeader").hide();
		$("#teSubjectOptions").hide();
	}
	if (_location) {
		$("#teLocationOptionsHeader").show();
		$("#teLocationOptions").show();
	} else {
		$("#teLocationOptionsHeader").hide();
		$("#teLocationOptions").hide();
	}
	if (_teacher) {
		$("#teTeacherOptionsHeader").show();
		$("#teTeacherOptions").show();
	} else {
		$("#teTeacherOptionsHeader").hide();
		$("#teTeacherOptions").hide();
	}
}

function loadTimetable(_id, _callback) {
	console.log("Load timetable");
	$.post(baseDir + "/php/get/getNewTimetableData.php", {
		idToken: googleTokenId,
		classId: _id
	}, function (_ajaxData) {

		if (_ajaxData.success) {
			if (_ajaxData.data) {
				timetable = new Timetable(JSON.stringify(_ajaxData.data), true);
			} else {
				timetable = new Timetable(
					JSON.stringify({
						"timetable": {},
						"bodies": {},
						"teachers": {},
						"locations": {}
					}), true
				);
			}

			timetable.placeTimetableOn($(".timetableEditor"));
			_callback();
		} else {
			popout(_ajaxData.error.message);
		}
	});
}

function teSetBody(_body) {
	editingSubjectBody.body = _body;
	editingSubjectBody.updateElement();
	editingSubjectBody.element.trigger("click");
}

function teSetTeacher(_teacher) {
	editingSubjectBody.teacher = _teacher;
	editingSubjectBody.updateElement();
	editingSubjectBody.element.trigger("click");
}

function teSetLocation(_location) {
	editingSubjectBody.location = _location;
	editingSubjectBody.updateElement();
	editingSubjectBody.element.trigger("click");
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
		editingSubjectBody.body.name,
		editingSubjectBody.body.acronym,
		editingSubjectBody.body.icon,
		editingSubjectBody.body.color
	);
	timetable.bodies[newBody.id] = newBody;
	editingSubjectBody.body = newBody;
	editingSubjectBody.updateElement();
}

function teDetachTeacher() {
	var newTeacher = new Teacher(-1 * timetable.newTeacherIdMultiplier,
		editingSubjectBody.teacher.name,
		editingSubjectBody.teacher.surname,
		editingSubjectBody.teacher.descrip,
		editingSubjectBody.teacher.image
	);
	timetable.teachers[newTeacher.id] = newTeacher;
	editingSubjectBody.teacher = newTeacher;
	editingSubjectBody.updateElement();
}

function teDetachLocation() {
	var newLocation = new Location(-1 * timetable.newLocationIdMultiplier,
		editingSubjectBody.location.name,
		editingSubjectBody.location.description
	);
	timetable.locations[newLocation.id] = newLocation;
	editingSubjectBody.location = newLocation;
	editingSubjectBody.updateElement();
}


function teAddListeners(_id) {

	//Listeners
	$("#teSave").off().click(function () {
		if ($(this).hasClass("disabled"))
			return;

		console.log(JSON.stringify(timetable.toArray()));
		// popout("Debug mode enabled");
		// return;

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
				popout(_ajaxData.error.message + " | " + _ajaxData.error.details + "<br>" + _ajaxData.debug.sql + '<br><br>' + _ajaxData.debug.subjectIds);
			}
		});
	});

	$("#teRemove").click(function () {
		if ($(this).hasClass("disabled")) {
			return;
		}

		if (editingSubjectBody) {
			var displayedDay = editingSubjectBody.element.parent().parent().parent().data("dayName");

			if (editingSubject.bodies.length == 1) {
				// subject.removed = true;
				timetable.days[displayedDay].splice($.inArray(editingSubject, timetable.days[displayedDay]), 1);

				editingSubject.element.prev(".insertSubject").remove();
				editingSubject.element.remove();

				editingSubject = undefined;
			} else {
				// subjectBody.removed = true;
				editingSubject.bodies.splice($.inArray(editingSubjectBody, editingSubject.bodies), 1);

				if (editingSubjectBody.element.next(".insertSubjectBody").hasClass("bottom")) {
					editingSubjectBody.element.prev(".insertSubjectBody").remove();
				} else {
					editingSubjectBody.element.next(".insertSubjectBody").remove();
				}

				editingSubjectBody.element.remove();
			}

			editingSubjectBody = undefined;
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
		if (!editingSubject) {
			return;
		}
		var value = $(this).val();
		if (/^\d+$/.test(value) && value.length <= 3 && editingSubject) { // /^\d+$/.test(value - test if all characters are digits

			editingSubject.number = value;
			editingSubject.changed = true;
			editingSubject.element.find(".number span").html(parseInt(value));

			setChangedSubject(editingSubject);
		}
	});

	//Acr
	$("#teSubjectAcronym > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val().toUpperCase();
			if (value.length <= 3) {
				if (editingSubjectBody) {
					editingSubjectBody.body.acronym = value;
					editingSubjectBody.body.changed = true;
					updateEverySubjectBody();
				} else if (editingBody) {
					editingBody.acronym = value;
					editingBody.setChanged();
					editingBody.updateElement();
				}
			}
		}, 150);
	});
	//Name
	$("#teSubjectName > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val();
			if (value.length <= 50) {
				if (editingSubjectBody) {
					editingSubjectBody.body.name = value;

					editingSubjectBody.body.changed = true;

					updateEverySubjectBody();
				} else if (editingBody) {
					editingBody.name = value;
					editingBody.setChanged();
					editingBody.updateElement();
				}
			}
		}, 150);
	});
	//Teacher's name
	$("#teTeacherName > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val();

			if (value.length <= 50) {
				if (editingSubjectBody) {
					editingSubjectBody.teacher.name = value;
					editingSubjectBody.teacher.changed = true;
					updateEverySubjectBody();
				} else if (editingTeacher) {
					editingTeacher.name = value;
					editingTeacher.setChanged(true);
					editingTeacher.updateElement();
				}
			}
		}, 150);
	});
	//Teacher's surname
	$("#teTeacherSurname > input").on("focusout", function () {
		if (!editingSubjectBody) {
			return;
		}
		var that = this;
		setTimeout(function () {
			var value = $(that).val();
			if (value.length <= 50) {
				if (editingSubjectBody) {
					editingSubjectBody.teacher.surname = value;
					editingSubjectBody.teacher.changed = true;
					updateEverySubjectBody();
				} else if (editingTeacher) {
					editingTeacher.surname = value;
					editingTeacher.setChanged(true);
					editingTeacher.updateElement();
				}
			}
		}, 150);
	});
	//Teacher's description

	$("#teTeacherDescription > input").on("focusout", function () {
		if (!editingSubjectBody) {
			return;
		}
		var that = this;
		setTimeout(function () {
			var value = $(that).val();
			if (value.length <= 50) {

				if (editingSubjectBody) {
					editingSubjectBody.teacher.description = value;
					editingSubjectBody.teacher.changed = true;
					updateEverySubjectBody();
				} else if (editingTeacher) {
					editingTeacher.description = value;
					editingTeacher.setChanged(true);
					editingTeacher.updateElement();
				}
			}
		}, 150);
	});

	//Location's name
	$("#teLocation > input").on("focusout", function () {
		var that = this;
		setTimeout(function () {
			var value = $(that).val();
			if (value.length <= 50) {
				if (editingSubjectBody) {
					editingSubjectBody.location.name = value;
					editingSubjectBody.location.changed = true;
					updateEverySubjectBody();
				} else if (editingLocation) {
					editingLocation.name = value;
					editingLocation.setChanged();
					editingLocation.updateElement();
				}
			}
		}, 150);
	});
	//TODO: Location's description


	//Start time
	$("body").on("change keyup keydown paste focusout", "#teStartTime input", function () {
		if (!editingSubjectBody) {
			return;
		}
		var value = $(this).parent().children(".firstTime").val() + ":" + ($(this).parent().children(".secondTime").val().length == 1 ? "0" + $(this).parent().children(".secondTime").val() : $(this).parent().children(".secondTime").val());

		editingSubject.start = new Time(value);
		editingSubject.element.find(".time > .start").html(value);

		setChangedSubject(editingSubject);
	});
	//End time
	$("body").on("change keyup keydown paste focusout", "#teEndTime input", function () {
		if (!editingSubjectBody) {
			return;
		}

		var value = $(this).parent().children(".firstTime").val() + ":" + ($(this).parent().children(".secondTime").val().length == 1 ? "0" + $(this).parent().children(".secondTime").val() : $(this).parent().children(".secondTime").val());

		editingSubject.end = new Time(value);
		editingSubject.element.find(".time > .end").html(value);


		setChangedSubject(editingSubject);

	});
	//Color picker
	$("#teColorPicker").on("change", function () {
		console.log("Color change");
		result = $(this).attr("result");
		$(".teSubjectImage").css("background-color", result);

		if (editingSubjectBody) {
			editingSubjectBody.body.color = result;
			editingSubjectBody.body.changed = true;
			updateEverySubjectBody();
		} else if (editingBody) {
			editingBody.color = result;
			editingBody.updateElement();
		}
	});
}

function setChangedSubject(_subject) {
	for (var index in _subject.bodies) {
		_subject.bodies[index].notificationArea.changed = true;
		_subject.bodies[index].notificationArea.changedElement.show();
	}
}

function updateEverySubjectBody() {
	timetable.element.find(".ttSubjectBody").each(function (index, value) {
		$(this).data("SubjectBody").updateElement();
	});
}

function clearInputs() {
	//Subject
	$("#teSubjectAcronym>input").val("");
	$("#teSubjectAcronym").removeClass("invalid valid");
	$("#teSubjectAcronym>.active").removeClass("active");
	$("#teSubjectNumber>input").val("");
	$("#teSubjectNumber").removeClass("invalid valid");
	$("#teSubjectNumber>.active").removeClass("active");
	$("#teSubjectDay").removeClass("ok").html('Day <i class="material-icons">arrow_drop_down</i>');
	$("#teStartTime").find("input").val("00");
	$("#teEndTime").find("input").val("00");
	$("#teColorPicker").removeClass("active");
	$("#teColorPicker .cpPreviewColor").css("background-color", "");
	$("#teColorPicker .cpColorCode").html("");
	//TODO: icon picker
	$("#teSubjectName>input").val("");
	$("#teSubjectName").removeClass("invalid valid");
	$("#teSubjectName>.active").removeClass("active");
	$("#teSubjectOptions > .teSubjectImage").css("background-color", "").html('<i class="material-icons">school</i>');

	//Teacher
	$("#teTeacherName>input").val("");
	$("#teTeacherName").removeClass("invalid valid");
	$("#teTeacherName>.active").removeClass("active");
	$("#teTeacherSurname>input").val("");
	$("#teTeacherSurname").removeClass("invalid valid");
	$("#teTeacherSurname>.active").removeClass("active");
	//TODO: image
	$("#teTeacherDescription>input").val("");
	$("#teTeacherDescription").removeClass("invalid valid");
	$("#teTeacherDescription>.active").removeClass("active");
	//Location
	$("#teLocation>input").val("");
	$("#teLocation").removeClass("invalid valid");
	$("#teLocation>.active").removeClass("active");
	$("#teLocationDescription>input").val("");
	$("#teLocationDescription").removeClass("invalid valid");
	$("#teLocationDescription>.active").removeClass("active");


}
