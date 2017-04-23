function newClassInit(_id, _tab = 0) {

	var countOfReminders = 5;

	//Download data

	var dateNow = new Date();
	dateNow = dateNow.toJSON();

	$.post(baseDir + "/php/get/getClassData.php", {
		idToken: googleTokenId,
		classId: _id,
		dateNow: dateNow,
		numberOfReminders: countOfReminders
	}, function (_ajaxData) {
		if (_ajaxData.success) {
			setupClassInfo(_ajaxData.data.classInfo, _ajaxData.data.members.length);
			setupClassUploadImage(_id);
			setupReminders(_ajaxData.data.reminders);
			setupSubject(_ajaxData.data.timetableData);
			setupMembers(_ajaxData.data.members);
		} else {
			popout(_ajaxData.error.message);
		}

	});

	//Members listener
	$("#cClassMembers").click(function () {
		$("#membersBackground, #cMembersPanel").show();
	});
	$("#membersBackground").off().on("click", function () {
		$("#membersBackground, #cMembersPanel").hide();
	});
	$("#cMembersGenerateTokenButton").off().on("click", function () {
		$.post(baseDir + "/php/get/getInviteToken.php", {
			idToken: googleTokenId,
			classId: _id
		}, function (_ajaxData) {
			if (_ajaxData.success) {
				//TODO: 1 Copy to clipboard
				$("#cMembersTokenSpan").html("<b>Token: </b>" + _ajaxData.data.token);

			} else {
				popout(_ajaxData.error.message);
			}

		});
	});

	//MenuListeners
	$("#cClassUploads").click(function () {
		removeClassElement();
		$(".cMenuButton.active").removeClass("active");
		$(this).addClass("active");
		newClassUploadsClick(_id);
	});
	$("#cClassTimetable").click(function () {
		removeClassElement();
		$(".cMenuButton.active").removeClass("active");
		$(this).addClass("active");
		newClassTimetableClick(_id);
	});
	$("#cClassMessages").click(function () {
		removeClassElement();
		$(".cMenuButton.active").removeClass("active");
		$(this).addClass("active");
		newClassMessagesClick(_id);
	});
	$("#cClassGroups").click(function () {

		popout("Comming soon");
		return;

		removeClassElement();
		$(".cMenuButton.active").removeClass("active");
		$(this).addClass("active");
		newClassGroupsClick(_id);
	});
}

function setupClassUploadImage(_id) {
	$("#cClassImageUploadButton").click(function () {
		$("#uDropArea").replaceWith('<div id="uDropArea" class="dropzoneCss"><div class="dz-message needsclick">Drop files here or click to upload.</div></div>');
		uploadDropzone = new Dropzone("#uDropArea", {
			url: "/php/set/setImage.php",
			maxFiles: 1,
			dictDefaultMessage: "Drop files here to upload",
			dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
			acceptedFiles: "image/*"
		});
		uploadDropzone.off();
		uploadDropzone.on("sending", function (file, xhr, formData) {
			formData.append("idToken", googleTokenId);
			formData.append("classId", _id);
		});
		uploadDropzone.on("success", function (params) {

			var response = JSON.parse(params.xhr.response);
			if (response.success) {
				setClassImage('/uploadImages/class/' + response.data.fileName);
				$("#uArea").hide();
			} else {
				popout(reponse.details);
			}
		});
		$("#uArea").show();
	});
}

function setClassImage(_url) {
	$("#cClassImageDiv > i").remove();
	$("#cClassImageDiv").css("background-image", "url(" + _url + ")");
}

function setupClassInfo(_classInfo, _membersCount) {
	/*
		"classInfo": {
		  "nameShort": "IV.IT",
		  "name": "IV.IT",
		  "school": "Spojená škola Nové Zámky",
		  "created": "2016-05-27 14:43:11"
		}
	*/

	$("#cClassShortName").html(_classInfo.nameShort);
	$("#cClassFullName").html(_classInfo.name);
	$("#cClassSchool").html(_classInfo.school);
	$("#cClassMembers").html(_membersCount + (_membersCount == 1 ? " member" : " members"));
	if (_classInfo.imageName) {
		setClassImage('/uploadImages/class/' + _classInfo.imageName);

	}
}

