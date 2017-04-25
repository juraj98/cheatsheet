function remindersInit() {
	console.info("%cFunction run:\t" + "%cremindersInit()", "color: #303F9F; font-weight:700", "color: #303F9F");

	timesOfRemindersWereLoaded = 0;

	var options = "[";
	for (var i = 0; i < user.classes.length; i++) {
		options += '"' + user.classes[i].nameShort + (i + 1 == user.classes.length ? '"' : '", ');
	}
	options += "]";
	$("#rClasses").attr("options", options);


	materialFormInit();

	$("#rAddButtonBtn").click(function () {
		var parent = $("#rExpand");
		var name = $(parent).children("#rName").children("input").val();
		var type = $(parent).children("#rCategories").attr("result");
		var subject = $(parent).children("#rSubject").children("input").val();
		var date = new Date($(parent).children("#rDate").attr("result"));
		var valid = true;

		if (!name) {
			valid = false;
			popout("Empty name");
		}
		if (!type) {
			valid = false;
			popout("Wrong type");
		}
		if (!subject) {
			valid = false;
			popout("Empty subject");
		}
		if (date < today || !date) {
			valid = false;
			popout("Wrong date");
		}
		if (valid) {
			popout("DATE: " + dateToSqlFormat(date));

			var reminder = JSON.stringify({
				reminderName: name,
				reminderType: parseInt(type),
				subject: subject,
				dateOfReminder: dateToSqlFormat(date)
			});

			var classShortName = JSON.parse($("#rClasses").attr("options"))[$("#rClasses").attr("result")];
			var classId;
			for (var i = 0; i < user.classes.length; i++) {
				if (user.classes[i].nameShort = classShortName)
					classId = user.classes[i].classId;
			}

			$.post(baseDir + "/php/create/createReminder.php", {
					idToken: googleTokenId,
					classId: classId,
					reminderData: reminder
				},
				function (_ajaxData) {

					if (_ajaxData.success) {
						popout("Success");
					} else {
						popout(_ajaxData.error.message);
					}
				}
			);
		}
	});

	$(".rfilterButton").click(function () {
		$(this).toggleClass("rDisabled");

		switch ($(this).attr("id")) {
			case "rHomeworkFilterButton":
				rFilters[0] = !rFilters[0];
				break;
			case "rProjectFilterButton":
				rFilters[1] = !rFilters[1];
				break;
			case "rOralExamFilterButton":
				rFilters[2] = !rFilters[2];
				break;
			case "rExamFilterButton":
				rFilters[3] = !rFilters[3];
				break;
			case "rTestFilterButton":
				rFilters[4] = !rFilters[4];
				break;
			case "rLessonFilterButton":
				rFilters[5] = !rFilters[5];
				break;
		}

		updateFilters();
	});

	setupRemindersListeners();

	rFilters = [true, true, true, true, true, true];
	updateFiltersPanel();

	clearReminders();

	loadReminders(null);
}

function setupRemindersListeners() {
	$(".content").off().scroll(function () {
		//$(this)[0].scrollHeight - $(this).height() = maxScroll
		if ($(this).scrollTop() == $(this)[0].scrollHeight - $(this).height()) {
			loadReminders(null);
		}
	});
}

function clearReminders() {
	for (var i in remindersDays) {
		remindersDays[i] = undefined;
	}
}

function updateFilters() {
	for (var i in remindersDays) {
		var allHidden = true;
		for (var j in remindersDays[i].reminders) {
			if (rFilters[remindersDays[i].reminders[j].type]) {
				allHidden = false;
				$(remindersDays[i].reminders[j].element).show();
			} else {
				$(remindersDays[i].reminders[j].element).hide();
			}
		}
		if (allHidden) {
			$(remindersDays[i].element).hide();
		} else {
			$(remindersDays[i].element).show();
		}
	}
}

function updateFiltersPanel() {
	$("#rHomeworkFilterButton").attr("class", (rFilters[0] ? "rFilterButton" : "rFilterButton rDisabled"));
	$("#rProjectFilterButton").attr("class", (rFilters[1] ? "rFilterButton" : "rFilterButton rDisabled"));
	$("#rOralExamFilterButton").attr("class", (rFilters[2] ? "rFilterButton" : "rFilterButton rDisabled"));
	$("#rExamFilterButton").attr("class", (rFilters[3] ? "rFilterButton" : "rFilterButton rDisabled"));
	$("#rTestFilterButton").attr("class", (rFilters[4] ? "rFilterButton" : "rFilterButton rDisabled"));
	$("#rLessonFilterButton").attr("class", (rFilters[5] ? "rFilterButton" : "rFilterButton rDisabled"));
}

var timesOfRemindersWereLoaded;

function loadReminders(_filters) {
	$.post(baseDir + "/php/get/getReminders.php", {
		idToken: googleTokenId,
		offset: timesOfRemindersWereLoaded * 10,
		filters: _filters
	}, function (_ajaxData) {
		if (_ajaxData.success) {

			console.log("Reminders loaded: " + _ajaxData.data.reminders.length);


			if (_ajaxData.data.reminders.length == 0) {
				if (timesOfRemindersWereLoaded++ == 0) {
					$("#rReminders").append('<div class="noItemsMessage">No reminders</div>');
				}
				return;
			}

			var remindersCreatedFromData = createRemindersFromData(_ajaxData.data.reminders);

			setupRemindersDays(remindersCreatedFromData);

			sortRemindersDays();

			addRemindersToPage();
		} else {
			popout(_ajaxData.error.message + " | " + _ajaxData.error.details);
		}
	});
}

function sortRemindersDays(_data) {
	remindersDays = sortObject(remindersDays);
}


function createRemindersFromData(_data) {
	var reminders = new Array();

	for (var i = 0; i < _data.length; i++) {
		//		_data[i]["date"] = sqlDateToJSFormat(_data[i]["date"]);
		reminders[i] = new Reminder(JSON.stringify(_data[i]));
	}

	return reminders;
}

function setupRemindersDays(_data) {
	for (var i = 0; i < _data.length; i++) {
		if (remindersDays[_data[i].date.getTime().toString()]) {
			remindersDays[_data[i].date.getTime().toString()].reminders.push(_data[i]);
		} else {
			remindersDays[_data[i].date.getTime().toString()] = new RemindersDay(null, _data[i].date, [_data[i]]);
		}
	}
}

function addRemindersToPage() {

	//TODO: 10 Handle empty reminders

	$(".rDay").remove();

	for (var i in remindersDays) {
		$("#rTarget").before(remindersDays[i].toElement());
	}

}
