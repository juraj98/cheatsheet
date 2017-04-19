class Timetable {

	/*
	Variables:
	  this.locations = {}
	  this.teachers = {}
	  this.bodies = {}

	  this.newBodyIdMultiplier = 1
	  this.newLocationIdMultiplier = 1
	  this.newTeacherIdMultiplier = 1

	  this.activeDay = today.getDay()

	  this.days = {
	    "monday": [],
	    "tuesday": [],
	    "wednesday": [],
	    "thursday": [],
	    "friday": [],
	    "saturday": [],
	    "sunday": []
	  }

	  this.number
	  this.timetableDayWidth

	  this.isEditor

	  this.element
	*/

	constructor(_json, _isEditor) {
		//Parse JSON
		var json = JSON.parse(_json);

		//Declare variables
		this.locations = {};
		this.teachers = {};
		this.bodies = {};
		// this.subjects = {};
		this.newBodyIdMultiplier = 1;
		this.newLocationIdMultiplier = 1;
		this.newTeacherIdMultiplier = 1;
		var today = new Date();
		// today.setDate(today.getDate() - 1);
		this.activeDay = today.getDay();
		this.isEditor = _isEditor;

		//Create locations
		for (var index in json.locations) {
			this.locations[index] = new Location(index, json.locations[index].name, json.locations[index].description);
		}

		//Create teachers
		for (var index in json.teachers) {
			this.teachers[index] = new Teacher(index, json.teachers[index].name, json.teachers[index].surname, json.teachers[index].description, null);
			// TODO: Add image
		}

		//Create bodies
		for (var index in json.bodies) {
			this.bodies[index] = new Body(index, json.bodies[index].name, json.bodies[index].acronym, json.bodies[index].icon, json.bodies[index].color);
		}

		//Create subject+s
		this.days = {
			"monday": [],
			"tuesday": [],
			"wednesday": [],
			"thursday": [],
			"friday": [],
			"saturday": [],
			"sunday": []
		};

		for (var timetableIndex in json.timetable) {
			//loop through timetable days
			for (var subjectIndex in json.timetable[timetableIndex]) {
				//Loop through day subjects
				var subjectBodies = [];
				for (var j = 0; j < json.timetable[timetableIndex][subjectIndex].bodies.length; j++) {
					subjectBodies.push(new SubjectBody(
						this.bodies[json.timetable[timetableIndex][subjectIndex].bodies[j].bodyId],
						this.teachers[json.timetable[timetableIndex][subjectIndex].bodies[j].teacherId],
						this.locations[json.timetable[timetableIndex][subjectIndex].bodies[j].locationId]
					));
				}

				this.days[timetableIndex].push(new Subject(
					json.timetable[timetableIndex][subjectIndex].id,
					this.getIndexByName(timetableIndex),
					json.timetable[timetableIndex][subjectIndex].number,
					new Time(json.timetable[timetableIndex][subjectIndex].startTime),
					new Time(json.timetable[timetableIndex][subjectIndex].endTime),
					subjectBodies
				));
			}
		}

		// console.log("==TIMETABLE==");
		// console.log(JSON.stringify(this.toArray()));
	}

	placeTimetableOn(_element) {
		//Calculate nuberof rows
		this.number = Math.floor($(_element).width() / 350);
		this.timetableDayWidth = $(_element).width() / this.number - 4;
		//-4px for margin: 2px 0;

		$(_element).replaceWith(this.toElement(this.number, this.timetableDayWidth));

		$(this.element).find(".ttSubjectBody").each(function () {
			$(this).data("SubjectBody").resize();
		});
	}
	generateDay(_dayIndex) {
		//Variables
		var day = this.days[this.getNameByIndex(_dayIndex)];
		var dayElement = $('<div class="timetableDay"></div>');

		//If day is empty, return
		if (day.length == 0) {
			return $(dayElement);
		}


		//If isEditor - add insertSubject on top
		if (this.isEditor) {
			$(dayElement).append('<div class="insertSubject' + (i == 0 ? " top" : "") + '"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
		}

		//Loop through subjects
		for (var i = 0; i < day.length; i++) {

			//Generate subject
			var subject = day[i].toElement(this.isEditor);
			if (this.isEditor) {
				this.setupSubjectSortable(subject);
			}
			$(dayElement).append(subject);

			//If isEditor - add inserSubject
			if (this.isEditor) {
				$(dayElement).append('<div class="insertSubject' + (i + 1 == day.length ? " bottom" : "") + '"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
			}
		}

		$(dayElement).data("dayIndex", _dayIndex).data("dayName", this.getNameByIndex(_dayIndex));
		this.setupTimetableDaySortable(dayElement);

		return $(dayElement);
	}

	toElement(_number, _timetableDayWidth) {

		//Create basic header
		this.element = $('<div class="ttTimetableRow' + (this.isEditor ? " timetableEditor" : "") + '"></div>');

		//Header
		$(this.element).html('<div class="ttHeader"><div class="card-1 unselectable leftArrow"><i class="material-icons">keyboard_arrow_left</i></div></div>');

		if (_number <= 1) {
			var currentHeaderDay = $('<div class="ttHeaderDay card-1">' + getDayById(this.activeDay) + '</div>');
			$(this.element).children(".ttHeader").append($(currentHeaderDay).addClass("both"));

		} else {
			var loop = _number

			for (var i = 0; i < loop; i++) {
				if (loop - _number > 7) {
					console.log("Break loop");
					for (var j = 0; j < _number; j++) {
						var currentHeaderDay = $('<div class="ttHeaderDay card-1">' + getDayById(this.activeDay + j) + '</div>');
						if (j - (loop - _number) == 0 || j + 1 == loop) {
							$(currentHeaderDay).addClass("one");
						} else {
							$(currentHeaderDay).width(_timetableDayWidth);
						}
						$(this.element).children(".ttHeader").append($(currentHeaderDay));
					}
					break;
				}
				if (Object.keys(this.days[this.getNameByIndex(this.activeDay + i)]).length == 0) {
					loop++;
				} else {
					var currentHeaderDay = $('<div class="ttHeaderDay card-1">' + getDayById(this.activeDay + i + loop - _number) + '</div>');
					$(this.element).children(".ttHeader").append($(currentHeaderDay));
					if (i - (loop - _number) == 0 || i + 1 == loop) {
						$(currentHeaderDay).width(_timetableDayWidth - 32);
					} else {
						$(currentHeaderDay).width(_timetableDayWidth);
					}
				}
			}
		}
		$(this.element).children(".ttHeader").append('<div class="card-1 unselectable rightArrow"><i class="material-icons">keyboard_arrow_right</i></div>');

		//Body
		if (_number <= 1) {
			var timetableDay = this.generateDay(this.activeDay);
			$(this.element).append($(timetableDay));
		} else {
			var loop = _number;
			for (var i = 0; i < loop; i++) {
				if (loop - _number > 7) {
					for (var j = 0; j < _number; j++) {
						$(this.element).append($("<div class='timetableDay'></div>"));
					}
					console.log("Break loop");
					break;
				}
				if (this.days[this.getNameByIndex(this.activeDay + i)].length == 0) {
					loop++;
				} else {

					var timetableDay = this.generateDay(this.activeDay + i);

					$(this.element).append($(timetableDay));

					$(timetableDay).width(_timetableDayWidth - 2);


				}
			}
		}
		this.addListeners();
		return $(this.element).data("Timetable", this);
	}


	toArray() {

		console.log(this);

		var returnArray = {
			bodies: jQuery.extend(true, {}, this.bodies),
			locations: jQuery.extend(true, {}, this.locations),
			teachers: jQuery.extend(true, {}, this.teachers)
		};

		var subjects = [];

		//loop through subjects
		for (var index in this.days) {

			for (var i = 0; i < this.days[index].length; i++) {
				var currentSubject = {
					id: this.days[index][i].id,
					dayIndex: this.days[index][i].dayIndex,
					number: this.days[index][i].number,
					startTime: this.days[index][i].startTime.getTime(),
					endTime: this.days[index][i].endTime.getTime(),
					bodies: []
				};

				//parse bodies
				for (var j = 0; j < this.days[index][i].bodies.length; j++) {
					var currentSubjectBody = this.days[index][i].bodies[j];

					currentSubject.bodies[j] = {
						bodyId: currentSubjectBody.body.id,
						teacherId: currentSubjectBody.teacher.id,
						locationId: currentSubjectBody.location.id
					}

					//Check body
					if (returnArray.bodies[currentSubjectBody.body.id] == undefined) {
						//add body to bodies array if not exists
						console.log("Adding body. ID: " + currentSubjectBody.body.id);
						returnArray.bodies[currentSubjectBody.body.id] = currentSubjectBody.body;
					}

					//Check teacher
					if (returnArray.teachers[currentSubjectBody.teacher.id] == undefined) {
						//add body to bodies array if not exists
						console.log("Adding teacher. ID: " + currentSubjectBody.teacher.id);
						returnArray.teachers[currentSubjectBody.teacher.id] = currentSubjectBody.teacher;
					}


					//Check location
					if (returnArray.locations[currentSubjectBody.location.id] == undefined) {
						//add location to locations array if not exists
						console.log("Adding location. ID: " + currentSubjectBody.location.id);
						returnArray.locations[currentSubjectBody.location.id] = currentSubjectBody.location;
					}
				}

				subjects.push(currentSubject);
			}

		}
		returnArray.subjects = subjects;

		console.log(returnArray);

		return returnArray;

	}

	//Listeners
	addListeners() {
		console.log("Add listeners");
		var that = this;

		//Left Arrow
		$(this.element).find(".ttHeader > .leftArrow").click(function () {
			console.log("Left Arrow");
			// that.saveDay();
			var notChanged = true;
			while (notChanged) {
				that.activeDay--;
				if (that.activeDay < 0) {
					that.activeDay += 6;
				}
				if (Object.keys(that.days[that.getNameByIndex(that.activeDay)]).length != 0) {
					notChanged = false;
				}
			}

			// TODO: Add call for disable timetable options function

			$(that.element).replaceWith(that.toElement(that.number, that.timetableDayWidth));

		});

		//Right arrow
		$(this.element).find(".ttHeader > .rightArrow").click(function () {
			console.log("Right Arrow");

			// that.saveDay();
			var notChanged = true;
			while (notChanged) {
				console.log("Active day: " + that.activeDay);
				that.activeDay++;
				if (that.activeDay > 6) {
					that.activeDay -= 6;
				}
				console.log("Active day after: " + that.activeDay);
				if (Object.keys(that.days[that.getNameByIndex(that.activeDay)]).length != 0) {
					notChanged = false;
				}
			}

			// TODO: Add call for disable timetable options function

			$(that.element).replaceWith(that.toElement(that.number, that.timetableDayWidth));
		});

		//Add listeners for every .insertSubjectBody button between subjects
		var subjectBodyInsertButtons = this.element.find(".insertSubjectBody"); //Select all element with class .insertSubjectBody and store them in array
		for (var i = 0; i < subjectBodyInsertButtons.length; i++) { //Loop through ^ elements                                         ^
			this.addInsertSubjectBodyListener($(subjectBodyInsertButtons[i])); //Call addInsertSubjectBodyListener() for every element stored in ^ array;
		}

		//Add listeners for every .insertSubject button between subjects
		var subjectInsertButtons = this.element.find(".insertSubject"); //Select all element with class .insertSubject and store them in array
		for (var i = 0; i < subjectInsertButtons.length; i++) { //Loop through ^ elements                                     ^
			this.addInsertSubjectListener($(subjectInsertButtons[i])); //Call addInsertSubjectListener() for every element stored in ^ array;
		}
	}

	addInsertSubjectBodyListener(_element) {
		var that = this;
		$(_element).click(function () {
			var firstInsertBodyElement;
			var lastInsertBodyElement;
			var referenceBodyId;
			var subject = $(this).parent().parent().data("Subject");
			var newSubjectBody = new SubjectBody(new Body(-1 * that.newBodyIdMultiplier, "", "", null, null), new Teacher(-1 * that.newTeacherIdMultiplier, "", "", null, null), new Location(-1 * that.newLocationIdMultiplier, "", null));

			if ($(this).hasClass("bottom")) {

				//If this element is bottom
				firstInsertBodyElement = $('<div class="insertSubjectBody"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
				lastInsertBodyElement = $('<div class="insertSubjectBody bottom"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
				referenceBodyId = $(this).prev(".ttSubjectBody").data("SubjectBody").id; //Find id of reference body

				subject.bodies.push(newSubjectBody); //Push newSubjectBody object on end of bodies array
				//No need to find corrent position, because it's bottom insert emelent so it's last position

			} else {
				if ($(this).hasClass("top")) {
					//If this element is top
					firstInsertBodyElement = $('<div class="insertSubjectBody top"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
					lastInsertBodyElement = $('<div class="insertSubjectBody"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
				} else {
					//If this element is not top
					firstInsertBodyElement = $('<div class="insertSubjectBody"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
					lastInsertBodyElement = $('<div class="insertSubjectBody"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
				}

				for (var i = 0; i < subject.bodies.length; i++) { //Loop through all bodies of current subject
					if (subject.bodies[i].id == referenceBodyId) { //Check if current's body id is same as reference body id
						subject.bodies.splice(i, 0, newSubjectBody); //If ^ is true insert newSubjectBody before reference body
						break; //Stop the loop
					}
				}
			}

			//Add listeners for newly created insertSubjectBody element
			that.addInsertSubjectBodyListener($(firstInsertBodyElement));
			that.addInsertSubjectBodyListener($(lastInsertBodyElement));


			//Add firstInsertBodyElement, newSubjectBody and lastInsertBodyElement after $(this) and than removes it
			$(this).after($(lastInsertBodyElement)).after(newSubjectBody.toElement()).after($(firstInsertBodyElement)).remove();
			newSubjectBody.element.find(".ttSubjectIcon").html('<i class="material-icons">school</i>');

			//Set changed
			newSubjectBody.body.changed = true;
			newSubjectBody.teacher.changed = true;
			newSubjectBody.location.changed = true;

			//Add subjectBody stuff to timetable's arrays
			that.locations[newSubjectBody.location.id] = newSubjectBody.location;
			that.teachers[newSubjectBody.teacher.id] = newSubjectBody.teacher;
			that.bodies[newSubjectBody.body.id] = newSubjectBody.body;

			//Trigger click so that user can edit it right awayA
			$(newSubjectBody.element).trigger("click");

			//Call resize function on newSubjectBody
			newSubjectBody.resize();


		});
	}

	addInsertSubjectListener(_element) {
		var that = this; //Reference for later
		$(_element).click(function () {
			var firstInsertSubjectElement; //Variable for first button that will be on top of inserted SubjectBody
			var lastInsertSubjectElement; //Variable for first button that will be bottom of inserted SubjectBody
			var newSubject = new Subject(-1, that.activeDay, 0, new Time("00:00"), new Time("00:00"), [new SubjectBody(new Body(-1 * that.newBodyIdMultiplier, "", "", null, null), new Teacher(-1 * that.newTeacherIdMultiplier, "", "", null, null), new Location(-1 * that.newLocationIdMultiplier, "", null))]);
			var day = that.days[that.getNameByIndex(that.activeDay)];
			var referenceSubjectId;

			if ($(this).hasClass("insertFirstSubject")) {
				firstInsertSubjectElement = $('<div class="insertSubject top"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
				lastInsertSubjectElement = $('<div class="insertSubject bottom"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');

				day.push(newSubject);
			} else {
				if ($(this).hasClass("top")) {
					//If this element is top
					firstInsertSubjectElement = $('<div class="insertSubject top"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
					lastInsertSubjectElement = $('<div class="insertSubject"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
					day.push(newSubject);
				} else {
					//Check if $(this) element is bottom
					if ($(this).hasClass("bottom")) {
						//If $(this) element is bottom
						firstInsertSubjectElement = $('<div class="insertSubject"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
						lastInsertSubjectElement = $('<div class="insertSubject bottom"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');

						//Useless for now
						//referenceSubjectId = $(this).prev(".ttSubject").data("Subject").id; //Find id of reference subject

						day.push(newSubject); //Push newSubjectBody object on end of subjects array

					} else {
						//If $(this) element is not bottom
						if ($(this).hasClass("top")) {
							//If this element is top
							firstInsertSubjectElement = $('<div class="insertSubject top"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
							lastInsertSubjectElement = $('<div class="insertSubject"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
						} else {
							//If this element is not top
							firstInsertSubjectElement = $('<div class="insertSubject"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
							lastInsertSubjectElement = $('<div class="insertSubject"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
						}

						referenceSubjectId = $(this).next(".ttSubject").data("Subject").id; //Find id of reference subject

						for (var i = 0; i < day.length; i++) { //Loop through all bodies of current subject
							console.log("-Loop id: " + day[i].id);
							if (day[i].id == referenceSubjectId) { //Check if current's body id is same as reference body id
								day.splice(i, 0, newSubject); //If ^ is true insert newSubjectBody before reference body
								break; //Stop the loop
							}
						}
					}
				}
			}

			//Add listeners for newly created insertSubject elements
			that.addInsertSubjectListener($(firstInsertSubjectElement));
			that.addInsertSubjectListener($(lastInsertSubjectElement));


			var newSubjectElement; //Variable to store newly created element of newSubject
			//Add firstInsertSubjectElement, newSubject and lastInsertSubjectElement after $(this) and than removes it
			$(this).after($(lastInsertSubjectElement)).after(newSubjectElement = newSubject.toElement(true)).after($(firstInsertSubjectElement)).remove();

			//Add subject's subjectBody's stuff to timetable's arrays
			that.locations[newSubject.bodies[0].location.id] = newSubject.bodies[0].location;
			that.teachers[newSubject.bodies[0].teacher.id] = newSubject.bodies[0].teacher;
			that.bodies[newSubject.bodies[0].body.id] = newSubject.bodies[0].body;

			//Set change
			newSubject.changed = true;
			newSubject.bodies[0].body.changed = true;
			newSubject.bodies[0].location.changed = true;
			newSubject.bodies[0].teacher.changed = true;

			//Trigger click so that user can edit it right away
			$(newSubject.bodies[0].element).trigger("click");

			//Call resize function on newSubject's frist/only body
			newSubject.bodies[0].resize();

			//Add listeners for newly created insertSubject elements
			$(newSubjectElement).find(".insertSubjectBody").each(function () { //Loop through all of the .insertSubjectBody elements inside of newSubject and add listeners to them
				that.addInsertSubjectBodyListener($(this));
			});

		});
	}

	setupSubjectSortable(_element) {

		//Setup fixed height for TimetableDay so when last item is dragged it don't scroll wierdly
		//FIX ME: Adding extra space on bottom
		var height = 0;
		$(_element).parent().children().each(function () {
			height += $(this).height();
		});
		$(_element).parent().height(height == 0 ? "auto" : height);

		var inserts; //Variable to store all of the InserSubjectBody elements
		var that = this; //Reference for later
		$(_element).children(".bodiesSortable").sortable({
			axis: "y", //Enable dragging only by y axis
			items: '.ttSubjectBody', //Selector for elements that can be dragged
			helper: 'clone', //While dragging use clone of element for helper, not original element. This'll remove bug that while dragging helper si moved to left edge of container
			distance: 15, //sorting will not start until after mouse is dragged beyond 15 pixels
			start: function (event, ui) { //Function called on start of drag;
				inserts = $(this).children(".insertSubjectBody").detach(); //store all .insertBodySubject elements in variable and detach them
			},
			stop: function (event, ui) { //Function called on start of drag
				var currentSubject = $(this).parent().data("Subject");
				var currentSubjectBody = $(ui.item).data("SubjectBody");

				currentSubject.bodies.splice(currentSubject.bodies.indexOf(currentSubjectBody), 1); //Remove currently dragged body from array
				currentSubject.bodies.splice($(ui.item).parent().children().index($(ui.item)), 0, currentSubjectBody); //Add currently dragged object to new position in array

				//After bodies are reorganised, add inserts
				$(this).children(".ttSubjectBody").each(function (i, val) {
					$(this).before(inserts[i]); //Put one insert before every body in subject
				});
				$(this).children(".ttSubjectBody").last().after(inserts[inserts.length - 1]); //Put last insert after last body in subject
			}
		});

	}
	setupTimetableDaySortable(_element) {

		//Setup fixed height for _element(TimetableDay) so when last item is dragged it don't scroll wierdly
		var height = 0;
		$(_element).children().each(function () {
			height += $(this).height();
		});
		$(_element).height(height == 0 ? "auto" : height);

		var inserts; //Variable to store all of the InserSubjectBody elements
		var that = this; //Reference for later

		$(_element).sortable({
			axis: "y", //Enable dragging only by y axis
			items: '.ttSubject', //Selector for elements that can be dragged
			distance: 15, //sorting will not start until after mouse is dragged beyond 15 pixels
			start: function (event, ui) { //Function called on start of drag
				inserts = $(this).children(".insertSubject").detach(); //store all .insertSubject elements in variable and detach them
			},
			stop: function (event, ui) { //Function called on end of drag


				var currentSubject = $(ui.item).data("Subject");
				var currentDay = that.days[that.getNameByIndex(that.activeDay)];

				currentDay.splice(currentDay.indexOf(currentSubject), 1); //Remove currently dragged body from array
				currentDay.splice($(ui.item).parent().children().index($(ui.item)), 0, currentSubject); //Add currently dragged object to new position in array

				//After bodies are reorganised, add inserts
				$(this).children(".ttSubject").each(function (i, val) {
					$(this).before(inserts[i]); //Put one insert before every body in subject
				});
				$(this).children(".ttSubject").last().after(inserts[inserts.length - 1]); //Put last insert after last body in subject
			}
		});
	}

	getTimetableSubjects() {
		return $.merge(this.days.sunday, this.days.monday, this.days.tuesday, this.days.wednesday, this.days.thursday, this.days.friday, this.days.saturday);
	}

	//Utility
	getDayByIndex(_index) {
		var dayIndex = this.activeDay + _index;
		if (dayIndex > 6) {
			dayIndex -= 6;
		}
		return this.days[dayIndex];
	}

	getIndexByName(_name) {
		switch (_name) {
			case "monday":
				return 1;
			case "tuesday":
				return 2;
			case "wednesday":
				return 3;
			case "thursday":
				return 4;
			case "friday":
				return 5;
			case "saturday":
				return 6;
			case "sunday":
				return 0;
			default:
				console.log("Unknow index: " + _index);
				return;
		}
	}
	getNameByIndex(_index) {
		if (_index > 6) {
			while (_index > 6) {
				_index -= 6;
			}
		} else if (_index < 0) {
			while (_index < 0) {
				_index += 6;
			}
		}

		switch (_index) {
			case 0:
				return "sunday";
			case 1:
				return "monday";
			case 2:
				return "tuesday";
			case 3:
				return "wednesday";
			case 4:
				return "thursday";
			case 5:
				return "friday";
			case 6:
				return "saturday";
			default:
				console.log("Unknow index: " + _index);
				return;
		}
	}
}
