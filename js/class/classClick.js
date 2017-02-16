function classClick(_classId, _classTab = 0) {
	console.info("%cFunction run:\t" + "%cclassClick(_classId)", "color: #303F9F; font-weight:700", "color: #303F9F");


	$(".content").html('<div class="contentRow contentRowIgnoreScrollbar"> <div id="classInfoPanel" class="card-1"> <div id="classPic" class="card-1 unselectable" unselectable="on"> <i class="material-icons">school</i> <div class="card-1"> <p><i class="material-icons">file_upload</i>Upload class picture</p> </div> </div> <div id="classInfoText"> <h1>Class Short Name</h1> <h2>Class Name</h2> <h2>School</h2> </div> </div> <div id="classReminders" class="card-1"> <h1>Reminders:</h1> </div> </div> <div id="classMenu" class="contentRowIgnoreScrollbar card-1 unselectable" unselectable="on"> <div class="classMenuItem" id="uploadsMenuBtn">Uploads</div> <div class="classMenuItem" id="timetableMenuBtn">Timetable</div> <div class="classMenuItem" id="messagesMenuBtn">Messages</div> <div class="classMenuItem" id="groupsMenuTab">Groups</div> </div> <div id="classOptionsPanel" class="contentRowIgnoreScrollbar card-1 unselectable" unselectable="on"></div>');
	classInit(_classId);

	switch (_classTab) {
		case 1:
			console.log("Timetable");
			classTimetableClick();
			$("#timetableMenuBtn").addClass("active");
			window.location.hash = "class/" + _classId + "/timetable";
			break;
		case 2:
			console.log("Messages");
			classMessagesClick();
			$("#messagesMenuBtn").addClass("active");
			window.location.hash = "class/" + _classId + "/messages";
			break;
		case 3:
			console.log("Groups");
			classGroupsClick();
			$("#groupsMenuTab").addClass("active");
			window.location.hash = "class/" + _classId + "/groups";
			break;
		case 0:
		default:
			console.log("Uploads");
			classUploadsClick();
			$("#uploadsMenuBtn").addClass("active");
			window.location.hash = "class/" + _classId + "/uploads";
			break;
	}
}
