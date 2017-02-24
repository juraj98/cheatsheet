function remindersInit() {
	console.info("%cFunction run:\t" + "%cremindersInit()", "color: #303F9F; font-weight:700", "color: #303F9F");

	materialFormInit();

	$("#rAddButtonBtn").click(function() {
		var parent = $("#rExpand");
		var name = $(parent).children("#rName").children("input").val();
		var type = $(parent).children("#rCategories").attr("result");
		var subject = $(parent).children("#rSubject").children("input").val();
		var date = new Date($(parent).children("#rDate").attr("result"));
		var valid = true;

		if (!name) {
			valid = false;
			console.log("Empty name");
		}
		if (!type) {
			valid = false;
			console.log("Wrong type");
		}
		if (!subject) {
			valid = false;
			console.log("Empty subject");
		}
		if (date < today || !date) {
			valid = false;
			console.log("Wrong date");
		}
		if (valid) {
			console.log("DATE: " + dateToSqlFormat(date));

			var reminder = JSON.stringify({
				reminderName: name,
				reminderType: parseInt(type),
				subject: subject,
				dateOfReminder: dateToSqlFormat(date)
			});

			console.log("Reminder: " + reminder);

			$.post(baseDir + "/php/create/createReminder.php", {
					idToken: googleTokenId,
					classId: workingWithRemindersOfClass,
					reminderData: reminder
				},
				function(_ajaxData) {

					if(_ajaxData.success){
						popout("Success");
					} else {
						popout(_ajaxData.error.message);
					}
				}
			);
		}
	});

	$(".rfilterButton").click(function() {
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

	rFilters = [true, true, true, true, true, true];
	updateFiltersPanel();

	fromDate = new Date(today.getTime());
	toDate = new Date(new Date().getTime() + 86400000 * 365);

	clearReminders();

	getReminderData("50", null, dateToSqlFormat(fromDate), dateToSqlFormat(toDate));
}

function clearReminders(){
	for(var i in remindersDays){
		remindersDays[i] = undefined;
	}
}

function updateFilters() {
	for (var i in remindersDays) {
		var allHidden = true;
		for(var j in remindersDays[i].reminders){
			if(rFilters[remindersDays[i].reminders[j].type]){
				allHidden = false;
				$(remindersDays[i].reminders[j].element).show();
			} else {
				$(remindersDays[i].reminders[j].element).hide();
			}
		}
		if(allHidden){
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

function getReminderData(_numberOfReminders, _filters, _from, _to) {
	workingWithRemindersOfClass = 1;
	$.post(baseDir + "/php/get/getReminders.php", {
		idToken: googleTokenId,
		classId: workingWithRemindersOfClass,
		numberOfReminders: _numberOfReminders,
		filters: _filters,
		from: _from,
		to: _to
	}, function(_ajaxData) {
		console.log("AJAXDATA");
		console.log(_ajaxData);
		if(_ajaxData.success){
			var remindersCreatedFromData = createRemindersFromData(_ajaxData.data.reminders);

			setupRemindersDays(remindersCreatedFromData);

			console.log(remindersDays);
			sortRemindersDays();
			console.log(remindersDays);

			addRemindersToPage();
		} else {
			popout(_ajaxData.error.message);
		}
	});
}

function sortRemindersDays(_data){
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

	for (var i in remindersDays) {
		$("#rTarget").before(remindersDays[i].toElement());
	}

}

//function createDay(_day) {
//
//	//Get this from database
//	var ajaxData = JSON.parse('[{"name":"asd","type":0,"subject":"dsa","date":1484521200000},{"name":"asd","type":0,"subject":"dsa","date":1484521200000}]');
//
//	var element = $('<div class="rDay"><div class="rDayInfo">' + getReminderDayNameFromDate(_day) + '</div></div>');
//	for (var i = 0; i < ajaxData.length; i++) {
//		ajaxData[i]["id"] = i;
//		var reminder = new Reminder(JSON.stringify(ajaxData[i]));
//		(element).append(reminder.toElement());
//	}
//
//	return $(element);
//
//}
