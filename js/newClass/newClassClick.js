function newClassClick(_id, _classTab = 0) {
	$(".content").load('html/classHtml.html', null, function () {
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
	});

}
