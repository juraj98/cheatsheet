class Timetable {
	/*
	Variables:
	  this.monday
	  this.tuesday
	  this.wednesday
	  this.thursday
	  this.friday
	  this.saturday
	  this.sunday

	  this.element
	  this.date
	  this.isEditor
	*/
	//Constructor
	constructor(_json, _isEditor, _date, _mondayJSON = null, _tuesdayJSON = null, _wednesdayJSON = null, _thursdayJSON = null, _fridayJSON = null, _saturdayJSON = null, _sundayJSON = null) {
		if (_json) {
			this.updateViaJSON(_json);
		} else {
			this.updateViaDays(_mondayJSON, _tuesdayJSON, _wednesdayJSON, _thursdayJSON, _fridayJSON, _saturdayJSON, _sundayJSON);
		}
		if (_date) {
			this.date = _date;
		} else {
			this.date = new Date();
		}
		this.isEditor = _isEditor;
	}

	//Updates
	updateViaJSON(_json) {
		_json = JSON.parse(_json);
		if (_json["monday"] || true) {
			this.monday = new TimetableDay(JSON.stringify(_json["monday"]));
		} else {
			this.monday = null;
		}
		if (_json["tuesday"] || true) {
			this.tuesday = new TimetableDay(JSON.stringify(_json["tuesday"]));
		} else {
			this.tuesday = null;
		}
		if (_json["wednesday"] || true) {
			this.wednesday = new TimetableDay(JSON.stringify(_json["wednesday"]));
		} else {
			this.wednesday = null;
		}
		if (_json["thursday"] || true) {
			this.thursday = new TimetableDay(JSON.stringify(_json["thursday"]));
		} else {
			this.thursday = null;
		}
		if (_json["friday"] || true) {
			this.friday = new TimetableDay(JSON.stringify(_json["friday"]));
		} else {
			this.friday = null;
		}
		if (_json["saturday"] || true) {
			this.saturday = new TimetableDay(JSON.stringify(_json["saturday"]));
		} else {
			this.saturday = null;
		}
		if (_json["sunday"] || true) {
			this.sunday = new TimetableDay(JSON.stringify(_json["sunday"]));
		} else {
			this.sunday = null;
		}
	}
	updateViaDays(_mondayJSON = null, _tuesdayJSON = null, _wednesdayJSON = null, _thursdayJSON = null, _fridayJSON = null, _saturdayJSON = null, _sundayJSON = null) {
		this.monday = new TimetableDay(_moday);
		this.tuesday = new TimetableDay(_tuesday);
		this.wednesday = new TimetableDay(_wednesday);
		this.thursday = new TimetableDay(_thursday);
		this.friday = new TimetableDay(_friday);
		this.saturday = new TimetableDay(_saturday);
		this.sunday = new TimetableDay(_sunday);
	}

	//Listeners
	addListeners() { //It's called just once on end of toElement();
		//Reference for this for functions in listeners
		var that = this;

		//Click listener for left arrow in header
		this.element.find(".ttHeader > .leftArrow").click(function () {
			var notChanged = true;
			while (notChanged) {
				that.date.setTime(that.date.getTime() - (24 * 60 * 60 * 1000));
				if (that.getCurrentTimetableDay().subjects.length != 0) {
					notChanged = false;
				}
			}
			//Disable subject options

			subjectOptionActivated = false;
			$(".teSubjectOptions").children().each(function () {
				$(this).addClass("disabled");
			});

			if (editingBody) {
				$(editingBody.notificationArea.editingElement).css("display", "none");
				editingBody.notificationArea.editing = false;
				editingBody.resize();
			}
			editingBody = null;
			$(that.element).replaceWith(that.toElement());
		});

		//Click listener for right arrow in header
		this.element.find(".ttHeader > .rightArrow").click(function () {
			var notChanged = true;
			while (notChanged) {
				that.date.setTime(that.date.getTime() + (24 * 60 * 60 * 1000));
				if (that.getCurrentTimetableDay().subjects.length != 0) {
					notChanged = false;
				}
			}

			//Disable subject options
			if (subjectOptionActivated) {
				subjectOptionActivated = false;
				$(".teSubjectOptions").children(".disabled").each(function () {
					$(this).addClass("disabled");
				});
			}
			if (editingBody) {
				$(editingBody.notificationArea.editingElement).css("display", "none");
				editingBody.notificationArea.editing = false;
				editingBody.resize();
			}
			editingBody = null;
			$(that.element).replaceWith(that.toElement());
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

	addInsertSubjectBodyListener(_element) { //Setup click listener for inserting subject body for _element
		var that = this; //Reference for later
		$(_element).click(function () {
			//variables
			var currentTimetableDay = that.getCurrentTimetableDay(), //Save reference of current displayed TimetableDay object for later
				firstInsertBodyElement, //Variable for first button that will be on top of inserted SubjectBody
				lastInsertBodyElement, //Variable for first button that will be bottom of inserted SubjectBody
				referenceBodyId; //Variable for body's id that will be used as reference to inserted body
			var subjectId = $(this).parent().parent().data("Subject").id; //Id of subject in with is .insertSubjectBody button
			var newBodyId = Math.max.apply(Math, that.findInCurrentTimetableDay(currentTimetableDay, subjectId).usedIds) + 1, //Id of body currently being inserted - created by incrementing currently biggest used id by 1

				newSubjectBody = new SubjectBody(null, newBodyId, "", "", "", "", true); //New subjectBody object

			that.findInCurrentTimetableDay(currentTimetableDay, subjectId).usedIds.push(newBodyId);

			//Check if $(this) element is bottom
			if ($(this).hasClass("bottom")) {

				//If this element is bottom
				firstInsertBodyElement = $('<div class="insertSubjectBody"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
				lastInsertBodyElement = $('<div class="insertSubjectBody bottom"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');

				referenceBodyId = $(this).prev(".ttSubjectBody").data("SubjectBody").id; //Find id of reference body

				that.findInCurrentTimetableDay(currentTimetableDay, subjectId).bodies.push(newSubjectBody); //Push newSubjectBody object on end of bodies array

			} else {

				//If this element is not bottom
				if ($(this).hasClass("top")) {
					//If this element is top
					firstInsertBodyElement = $('<div class="insertSubjectBody top"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
					lastInsertBodyElement = $('<div class="insertSubjectBody"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
				} else {
					//If this element is not top
					firstInsertBodyElement = $('<div class="insertSubjectBody"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
					lastInsertBodyElement = $('<div class="insertSubjectBody"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
				}

				referenceBodyId = $(this).next(".ttSubjectBody").data("SubjectBody").id; //Find id of reference body

				for (var i = 0; i < that.findInCurrentTimetableDay(currentTimetableDay, subjectId).bodies.length; i++) { //Loop through all bodies of current subject
					if (that.findInCurrentTimetableDay(currentTimetableDay, subjectId).bodies[i].id == referenceBodyId) { //Check if current's body id is same as reference body id
						that.findInCurrentTimetableDay(currentTimetableDay, subjectId).bodies.splice(i, 0, newSubjectBody); //If ^ is true insert newSubjectBody before reference body
						break; //Stop the loop
					}
				}
			}

			//Add listeners for newly created insertSubjectBody element
			that.addInsertSubjectBodyListener($(firstInsertBodyElement));
			that.addInsertSubjectBodyListener($(lastInsertBodyElement));


			//Add firstInsertBodyElement, newSubjectBody and lastInsertBodyElement after $(this) and than removes it
			$(this).after($(lastInsertBodyElement)).after(newSubjectBody.toElement()).after($(firstInsertBodyElement)).remove();

			//Trigger click so that user can edit it right awayA
			$(newSubjectBody.element).trigger("click");

			//Call resize function on newSubjectBody
			newSubjectBody.resize();
		});
	}
	addInsertSubjectListener(_element) {
		var that = this; //Reference for later
		$(_element).click(function () {
			//variables
			var currentTimetableDay = that.getCurrentTimetableDay(), //Save reference of current displayed TimetableDay object for later
				newSubjectId; //if starting from 0 this will make sure that newSubjectId will be always bigger by one of last userdId
			if (currentTimetableDay.usedIds.length == 0) {
				newSubjectId = 0;
			} else {
				newSubjectId = Math.max.apply(Math, currentTimetableDay.usedIds) + 1;
			}
			var newSubjectNumber = "1", //Number for subject TODO: Add automatic calculation
				newSubjectStart = "00:00", //Start of subject TODO: Add automatic calculation
				newSubjectEnd = "00:00", //End of subject TODO: Add automatic calculation
				referenceSubjectId, //Variable for body's id that will be used as reference to inserted body
				firstInsertSubjectElement, //Variable for first button that will be on top of inserted SubjectBody
				lastInsertSubjectElement, //Variable for first button that will be bottom of inserted SubjectBody
				newSubjectBody = new SubjectBody(null, 0, "", "", "", "", true), //New subjectBody object
				newSubject = new Subject(null, newSubjectId, newSubjectNumber, newSubjectStart, newSubjectEnd, "[" + newSubjectBody.toJSON() + "]"); //New subjectBody object

			//If it's first in TimetableDay
			currentTimetableDay.usedIds.push(newSubjectId);

			//Check if $(this) element should add first subject
			if ($(this).hasClass("insertFirstSubject")) {
				firstInsertSubjectElement = $('<div class="insertSubject top"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
				lastInsertSubjectElement = $('<div class="insertSubject bottom"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');

				currentTimetableDay.subjects.push(newSubject); //Push newSubjectBody object on end of subjects array
			} else {
				//Check if $(this) element is bottom
				if ($(this).hasClass("bottom")) {
					//If $(this) element is bottom
					firstInsertSubjectElement = $('<div class="insertSubject"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');
					lastInsertSubjectElement = $('<div class="insertSubject bottom"><span class="blockText  unselectable" unselectable="on">Add new subject</span></div>');

					//Useless for now
					//referenceSubjectId = $(this).prev(".ttSubject").data("Subject").id; //Find id of reference subject

					currentTimetableDay.subjects.push(newSubject); //Push newSubjectBody object on end of subjects array

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

					for (var i = 0; i < currentTimetableDay.subjects.length; i++) { //Loop through all bodies of current subject
						if (currentTimetableDay.subjects[i].id == referenceSubjectId) { //Check if current's body id is same as reference body id
							currentTimetableDay.subjects.splice(i, 0, newSubject); //If ^ is true insert newSubjectBody before reference body
							break; //Stop the loop
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

			//Trigger click so that user can edit it right awayA
			$(newSubject.bodies[0].element).trigger("click");

			//Call resize function on newSubject's frist/only body
			newSubject.bodies[0].resize();

			//Setup new subject to be sortable
			that.setupSubjectSortable($(newSubjectElement));

			//Add listeners for newly created insertSubject elements
			$(newSubjectElement).find(".insertSubjectBody").each(function () { //Loop through all of the .insertSubjectBody elements inside of newSubject and add listeners to them
				that.addInsertSubjectBodyListener($(this));
			});

			//TO-DO: Call that.setupSortableBodies() and that.setupSortableSubjects() function
		});
	}

	//Sortable
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
				var currentTimetableDay = that.getCurrentTimetableDay(); //Store currentTimetableDay in variable
				var currentSubjectId = $(_element).data("Subject").id; //Get id of current subject
				for (var i = 0; i < currentTimetableDay.subjects[currentSubjectId].bodies.length; i++) { //loop through all bodies of current subject
					//Loop through bodies until current body id is equal to id of dragged body
					if (currentTimetableDay.subjects[currentSubjectId].bodies[i].id == ui.item.data("SubjectBody").id) {

						var draggedBodyObject = currentTimetableDay.subjects[currentSubjectId].bodies[i]; //Save currently dragged body to variable
						currentTimetableDay.subjects[currentSubjectId].bodies.splice(i, 1); //Remove currently dragged body from array
						currentTimetableDay.subjects[currentSubjectId].bodies.splice($(ui.item).parent().children().index($(ui.item)), 0, draggedBodyObject); //Add currently dragged object to new position in array
						break; //Break loop
					}
				}
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

				for (var i = 0; i < $(this).data("TimetableDay").subjects.length; i++) { //loop through all subjects of current TimetableDay
					//Loop through subjects until current subject id is equal to id of dragged subject
					if ($(this).data("TimetableDay").subjects[i].id == ui.item.attr("ttOptionSubjetId")) {

						var draggedSubjectObject = $(this).data("TimetableDay").subjects[i]; //Save currently dragged subject to variable
						$(this).data("TimetableDay").subjects.splice(i, 1); //Remove currently dragged subject from array
						$(this).data("TimetableDay").subjects[i].splice($(ui.item).parent().children().index($(ui.item))); //Add currently dragged object to new position in array
						break; //Break loop
					}
				}
				//After bodies are reorganised, add inserts
				$(this).children(".ttSubject").each(function (i, val) {
					$(this).before(inserts[i]); //Put one insert before every body in subject
				});
				$(this).children(".ttSubject").last().after(inserts[inserts.length - 1]); //Put last insert after last body in subject
			}
		});
	}

	placeTimetableOn(_element) {

		//Calculate nuberof rows
		this.number = Math.floor($(_element).width() / 350);
		this.timetableDayWidth = $(_element).width() / this.number - 16;


		$(_element).replaceWith(this.toElement(this.number, this.timetableDayWidth));
		$(this.element).find(".ttSubjectBody").each(function () {
			$(this).data("SubjectBody").resize();
		});
	}
	//Resize |TODO: rework
	//	resize() {
	//		console.log("resize");
	//		this.element.each(function() {
	//			var that = $(this);
	//			$(this).find(".ttSubjectBody").each(function() {
	//
	//			});
	//		});
	//	}

	//To funtions
	toElement(_number, _width) {
		_number = this.number;
		_width = this.timetableDayWidth;


		//Main element
		var element = $('<div class="ttTimetableRow' + (this.isEditor ? " timetableEditor" : "") + '"></div>');
		//Header
		$(element).html('<div class="ttHeader"><div class="card-1 unselectable leftArrow"><i class="material-icons">keyboard_arrow_left</i></div></div>');

		if (_number <= 1) {
			var currentHeaderDay = $('<div class="ttHeaderDay card-1">' + getDayById(this.date.getDay()) + '</div>');
			$(element).children(".ttHeader").append($(currentHeaderDay));
			$(currentHeaderDay).width(_width - 58);

		} else {
			var loop = _number

			//Fix me: If timetable is empty this create infinite loop

			for (var i = 0; i < loop; i++) {
				if (this.getCurrentTimetableDay(i).subjects.length == 0) {
					loop++;
				} else {
					var currentHeaderDay = $('<div class="ttHeaderDay card-1">' + getDayById(this.date.getDay() + i) + '</div>');
					$(element).children(".ttHeader").append($(currentHeaderDay));
					if (i - (loop - _number) == 0 || i + 1 == loop) {
						$(currentHeaderDay).width(_width - 29);
					} else {
						$(currentHeaderDay).width(_width);
					}
				}
			}
		}

		$(element).children(".ttHeader").append('<div class="card-1 unselectable rightArrow"><i class="material-icons">keyboard_arrow_right</i></div>');


		if (_number <= 1) {
			if (this.getCurrentTimetableDay()) {
				$(element).append(this.getCurrentTimetableDay().toElement(this.isEditor));
			}
		} else {
			var loop = _number;

			for (var i = 0; i < loop; i++) {

				if (this.getCurrentTimetableDay(i).subjects.length == 0) {
					loop++;
				} else {
					var insertedTimetableDay = this.getCurrentTimetableDay(i).toElement(this.isEditor)
					$(element).append($(insertedTimetableDay));
					$(insertedTimetableDay).width(_width);
					if (i - (loop - _number) == 0) {
						$(insertedTimetableDay).css("margin-left", "0");
					} else if (i + 1 == loop) {
						$(insertedTimetableDay).css("margin-right", "0");
					}
				}

			}
		}

		$(element).width((_width + 4) * _number);

		$(element).data("Timetable", this)

		this.element = $(element);
		this.addListeners();

		if (this.isEditor) { //If this is timetableEditor call setup draggable functions
			var that = this;
			this.element.find(".ttSubject").each(function () {
				that.setupSubjectSortable($(this));
			});
			this.element.find(".timetableDay").each(function () {
				that.setupTimetableDaySortable($(this));
			});
		}

		return $(element);
	}

	toJSON() {
		return JSON.stringify(this.toArray());
	}
	toArray() {
		var array = {};
		//monday
		if (this.monday) {
			array["monday"] = this.monday.toArray();
		} else {
			array["monday"] = null;
		}
		//tuesday
		if (this.tuesday) {
			array["tuesday"] = this.tuesday.toArray();
		} else {
			array["tuesday"] = null;
		}
		//wednesday
		if (this.wednesday) {
			array["wednesday"] = this.wednesday.toArray();
		} else {
			array["wednesday"] = null;
		}
		//thursday
		if (this.thursday) {
			array["thursday"] = this.thursday.toArray();
		} else {
			array["thursday"] = null;
		}
		//friday
		if (this.friday) {
			array["friday"] = this.friday.toArray();
		} else {
			array["friday"] = null;
		}
		//saturday
		if (this.saturday) {
			array["saturday"] = this.saturday.toArray();
		} else {
			array["saturday"] = null;
		}
		//sunday
		if (this.sunday) {
			array["sunday"] = this.sunday.toArray();
		} else {
			array["sunday"] = null;
		}
		return array;
	}

	//Utility
	getCurrentTimetableDay(_difference = 0) {
		var index = this.date.getDay() + _difference;

		if (index < 0) {
			index += 7;
		} else if (index > 6) {
			index -= 7;
		}

		switch (index) {
			case 0:
				return this.sunday;
			case 1:
				return this.monday;
			case 2:
				return this.tuesday;
			case 3:
				return this.wednesday;
			case 4:
				return this.thursday;
			case 5:
				return this.friday;
			case 6:
				return this.saturday;
			default:
				console.error("Wrong index: " + index);
				return this.none;
		}
	}

	findInCurrentTimetableDay(_currentTimetableDay, _subjectId, _bodyId = null) {
		for (var currentSubjectIndex = 0; currentSubjectIndex < _currentTimetableDay.subjects.length; currentSubjectIndex++) {

			if (_currentTimetableDay.subjects[currentSubjectIndex].id == _subjectId) {
				if (_bodyId) {
					for (var currentBodyIndex = 0; currentBodyIndex < _currentTimetableDay.subjects[currentSubjectIndex].bodies.length; currentBodyIndex++) {
						if (_currentTimetableDay.subjects[currentSubjectIndex].bodies[currentBodyIndex].id == _bodyId) {
							return _currentTimetableDay.subjects[currentSubjectIndex].bodies[currentBodyIndex]
						}
					}

				} else {
					return _currentTimetableDay.subjects[currentSubjectIndex];
				}
			}

		}
	}


}
