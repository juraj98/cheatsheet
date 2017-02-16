function skipWeekend(_day, _difference) { //Skip saturday and sunday
	_day += _difference;
	if (_difference == 0 || _difference == 1) {
		if (_day == 6 || _day == 0) {
			return 1;
		} else {
			return _day;
		}
	} else if (_difference == -1) {
		if (_day == 6 || _day == 0) {
			return 5;
		} else {
			return _day;
		}
	}
}

//Get day index - 0 = Sunday 1 = Monday 2 = Tuesday 3 = Wednesday 4 = Thursday 5 = Friday 6 = Saturday

	//
function classTimetableInit() {
	console.info("%cFunction run:\t" + "%cclassTimetableInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
	$("#classTimetable").css("margin-left", "+=10px");

	$("#classOptionsPanel > #edit").click(function() {
		//		editingTimetableForClass = <Class id>
		timetableEditorClick();
	});

	$.post(
		baseDir + "/php/get/getTimetableData.php", {
			idToken: googleTokenId,
			classId: 1 //Feature: Hardcoded class ID - change later
		},
		function(_ajaxData) {
			switch (_ajaxData) {
				case "1":
					popout("There is problem with your login. Please logoff and log in again.");
					break;
				case "2":
					popout("There was problem while recieving class data. Try reloading the page.");
					break;
				case "3":
					popout("Error 3"); //FIX ME: fix error output
					break;
				default:
					timetable = _ajaxData; //Already parsed to JSON

					setupTimetable();
					break;
			}
		}
	);
}

function setupTimetable() { //TODO: 16 Call on resize //TODO: Rework
	console.info("%cFunction run:\t" + "%csetupTimetable()", "color: #303F9F; font-weight:700", "color: #303F9F");

	var timetableHTML;

	if (activeDay.getDay() == 0) {
		activeDay.setDate(activeDay.getDate() + 1);
	} else if (activeDay.getDay() == 6) {
		activeDay.setDate(activeDay.getDate() + 2);
	}

	var thisWeekMonday = new Date();
	var thisWeekFriday = new Date();
	thisWeekMonday.setTime(today.getTime());
	thisWeekFriday.setTime(today.getTime());

	if (thisWeekMonday.getDay() == 0) {
		thisWeekMonday.setDate(thisWeekMonday.getDate() + 1);
	} else if (thisWeekMonday.getDay() == 6) {
		thisWeekMonday.setDate(thisWeekMonday.getDate() + 2);
	}
	if (thisWeekFriday.getDay() == 0) {
		thisWeekFriday.setDate(thisWeekFriday.getDate() + 1);
	} else if (thisWeekFriday.getDay() == 6) {
		thisWeekFriday.setDate(thisWeekFriday.getDate() + 2);
	}

	switch (today.getDay()) {
		case 0: //To the same as case 1:
		case 6: // ^^^^^^
		case 1:
			//        thisWeekMonday.setTime(thisWeekMonday.getTime());
			thisWeekFriday.setDate(thisWeekFriday.getDate() + 5); //Must add +1 bc in condition we don't want to compare day > start of friday but rather end of friday - fri 23:59:59:99
			break;
		case 2:
			thisWeekMonday.setDate(thisWeekMonday.getDate() - 1);
			thisWeekFriday.setDate(thisWeekFriday.getDate() + 4);
			break;
		case 3:
			thisWeekMonday.setDate(thisWeekMonday.getDate() - 2);
			thisWeekFriday.setDate(thisWeekFriday.getDate() + 3);
			break;
		case 4:
			thisWeekMonday.setDate(thisWeekMonday.getDate() - 3);
			thisWeekFriday.setDate(thisWeekFriday.getDate() + 2);
			break;
		case 5:
			thisWeekMonday.setDate(thisWeekMonday.getDate() - 4);
			thisWeekFriday.setTime(thisWeekFriday.getTime() + 1);
			break;
	}
	thisWeekMonday.setTime(thisWeekMonday.getTime() - (thisWeekMonday.getTime() % 86400000)); // Removes hours, minutes..... from dates.
	thisWeekFriday.setTime(thisWeekFriday.getTime() - (thisWeekFriday.getTime() % 86400000)); // 86400000 is one day in milliseconds.
	thisWeekMonday.setHours(0);
	thisWeekFriday.setHours(0);
	thisWeekFriday.setTime(thisWeekFriday.getTime() + 86399999); // 86400000 is one day in milliseconds.

	var daysColumnsCount = Math.floor($("#classTimetable").innerWidth() / 350);
	var daysColumnsWidth = ($("#classTimetable").innerWidth() - daysColumnsCount * 10) / daysColumnsCount;

	//Setup timetable menu          //FIX ME: If there is space only for one column two'll be displayed.
	//FIX ME: If ^ is fixed there'll be problem witch css because .classTimetableEdgeDay'll have space only for one arrow, and there will be two.
	var i = 1; //Skipping 0 and i++ because first "loop" is outside actual loop
	tempDay.setTime(activeDay.getTime()); //Can't use tempDay = activeDay bc reasons. Added " = new Date()" to \shadredVariables.js too.

	timetableHTML = '<div id="classTimetableMenu" class="unselectable" unselectable="on"><div class="classTimetableMenuArrow card-1" id="leftArrow"><i class="material-icons">keyboard_arrow_left</i></div><div class="classTimetableMenuItem';
	if (today.getDate() == tempDay.getDate() && today.getMonth() == tempDay.getMonth() && today.getFullYear() == tempDay.getFullYear()) {
		timetableHTML += ' active';
	}
	timetableHTML += ' classTimetableEdgeDay card-1">' + getDayById(tempDay.getDay());
	if (tempDay.getTime() < thisWeekMonday.getTime() || tempDay.getTime() > thisWeekFriday.getTime()) {
		timetableHTML += " (" + tempDay.getDay() + ". " + tempDay.getMonth() + ". " + tempDay.getFullYear() + ")";
	}
	timetableHTML += '</div>';
	tempDay = setDay(true, tempDay);

	for (i; i < daysColumnsCount - 1; i++) {
		timetableHTML += '<div class="classTimetableMenuItem';
		if (today.getDate() == tempDay.getDate() && today.getMonth() == tempDay.getMonth() && today.getFullYear() == tempDay.getFullYear()) {
			timetableHTML += ' active';
		}
		timetableHTML += ' card-1">' + getDayById(tempDay.getDay());

		if (tempDay.getTime() < thisWeekMonday.getTime() || tempDay.getTime() > thisWeekFriday.getTime()) {
			timetableHTML += " (" + tempDay.getDay() + ". " + tempDay.getMonth() + ". " + tempDay.getFullYear() + ")";
		}

		timetableHTML += '</div>'
		tempDay = setDay(true, tempDay);
	}
	timetableHTML += '<div class="classTimetableMenuItem';
	if (today.getDate() == tempDay.getDate() && today.getMonth() == tempDay.getMonth() && today.getFullYear() == tempDay.getFullYear()) {
		timetableHTML += ' active';
	}
	timetableHTML += ' classTimetableEdgeDay card-1">' + getDayById(tempDay.getDay());

	if (tempDay.getTime() < thisWeekMonday.getTime() || tempDay.getTime() > thisWeekFriday.getTime()) {
		timetableHTML += " (" + tempDay.getDay() + ". " + tempDay.getMonth() + ". " + tempDay.getFullYear() + ")";
	}

	timetableHTML += '</div><div class="classTimetableMenuArrow card-1" id="rightArrow"><i class="material-icons">keyboard_arrow_right</i></div></div>';
	tempDay = setDay(true, tempDay);

	//Setup actual days             //FIX ME: there is an option that none column will be displayed.
	tempDay.setTime(activeDay.getTime()); //Can't use tempDay = activeDay bc reasons. Added " = new Date()" to \shadredVariables.js too.

	timetableHTML += '<div id="classTimetableDays">';
	for (var i = 0; i < daysColumnsCount; i++) {
		var lessonNumber = 1;
		timetableHTML += '<div class="classTimetableDayRow">';
		var arrayIndex = tempDay.getDay() - 1;
		for (var j = 0; j < timetable[arrayIndex].length; j++) {
			//lessonHeader
			if (j != 0) {
				if (timetable[arrayIndex][j]['start'] != timetable[arrayIndex][j - 1]['start'] || timetable[arrayIndex][j]['end'] != timetable[arrayIndex][j - 1]['end']) {
					timetableHTML += '<div class="classTimetableClass card-1"><div class="classTimetableClassHeader"><h2 class="number">' + lessonNumber++ + '. Lesson</h2><h2 class="time">' + timetable[arrayIndex][j]['start'] + ' - ' + timetable[arrayIndex][j]['end'] + '</h2></div>';
				}
			} else {
				timetableHTML += '<div class="classTimetableClass card-1"><div class="classTimetableClassHeader"><h2 class="number">' + lessonNumber++ + '. Lesson</h2><h2 class="time">' + timetable[arrayIndex][j]['start'] + ' - ' + timetable[arrayIndex][j]['end'] + '</h2></div>';
			}

			//lessonParts
			timetableHTML += '<div class="classTimetableClassPart'

			//  //determines if it's last class in same card
			if (j != timetable[arrayIndex].length - 1) {
				if (timetable[arrayIndex][j]['start'] != timetable[arrayIndex][j + 1]['start'] || timetable[arrayIndex][j]['end'] != timetable[arrayIndex][j + 1]['end']) {
					timetableHTML += ' classTimetableClassLastPart';
				}
			} else {
				timetableHTML += ' classTimetableClassLastPart';
			}
			timetableHTML += '">';
			//  //Icon || Color
			if (timetable[arrayIndex][j]['color'] != "null") {
				timetableHTML += '<div class="classTimetableClassIcon card-1" style="background-color: ' + timetable[arrayIndex][j]['color'] + ';">'
			}
			//  //Icon || First letter
			if (timetable[arrayIndex][j]['icon'] == "null") {
				timetableHTML += timetable[arrayIndex][j]['acronym'][0] + '</div>';
			} else {
				timetableHTML += '<i class="material-icons">' + timetable[arrayIndex][j]['icon'] + '</i></div>';
			}
			//  //Rest of header - LessonName, Teacher, Location
			timetableHTML += '<h1>' + timetable[arrayIndex][j]['name'] + '</h1><h2>' + timetable[arrayIndex][j]['teacher'] + ' - ' + timetable[arrayIndex][j]['location'] + '</h2></div>';

			//  //determines if it's last class in same card to close it
			if (j != timetable[arrayIndex].length - 1) {
				if (timetable[arrayIndex][j]['start'] != timetable[arrayIndex][j + 1]['start'] || timetable[arrayIndex][j]['end'] != timetable[arrayIndex][j + 1]['end']) {
					timetableHTML += '</div>';
				}
			} else {
				timetableHTML += '</div>';
			}
		}

		timetableHTML += '</div>';
		tempDay = setDay(true, tempDay);
	}
	timetableHTML += '</div>';

	//add HTML to page
	$("#classTimetable").html(timetableHTML);

	//resizeing
	$(".classTimetableMenuItem").css("width", "calc(100% / " + daysColumnsCount + " - 10px)");
	$(".classTimetableEdgeDay").css("width", "calc(100% / " + daysColumnsCount + " - 40px)");
	$(".classTimetableDayRow").css("width", "calc(100% / " + daysColumnsCount + " - 10px)");


	timetableDisplayed = true;
}

function setDay(_up, _date) {
	if (_up) {
		if (_date.getDay() == 5) {
			_date.setDate(_date.getDate() + 3);
		} else {
			_date.setDate(_date.getDate() + 1);
		}
	} else {
		if (_date.getDay() == 1) {
			_date.setDate(_date.getDate() - 3);
		} else {
			_date.setDate(_date.getDate() - 1);
		}
	}
	return _date;
}
