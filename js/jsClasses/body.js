class Body {
	constructor(_id, _name, _acronym, _icon, _color) {
		this.id = _id;
		this.name = _name;
		this.acronym = _acronym;
		this.icon = _icon;
		this.color = _color;
		this.notificationArea = new SubjectNotificationArea(this.changed);
	}

	toElement() {
		this.element = $('<div class="teBodyEditorItem card-1"><div class="teBodyEditorItemIcon unselectable card-1"></div><div class="teBodyEditorItemName"></div><div class="teBodyEditorItemAcronym"></div></div>');

		this.element.data("Body", this);

		this.updateElement();

		this.element.append(this.notificationArea.toElement());

		var that = this
		this.element.click(function () {
			if (editingBody == that) {
				return;
			}
			clearEditing();
			that.notificationArea.toggleEditing();
			editingBody = that;

			//Name
			$("#teSubjectName").removeClass("disabled");
			if (that.name) {
				if (that.name.length <= 50) {
					$("#teSubjectName").removeClass("invalid").addClass("valid").children(".label").addClass("active");
				} else {
					$("#teSubjectName").removeClass("valid").addClass("invalid").children(".label").addClass("active");
				}
			} else {
				$("#teSubjectName").removeClass("valid invalid").children(".label").removeClass("active");
			}
			$("#teSubjectName > input").val(that.name);
			$("#teSubjectName > .maxLengthLabel").html(that.name.length + "/50");
			//Acronym
			$("#teSubjectAcronym").removeClass("disabled");
			if (that.acronym) {
				if (that.acronym.length <= 3) {
					$("#teSubjectAcronym").removeClass("invalid").addClass("valid").children(".label").addClass("active");
				} else {
					$("#teSubjectAcronym").removeClass("valid").addClass("invalid").children(".label").addClass("active");
				}
			} else {
				$("#teSubjectAcronym").removeClass("valid invalid").children(".label").removeClass("active");
			}
			$("#teSubjectAcronym > input").val(that.acronym);
			$("#teSubjectAcronym > .maxLengthLabel").html(that.acronym.length + "/3");

			if (that.icon) {
				console.log("te has icon");
			} else {
				if (that.acronym.length == 0) {
					$(".teSubjectImage").html('<i class="material-icons">school</i>');
				} else {
					$(".teSubjectImage").html(that.acronym.charAt(0).toUpperCase());
				}
			}
			//Color ✓
			$("#teColorPicker").removeClass("disabled");
			if (that.color) {
				$("#teColorPicker").addClass("active").attr("result", that.color);
				$("#teColorPicker .cpColorCode").html(that.color);
				$("#teColorPicker .cpPreviewColor").css("background-color", that.color);
				$(".teSubjectImage").css("background-color", that.color);
			} else {
				$("#teColorPicker").removeClass("active").attr("result", "");
				$("#teColorPicker .cpColorCode").html("");
				$("#teColorPicker .cpPreviewColor").css("background-color", "");
				$(".teSubjectImage").css("background-color", "");
			}
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
		this.element.find(".teBodyEditorItemName").html(this.name);
		//acronym
		this.element.find(".teBodyEditorItemAcronym").html(this.acronym);
		//icon + color
		this.element.find(".teBodyEditorItemIcon").html(this.acronym.charAt(0).toUpperCase()).css("background-color", this.color);
	}
}
