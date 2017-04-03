
class SubjectBody {
  constructor(_body, _teacher, _location, _changed = false) {
    this.body = _body;
    this.teacher = _teacher;
    this.location = _location;
    if(_changed)
      this.changed = true;
    this.notificationArea = new SubjectNotificationArea(this.changed);
  }

  toElement() {
    //Create element
    this.element = $('<div class="ttSubjectBody"><div' +  (this.body.color ? ' style="background-color:' + this.body.color + ';"' : "") + ' class="ttSubjectIcon unselectable card-1"></div><span class="ttSubjectName"></span><span class="ttSubjectInfo"></span></div>');

    //Add data
    //Icon
    if(this.body.icon){
      //Icon is set
      $(this.element).find(".ttSubjectIcon").html('<i class="material-icons">' + this.body.icon + '</i>');
    } else {
      //Add first letter of acronym
      $(this.element).find(".ttSubjectIcon").html(this.body.acronym.charAt(0).toUpperCase());
    }
    //Name
    $(this.element).find(".ttSubjectName").html(this.body.name);

    //Info
    if(this.teacher && this.location) {
      $(this.element).find(".ttSubjectInfo").html(this.teacher.getFullName() + " - " + this.location.name);
    } else {
      if(this.teacher){
        $(this.element).find(".ttSubjectInfo").html(this.teacher.getFullName());
      } else {
        $(this.element).find(".ttSubjectInfo").html(this.location.name);
      }
    }

    //Add notificationArea
    $(this.element).append(this.notificationArea.toElement());

		return $(this.element).data("SubjectBody", this);

  }

  resize(){
    $(this.element).children(".ttSubjectIcon").css("margin-top", ($(this.element).height() - 50)/2)
  }



}
