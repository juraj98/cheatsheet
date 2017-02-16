function classTimetableClick() {
	console.info("%cFunction run:\t" + "%cclassTimetableClick()", "color: #303F9F; font-weight:700", "color: #303F9F");
	$("#classOptionsPanel").html('<div id="edit" class="leftOption"><i class="material-icons">mode_edit</i>Edit</div><div id="personalize" class="rightOption"><i class="material-icons">person</i>Personalize</div>');
	$("#classOptionsPanel").after('<div id="classTimetable" class="contentRowIgnoreScrollbar"></div>');
	
	classResize();
	classTimetableInit();
	
}