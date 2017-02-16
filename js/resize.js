/*
10 - Home;		11 - Messages;	12 - Assignments;	13 - Homework;	14 - Notes;
20 - AddClass;	21 - Class Upload;		
30 - Account;	31 - Settings;
*/
page = 21;

function resizeInit() {
	console.info("%cFunction run:\t" + "%cresizeInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
    
	$(window).off("resize");

	//Content resize (Every page)

	switch (page) {
		//	case 10:
		//		$(windows).resize(
		//			homeResize()
		//		);
		//		break;
		//	case 11:
		//		$(windows).resize(
		//			messagesResize()
		//		);
		//		break;
		//	case 12:
		//		$(windows).resize(
		//			assignmentsResize()
		//		);
		//		break;
		//	case 13:
		//		$(windows).resize(
		//			homeworkResize()
		//		);
		//		break;
		//	case 14:
		//		$(windows).resize(
		//			notesResize()
		//		);
		//		break;
		//	case 20:
		//		$(windows).resize(
		//			addClassResize()
		//		);
		//		break;
	case 21:
		$(window).resize(function () {
			console.info("%cFunction run: " + "%cclassResize()", "color: #3F51B5; font-weight:700", "color: #3F51B5");
			classResize();
		});
		break;
		//	case 30:
		//		$(windows).resize(
		//			accountResize()
		//		);
		//		break;
		//	case 31:
		//		$(windows).resize(
		//			settingsResize()
		//		);
		//		break;
	}
}