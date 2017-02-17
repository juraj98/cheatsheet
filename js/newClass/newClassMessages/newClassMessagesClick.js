function newClassMessagesClick(_id){
	console.info("%cFunction run:\t" + "%cnewClassMessagesClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	$("#cOptionsHeader").hide();
	$("#cOptions").hide();

	$("#cMainHeader").html("Messages:");

	$("#cMainHeader").after('<div id="cNewMessageBox"><div id="cNewMessageBoxPicture"><div id="cNewMessageBoxPictureArrow" class="card-1"></div><img src="images/placeholders/profilePicturePlaceholder.png" id="cNewMessageBoxPictureImage" class="card-1"></div><span id="cNewMessageBoxYouText">You</span><textarea rows="1" class="card-1"></textarea><div id="cNewMessageSendButton" class="card-1"><span>Send</span><i class="material-icons">send</i></div></div>');

	newClassMessagesInit(_id);

}
