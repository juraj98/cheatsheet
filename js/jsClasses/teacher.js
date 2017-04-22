class Teacher {
	constructor(_id, _name, _surname, _description, _image) {
		this.id = _id;
		this.name = _name;
		this.surname = _surname;
		this.description = _description;
		this.image = _image;
		this.notificationArea = new SubjectNotificationArea(this.changed);
	}

	getFullName() {
		return this.name + " " + this.surname;
	}

	toElement() {
		this.element = $('<div class="teTeacherEditorItem card-1"><div class="teTeacherEditorItemImage unselectable card-1"><i class="material-icons">person</i></div><div class="teTeacherEditorItemName"></div><div class="teTeacherEditorItemSurname"></div><div class="teTeacherEditorItemDescription"></div></div>');

		this.element.data("Teacher", this);

		this.updateElement();

		this.element.append(this.notificationArea.toElement());

		var that = this;
		this.element.click(function () {
			console.log("Teacher click");
			if (editingTeacher == that) {
				return;
			}
			clearEditing();
			that.notificationArea.toggleEditing();
			editingTeacher = that;

			//Teacher's name
			if (that.name) {
				if (that.name.length <= 50) {
					$("#teTeacherName").removeClass("invalid").addClass("valid").children(".label").addClass("active");
				} else {
					$("#teTeacherName").removeClass("valid").addClass("invalid").children(".label").addClass("active");
				}
			} else {
				$("#teTeacherName").removeClass("valid invalid").children(".label").removeClass("active");
			}
			$("#teTeacherName").removeClass("disabled");
			$("#teTeacherName > input").val(that.name);
			$("#teTeacherName > .maxLengthLabel").html(that.name.length + "/50");

			//Teacher's description
			if (that.description) {
				if (that.description.length <= 50) {
					$("#teTeacherDescription").removeClass("invalid").addClass("valid").children(".label").addClass("active");
				} else {
					$("#teTeacherDescription").removeClass("valid").addClass("invalid").children(".label").addClass("active");
				}
				$("#teTeacherDescription > input").val(that.description);
				$("#teTeacherDescription > .maxLengthLabel").html(that.description.length + "/50");
			} else {
				$("#teTeacherDescription").removeClass("valid invalid").children(".label").removeClass("active");
			}
			$("#teTeacherDescription").removeClass("disabled");

			//Teacher's surname
			if (that.surname) {
				if (that.surname.length <= 50) {
					$("#teTeacherSurname").removeClass("invalid").addClass("valid").children(".label").addClass("active");
				} else {
					$("#teTeacherSurname").removeClass("valid").addClass("invalid").children(".label").addClass("active");
				}
			} else {
				$("#teTeacherSurname").removeClass("valid invalid").children(".label").removeClass("active");
			}
			$("#teTeacherSurname > input").val(that.surname);
			$("#teTeacherSurname > .maxLengthLabel").html(that.surname.length + "/50");
			$("#teTeacherSurname").removeClass("disabled");
		});
		return this.element;

	}

	setChanged() {
		this.changed = true;
		this.notificationArea.changed = true;
		this.notificationArea.changedElement.show();
	}

	updateElement() {
		//name
		this.element.find(".teTeacherEditorItemName").html(this.name);
		//surname
		this.element.find(".teTeacherEditorItemSurname").html(this.surname);
		//description
		this.element.find(".teTeacherEditorItemDescription").html(this.description ? this.description : "No description");
		//TODO: icon
	}

}
