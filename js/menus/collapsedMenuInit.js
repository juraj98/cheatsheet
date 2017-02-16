function collapsedMenuInit(){
	console.info("%cFunction run:\t" + "%ccollapsedMenuInit()", "color: #303F9F; font-weight:700", "color: #303F9F");

	//Classes
	var classDivider = $("#collapsedMenuClassDivider");

	for (var i = 0; i < user.classes.length; i++) {
		classElements[i] = $('<li class="collapsedSideMenuButton classBtn"><i class="material-icons">grade</i><span>' + user.classes[i]['nameShort'] + '</span></li>');

		$(classDivider).before(classElements[i].data("classId", user.classes[i]['classId']));
	}

	//Listeners
	$(".collapsedSideMenuButton").on("click", function(){
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(this).addClass("sideMenuItemActive");
	});
	$("#collapsedBackground, .collapsedSideMenuButton").on("click", function(){
		$("#collapsedBackground").removeClass("active");
		$("#collapsedSideMenu").removeClass("active");

		setTimeout(function(){
			$("#collapsedBackground").css("display", "none");
		}, 300);
	});
	$("#menuButton").on("click", function(){	//.click() no working? :|
		$("#collapsedBackground").css("display", "block").addClass("active");
		$("#collapsedSideMenu").addClass("active");
	});

}
