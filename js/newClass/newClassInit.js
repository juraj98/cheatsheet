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
			setupReminders(_ajaxData.data.reminders);
			setupSubject(_ajaxData.data.timetableData);
			setupMembers(_ajaxData.data.members);
		} else {
			popout(_ajaxData.error.message);
		}

	});

	//Members listener
//	$("#collapsedBackground")
	$("#cClassMembers").click(function(){
		$("#membersBackground, #cMembersPanel").show();
	});
	$("#membersBackground").off().on("click", function(){
		$("#membersBackground, #cMembersPanel").hide();
	});
	$("#cMembersGenerateTokenButton").off().on("click", function(){
		$.post(baseDir + "/php/get/getInviteToken.php", {
			idToken: googleTokenId,
			classId: _id
		}, function (_ajaxData) {
			if (_ajaxData.success) {
				//TODO: 1 Copy to clipboard
				$("#cMembersTokenSpan").html(_ajaxData.data.token);

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
		removeClassElement();
		$(".cMenuButton.active").removeClass("active");
		$(this).addClass("active");
		newClassGroupsClick(_id);
	});


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
}

function setupReminders(_reminders){
	var reminders = new Array();
	var countOfReminders = _reminders.length > 5 ? 5 : _reminders.length;
	var bottomMargin = (($("#cColumnLeft").height() - 8) - 25 - 8 - 76 * countOfReminders) / (countOfReminders - 1);
	for (var i = 0; i < countOfReminders; i++) {
		reminders[i] = new Reminder(JSON.stringify(_reminders[i]));
//		reminders[i] = new Reminder(null, _reminders[i].id, _reminders[i].name, _reminders[i].type, _reminders[i].subject, _reminders[i].dateOfReminder);
		$("#cReminders").append(reminders[i].toElement().css("margin-bottom", (i + 1 == countOfReminders ? "0" : bottomMargin))

		);
	}
}

function setupSubject(_timetableData){
	if(_timetableData.isCurrent){
		$("#cSubjectHeader").html("Current subject:");
	} else {
		$("#cSubjectHeader").html("Next subject:");
	}

	var currentSubject = new Subject(JSON.stringify (_timetableData.subject));
  $("#cCurrentSubject").replaceWith(currentSubject.toElement().attr("id", "cCurrentSubject"));

}

function setupMembers(_members){
	$("#cMembersConatainer, #cMembersTokenSpan").html("");
	for(var i = 0; i < _members.length; i++){
		$("#cMembersConatainer").append('<div class="cmMemberConatiner"><img src="' + (_members[i].image ? _members[i].image : 'images/placeholders/profilePicturePlaceholder.png') + '" class="cmUserImage"><span class="cmUserName">' + _members[i].name + " " + _members[i].surname + '</span>' + (_members[i].username ? '<span class="cmUserMail">' + _members[i].username + '</span>' : "") + '</div>');
	}
}

function removeClassElement() {
	$("#cUploadsCollapsible").remove();
	$(".ttTimetableRow").remove();
	$("#cGroupsContainer").remove();
}
