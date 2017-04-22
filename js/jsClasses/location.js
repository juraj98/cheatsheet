class Location {
	constructor(_id, _name, _description) {
		this.id = _id;
		this.name = _name;
		this.description = _description;
		this.notificationArea = new SubjectNotificationArea(this.changed);
	}

	toElement() {
		this.element = $('<div class="teLocationEditorItem card-1"><div class="teLocationEditorItemName"></div><div class="teLocationEditorItemDescription">No description</div></div>');

		this.element.data("Location", this);

		this.updateElement();

		this.element.append(this.notificationArea.toElement());

		var that = this;
		this.element.click(function () {
			if (editingLocation == that) {
				return;
			}
			clearEditing();
			that.notificationArea.toggleEditing();
			editingLocation = that;
			//Location
			if (that.name) {
				if (that.name.length <= 50) {
					$("#teLocation").removeClass("invalid").addClass("valid").children(".label").addClass("active")
				} else {
					$("#teLocation").removeClass("valid").addClass("invalid").children(".label").addClass("active");
				}
			} else {
				$("#teLocation").removeClass("valid invalid").children(".label").removeClass("active");
			}
			$("#teLocation").removeClass("disabled");
			$("#teLocation > input").val(that.name);
			$("#teLocation > .maxLengthLabel").html(that.name.length + "/50");

			//Location description
			if (that.description) {
				if (that.description.length <= 50) {
					$("#teLocationDescription").removeClass("invalid").addClass("valid").children(".label").addClass("active")
				} else {
					$("#teLocationDescription").removeClass("valid").addClass("invalid").children(".label").addClass("active");
				}
				$("#teLocationDescription > input").val(that.description);
				$("#teLocationDescription > .maxLengthLabel").html(that.description.length + "/50");
			} else {
				$("#teLocationDescription").removeClass("valid invalid").children(".label").removeClass("active");
			}
			$("#teLocationDescription").removeClass("disabled");
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
		this.element.find(".teLocationEditorItemName").html(this.name);
		//description
		this.element.find(".teLocationEditorItemDescription").html(this.description ? this.description : "No description");
	}
}
