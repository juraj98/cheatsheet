class TimetableDay {
	/*
	  Variables:
	    this.subjects
	    this.usedIds
	*/

	//constructor
	constructor(_json) {
		//Create timetableDay from JSON
		this.usedIds = new Array();
		this.subjects = new Array();
		_json = JSON.parse(_json);
		if (_json) {
			this.updateViaJSON(_json);
		}
	}

	//updates
	updateViaJSON(_json) {
		var subjectArray = new Array();
		//		_json = JSON.parse(_json);
		//TODO: 7 Handle empty day
		for (var i = 0; i < _json.length; i++) {
			var currentSubject = new Subject(JSON.stringify(_json[i]));
			//Check if id is already used
			if ($.inArray(currentSubject.id, this.usedIds) == -1) {
				subjectArray.push(currentSubject);
				this.usedIds.push(currentSubject.id);
			} else {
				console.error("Duplicate id: " + currentSubject.id + "\nNumber: " + currentSubject.number + "\nStart: " + currentSubject.start + "\nEnd: " + currentSubject.end + "\nBodies: " + currentSubject.bodies);
				return;
			}
		}
		this.subjects = subjectArray;
	}


	//to funtions
	toElement(_isEditor) {
		//Create basic element
		var element = $('<div class="timetableDay"></div>');


		//Generate subjects
		for (var i = 0; i < this.subjects.length; i++) {
			$(element).append(this.subjects[i].toElement(_isEditor));
			if (_isEditor && i + 1 != this.subjects.length) {
				$(element).append('<div class="insertSubject"><span class="blockText unselectable" unselectable="on">Add new subject</span></div>');
			}
		}


		if (_isEditor) {
			if (this.subjects.length == 0) {
				//Empty timetableDay - add insertSubject.insertFirstSubject;


				$(element).html('<div class="card-1 insertFirstSubject insertSubject"><p>Insert first subject</p><p>Timetable for this day is empty</p></div>')
			} else {
				//Add frist and last.insertSubject element to element
				$(element).prepend('<div class="insertSubject top"><span class="blockText unselectable" unselectable="on">Add new subject</span></div>')
					.append('<div class="insertSubject bottom"><span class="blockText unselectable" unselectable="on">Add new subject</span></div>');
			}
		}

		return $(element).data("TimetableDay", this);
	}
	toJSON() {
		return JSON.stringify(this.toArray());
	}
	toArray() {
		//convert subujectBody objects to array
		var array = new Array();
		for (var i = 0; i < this.subjects.length; i++) {
			array.push(this.subjects[i].toArray());
		}
		return array;
	}
}
