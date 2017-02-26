function leftMenuInit() {
	console.info("%cFunction run:\t" + "%cleftMenuInit()", "color: #303F9F; font-weight:700", "color: #303F9F");


	//=======Side Menu Setup========

	//TODO: 8 make menu scrollable if display is too small

	var sideMenu = $('<div class="sideMenu"><div class="sideMenuItem homeBtn sideMenuItemActive" class="homeBtn"><i class="material-icons">home</i><p>Home</p></div><div class="sideMenuItem messagesBtn"><i class="material-icons">message</i><p>Messages</p></div><div class="sideMenuItem remindersBtn"><i class="material-icons">alarm</i><p>Reminders</p></div><div class="sideMenuDivider"></div><div class="sideMenuItem addClass"><i class="material-icons">add</i><p>Add Class</p></div><div class="sideMenuDivider" id="classDivider"></div><div class="sideMenuItem accountBtn"><i class="material-icons">account_box</i><p>Account</p></div><div class="sideMenuItem" id="logOutBtn"><i class="material-icons">exit_to_app</i><p>Log Out</p></div></div>');

	$("body").append(sideMenu);

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

}
