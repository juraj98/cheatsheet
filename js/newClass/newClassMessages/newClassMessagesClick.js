function newClassMessagesClick(_id){
	console.info("%cFunction run:\t" + "%cnewClassMessagesClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	//options hide for messages
	$("#cOptionsHeader").hide();
	$("#cOptions").hide();
	$(".cUserMsg, .cOtherMsg").remove();

	//Change header
	$("#cMainHeader").html("Messages:");

	//Hide and show stuff
	$("#cNewMessageBox").show();
	$("#cNewUpload").hide();
	$("#cAddNewGroupContainer").hide();

	//Handle main container
	newClassMessagesInit(_id);

}
