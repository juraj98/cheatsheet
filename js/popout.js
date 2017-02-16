var popoutContainer;

function popoutInit() {
	popoutContainer = $('#popoutContainer');

}

function popout(_text) {
	var popout = $('<div class="popout card-1">' + _text + '</div>');
	$(popoutContainer).append(popout);

	setTimeout(function() {
		$(popout).addClass("popoutEnding");
		setTimeout(function() {
			$(popout).remove();
		}, 600);
	}, (1500 + _text.length*25));
}
