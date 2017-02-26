function loadFromUrl(){

	var hash = window.location.hash.substr(1).split("/");

	/*
	1:	Messages
	*/

	switch(hash[0]){
		case "reminders":
			remindersClick();
			break;
		case "addclass":
			addClassClick();
			break;
		case "class":
			console.log("HASH[2]: " + hash[2]);
			switch(hash[2]) {
				case "timetable":
					newClassClick(hash[1], 1);
					break;
				case "messages":
					newClassClick(hash[1], 2);
					break;
				case "groups":
					newClassClick(hash[1], 3);
					break;
				case "uploads":
				default:
					newClassClick(hash[1]);
					break;
			}
			break;
		case "account":
			accountClick();
			break;
		default:
			window.location.hash = "";
			homeClick();
			break;

	}
}
