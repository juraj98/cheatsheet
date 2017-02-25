function homeInit(){
	getACtivityData();
}

function getACtivityData(_limit = null) {
	workingWithRemindersOfClass = 1;

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
				$("#hLeftSide").prepend(newActivityItem.toElement());

			}
		} else {
			popout(_ajaxData.error.message + "<br><br>" + _ajaxData.error.details);
		}
	});
}
