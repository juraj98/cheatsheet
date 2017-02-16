function newClassClick(_id, _classTab = 0){
	$(".content").html('<div class="cColumn" id="cColumnLeft"><div id="cClassCard" class="card-1"><div id="cClassImageDiv" class="unselectable card-1"><i class="material-icons">school</i><div class="card-1" id="cClassImageUploadButton"><i class="material-icons">file_upload</i><span>Upload image</span></div></div><h1 id="cClassShortName"></h1><h2 id="cClassFullName"></h2><h2 id="cClassSchool"></h2><h3 id="cClassMembers"></h3></div><div class="cHeader" id="cSubjectHeader"></div><div id="cCurrentSubject" class="card-1"></div><div class="cHeader">Menu:</div><div id="cClassMenu"><div id="cClassUploads" class="card-1 cMenuButton unselectable active">Uploads</div><div id="cClassTimetable" class="card-1 unselectable cMenuButton">Timetable</div><div id="cClassMessages" class="card-1 unselectable cMenuButton">Messages</div><div id="cClassGroups" class="card-1 unselectable cMenuButton">Groups</div></div></div><div class="cColumn" id="cColumnRight"><div id="cReminders"><div class="cHeader">Reminders:</div></div></div><div class="cHeader wideHeader" id="cOptionsHeader">[Uploads/Timetable/Messages/Groups] Options:</div><div id="cOptions" class="card-1"><div class="leftOption unselectable"><i class="material-icons">search</i><div>Filter</div></div><div class="rightOption unselectable"><i class="material-icons">file_upload</i><div>Upload</div></div></div><div class="cHeader wideHeader" id="cMainHeader">[Uploads/Timetable/Messages/Groups]:</div>');

	newClassInit(_id);

	switch (_classTab) {
		case 1:
	$("#cClassTimetable").trigger("click");
			$("#cClassTimetable").addClass("active");
			window.location.hash = "class/" + _id + "/timetable";
			break;
		case 2:
	$("#cClassMessages").trigger("click");
			$("#cClassMessages").addClass("active");
			window.location.hash = "class/" + _id + "/messages";
			break;
		case 3:
	$("#cClassGroups").trigger("click");
			$("#cClassGroups").addClass("active");
			window.location.hash = "class/" + _id + "/groups";
			break;
		case 0:
		default:
	$("#cClassUploads").trigger("click");
			$("#cClassUploads").addClass("active");
			window.location.hash = "class/" + _id + "/uploads";
			break;
	}
}