function setupReminders(_reminders) {
	var reminders = new Array();
	var countOfReminders = _reminders.length > 5 ? 5 : _reminders.length;
	var bottomMargin = (($("#cColumnLeft").height() - 8) - 25 - 8 - 76 * countOfReminders) / (countOfReminders - 1);
	for (var i = 0; i < countOfReminders; i++) {
		reminders[i] = new Reminder(JSON.stringify(_reminders[i]));
		//		reminders[i] = new Reminder(null, _reminders[i].id, _reminders[i].name, _reminders[i].type, _reminders[i].subject, _reminders[i].dateOfReminder);
		$("#cReminders").append(reminders[i].toElement());
	}
}

function setupSubject(_timetableData) {
	if (_timetableData.isCurrent) {
		$("#cSubjectHeader").html("Current subject:");
	} else {
		$("#cSubjectHeader").html("Next subject:");
	}

	var firstSubject,
		firstSubjectBodies = [],
		secondSubject,
		secondSubjectBodies = [];

	for (var i = 0; i < _timetableData.firstSubject.bodies.length; i++) {
		var currentSubjectBody = _timetableData.firstSubject.bodies[i];
		firstSubjectBodies.push(new SubjectBody(
			new Body(currentSubjectBody.bodyId, currentSubjectBody.bodyName, currentSubjectBody.acronym, currentSubjectBody.icon, currentSubjectBody.color),
			new Teacher(currentSubjectBody.teacherId, currentSubjectBody.teacherName, currentSubjectBody.teacherSurname, currentSubjectBody.teacherDescription, null),
			new Location(currentSubjectBody.locationId, currentSubjectBody.locationName, currentSubjectBody.locationDescription)
		));
	}
	for (var i = 0; i < _timetableData.secondSubject.bodies.length; i++) {
		var currentSubjectBody = _timetableData.firstSubject.bodies[i];
		secondSubjectBodies.push(new SubjectBody(
			new Body(currentSubjectBody.bodyId, currentSubjectBody.bodyName, currentSubjectBody.acronym, currentSubjectBody.icon, currentSubjectBody.color),
			new Teacher(currentSubjectBody.teacherId, currentSubjectBody.teacherName, currentSubjectBody.teacherSurname, currentSubjectBody.teacherDescription, null),
			new Location(currentSubjectBody.locationId, currentSubjectBody.locationName, currentSubjectBody.locationDescription)
		));
	}


	var firstSubject = new Subject(
		_timetableData.firstSubject.subjectId,
		_timetableData.firstSubject.dayIndex,
		_timetableData.firstSubject.number,
		new Time(_timetableData.firstSubject.startTime),
		new Time(_timetableData.firstSubject.endTime),
		firstSubjectBodies);
	var secondSubject = new Subject(
		_timetableData.secondSubject.subjectId,
		_timetableData.secondSubject.dayIndex,
		_timetableData.secondSubject.number,
		new Time(_timetableData.secondSubject.startTime),
		new Time(_timetableData.secondSubject.endTime),
		secondSubjectBodies);

	//Note: Second subject is not used here

	$("#cCurrentSubject").replaceWith(firstSubject.toElement().attr("id", "cCurrentSubject"));

}

function setupMembers(_members) {
	$("#cMembersConatainer, #cMembersTokenSpan").html("");
	for (var i = 0; i < _members.length; i++) {
		$("#cMembersConatainer").append('<div class="cmMemberConatiner"><img src="' + (_members[i].image ? _members[i].image : 'images/placeholders/profilePicturePlaceholder.png') + '" class="cmUserImage"><span class="cmUserName">' + _members[i].name + " " + _members[i].surname + '</span>' + (_members[i].username ? '<span class="cmUserMail">' + _members[i].username + '</span>' : "") + '</div>');
	}
}

function removeClassElement() {
	$("#cUploadsCollapsible").remove();
	$(".ttTimetableRow").remove();
	$("#cGroupsContainer").remove();
}
