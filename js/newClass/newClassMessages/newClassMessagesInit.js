function newClassMessagesInit(_id){
	autosize($('#cNewMessageBox > textarea'));

	$("#cNewMessageSendButton > span").click(function(){
		//TODO: Add new message to posts

		$.post(baseDir + "/php/create/createMessage.php", {
			idToken: googleTokenId,
			classId: _id,
			content: $("#cNewMessageBox > textarea").val()
		}, function(_ajaxData) {
			if (_ajaxData.success) {
				 popout("Success");
			} else {
				popout(_ajaxData.error.message);
			}
		});
	});

	$.post(baseDir + "/php/get/getMessages.php", {
		idToken: googleTokenId,
		classId: _id
	}, function(_ajaxData) {
		if (_ajaxData.success) {

			for (var i = 0; i < _ajaxData.data.messages.length; i++) {

				var newMessage = new Message(JSON.stringify(_ajaxData.data.messages[i]));

				$("#cNewMessageBox").after(newMessage.toElement());
			}
		} else {
			popout(_ajaxData.error.message);
		}
	});

	//TODO: Load more on scroll
	//TODO: Add space on end


}
