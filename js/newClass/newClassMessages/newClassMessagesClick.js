function newClassMessagesClick(_id){
	console.info("%cFunction run:\t" + "%cnewClassMessagesClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	$("#cOptionsHeader").html("Messages options:");

	$("#cOptions > .leftOption").html('<i class="material-icons">warning</i><div>&lt;empty&gt;</div>');
	$("#cOptions > .rightOption").html('<i class="material-icons">warning</i><div>&lt;empty&gt;</div>');

	$("#cMainHeader").html("Messages:");
}
