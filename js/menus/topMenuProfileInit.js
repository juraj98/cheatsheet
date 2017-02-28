function topMenuProfileInit() {
	console.info("%cFunction run:\t" + "%ctopmenuProfileInit()", "color: #303F9F; font-weight:700", "color: #303F9F");


	$(".topMenuUserProfileName").html(user.name + " " + user.surname);
	$(".topMenuUserProfileUsername").html(user.username);
	$(".topMenuUserProfileCheatpoints").html(user.cheatpoints + " Cheatpoints");
	$(".topMenuUserProfileEmail").html(user.mail);
	$(".topMenuUserClasses").html(setUpTopMenuProfileClassesHtml(user.classes));
	if(user.image != null && user.image != "https://lh5.googleusercontent.com/-Qz5ssNA8E18/AAAAAAAAAAI/AAAAAAAAF5Y/B2o_bbzMSfo/s96-c/photo.jpg"){		//FIXME: Handle google default image
		$(".topMenuMainProfilePicture").attr("src", user.image);
	}

	$(".topMenuUserImage").click(function () {
		return;

		$(this).addClass("topMenuUserImageActive");
		return false;
	});
	$('.topMenuUserImageActive').on('click', function (e) {
		e.stopPropagation();
	});
	$('.topMenuUserImageActive').children().on('click', function (e) {
		e.stopPropagation();
	});

}

function setUpTopMenuProfileClassesHtml(_classes) {
	console.info("%cFunction run:\t" + "%csetUpTopMenuProfileClassesHtml()", "color: #303F9F; font-weight:700", "color: #303F9F");
	//TODO: 9 setUpTopMenuProfileClassesHtml();

	return "";
}
