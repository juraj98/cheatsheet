class Body {
  constructor(_id, _name, _acronym, _icon, _color) {
    this.id = _id;
    this.name = _name;
    this.acronym = _acronym;
    this.icon = _icon;
    this.color = _color;
  }

  toElement (){
    this.element = $('<div class="teBodyEditorItem card-1"><div class="teBodyEditorItemIcon unselectable card-1"></div><div class="teBodyEditorItemName"></div><div class="teBodyEditorItemAcronym"></div></div>');

    this.element.data("Body", this);

    this.updateElement();

    return this.element;
  }

  updateElement(){
    //name
    this.element.find(".teBodyEditorItemName").html(this.name);
    //acronym
    this.element.find(".teBodyEditorItemAcronym").html(this.acronym);
    //icon + color
    this.element.find(".teBodyEditorItemIcon").html(this.acronym.charAt(0).toUpperCase()).css("background-color", this.color);
  }
}
