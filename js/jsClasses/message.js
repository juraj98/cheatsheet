class Message {

	constructor(_json, _id = null, _content = null, _created = null, _userId = null, _userName = null, _userSurname = null, _userImage = null) {
		if (_json) {
			this.updateViaJSON(_json);
		} else {
			this.updateViaParams(_id, _content, _created, _userId, _userName, _userSurname, _userImage);
		}
	}

	updateViaJSON(_json) {
		_json = JSON.parse(_json);

		this.id = _json["id"];
		this.content = _json["content"];
		this.created = _json["created"];
		this.userId = _json["userId"];
		this.userName = _json["name"];
		this.userSurname = _json["surname"];
		this.userImage = _json["image"];
	}

	updateViaParams(_id, _content, _created, _userId, _userName, _userSurname, _userImage) {
		this.id = _id;
		this.content = _content;
		this.created = _created;
		this.userId = _userId;
		this.userName = _userName;
		this.userSurname = _userSurname;
		this.userImage = _userImage;
	}

	toElement() {

		this.element = $('<div><img class="cImage card-1" src="' + (this.image ? this.image : "images/placeholders/profilePicturePlaceholder.png") + '"><span class="cName"></span><div class="cMsgConainer"><div class="cMsgBox card-1">' + this.content + '</div><div class="cMsgBoxArrowConatiner"><div class="cMsgBoxArrow"></div></div></div></div>');

		if (this.userId == user.id) {
			$(this.element).addClass("cUserMsg");
			$(this.element).find(".cName").html(this.created + " | " + this.userName + " " + this.userSurname);
		} else {
			$(this.element).addClass("cOtherMsg");
			$(this.element).find(".cName").html(this.userName + " " + this.userSurname + " | " + this.created);
		}

		return $(this.element).data("Message", this);
	}

}
