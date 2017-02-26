function sideMenusListeners(){
	$(".homeBtn").on("click", function() {
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(".homeBtn").addClass("sideMenuItemActive");
		var html = "Home";
		$(".content").html(html);
	});
	$(".messagesBtn").on("click", function() {
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(".messagesBtn").addClass("sideMenuItemActive");
		var html = "Messages";
		$(".content").html(html);
	});
	$(".remindersBtn").on("click", function() {
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(".remindersBtn").addClass("sideMenuItemActive");
		remindersClick();
	});
	$(".addClass").on("click", function() {
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(".addClass").addClass("sideMenuItemActive");
		addClassClick();
	});
	$(".classBtn").on("click", function() {
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(".classBtn").addClass("sideMenuItemActive");
		newClassClick($(this).data("classId"));

	});
	$(".accountBtn").on("click", function() {
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(".accountBtn").addClass("sideMenuItemActive");
		accountClick();
	});
	$(".settingBtn").on("click", function() {
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(".settingBtn").addClass("sideMenuItemActive");
		var html = "Settings";
		$(".content").html(html);
	});
	$(".logOutBtn").on("click", function() {
		gapi.auth2.getAuthInstance().signOut().then(function() {
			console.log('User signed out.');
		});
	});
}
