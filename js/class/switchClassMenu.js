function switchClassMenu(target) {
	console.info("%cFunction run:\t" + "%cswitchClassMenu(target)", "color: #303F9F; font-weight:700", "color: #303F9F");
    timetableDisplayed = false;
	
	$("#classMainUploadCollapsible").remove();
	$("#classTimetable").remove();
	$("#classMessages").remove();
	$("#classGroups").remove();

	$(".classMenuItem.active").removeClass("active");
	target.addClass("active");

	switch (target.attr("id")) {
	case "uploadsMenuBtn":
		classUploadsClick();
		break;
	case "timetableMenuBtn":
		classTimetableClick();
		break;
	case "messagesMenuBtn":
		classMessagesClick();
		break;
	case "groupsMenuTab":
		classGroupsClick();
		break;
	}
}
