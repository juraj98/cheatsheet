class Subject {
	/*
	Variables:
	    this.id
	    this.number
	    this.start
	    this.end
	    this.bodies
	    this.usedIds

	HTMLAttributes:
	    ttOptionSubjectId
	    ttOptionNumber
	    ttOptionFixedStart
	    ttOptionFixedEnd
	    --ttOptionAutoNumber
	    --ttOptionAutoStart
	    --ttOptionAutoEnd

	*/

	//constructor
	constructor(_json, _id = null, _number = null, _start = null, _end = null, _bodiesJSON = null) {
		this.newId = 0;
		if (_json) {
			//Create from json
			this.updateViaJSON(_json);
		} else {
			//Create from constructor parameters
			if (_id == null || _number == null || _start == null || _end == null) {
				console.error("SubjectBody class didn't recieved all needed parameters.");
			} else {
				this.updateViaParams(_id, _number, _start, _end, _bodiesJSON);
			}
		}
	}

	//update functions
	updateViaJSON(_json) {
		_json = JSON.parse(_json);
		//Convert bodiesJSON to subjectBody objects
		var bodiesArray = new Array();
		this.usedIds = new Array();
		for (var i = 0; i < _json["bodies"].length; i++) {
			var currentBody = new SubjectBody(JSON.stringify(_json["bodies"][i]))
				//Check if id is already used
			if ($.inArray(currentBody.id, this.usedIds) == -1) {
				bodiesArray.push(currentBody);
				this.usedIds.push(currentBody.id);
			} else {
				console.error("Duplicate id: " + currentBody.id + "\nNumber: " + _json["number"] + "\nStart: " + _json["start"] + "\nEnd: " + _json["end"] + "\nBodies: " + _json["bodies"]);

				return;
			}
		}
		this.id = _json["id"];
		this.number = _json["number"];
		this.start = new Time(_json["start"]);
		this.end = new Time(_json["end"]);
		this.bodies = bodiesArray;
	}
	updateViaParams(_id, _number, _start, _end, _bodiesJSON = null) {
		//Convert bodiesJSON to subjectBody objects
		var bodiesArray = new Array();
		this.usedIds = new Array();
		if (_bodiesJSON) {
			_bodiesJSON = JSON.parse(_bodiesJSON);
			for (var i = 0; i < _bodiesJSON.length; i++) {
				var currentBody = new SubjectBody(JSON.stringify(_bodiesJSON[i]));
				//Check if id is already used
				if ($.inArray(currentBody.id, this.usedIds) == -1) {
					bodiesArray.push(currentBody);
					this.usedIds.push(currentBody.id);
				} else {
					console.error("Duplicate id " + currentBody.id);
					return;
				}
			}
		}
		this.id = _id;
		this.number = _number;
		this.start = new Time(_start);
		this.end = new Time(_end);
		this.bodies = bodiesArray;
	}

	//to functions
	toElement(_isEditor) {
		//Create basic jQuery element(.ttSubject);
		var element = $('<div class="ttSubject card-1"></div>');

		//Create start of innerHTML for element
		var elementHTML = '<div class="ttSubjectHeader"><div class="number"><span>' + this.number + '</span>. Lesson</div><div class="time"><span class="start">' + this.start.getTime() + '</span> - <span class="end">' + this.end.getTime() + '</span></div></div><div class="bodysSortable"></div>';

		//Insert innerHTML to element
		$(element).html(elementHTML);
		var elementBodiesDiv = $(element).children(".bodysSortable");


		//Insert first .insert element into element
		if (_isEditor) {
			$(elementBodiesDiv).append($('<div class="insertSubjectBody top"><span class="blockText unselectable" unselectable="on">Add new subject</span></div>'));
		}

		//Generate bodies for into element

		for (var i = 0; i < this.bodies.length; i++) {
			$(elementBodiesDiv).append(this.bodies[i].toElement());
			if (_isEditor && i + 1 != this.bodies.length) {
				$(elementBodiesDiv).append($('<div class="insertSubjectBody"><span class="blockText unselectable" unselectable="on">Add new subject</span></div>'));
			}
		}

		//Insert last .insertSubject element to element
		if (_isEditor) {
			$(elementBodiesDiv).append($('<div class="insertSubjectBody bottom"><span class="blockText unselectable" unselectable="on">Add new subject</span></div>'));
		}

		return $(element).data("Subject", this);
	}
	toJSON() {
		return JSON.stringify(this.toArray());
	}
	toArray() {
		//convert subujectBody objects to array
		var bodiesArray = new Array();
		for (var i = 0; i < this.bodies.length; i++) {
			bodiesArray.push(this.bodies[i].toArray());
		}
		var array = {
			id: this.id,
			number: this.number,
			start: this.start.getTime(),
			end: this.end.getTime(),
			bodies: bodiesArray
		};
		return array;
	}
}
