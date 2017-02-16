function newClassTimetableClick(_id) {
	console.info("%cFunction run:\t" + "%cnewClassTimetableClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	$("#cOptionsHeader").html("Timetable options:");

	$("#cOptions > .leftOption").html('<i class="material-icons">mode_edit</i><div>Edit</div>').click(function(){
		timetableEditorClick(_id)
	});
	$("#cOptions > .rightOption").html(''/*<i class="material-icons">person</i><div>Personalize</div>*/);

	$("#cMainHeader").html("Timetable:");
	$("#cMainHeader").after('<div id="cTimetableContainer"><div id="cTimetableTarget"></div></div>');


	newClassTimetableInit(_id);
}
