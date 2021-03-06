class Subject {

  /*
  Variables:
  this.id
  this.dayIndex
  this.number

  this.startTime = new Time()
  this.endTime = new Time()

  this.bodies = []

  this.element
  */

  constructor(_id, _dayIndex, _number, _startTime, _endTime, _bodies) {
    this.id = _id;
    this.dayIndex = _dayIndex;
    this.number = _number;
    this.startTime = _startTime;
    this.endTime = _endTime;
    this.bodies = _bodies;
  }

  toElement(_isEditor){
    //Create basic jQuery element(.ttSubject);
    this.element = $('<div class="ttSubject card-1"></div>');

    //Create start of innerHTML for element
    var elementHTML = '<div class="ttSubjectHeader"><div class="number"><span>' + this.number + '</span>. Lesson</div><div class="time"><span class="start">' + this.startTime.getTime() + '</span> - <span class="end">' + this.endTime.getTime() + '</span></div></div><div class="bodiesSortable"></div>';

    //Insert innerHTML to element
    $(this.element).html(elementHTML);
    var elementBodiesDiv = $(this.element).children(".bodiesSortable");

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

    return $(this.element).data("Subject", this);
  }
}
