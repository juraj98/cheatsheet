function newClassTimetableClick(_id) {
	console.info("%cFunction run:\t" + "%cnewClassTimetableClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	//options show for messages
	$("#cOptionsHeader").show();
	$("#cOptions").show();

	//Change header
	$("#cOptionsHeader").html("Timetable options:");

	//Change options html
	$("#cOptions > .leftOption").html('<i class="material-icons">mode_edit</i><div>Edit</div>').off().click(function(){
		timetableEditorClick(_id)
	});
	$("#cOptions > .rightOption").html(''/*<i class="material-icons">person</i><div>Personalize</div>*/);


	//Hide and show stuff
	$("#cNewMessageBox").hide();
	$("#cNewUpload").hide();
	$("#cAddNewGroupContainer").hide();


	//Hide and show stuff
	$("#cMainHeader").html("Timetable:");
	$("#cMainHeader").after('<div id="cTimetableContainer"><div id="cTimetableTarget"></div></div>');

	//Handle main container
	newClassTimetableInit(_id);
}
