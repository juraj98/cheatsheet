function classInit() {
	console.info("%cFunction run:\t" + "%cclassInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
	classUploadsClick();        //For the first time alway start with uploads
	$(".contentRowIgnoreScrollbar").css("margin-left", "+=10px");		// Margin 10 for collapsible

	$("body").on("click", ".classMenuItem", function() {
		switchClassMenu($(this));
	});

}
