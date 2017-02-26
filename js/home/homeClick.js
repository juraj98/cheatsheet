function homeClick() {
			window.location.hash = "";
	$(".content").html('<div id="hRightSide"><div class="hHeader" id="hRemindersHeader">Reminders:</div></div><div id="hLeftSide"><div class="hHeader">Activity feed:</div></div>');
	homeInit();
}
