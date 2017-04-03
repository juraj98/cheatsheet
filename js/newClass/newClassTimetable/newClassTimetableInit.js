function newClassTimetableInit(_id){
	console.info("%cFunction run:\t" + "%cnewClassTimetableInit(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	$.post(baseDir + "/php/get/getNewTimetableData.php", {
		idToken: googleTokenId,
		classId: _id
	}, function(_ajaxData) {

		if(_ajaxData.success){
			var timetable = new Timetable(JSON.stringify(_ajaxData.data), false);
			timetable.placeTimetableOn("#cTimetableTarget");
		} else {
			popout(_ajaxData.error.message);
		}


	});

}
