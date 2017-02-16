function classMessagesClick() {
	console.info("%cFunction run:\t" + "%cclassMessagesClick()", "color: #303F9F; font-weight:700", "color: #303F9F");

    $("#classOptionsPanel").html('');
	$("#classOptionsPanel").after('');
	
	classMessagesInit();
	classResize();
}