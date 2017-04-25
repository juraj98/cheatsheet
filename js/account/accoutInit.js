var createdDirectMessages = 0;
var timesDirectMessagesWereLoaded = 0;

function accountInit() {


	createdDirectMessages = 0;
	timesDirectMessagesWereLoaded = 0;
	updateInfo();

	setupUserUploadImage();

	autosize($('#aMessageBox .cMsgBox > textarea'));

	$("#aUserNewMessage").click(function (e) {
		if (e.target != this && $(e.target).hasClass("acceptClick") == false) {
			console.log("return");
			return; //Returns if target is child
		}

		if (!$(this).hasClass("active")) {
			$(this).addClass("active");
			$(this).children("input").val("").focus();
		}
	});

	$(".cMsgBox > textarea").on("keydown", function (e) {
		if (e.which == 13) {
			e.preventDefault();
			var value = $.trim($(this).val());
			if (value != "" && value != " ") {
				$.post(baseDir + "/php/create/createDirectMessage.php", {
					idToken: googleTokenId,
					otherUserId: chatingWith,
					content: value
				}, function (_ajaxData) {
					if (_ajaxData.success) {
						createdDirectMessages++;
						var nowDate = new Date();
						var created =
							nowDate.getFullYear() + "-" +
							((nowDate.getMonth() + 1).toString().length == 1 ? "0" + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1)) + "-" +
							(nowDate.getDate().toString().length == 1 ? "0" + nowDate.getDate() : nowDate.getDate()) + " " +
							(nowDate.getHours().toString().length == 1 ? "0" + nowDate.getHours() : nowDate.getHours()) + ":" +
							(nowDate.getMinutes().toString().length == 1 ? "0" + nowDate.getMinutes() : nowDate.getMinutes()) + ":" +
							(nowDate.getMinutes().toString().length == 1 ? "0" + nowDate.getMinutes() : nowDate.getMinutes());
						var newMessage = new Message(
							null, -1,
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

	setupDirectMessagesScrollListener();
	loadRecentMessages();

	var previousSearch;
	$("#aUserNewMessageInput").on("change keyup paste", function () {
		var value = $.trim($(this).val());
		if (value != "" && value != " " && value != previousSearch) {
			previousSearch = value.split(" ");
			$.post(baseDir + "/php/search/search.php", {
				idToken: googleTokenId,
				searchString: JSON.stringify(previousSearch),
				filters: '[false, false, true]'
			}, function (_ajaxData) {
				if (_ajaxData.success) {
					var suggestions = "";
					$("#aUserNewMessageSuggestions").html("").show();
					for (var i = 0; i < _ajaxData.data.users.length; i++) {
						var newElement = $('<div><i class="material-icons">person</i><span>' + _ajaxData.data.users[i].name + ' ' + _ajaxData.data.users[i].surname + '</span></div>').data("User", _ajaxData.data.users[i]).on("click", function () {
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

	$("#aUserEditInfo").click(function () {
		editProfileInfo();
	});
	$("#aUserSaveInfo").click(function () {
		saveProfileInfo();
	});

}

function setupDirectMessagesScrollListener() {
	$("#aUserMessages").off().scroll(function () {
		if ($(this).scrollTop() == $(this)[0].scrollHeight - $(this).height()) {
			loadDirectMessages();
		}
	});
}

function chatInit(_userId) {

	timesDirectMessagesWereLoaded = 0;
	createdDirectMessages = 0;

	chatingWith = _userId;
	$("#aUserMessages > .cUserMsg, #aUserMessages > .cOtherMsg").remove();
	loadDirectMessages();
}

function setupUserUploadImage() {
	$("#aUserImageUploadButton").click(function () {
		console.log("click");
		$("#uDropArea").replaceWith('<div id="uDropArea" class="dropzoneCss"><div class="dz-message needsclick">Drop files here or click to upload.</div></div>');
		uploadDropzone = new Dropzone("#uDropArea", {
			url: "/php/set/setImage.php",
			maxFiles: 1,
			dictDefaultMessage: "Drop files here to upload",
			dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
			acceptedFiles: "image/*"
		});
		uploadDropzone.off();
		uploadDropzone.on("sending", function (file, xhr, formData) {
			formData.append("idToken", googleTokenId);
		});
		uploadDropzone.on("success", function (params) {

			var response = JSON.parse(params.xhr.response);
			if (response.success) {
				setUserImage(response.data.fileName);
				$("#uArea").hide();
			} else {
				popout(reponse.details);
			}
		});
		$("#uArea").show();
	});
}

function setUserImage(_url) {
	if (!validURL(_url)) {
		_url = "uploadImages/user/" + _url;
	}

	console.log("URL: " + _url);

	$("#aUserImageDiv > i").remove();
	$("#aUserImageDiv").css("background-image", "url(" + _url + "?random=" + new Date().getTime() + ")");
}

function loadDirectMessages() {
	$.post(baseDir + "/php/get/getDirectMessages.php", {
		idToken: googleTokenId,
		otherUserId: chatingWith,
		offset: timesDirectMessagesWereLoaded * 20 + createdDirectMessages
	}, function (_ajaxData) {
		if (_ajaxData.success) {
			timesDirectMessagesWereLoaded++;
			$("#aMessagesHeader").html(_ajaxData.data.user.name + " " + _ajaxData.data.user.surname + " messages:");

			console.log("Messages loaded: " + _ajaxData.data.messages.length);

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


				$("#aUserMessages").append(newMessage.toElement());
			}

		} else {
			popout(_ajaxData.error.message);
		}
	});
}

function loadRecentMessages() {
	$.post(baseDir + "/php/get/getLastMessages.php", {
		idToken: googleTokenId
	}, function (_ajaxData) {
		if (_ajaxData.success) {

			$(".aUserContact").remove();

			for (var i = 0; i < _ajaxData.data.lastMessages.length; i++) {

				var contactImage;
				var contactName;
				var contactSurname;
				var contactId;

				if (_ajaxData.data.lastMessages[i].firstUserId == user.id) {
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

				var contactElement = $('<div class="aUserContact"><img class="card-1" src="' + (contactImage == null ? "images/placeholders/profilePicturePlaceholder.png" : contactImage) + '" style=""><h1>' + contactName + " " + contactSurname + '</h1><h2>' + _ajaxData.data.lastMessages[i].content + '</h2></div>').data("contactId", contactId).click(function () {

					chatInit($(this).data("contactId"));
				});

				$("#aUserContacts").append(contactElement);

				if (i == 0) {
					chatInit(contactId);
				}

			}

		} else {
			popout(_ajaxData.error.message);
		}
	});
}

function editProfileInfo() {
	$("#aUserInfoPanel").addClass("edit");
}

function saveProfileInfo() {
	var name = $("#aUserNameEdit").val();
	var surname = $("#aUserSurnameEdit").val();
	var username = $("#aUserUsernameEdit").val();
	var mail = $("#aUserMailEdit").val();

	if (isValidEmailAddress(mail)) {

		user.name = name;
		user.surname = surname;
		user.username = username;
		user.mail = mail;

		user.saveUser(function () {
			popout("Account info saved.");
			$("#aUserInfoPanel").removeClass("edit");
			updateInfo();
		});

	} else {
		popout("Wrong E-mail address");
	}
}

function updateInfo() {
	$("#aUserNameAndSurname").html(user.name + " " + user.surname);
	$("#aUserUsername").html(user.username);
	$("#aUserMail").html(user.mail);
	$("#aUserCheatpoints").html(user.cheatpoints + " Cheatpoints");


	if (user.image) {
		console.log("User image : " + user.image);
		setUserImage(user.image);
	}

	$("#aUserNameEdit").val(user.name);
	$("#aUserSurnameEdit").val(user.surname);
	$("#aUserUsernameEdit").val(user.username);
	$("#aUserMailEdit").val(user.mail);
}

function validURL(str) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	return regexp.test(str);
}
