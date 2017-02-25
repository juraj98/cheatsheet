function accountInit() {

	updateInfo()

	autosize($('#aMessageBox .cMsgBox > textarea'));

	$("#aUserNewMessage").click(function(e) {
		if (e.target != this && $(e.target).hasClass("acceptClick") == false) {
			console.log("return");
			return; //Returns if target is child
		}

		if (!$(this).hasClass("active")) {
			$(this).addClass("active");
			$(this).children("input").val("").focus();
		}
	});

	$(".cMsgBox > textarea").on("keyup", function(e) {
		if (e.which == 13) {
			var value = $.trim($(this).val());
			if (value != "" && value != " ") {
				$.post(baseDir + "/php/create/createDirectMessage.php", {
					idToken: googleTokenId,
					otherUserId: chatingWith,
					content: value
				}, function(_ajaxData) {
					if (_ajaxData.success) {
						var nowDate = new Date();
						var created =
								nowDate.getFullYear() + "-" +
								((nowDate.getMonth()+1).length == 1 ? "0" + (nowDate.getMonth()+1) : (nowDate.getMonth()+1)) + "-" +
								(nowDate.getDate().length == 1 ? "0" + nowDate.getDate() : nowDate.getDate()) + " " +
								(nowDate.getHours().length == 1 ? "0" + nowDate.getHours() : nowDate.getHours()) + ":" +
								(nowDate.getMinutes().length == 1 ? "0" + nowDate.getMinutes() : nowDate.getMinutes()) + ":" +
								(nowDate.getMinutes().length == 1 ? "0" + nowDate.getMinutes() : nowDate.getMinutes());
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
						$(".cMsgBox textarea").val("");
						$("#aMessageBox").after(newMessage.toElement());
					} else {
						popout(_ajaxData.error.message);
					}
				});
			}
		}
	});

	loadRecentMessages();

	var previousSearch;
	$("#aUserNewMessageInput").on("change keyup paste", function() {
		var value = $.trim($(this).val());
		if (value != "" && value != " " && value != previousSearch) {
			previousSearch = value.split(" ");
			$.post(baseDir + "/php/search/search.php", {
				idToken: googleTokenId,
				searchString: JSON.stringify(previousSearch),
				filters: '[false, false, true]'
			}, function(_ajaxData) {
				if (_ajaxData.success) {
					var suggestions = "";
					$("#aUserNewMessageSuggestions").html("").show();
					for (var i = 0; i < _ajaxData.data.users.length; i++) {
						var newElement = $('<div><i class="material-icons">person</i><span>' + _ajaxData.data.users[i].name + ' ' + _ajaxData.data.users[i].surname + '</span></div>').data("User", _ajaxData.data.users[i]).on("click", function() {
							$("#aUserNewMessageInput").val("");
							$("#aUserNewMessage").removeClass("active");
							chatInit($(this).data("User").id);
							$(this).parent().hide();
						});
						$("#aUserNewMessageSuggestions").append(newElement);
					}
				} else {
					popout(_ajaxData.error.message);
				}
			});
		}
	});

	$("#aUserEditInfo").click(function(){
		editProfileInfo();
	});
	$("#aUserSaveInfo").click(function(){
		saveProfileInfo();
	});



}

function chatInit(_userId) {

	chatingWith = _userId;

	$.post(baseDir + "/php/get/getDirectMessages.php", {
		idToken: googleTokenId,
		otherUserId: _userId
	}, function(_ajaxData) {
		if (_ajaxData.success) {
			$("#aUserMessages > .cUserMsg, #aUserMessages > .cOtherMsg").remove();

			$("#aMessagesHeader").html(_ajaxData.data.user.name + " " + _ajaxData.data.user.surname + " messages:");

			for (var i = 0; i < _ajaxData.data.messages.length; i++) {
				var newMessage;
				if (_ajaxData.data.messages[i].authorId == user.id) {
					newMessage = new Message(
						null,
						_ajaxData.data.messages[i].id,
						_ajaxData.data.messages[i].content,
						_ajaxData.data.messages[i].created,
						user.id,
						user.name,
						user.surname,
						user.image
					);

				} else {
					newMessage = new Message(
						null,
						_ajaxData.data.messages[i].id,
						_ajaxData.data.messages[i].content,
						_ajaxData.data.messages[i].created,
						_ajaxData.data.user.id,
						_ajaxData.data.user.name,
						_ajaxData.data.user.surname,
						_ajaxData.data.user.image
					);
				}


				$("#aMessageBox").after(newMessage.toElement());
			}

		} else {
			popout(_ajaxData.error.message);
		}
	});
}

function loadRecentMessages() {
	$.post(baseDir + "/php/get/getLastMessages.php", {
		idToken: googleTokenId
	}, function(_ajaxData) {
		if (_ajaxData.success) {

			$(".aUserContact").remove();

			for(var i = 0; i < _ajaxData.data.lastMessages.length; i++){

				var contactImage;
				var contactName;
				var contactSurname;
				var contactId;

				if(_ajaxData.data.lastMessages[i].firstUserId == user.id){
					contactImage = _ajaxData.data.lastMessages[i].secondImage;
					contactName = _ajaxData.data.lastMessages[i].secondName;
					contactSurname = _ajaxData.data.lastMessages[i].secondSurname;
					contactId = _ajaxData.data.lastMessages[i].secondUserId;
				} else {
					contactImage = _ajaxData.data.lastMessages[i].firstImage;
					contactName = _ajaxData.data.lastMessages[i].firstName;
					contactSurname = _ajaxData.data.lastMessages[i].firstSurname;
					contactId = _ajaxData.data.lastMessages[i].firstUserId;
				}

				var contactElement = $('<div class="aUserContact"><img class="card-1" src="' + (contactImage == null ? "images/placeholders/profilePicturePlaceholder.png" : contactImage) + '" style=""><h1>' + contactName + " " + contactSurname + '</h1><h2>' + _ajaxData.data.lastMessages[i].content + '</h2></div>').data("contactId", contactId).click(function(){
					chatInit($(this).data("contactId"));
				});

				$("#aUserNewMessage").after(contactElement);

				if(i == 0) {
					chatInit(contactId);
				}

			}

		} else {
			popout(_ajaxData.error.message);
		}
	});
}

function editProfileInfo(){
	$("#aUserInfoPanel").addClass("edit");
}

function saveProfileInfo(){
	var name = $("#aUserNameEdit").val();
	var surname = $("#aUserSurnameEdit").val();
	var username = $("#aUserUsernameEdit").val();
	var mail = $("#aUserMailEdit").val();

	if(isValidEmailAddress(mail)){

		user.name = name;
		user.surname = surname;
		user.username = username;
		user.mail = mail;

		user.saveUser(function(){
			popout("Account info saved.");
			$("#aUserInfoPanel").removeClass("edit");
			updateInfo();
		});

	} else {
		popout("Wrong E-mail address");
	}
}

function updateInfo(){
	$("#aUserNameAndSurname").html(user.name + " " + user.surname);
	$("#aUserUsername").html(user.username);
	$("#aUserMail").html(user.mail);
	$("#aUserCheatpoints").html(user.cheatpoints + " Cheatpoints");

	$("#aUserNameEdit").val(user.name);
	$("#aUserSurnameEdit").val(user.surname);
	$("#aUserUsernameEdit").val(user.username);
	$("#aUserMailEdit").val(user.mail);
}
