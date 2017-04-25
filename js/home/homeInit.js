var timesActivityWereLoaded = 0;

function homeInit() {
	console.log("Home init");
	timesActivityWereLoaded = 0;
	getActivityData();
	getReminders(5);
	getCurrentSubjects();
	setupHomeScrollListener();
}

function setupHomeScrollListener() {
	$(".content").off().scroll(function () {
		//$(this)[0].scrollHeight - $(this).height() = maxScroll
		if ($(this).scrollTop() == $(this)[0].scrollHeight - $(this).height()) {
			getActivityData();

		}
	});
}

function getReminders(_limit = null) {
	$("#hRightSide .rReminder").remove();

	var getRemindersPostData = {
		idToken: googleTokenId
	}
	if (_limit) {
		getRemindersPostData["limit"] = _limit
	}

	$.post(baseDir + "/php/get/getReminders.php", getRemindersPostData, function (_ajaxData) {
		if (_ajaxData.success) {

			if (_ajaxData.data.reminders.length == 0) {
				$("#hRightSide").append('<div class="noItemsMessage">No reminders</div>');
				return;
			}
			for (var i = 0; i < _ajaxData.data.reminders.length; i++) {
				var newReminder = new Reminder(JSON.stringify(_ajaxData.data.reminders[i]), true);
				$("#hRightSide").append(newReminder.toElement());
			}
		} else {
			popout(_ajaxData.error.message + "<br><br>" + _ajaxData.error.details);
		}
	});
}

function getActivityData(_limit = null) {
	var getActivityPostData = {
		idToken: googleTokenId,
		offset: (timesActivityWereLoaded * 25)
	}
	if (_limit) {
		getActivityPostData["limit"] = _limit
	}

	if (timesActivityWereLoaded == 0) {
		$("#hLeftSide").html('<div class="hHeader" id="hActivityHeader">Activity feed:</div>');
	}

	$.post(baseDir + "/php/get/getActivity.php", getActivityPostData, function (_ajaxData) {
		if (_ajaxData.success) {

			console.log("Loaded activity: " + _ajaxData.data.activity.length);

			if (timesActivityWereLoaded++ == 0 && _ajaxData.data.activity.length == 0) {
				$("#hLeftSide").append('<div class="noItemsMessage">No activity</div>');
				return;
			}

			for (var i = 0; i < _ajaxData.data.activity.length; i++) {
				var newActivityItem = new ActivityItem(JSON.stringify(_ajaxData.data.activity[i]));
				$("#hLeftSide").append($(newActivityItem.toElement()).addClass("hActivity"));
			}
			$(".hActivity").off().click(function () {
				console.log("Click");


				if ($(this).hasClass("active")) {
					$(".hActivity.active").removeClass("active");
				} else {
					$(".hActivity.active").removeClass("active");
					$(this).addClass("active");
				}
			});
		} else {
			popout(_ajaxData.error.message + "<br><br>" + _ajaxData.error.details);
		}
	});
}

function getCurrentSubjects() {
	var dateNow = new Date();
	dateNow = dateNow.toJSON();
	$.post(baseDir + "/php/get/getCurrentSubjects.php", {
		idToken: googleTokenId,
		dateNow: dateNow
	}, function (_ajaxData) {
		// console.log(_ajaxData);
		if (_ajaxData.success) {

			if (!_ajaxData.data.firstSubject && !_ajaxData.data.secondSubject) {
				return;
			}


			var firstSubject,
				firstSubjectBodies = [],
				secondSubject,
				secondSubjectBodies = [];

			if (_ajaxData.data.secondSubject) {

				for (var i = 0; i < _ajaxData.data.secondSubject.bodies.length; i++) {
					var currentSubjectBody = _ajaxData.data.firstSubject.bodies[i];
					secondSubjectBodies.push(new SubjectBody(
						new Body(currentSubjectBody.bodyId, currentSubjectBody.bodyName, currentSubjectBody.acronym, currentSubjectBody.icon, currentSubjectBody.color),
						new Teacher(currentSubjectBody.teacherId, currentSubjectBody.teacherName, currentSubjectBody.teacherSurname, currentSubjectBody.teacherDescription, null),
						new Location(currentSubjectBody.locationId, currentSubjectBody.locationName, currentSubjectBody.locationDescription)
					));
					var secondSubject = new Subject(
						_ajaxData.data.secondSubject.subjectId,
						_ajaxData.data.secondSubject.dayIndex,
						_ajaxData.data.secondSubject.number,
						new Time(_ajaxData.data.secondSubject.startTime),
						new Time(_ajaxData.data.secondSubject.endTime),
						secondSubjectBodies);
				}
				$("#hRightSide").prepend(secondSubject.toElement()).prepend((_ajaxData.data.isCurrent ? '<div class="hHeader" id="hRemindersHeader">Next subject:</div>' : ""));

			}

			if (_ajaxData.data.firstSubject) {
				for (var i = 0; i < _ajaxData.data.firstSubject.bodies.length; i++) {
					var currentSubjectBody = _ajaxData.data.firstSubject.bodies[i];
					firstSubjectBodies.push(new SubjectBody(
						new Body(currentSubjectBody.bodyId, currentSubjectBody.bodyName, currentSubjectBody.acronym, currentSubjectBody.icon, currentSubjectBody.color),
						new Teacher(currentSubjectBody.teacherId, currentSubjectBody.teacherName, currentSubjectBody.teacherSurname, currentSubjectBody.teacherDescription, null),
						new Location(currentSubjectBody.locationId, currentSubjectBody.locationName, currentSubjectBody.locationDescription)
					));
				}
				var firstSubject = new Subject(
					_ajaxData.data.firstSubject.subjectId,
					_ajaxData.data.firstSubject.dayIndex,
					_ajaxData.data.firstSubject.number,
					new Time(_ajaxData.data.firstSubject.startTime),
					new Time(_ajaxData.data.firstSubject.endTime),
					firstSubjectBodies);
				$("#hRightSide").prepend(firstSubject.toElement()).prepend('<div class="hHeader" id="hRemindersHeader">' + (_ajaxData.data.isCurrent ? "Current subject" : "Next subjects") + ':</div>');
			}



		} else {
			popout(_ajaxData.error.message + "<br><br>" + _ajaxData.error.details);
		}
	});
}
