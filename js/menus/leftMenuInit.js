function leftMenuInit() {
	console.info("%cFunction run:\t" + "%cleftMenuInit()", "color: #303F9F; font-weight:700", "color: #303F9F");


	//=======Side Menu Setup========

	//TODO: 8 make menu scrollable if display is too small

	//=======Add notifications======
//	if (data) {
//		if (data['messages']) {
//			messagesNotificationElement = $('<p class="sideMenuItemNotifi">' + data['messages'] + '</p>');
//			$("#messagesBtn").append(messagesNotificationElement);
//		}
//		if (data['reminders']) {
//			assignmentsNotificationElement = $('<p class="sideMenuItemNotifi">' + data['reminders'] + '</p>');
//			$("#remindersBtn").append(assignmentsNotificationElement);
//		}
//
//	}

	//=======Classes Menu========
	var classDivider = $("#classDivider");

	for (var i = 0; i < user.classes.length; i++) {
		classElements[i] = $('<div class="sideMenuItem classBtn"><i class="material-icons">grade</i><p>' + user.classes[i]['nameShort'] + '</p></div>');


		$(classDivider).before(classElements[i].data("classId", user.classes[i]['classId']));
	}

	$(".sideMenu").show();

}
