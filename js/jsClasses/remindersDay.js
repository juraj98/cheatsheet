class RemindersDay {

	/*
	Variables:
	    this.id
	    this.date
		this.reminders
		this.element
	*/

	constructor(_json, _date = null, _reminders = null) {
		if (_json) {
			//Create from json
			this.updateViaJSON(_json);
		} else {
			this.updateViaParams(_date, _reminders);
		}
	}

	updateViaJSON(_json) {
		_json = JSON.parse(_json);

		this.id = _json["id"];
		this.date = _json["date"];
		this.reminders = new Array();

		for (var i = 0; i < _json["reminders"].length; i++) {
			reminders[i] = new Reminder(_json["reminders"]);
		}
	}

	updateViaParams(_date, _reminders) {
		this.date = _date;
		this.reminders = _reminders;
	}

	toElement() {
		this.element = $('<div class="rDay"><div class="rDayInfo">' + this.getReminderDayNameFromDate(this.date) + '</div></div>');

		for (var i = 0; i < this.reminders.length; i++) {
			$(this.element).append(this.reminders[i].toElement());
		}

		return this.element.data("RemindersDay", this);

	}

	getReminderDayNameFromDate(_date) {
		var tomorrow = new Date(today.getTime());
		tomorrow.setTime(tomorrow.getTime() + 86400000);

		if (_date.toDateString() == today.toDateString()) {
			return "Today";
		} else if (_date.toDateString() == tomorrow.toDateString()) {
			return "Tomorrow";
		} else {
			return _date.toDateString();
		}
	}


}
