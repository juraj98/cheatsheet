class SubjectNotificationArea {
	/*Variables:
		this.changed
		this.editing
		this.reminders
	*/


	constructor(_changed, _editing = false, _reminders = false) {

		this.element = $('<div class="ttSubjectNotifications unselectable"></div>');

		this.editingElement = $('<i class="material-icons" style="color:#F44336; display:' + ((this.editing = _editing) ? "block" : "none") +
			';">mode_edit</i>');
		this.changedElement = $('<i class="material-icons" style="display:' + ((this.changed = _changed) ? "block" : "none") +
			';">extension</i>');
		this.remindersElement = $('<i class="material-icons" style="display:' + ((this.reminders = _reminders) ? "block" : "none") +
			';">notifications</i>');

		$(this.element).append($(this.editingElement))
			.append($(this.changedElement))
			.append($(this.remindersElement));
	}

	toggleEditing() {
		console.log("toggleEditing");
		this.editing = !this.editing;
		this.editingElement.toggle();
	}

	toElement() {
		return $(this.element).data("SubjectNotificationArea", this);
	}
}
