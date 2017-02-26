function newClassMessagesClick(_id){
	console.info("%cFunction run:\t" + "%cnewClassMessagesClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	//options hide for messages
	$("#cOptionsHeader").hide();
	$("#cOptions").hide();

	//Change header
	$("#cMainHeader").html("Messages:");

	//Change options html
	if($("#cNewMessageBox").length == 0)
		$("#cMainHeader").after('<div id="cNewMessageBox"><div id="cNewMessageBoxPicture"><div id="cNewMessageBoxPictureArrow" class="card-1"></div><img src="images/placeholders/profilePicturePlaceholder.png" id="cNewMessageBoxPictureImage" class="card-1"></div><span id="cNewMessageBoxYouText">You</span><textarea rows="1" class="card-1"></textarea><div id="cNewMessageSendButton" class="card-1"><span>Send</span><i class="material-icons">send</i></div></div>');

	//Hide and show stuff
	$("#cNewMessageBox").show();
	$("#cNewUpload").hide();
	$("#cAddNewGroupContainer").hide();

	//Handle main container
	newClassMessagesInit(_id);

}
