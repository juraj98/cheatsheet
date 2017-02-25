class ActivityItem {

	constructor(_json) {
		this.updateViaJSON(_json);
	}

	updateViaJSON(_json) {
		_json = JSON.parse(_json);

		this.id = _json.id;
		this.activityType = _json.activityType;
		this.header = _json.header;
		this.name = _json.name;
		this.surname = _json.surname;
		this.created = _json.created;

		switch (this.activityType) {
			case "reminder":
				this.reminderType = _json.reminderType;
			case "post":
				this.subject = _json.subject;
				break;
		}

	}

	toElement() {

		switch (this.activityType) {
			case "message":
				return this.toElementMessage();
			case "post":
				return this.toElementPost();
			case "reminder":
				return this.toElementReminder();
		}
	}

	toElementMessage(){
		this.element = $('<div class="hActivity card-1"><div class="hIcon card-1" style="background-color:#673AB7;"><i class="material-icons">message</i></div><h1>Message: ' + this.header + '</h1><h2>' + this.name + " " + this.surname + " | " + this.created + '</h2></div>');

		return $(this.element).data("Activity", this);
	}

	toElementPost(){
		this.element = $('<div class="hActivity card-1"><div class="hIcon card-1" style="background-color:#3F51B5;"><i class="material-icons">file_upload</i></div><h1>Upload: ' + this.header + '</h1><h2>' + this.subject + '</h2></div>');

		return $(this.element).data("Activity", this);
	}

	toElementReminder(){
		this.element = $('<div class="hActivity card-1"><div class="hIcon card-1" style="background-color:' + this.getColorFromId(this.reminderType) + ';"><i class="material-icons">' + this.getIconFromId(this.reminderType) + '</i></div><h1>' + this.getNameFromId(this.reminderType) + ': ' + this.header + '</h1><h2>' + this.subject + '</h2></div>');

		return $(this.element).data("Activity", this);
	}


	getColorFromId(_id) {
		switch (_id) {
			case "0":
				return "#2196F3";
			case "1":
				return "#795548";
			case "2":
				return "#FF9800";
			case "3":
				return "#FF5722";
			case "4":
				return "#F44336";
			case "5":
				return "#CDDC39";
//			case "6":
//				return "#3F51B5"
//			case "7":
//				return "#673AB7";
//			default:
//				return "#8BC34A";
		}

	}
	getIconFromId(_id) {
		switch (_id) {
			case "0":
				return "chrome_reader_mode";
			case "1":
				return "assessment";
			case "2":
				return "group";
			case "3":
				return "assignment";
			case "4":
				return "assignment_late";
			case "5":
				return "book";
//			case "6":
//				return "file_upload";
//			case "7":
//				return "message";
//			default:
//				return "star_rate";
		}
	}

	getNameFromId(_id) {
		switch (_id) {
			case "0":
				return "Homework";
			case "1":
				return "Project";
			case "2":
				return "Oral exam";
			case "3":
				return "Exam";
			case "4":
				return "Test";
			case "5":
				return "Lesson";
		}
	}

}
