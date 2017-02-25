function sideMenusListeners(){
	$(".homeBtn").on("click", function() {
		var html = "Home";
		$(".content").html(html);
	});
	$(".messagesBtn").on("click", function() {
		var html = "Messages";
		$(".content").html(html);
	});
	$(".remindersBtn").on("click", function() {
		remindersClick();
	});
	$(".addClass").on("click", function() {
		addClassClick();
	});
	$(".classBtn").on("click", function() {
		newClassClick($(this).data("classId"));

	});
	$(".accountBtn").on("click", function() {
		accountClick();
	});
	$(".settingBtn").on("click", function() {
		var html = "Settings";
		$(".content").html(html);
	});
	$(".logOutBtn").on("click", function() {
		gapi.auth2.getAuthInstance().signOut().then(function() {
			console.log('User signed out.');
		});
	});

	$(".sideMenuItem").on("click", function() {
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(this).addClass("sideMenuItemActive");
	});
}
