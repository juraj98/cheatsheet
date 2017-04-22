class SubjectBody {
	constructor(_body, _teacher, _location, _changed = false) {
		this.body = _body;
		this.teacher = _teacher;
		this.location = _location;
		if (_changed)
			this.changed = true;
		this.notificationArea = new SubjectNotificationArea(this.changed);
	}

	updateElement() {
		//Color
		if (this.body.color) {
			$(this.element).find(".ttSubjectIcon").css("background-color", this.body.color);
		}

		if (this.body.icon) {
			//Icon is set
			$(this.element).find(".ttSubjectIcon").html('<i class="material-icons">' + this.body.icon + '</i>');
		} else {
			//Add first letter of acronym
			$(this.element).find(".ttSubjectIcon").html(this.body.acronym.charAt(0).toUpperCase());
		}
		//Name
		$(this.element).find(".ttSubjectName").html(this.body.name);

		//Info
		if (this.teacher && this.location) {
			$(this.element).find(".ttSubjectInfo").html(this.teacher.getFullName() + " - " + this.location.name);
		} else {
			if (this.teacher) {
				$(this.element).find(".ttSubjectInfo").html(this.teacher.getFullName());
			} else {
				$(this.element).find(".ttSubjectInfo").html(this.location.name);
			}
		}

		//changed
		if (this.body.changed || this.location.changed || this.teacher.changed) {
			console.log("chaned");
			this.notificationArea.changed = true;
			this.notificationArea.changedElement.show();
		} else {
			console.log("notCahnged");
		}

	}

	toElement() {
		//Create element
		this.element = $('<div class="ttSubjectBody"><div class="ttSubjectIcon unselectable card-1"></div><span class="ttSubjectName"></span><span class="ttSubjectInfo"></span></div>');

		this.updateElement();

		//Add notificationArea
		$(this.element).append(this.notificationArea.toElement());

		return $(this.element).data("SubjectBody", this);

	}

	resize() {
		$(this.element).children(".ttSubjectIcon").css("margin-top", ($(this.element).height() - 50) / 2)
	}



}
