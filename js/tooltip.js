function tooltipInit(){

	var tooltip = $('<div id="tooltip"></div>')
	$("body").append(tooltip);

	$("body").on("mouseenter", "[tooltip]", function() {
		console.log("Tooltip");
		$(tooltip).html($(this).attr("tooltip"));
		$(tooltip).show();
		$(tooltip).css("top", $(this).offset().top - $(tooltip).height() - 15);
		$(tooltip).css("left", $(this).offset().left + ($(this).outerWidth() - $(tooltip).outerWidth(true)) / 2);
	});
	$("body").on("mouseleave", "[tooltip]", function() {
		$(tooltip).hide();
	});

}
