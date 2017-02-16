class Group {
	constructor(_json, _id = null, _admin = null ,_class = null, _members = null, _name = null, _privacy = null, _image = null, _description = null){
		if(_json) {
			this.updateViaJSON(_json);
		} else {
			if(_id, _admin, _class, _members, _name, _privacy){
				this.updateViaParams(_id, _class, _members, _name, _privacy, _image, _description);
			}
		}
	}

	updateViaJSON(_json){
		var data = JSON.parse(_json);
		this.id = data["id"];
		this.admin = data["admin"];
		this.class = data["class"];
		this.members = JSON.parse(data["members"]);
		this.name = data["name"];
		this.privacy = data["privacy"];
		this.image = data["image"];
		this.description = data["description"];
	}
	updateViaParams(_id, _class, _members, _name, _privacy, _image = null, _description = null){
		this.id = _id;
		this.admin = _admin;
		this.class = _class;
		this.members = _members;
		this.name = _name;
		this.privacy = _privacy;
		this.image = _image;
		this.description = _description;
	}

	toElement(){
		this.element = $('<div class="cGroup card-1"></div>');

		if(this.image){
				$(this.element).append('<div class="cGroupImage card-1"><img src="' + this.image + '"></div>');
		} else {
				$(this.element).append('<div class="cGroupImage card-1"><i class="material-icons">group</i><div class="cGroupImageUploadButton card-1"><i class="material-icons">file_upload</i><span>Upload picture</span></div></div>');
		}
		$(this.element).append('<h1>' + this.name + '</h1><h2>' + this.getPrivacyStringById(this.privacy) + '</h2><h2>' + this.members.length + ' Members</h2>');

		if(this.description){
			$(this.element).append('<p>' + this.description + '</p>');
		}
		return $(this.element).data("Group", this);

	}

	getPrivacyStringById(_id){
		switch(_id){
			case 0:
			case "0":
				return "Public";
			case 1:
			case "1":
				return "Closed";
			case 2:
			case "2":
				return "Invite Only";
			default:
				return "Unknown";
		}
	}
}
