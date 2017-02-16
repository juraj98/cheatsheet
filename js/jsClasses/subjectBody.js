class SubjectBody {

	/*
	Variables:
	    this.id
	    this.name
	    this.acronym
	    this.teacher
	    this.location
	    this.icon
	    this.color
		this.notificationArea
	    this.usedIds
		this.element
	*/

	//constructor
	constructor(_json, _id = null, _name = null, _acronym = null, _teacher = null, _location = null, _changed = false, _icon = null, _color = null) {
		if (_json) {
			//Create from json
			this.updateViaJSON(_json);
		} else {
			//Create from constructor parameters
			if (_id == null || _name == null || _acronym == null || _teacher == null || _location == null) {
				console.error("SubjectBody class didn't recieved all needed parameters.");
			} else {
				this.updateViaParams(_id, _name, _acronym, _teacher, _location, _icon, _color, _changed);
			}
		}
	}

	//Update functions
	updateViaJSON(_json) {
		_json = JSON.parse(_json);
		this.id = _json["id"];
		this.name = _json["name"];
		this.acronym = _json["acronym"];
		this.teacher = _json["teacher"];
		this.location = _json["location"];
		this.icon = _json["icon"];
		this.color = _json["color"];
		this.notificationArea = new SubjectNotificationArea(_json["changed"]);
	}
	updateViaParams(_id, _name, _acronym, _teacher, _location, _icon = null, _color = null, _changed = false) {
		this.id = _id;
		this.name = _name;
		this.acronym = _acronym;
		this.teacher = _teacher;
		this.location = _location;
		this.icon = _icon;
		this.color = _color;
		this.notificationArea = new SubjectNotificationArea(_changed);
	}

	//Resize
	resize() {
		var element;

		//Notifications
		element = $(this.element).children(".ttSubjectNotifications");
		//		console.log("(" + $(this.element).height() + " - " + $(element).outerHeight(true) + ") / 2 = " + ($(this.element).height() - $(element).outerHeight(true)) / 2);

		//Icon
		$(element).css("top", ($(this.element).height() - $(element).outerHeight(true)) / 2);
		element = $(this.element).children(".ttSubjectIcon");
		//		console.log("(" + $(this.element).height() + " - " + $(element).outerHeight() + ") / 2 = " + ($(this.element).height() - $(element).outerHeight()) / 2);
		$(element).css("margin", (($(this.element).height() - $(element).outerHeight()) / 2) + "px 8px");

		/*
			#
			Text
			15px
			Text
			#
		*/

		//Text
		var margin = ($(this.element).height() - ($(this.element).children(".ttSubjectName").height() + $(this.element).children(".ttSubjectInfo").height())) / 2;
		if (margin < 0) {
			margin = 0;
		}
		$(this.element).children(".ttSubjectName").css("margin-top", margin);


	}

	//To functions
	toElement() {

		this.element = $('<div class="ttSubjectBody"><div style="background-color: ' + this.color + '" class="ttSubjectIcon unselectable card-1">' + (this.icon ? '<i class="material-icons">' + this.icon + '</i>' : (this.acronym ? this.acronym.charAt(0).toUpperCase() : '<i class="material-icons">school</i>')) + '</div><span class="ttSubjectName">' + this.name + '</span><span class="ttSubjectInfo">' + this.teacher + (this.teacher && this.location ? " - " : "") + this.location + '</span></div>').data("SubjectBody", this);

		$(this.element).append(this.notificationArea.toElement());

		return $(this.element);
	}
	toJSON() {
		return JSON.stringify(this.toArray());
	}
	toArray() {
		return {
			id: this.id,
			name: this.name,
			acronym: this.acronym,
			teacher: this.teacher,
			location: this.location,
			icon: this.icon,
			color: this.color,
			changed: this.notificationArea.changed
		}
	}
}
