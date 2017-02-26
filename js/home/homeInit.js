function homeInit(){
	getActivityData();
	getReminders(5);
	getCurrentSubjects();
}

function getReminders(_limit = null){
	$("#hRightSide .rReminder").remove();

	var getRemindersPostData = {
		idToken: googleTokenId
	}
	if(_limit){
		getRemindersPostData["limit"] = _limit
	}

	$.post(baseDir + "/php/get/getReminders.php", getRemindersPostData, function(_ajaxData) {
		if(_ajaxData.success){
			for(var i = 0; i < _ajaxData.data.reminders.length; i++){
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
		idToken: googleTokenId
	}
	if(_limit){
		getActivityPostData["limit"] = _limit
	}

	$.post(baseDir + "/php/get/getActivity.php", getActivityPostData, function(_ajaxData) {
		if(_ajaxData.success){
			$("#hLeftSide").html('<div class="hHeader" id="hActivityHeader">Activity feed:</div>');
			for(var i = 0; i < _ajaxData.data.activity.length; i++){
				var newActivityItem = new ActivityItem(JSON.stringify(_ajaxData.data.activity[i]));
				$("#hActivityHeader").after($(newActivityItem.toElement()).addClass("hActivity"));
			}
			$(".hActivity").click(function(){
				if($(this).hasClass("active")){
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

function getCurrentSubjects(){
	var dateNow = new Date();
	dateNow = dateNow.toJSON();
	$.post(baseDir + "/php/get/getCurrentSubjects.php", {
		idToken: googleTokenId,
		dateNow: dateNow
	}, function(_ajaxData) {
		console.log(_ajaxData);
		if(_ajaxData.success){
			$(".hCurrentNextSubjectHeader, .hCurrentNextSubject").remove();
			for(var i = 0; i < _ajaxData.data.timetableData.length; i++){
				var header = $('<div class="hHeader hCurrentNextSubjectHeader">' + _ajaxData.data.timetableData[i].nameShort + (_ajaxData.data.timetableData[i].isCurrent ? ' current subject:' : ' next subject:') + '</div>');
				$("#hRightSide").prepend(header);

				var subject = new Subject(JSON.stringify(_ajaxData.data.timetableData[i].subject));

				if(_ajaxData.data.timetableData[i].isCurrent){
					var nextHeader = $('<div class="hHeader hCurrentNextSubjectHeader">' + _ajaxData.data.timetableData[i].nameShort + ' next subject:' + '</div>');
					$(header).after(nextHeader);
					var nextSubject = new Subject(JSON.stringify(_ajaxData.data.timetableData[i].nextSubject));
					$(nextHeader).after(nextSubject.toElement());
				}

				$(header).after(subject.toElement());


			}
		} else {
			popout(_ajaxData.error.message + "<br><br>" + _ajaxData.error.details);
		}
	});
}
