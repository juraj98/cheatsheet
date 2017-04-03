class Teacher {
  constructor(_id, _name, _surname, _description, _image) {
    this.id = _id;
    this.name = _name;
    this.surname = _surname;
    this.description = _description;
    this.image = _image;
  }

  getFullName(){
      return this.name + " " + this.surname;
  }
}
