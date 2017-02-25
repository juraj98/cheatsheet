class Reminder {
	/*
	Variables:
	    this.id
	    this.name
	    this.type
	    this.subject
	    this.date
		this.element
	*/

	/*
	Types:
		0 - Homework - Blue(#2196F3) - chrome_reader_mode
		1 - Project - Brown(#795548) - assessment
		2 - Oral exam - Orange(#FF9800) - group
		3 - Exam - DeepOrange(#FF5722) - assignment
		4 - Test - Red(#F44336) - assignment_late
		5 - Lesson - Lime(#CDDC39) - book
		*/
	constructor(_json, _displayClass = false) {
		this.updateViaJSON(_json, _displayClass);
	}

	updateViaJSON(_json, _displayClass) {
		_json = JSON.parse(_json);
		this.id = _json["id"];
		this.name = _json["name"];
		this.type = _json["type"];
		this.subject = _json["subject"];
		this.date = new Date(_json["dateOfReminder"]);
		this.class = _json["nameShort"];
		this.displayClass = _displayClass;
	}

	toElement() {
		this.element = $('<div class="rReminder card-1"></div>');

		$(this.element).append('<div class="rIcon card-1" style="background-color:' + this.getColorFromId(this.type) + ';"><i class="material-icons">' + this.getIconFromId(this.type) + '</i></div>');

		$(this.element).append('<h1>' + (this.displayClass ? this.class + ": " : "") + this.name + '</h1><h2>' + this.subject + '</h2>');

		$(this.element).append('<div class="rButtons"><i class="material-icons">done</i><i class="material-icons">bookmark_border</i></div>');

		//Notes
		//		$(this.element).append('<span class="rExpandReminder">Show notes</span>');

		return this.element.data("Reminder", this);
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
			default:
				console.error("Wrong id: " + _id);
				break;
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
			default:
				console.error("Wrong id: " + _id);
				break;
		}
	}

}
