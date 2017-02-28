var createdMessages = 0;
var timesMessagesWereLoaded = 0;
function newClassMessagesInit(_id){
	autosize($('#cNewMessageBox > textarea'));

	$("#cNewMessageSendButton").click(function(){
		console.log("SEND");
		//TODO: Add new message to posts

		var value = $("#cNewMessageBox > textarea").val();

		$.post(baseDir + "/php/create/createMessage.php", {
			idToken: googleTokenId,
			classId: _id,
			content: value
		}, function(_ajaxData) {
			if (_ajaxData.success) {
				 popout("Success");
				var nowDate = new Date();
				var created =
					nowDate.getFullYear() + "-" +
					((nowDate.getMonth()+1).toString().length == 1 ? "0" + (nowDate.getMonth()+1) : (nowDate.getMonth()+1)) + "-" +
					(nowDate.getDate().toString().length == 1 ? "0" + nowDate.getDate() : nowDate.getDate()) + " " +
					(nowDate.getHours().toString().length == 1 ? "0" + nowDate.getHours() : nowDate.getHours()) + ":" +
					(nowDate.getMinutes().toString().length == 1 ? "0" + nowDate.getMinutes() : nowDate.getMinutes()) + ":" +
					(nowDate.getMinutes().toString().length == 1 ? "0" + nowDate.getMinutes() : nowDate.getMinutes());
				var newMessage = new Message(
					null,
					-1,
					value,
					created,
					user.id,
					user.name,
					user.surname,
					user.image
				);
				$("#cNewMessageBox").after(newMessage.toElement());
			} else {
				popout(_ajaxData.error.message);
			}
		});
	});
	createdMessages = 0;
	timesMessagesWereLoaded = 0;
	loadMessages(_id);
	setupMessagesScrollListener(_id);

	//TODO: Add space on end

}

function setupMessagesScrollListener(_id){
	$(".content").off().scroll(function() {

		if($(this).scrollTop() == $(this)[0].scrollHeight - $(this).height()){
			loadMessages(_id);
		}
	});
}

function loadMessages(_id){
	console.log("Load");
	$.post(baseDir + "/php/get/getMessages.php", {
		idToken: googleTokenId,
		classId: _id,
		offset: timesMessagesWereLoaded*20+createdMessages
	}, function(_ajaxData) {
		if (_ajaxData.success) {
			timesMessagesWereLoaded++;

			console.log("Messages loaded:" + _ajaxData.data.messages.length);

			for (var i = 0; i < _ajaxData.data.messages.length; i++) {

				var newMessage = new Message(JSON.stringify(_ajaxData.data.messages[i]));

				$(".content").append(newMessage.toElement());
			}
		} else {
			popout(_ajaxData.error.message);
		}
	});
}
