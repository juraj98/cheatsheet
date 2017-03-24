function timetableEditorClick(_id) {
	console.info("%cFunction run:\t" + "%ctimetableEditorClick()", "color: #303F9F; font-weight:700", "color: #303F9F");
	$(".content").load('html/timetableEditorHtml.html', null, function () {
		console.log("Timetable editor clicked with id: " + _id);
		timetableEditorInit(_id);
	});
}
