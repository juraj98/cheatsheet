
function remindersClick(){
	window.location.hash = "reminder";

$(".content").load('html/remindersHtml.html', null, function(){
		remindersInit();
	});
}

