function homeInit(){
	getActivityData();
	getReminders(5);
}

function getReminders(_limit = null){
	$("#hRightSide .rReminder").remove();

	var getActivityPostData = {
		idToken: googleTokenId
	}
	if(_limit){
		getActivityPostData["limit"] = _limit
	}

	$.post(baseDir + "/php/get/getReminders.php", getActivityPostData, function(_ajaxData) {
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
			$("#hLeftSide").html("");
			for(var i = 0; i < _ajaxData.data.activity.length; i++){
				var newActivityItem = new ActivityItem(JSON.stringify(_ajaxData.data.activity[i]));
				$("#hLeftSide").prepend($(newActivityItem.toElement()).addClass("hActivity"));

			}
		} else {
			popout(_ajaxData.error.message + "<br><br>" + _ajaxData.error.details);
		}
	});
}
