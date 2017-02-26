function sideMenusListeners(){
	$(".homeBtn").on("click", function() {
		$(".sideMenuItemActive").removeClass("sideMenuItemActive");
		$(".homeBtn").addClass("sideMenuItemActive");
		homeClick();
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
	$(".logOutBtn").on("click", function() {
		gapi.auth2.getAuthInstance().signOut().then(function() {
			console.log('User signed out.');
		});
	});
}
