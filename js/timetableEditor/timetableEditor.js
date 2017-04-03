function loadTimetable(_id, _callback) {
	console.log("Load timetable");
		$.post(baseDir + "/php/get/getNewTimetableData.php", {
			idToken: googleTokenId,
			classId: _id
		}, function(_ajaxData) {

			if (_ajaxData.success) {
				timetable = new Timetable(JSON.stringify(_ajaxData.data), true);
				timetable.placeTimetableOn($(".timetableEditor"));
				_callback();
			}  else {
				popout(_ajaxData.error.message);
			}
		});
}

var timetable;

function timetableEditorInit(_id) {
	console.info("%cFunction run:\t" + "%ctimetableEditorInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
	console.log("Timetable init with id: " + _id);

	editingBody = undefined;
	subjectOptionActivated = false;




	//Basic functions
	materialFormInit();

	//Create timetable
	loadTimetable(_id, function(){
		// Resize listener
		$(window).off().resize(function(){
			timetable.placeTimetableOn($(".timetableEditor"));
		});
	});

		teAddListeners(_id);

}

function teAddListeners(_id) {
	console.log("Add listeners te");

	//Listeners
	$("#teSave").off().click(function() {
		if($(this).hasClass("disabled"))
			return;

		console.log(JSON.stringify(timetable.toArray()));
		return;

		$(this).addClass("disabled");
		$.post(baseDir + "/php/set/setTimetable.php", {
			idToken: googleTokenId,
			classId: _id,
			timetableData: JSON.stringify(timetable.toArray())
		}, function(_ajaxData) {
			if (_ajaxData.success) {
				popout("Success");
				loadTimetable(_id, function(){
					//Resize listener
					$(window).off().resize(function(){
						timetable.placeTimetableOn($(".timetableEditor"));
					});
					$("#teSave").removeClass("disabled");
				});
			} else {
				popout(_ajaxData.error.message);
			}
		});
	});

	$("#teRemove").click(function() {
		if ($(this).hasClass("disabled")) {
			return;
		}

		if (editingBody) {
			var displayedDay = $(editingBody).parent().parent().parent().data("dayName");
			var subject = $(editingBody).parent().parent().data("Subject");
			var subjectBody = $(editingBody).data("SubjectBody");

			if(subject.bodies.length == 1) {
				// subject.removed = true;
				timetable.days[displayedDay].splice( $.inArray(subject, timetable.days[displayedDay]), 1 );
				subject.element.remove();
			} else {
				// subjectBody.removed = true;
				subject.bodies.splice( $.inArray(subjectBody, subject.bodies), 1 );
				subjectBody.element.remove();
			}

			editingBody = undefined;
		}

	});

	//Number
	$("#teSubjectNumber > input").off().on("change keyup keydown paste", function() {
		console.log("Test");
		var value = $(this).val();
		if (/^\d+$/.test(value) && value.length <= 3) { // /^\d+$/.test(value - test if all characters are digits
			var subject = $(editingBody).parent().parent().data("Subject");
			subject.number = value;
			subject.element.find(".number span").html(parseInt(value));

			setChanged();
		}
	});

	//Acr
	$("#teSubjectAcronym > input").on("change keyup keydown paste", function() {
		var value = $(this).val().toUpperCase();
		if (value.length <= 3) {
			$(editingBody).data("SubjectBody").body.acronym = value;

			updateEverySubjectBody();
			setChanged(true);
		}
	});
	//Name
	$("#teSubjectName > input").on("change keyup keydown paste", function() {
		var value = $(this).val();
		if (value.length <= 50) {
			$(editingBody).data("SubjectBody").body.name = value;

			updateEverySubjectBody();
			setChanged(true);
		}
	});
	//Teacher's name
	$("#teTeacherName > input").on("change keyup keydown paste", function() {
		var value = $(this).val();
		if (value.length <= 50) {
			$(editingBody).data("SubjectBody").teacher.name = value;

			updateEverySubjectBody();
			setChanged(false, true);
		}
	});
	//Teacher's surname
	$("#teTeacherSurname > input").on("change keyup keydown paste", function() {
		var value = $(this).val();
		if (value.length <= 50) {
			$(editingBody).data("SubjectBody").teacher.surname = value;

			updateEverySubjectBody();
			setChanged(false, true);
		}
	});
	//Teacher's description

	$("#teTeacherDescription > input").on("change keyup keydown paste", function() {
		var value = $(this).val();
		if (value.length <= 50) {
			$(editingBody).data("SubjectBody").teacher.description = value;

			updateEverySubjectBody();
			setChanged(false, true);
		}
	});

	//Location's name
	$("#teLocation > input").on("change keyup keydown paste", function() {
		var value = $(this).val();
		if (value.length <= 50) {
			$(editingBody).data("SubjectBody").location.name = value;

			updateEverySubjectBody();
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
	$("#teColorPicker").on("change", function() {
		console.log("Color change");
		result = $(activeColorPicker).attr("result");

		$(editingBody).data("SubjectBody").body.color = result;
		// $(subjectBody).children(".ttSubjectIcon").css("background-color", result);

		$(".teSubjectImage").css("background-color", result);

		updateEverySubjectBody();
		setChanged(true);

	});

}

function updateEverySubjectBody(){
	timetable.element.find(".ttSubjectBody").each(function (index, value) {
		$(this).data("SubjectBody").updateElement();
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
